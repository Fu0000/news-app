# 综合新闻 APP - API 接口规范说明书

## 1. API 整体规范 (API Design Guidelines)
在 `Node.js` + `Vue3/UniApp` 的前后端分离架构下，前后端交互严格遵循 RESTful API 规范，以及以下约定：
*   **基础路径**：所有的接口统一使用 `/api/v1` 作为前缀。
*   **请求与响应格式**：所有非文件上传接口的 `Content-Type` 必须为 `application/json`。
*   **鉴权机制 (Authorization)**：除登录/注册、公开的新闻列表浏览外，所有需要鉴权的接口，前端需在 Request Headers 中携带 `Authorization: Bearer <Your_JWT_Token>`。
*   **统一响应体结构 (Standard Response Format)**：
    ```json
    {
      "code": 200,          // 业务状态码：200 成功，400 参数错误，401 未授权/Token过期，403 无权限，404 资源不存在，500 服务器错误
      "msg": "操作成功",     // 给前端展示的提示信息
      "data": {}            // 具体的业务数据对象或数组。若无数据返回 null
    }
    ```
*   **分页规范**：列表查询接口统一采用 `page` (当前页码，从 1 开始) 和 `size` (每页条数，默认 10) 两个 Query 参数。响应体的 `data` 必须包含 `total` (总条数) 和 `list` (当前页数据数组)。

---

## 2. 用户服务 (User Service)

### 2.1 账号注册/登录 (Login/Register)
*   **接口路径**：`POST /api/v1/user/login`
*   **接口描述**：使用手机号+密码进行注册/登录（若手机号未注册则自动注册）。
*   **请求头**：`Content-Type: application/json`
*   **请求体 (Body)**：
    ```json
    {
      "phone": "13800138000",   // 必填，手机号
      "password": "myPassword123" // 必填，密码
    }
    ```
*   **成功响应 (200 OK)**：
    ```json
    {
      "code": 200,
      "msg": "登录成功",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR...", // JWT Token
        "user_id": 10001,
        "nickname": "新闻新用户_9821",
        "avatar_url": "https://oss.example.com/default_avatar.png"
      }
    }
    ```

---

### 2.2 获取个人信息 (Get Profile)
*   **接口路径**：`GET /api/v1/user/profile`
*   **接口描述**：获取当前登录用户的详细信息（包括粉丝数、关注数等统计数据）。
*   **请求头**：`Authorization: Bearer <Token>`
*   **请求参数**：无
*   **成功响应 (200 OK)**：
    ```json
    {
      "code": 200,
      "msg": "获取成功",
      "data": {
        "user_id": 10001,
        "nickname": "科技资讯官",
        "avatar_url": "https://oss.example.com/avatar1.jpg",
        "bio": "分享前沿科技动态",
        "following_count": 12,
        "followers_count": 3450,
        "publish_count": 56
      }
    }
    ```

---

## 3. 内容服务 (Content Service)

### 3.1 获取新闻资讯列表 (Get News List)
*   **接口路径**：`GET /api/v1/news/list`
*   **接口描述**：首页新闻瀑布流获取，支持按分类拉取，按时间倒序。
*   **请求参数 (Query)**：
    *   `category_id` (可选, Number)：分类ID，不传则拉取所有分类/推荐
    *   `page` (必填, Number)：当前页码，如 1
    *   `size` (可选, Number)：每页条数，默认 10
*   **成功响应 (200 OK)**：
    ```json
    {
      "code": 200,
      "msg": "获取成功",
      "data": {
        "total": 1205,
        "list": [
          {
            "id": 5001,
            "title": "苹果发布全新混合现实头显 Vision Pro",
            "cover_urls": [
              "https://oss.example.com/news/cover_1.jpg",
              "https://oss.example.com/news/cover_2.jpg",
              "https://oss.example.com/news/cover_3.jpg"
            ],
            "author_name": "果粉圈",
            "view_count": 89000,
            "comment_count": 1204,
            "publish_time": "2024-06-06T10:00:00Z"
          },
          { ... }
        ]
      }
    }
    ```

---

