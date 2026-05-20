import type { RuleExpression } from 'vee-validate'
import type { MaybeRef } from 'vue'

/** Common props shared by all field wrappers */
export interface FieldBaseProps<Value> {
	/** Field name used by vee-validate */
	name: string

	/** If `false`, disconnects the field from the parent form context @default `true` */
	controlled?: boolean

	/** Validation rules, applied when `controlled: false` or as field-level override */
	rules?: MaybeRef<RuleExpression<Value>>

	/** When to trigger validation @default `'change'` */
	validateOn?: 'change' | 'submit'

	/** Pre-fills the field value */
	initialValue?: Value
}
