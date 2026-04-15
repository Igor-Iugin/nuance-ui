export type * from './factory'
export type * from './styling'
export type * from './theme'

/** Value that may be synchronous or wrapped in a promise. */
export type MaybePromise<T = unknown> = T | Promise<T>

export type AnyString = string & {}
