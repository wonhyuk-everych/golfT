import { ref } from '#imports'

export interface User {
  id: string
  member_id: number
  name_kr?: string
  name_en?: string
  email?: string
}

export const useUser = () => {
  const user = ref<User | null>(null)

  return {
    user,
    setUser: (userData: User | null) => {
      user.value = userData
    }
  }
}
