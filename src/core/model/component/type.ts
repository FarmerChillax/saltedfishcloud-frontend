export type ValidateRule = (string | true | PromiseLike<string | true> | ((value: any) => string | true) | ((value: any) => PromiseLike<string | true>))