export type CssVariable = `--${string}`

export type TransformVars<V> = {
	[Key in keyof V]: V[Key] extends CssVariable ? Record<V[Key], string | undefined> : never;
}

/** Map of component part names to user-provided class names. */
export type Classes<Key extends string, Value = string | string[]> = Partial<Record<Key, Value>>
