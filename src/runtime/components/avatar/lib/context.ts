import { createInjectionState } from '@vueuse/core'


const [useProvide, useState] = createInjectionState(() => ({ withinGroup: true }))

export const useProvideAvatarGroup = useProvide
export const useAvatarGroupState = useState
