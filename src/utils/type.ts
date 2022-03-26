// import { MouseEvent } from 'react'

// export const createEvent = <T>(p: Type) => (event: MouseEvent, node: Type): void => {}

// export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, fields: K[]): Omit<T, K> {
//   const clone = { ...obj }

//   if (Array.isArray(fields)) {
//     fields.forEach((key) => {
//       delete clone[key]
//     })
//   }

//   return clone
// }

export const tuple = <T extends string[]>(...args: T) => args

export const tupleNum = <T extends number[]>(...args: T) => args

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
