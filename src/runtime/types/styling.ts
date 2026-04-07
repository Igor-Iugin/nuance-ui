export type CssVariable = `--${string}`

export type TransformVars<V> = {
	[Key in keyof V]: V[Key] extends CssVariable ? Record<V[Key], string | undefined> : never;
}
