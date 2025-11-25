import { createStrictInjection } from '@helpers'


const injectionKey = Symbol('DrawerState')
const [useProvide, useState] = createStrictInjection((close: () => void) => close, {
	injectionKey,
	name: 'DrawerState',
})

export const useProvideDialogState = useProvide
export const useDialogState = useState
