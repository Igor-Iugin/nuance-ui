import type { NuanceIcons } from '@nui/types'


/** Default icon registry. Maps every component icon to its `gravity-ui` id. */
export const DEFAULT_ICONS: NuanceIcons = {
	// ─── Actions ───
	close: 'lucide:x',
	check: 'lucide:check',
	minus: 'lucide:minus',
	plus: 'lucide:plus',

	// ─── Chevrons ───
	chevronRight: 'lucide:chevron-right',
	chevronLeft: 'lucide:chevron-left',
	chevronDown: 'lucide:chevron-down',
	chevronUp: 'lucide:chevron-up',
	selectExpand: 'lucide:chevrons-up-down',

	// ─── Inputs ───
	email: 'lucide:at-sign',
	passwordShow: 'lucide:eye',
	passwordHide: 'lucide:eye-off',
	calendar: 'lucide:calendar',
	clock: 'lucide:clock',

	// ─── User ───
	person: 'lucide:user',

	// ─── Theme ───
	sun: 'lucide:sun',
	moon: 'lucide:moon',

	// ─── Files & tree ───
	upload: 'lucide:upload',
	file: 'lucide:file',
	folder: 'lucide:folder',
	folderOpen: 'lucide:folder-open',

	// ─── Table sort ───
	sortAsc: 'lucide:arrow-up-narrow-wide',
	sortDesc: 'lucide:arrow-down-wide-narrow',
	sortOff: 'lucide:arrow-up-down',
}
