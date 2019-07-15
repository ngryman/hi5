declare module 'hi5' {
  namespace hi5 {
    export function optional<T>(value: T, name: string, types: any): T
    export function optional<T>(
      value: T,
      name: string,
      types: any,
      defaultValue: Exclude<T, undefined>
    ): Exclude<T, undefined>

    export function deep<T>(
      obj: T,
      name: string,
      mapper: (obj: Exclude<T, undefined>) => Exclude<Required<T>, undefined>
    ): Exclude<Required<T>, undefined>

    export function guard(fn: Function, types: any[]): void
  }

  function hi5<T>(value: T, name: string, types: any): Exclude<T, undefined>

  export = hi5
}
