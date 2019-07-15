declare module 'hi5' {
  namespace hi5 {
    export function optional(value: any, name: string, types: any): void
    export function guard(fn: Function, types: any[]): void
  }

  declare function hi5(value: any, name: string, types: any): void

  export = hi5
}
