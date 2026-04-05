/** Time format */
export type TimePickerFormat = '12h' | '24h'

/** Labels for am/pm values */
export interface TimePickerAmPmLabels {
	/** Label for AM */
	am: string
	/** Label for PM */
	pm: string
}

/** Input passed to `pasteSplit` */
export interface TimePickerPasteSplitInput {
	/** Pasted time string */
	time: string
	/** Active time format */
	format: TimePickerFormat
	/** Active am/pm labels */
	amPmLabels: TimePickerAmPmLabels
}

/** Parsed time values returned from `pasteSplit` */
export interface TimePickerPasteSplitReturnType {
	/** Parsed hours */
	hours: number | null
	/** Parsed minutes */
	minutes: number | null
	/** Parsed seconds */
	seconds: number | null
	/** Parsed am/pm value */
	amPm: string | null
}

export type TimePickerPasteSplit = (
	input: TimePickerPasteSplitInput,
) => TimePickerPasteSplitReturnType
