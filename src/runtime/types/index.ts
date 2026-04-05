export type * from './theme'

/** Map of component part names to user-provided class names. */
export type Classes<Key extends string, Value = string | string[]> = Partial<Record<Key, Value>>

/** Value that may be synchronous or wrapped in a promise. */
export type MaybePromise<T = unknown> = T | Promise<T>
