import { defineStore } from 'pinia'

interface UserState {
  token: string | null
  userId: string | null
  nickname: string | null
  avatarUrl: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    nickname: localStorage.getItem('nickname'),
    avatarUrl: localStorage.getItem('avatarUrl')
  }),
  
  getters: {
    isLogged: (state) => !!state.token
  },
  
  actions: {
    setLoginState(payload: any) {
      this.token = payload.token
      this.userId = payload.user_id
      this.nickname = payload.nickname
      this.avatarUrl = payload.avatar_url
      
      localStorage.setItem('token', payload.token)
      localStorage.setItem('userId', payload.user_id)
      localStorage.setItem('nickname', payload.nickname)
      if (payload.avatar_url) {
        localStorage.setItem('avatarUrl', payload.avatar_url)
      }
    },
    
    logout() {
      this.token = null
      this.userId = null
      this.nickname = null
      this.avatarUrl = null
      localStorage.clear()
    }
  }
})