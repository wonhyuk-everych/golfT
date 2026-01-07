import { useNuxtApp } from '#imports'

export const useChannel = () => {
  const { $channel } = useNuxtApp()
  return $channel
}
