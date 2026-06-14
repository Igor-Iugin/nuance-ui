/** Registry of icon names used by components. Override to swap the icon pack. */
export interface NuanceIcons {
	// ─── Actions ───

	/** Close / clear / dismiss */
	close: string

	/** Confirmation checkmark */
	check: string

	/** Indeterminate / remove */
	minus: string

	/** Add */
	plus: string

	// ─── Chevrons ───

	/** Chevron pointing right */
	chevronRight: string

	/** Chevron pointing left */
	chevronLeft: string

	/** Chevron pointing down */
	chevronDown: string

	/** Chevron pointing up */
	chevronUp: string

	/** Vertical expand chevrons */
	selectExpand: string

	// ─── Inputs ───

	/** Email field */
	email: string

	/** Reveal password */
	passwordShow: string

	/** Hide password */
	passwordHide: string

	/** Calendar / date field */
	calendar: string

	/** Clock / time field */
	clock: string

	// ─── User ───

	/** User avatar placeholder */
	person: string

	// ─── Theme ───

	/** Light theme */
	sun: string

	/** Dark theme */
	moon: string

	// ─── Files & tree ───

	/** Upload */
	upload: string

	/** File node */
	file: string

	/** Collapsed folder node */
	folder: string

	/** Expanded folder node */
	folderOpen: string

	// ─── Table sort ───

	/** Ascending sort */
	sortAsc: string

	/** Descending sort */
	sortDesc: string

	/** Unsorted */
	sortOff: string
}
