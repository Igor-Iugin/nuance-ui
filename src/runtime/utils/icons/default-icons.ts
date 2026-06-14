import type { NuanceIcons } from '@nui/types'


/** Default icon registry. Maps every component icon to its `gravity-ui` id. */
export const DEFAULT_ICONS: NuanceIcons = {
	// ─── Actions ───
	close: 'gravity-ui:xmark',
	check: 'gravity-ui:check',
	minus: 'gravity-ui:minus',
	plus: 'gravity-ui:plus',

	// ─── Chevrons ───
	chevronRight: 'gravity-ui:chevron-right',
	chevronLeft: 'gravity-ui:chevron-left',
	chevronDown: 'gravity-ui:chevron-down',
	chevronUp: 'gravity-ui:chevron-up',
	selectExpand: 'gravity-ui:chevrons-expand-vertical',

	// ─── Inputs ───
	email: 'gravity-ui:at',
	passwordShow: 'gravity-ui:eye',
	passwordHide: 'gravity-ui:eye-slash',
	calendar: 'gravity-ui:calendar',
	clock: 'gravity-ui:clock',

	// ─── User ───
	person: 'gravity-ui:person',

	// ─── Theme ───
	sun: 'gravity-ui:sun',
	moon: 'gravity-ui:moon',

	// ─── Files & tree ───
	upload: 'gravity-ui:arrow-shape-up-from-line',
	file: 'gravity-ui:file',
	folder: 'gravity-ui:folder',
	folderOpen: 'gravity-ui:folder-open',

	// ─── Table sort ───
	sortAsc: 'gravity-ui:bars-descending-align-left-arrow-up',
	sortDesc: 'gravity-ui:bars-descending-align-left-arrow-down',
	sortOff: 'gravity-ui:bars-descending-align-left',
}