### 3.2 获取新闻详情 (Get News Detail)
*   **接口路径**：`GET /api/v1/news/:id`
*   **接口描述**：获取文章富文本正文内容。若携带了 Token，则返回当前用户是否已点赞/收藏该文章。
*   **请求参数 (Path)**：`:id` (文章ID)
*   **成功响应 (200 OK)**：
    ```json
    {
      "code": 200,
      "msg": "获取成功",
      "data": {
        "id": 5001,
        "title": "苹果发布全新混合现实头显 Vision Pro",
        "content": "<p>苹果在今日的WWDC大会上...</p><img src=\"https://oss.example.com/news/detail_1.jpg\" />", // 图文并茂的富文本HTML内容
        "author_id": 1002,
        "author_name": "果粉圈",
        "author_avatar": "https://oss.example.com/avatar2.jpg",
        "view_count": 89001,
        "like_count": 5600,
        "publish_time": "2024-06-06T10:00:00Z",
        "has_liked": false,    // 当前用户是否已点赞
        "has_favorited": true  // 当前用户是否已收藏
      }
    }
    ```

---

### 3.3 发布内容 (Publish Content)
*   **接口路径**：`POST /api/v1/content/publish`
*   **接口描述**：发布文章、短视频或动态。必须登录。
*   **请求头**：`Authorization: Bearer <Token>`, `Content-Type: application/json`
*   **请求体 (Body)**：
    ```json
    {
      "type": 1,                // 必填，发布类型 (1:文章, 2:视频, 3:动态)
      "category_id": 1,         // 文章/视频必填，分类ID
      "title": "测试文章标题",    // 必填，标题/描述
      "content": "<p>这是正文，包含图片<img src='https://oss.example.com/p1.jpg'></p>", // 图文并茂的富文本(HTML/JSON)，类型为1或3时必填
      "cover_urls": ["https://oss.example.com/c1.jpg", "https://oss.example.com/c2.jpg"], // 可选，封面图数组(支持无图、单图、三图流)
      "video_url": "https://oss.example.com/v.mp4"  // 类型为2时必填
    }
    ```
*   **成功响应 (200 OK)**：
    ```json
    {
      "code": 200,
      "msg": "发布成功",
      "data": { "content_id": 5002 }
    }
    ```

---

## 4. 互动服务 (Interaction Service)

### 4.1 点赞/取消点赞 (Toggle Like)
*   **接口路径**：`POST /api/v1/interaction/like`
*   **接口描述**：对文章、视频或评论进行点赞。若已点赞则取消点赞。必须登录。
*   **请求体 (Body)**：
    ```json
    {
      "target_id": 5001,  // 必填，目标ID
      "target_type": 1    // 必填，目标类型 (1:文章, 2:视频, 3:评论)
    }
    ```
*   **成功响应 (200 OK)**：
    ```json
    {
      "code": 200,
      "msg": "操作成功",
      "data": {
        "is_liked": true,    // 操作后的点赞状态
        "like_count": 5601   // 操作后的最新点赞数
      }
    }
    ```

---

### 4.2 发表评论 (Post Comment)
*   **接口路径**：`POST /api/v1/interaction/comment`
*   **接口描述**：在文章或视频下发表评论，支持回复他人评论。
*   **请求体 (Body)**：
    ```json
    {
      "target_id": 5001,      // 必填，新闻/视频ID
      "target_type": 1,       // 必填，1文章 2视频
      "parent_id": 0,         // 可选，0为直接评论文章，非0为回复某条评论的ID
      "content": "我觉得这款头显太贵了！" // 必填，评论内容
    }
    ```
*   **成功响应 (200 OK)**：
    ```json
    {
      "code": 200,
      "msg": "评论发表成功",
      "data": { "comment_id": 8001 }
    }
    ```

---

## 5. 公共服务 (Common Service)

### 5.1 获取文件上传凭证 (Get Upload Token)
*   **接口路径**：`GET /api/v1/common/upload/token`
*   **接口描述**：为了安全和性能，前端上传图片/视频不经过 Node.js 服务器中转，而是直接上传到阿里云 OSS/MinIO。此接口用于前端获取直传签名 (STS Token/Policy)。
*   **请求参数**：无
*   **成功响应 (200 OK)**：
    ```json
    {
      "code": 200,
      "msg": "获取成功",
      "data": {
        "access_id": "LTAI5t...",
        "policy": "eyJleHB...",
        "signature": "O+V...",
        "dir": "uploads/2024/06/",
        "host": "https://your-bucket.oss-cn-hangzhou.aliyuncs.com"
      }
    }
    ```
