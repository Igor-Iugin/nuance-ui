export type * from './theme'

export type Classes<Key extends string, Value = string | string[]> = Partial<Record<Key, Value>>
