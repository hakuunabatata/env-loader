export type envTypes<T = string> =
  | boolean
  | number
  | string
  | object
  | undefined
  | T
  | T[];

export type EnvType = "boolean" | "number" | "string" | "object" | "array";

interface BaseEnv<T> {
  name: string;
  type: EnvType;
  required?: boolean;
  default?: T;
}

interface StringEnv extends BaseEnv<string> {
  type: "string";
}

interface BooleanEnv extends BaseEnv<boolean> {
  type: "boolean";
}
interface NumberEnv extends BaseEnv<number> {
  type: "number";
}
interface ObjectEnv extends BaseEnv<object> {
  type: "object";
}
interface ArrayEnv extends BaseEnv<object[]> {
  type: "array";
}

export type EnvPayload =
  | NumberEnv
  | StringEnv
  | BooleanEnv
  | ObjectEnv
  | ArrayEnv;
