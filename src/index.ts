import { EnvPayload, EnvType, envTypes } from "./types";

export class EnvLoader {
  private envs: Record<string, envTypes> = {};

  constructor(initial?: EnvPayload[]) {
    if (initial) this.loadEnvs(initial);
  }

  public loadEnv<T extends envTypes>(
    name: string,
    type: EnvType = "string",
    defaultValue?: T,
    required = false
  ) {
    const raw = process.env[name];
    let value: envTypes;

    if (raw)
      switch (type) {
        case "array":
          value = this.convertArray(raw);
        case "boolean":
          value = this.convertBoolean(raw);
        case "number":
          value = this.convertNumber(raw);
        case "object":
          value = this.convertObject(raw);
        case "string":
          value = this.convertString(raw);
        default:
          throw new Error("Invalid Type");
      }
    else if (required)
      throw new Error(`Required environment ${name} not provided`);

    value = value ?? defaultValue;
    if (required && value === undefined)
      throw new Error(`Required environment ${name} not provided`);

    this.envs[
      name
        .replace(new RegExp([" ", "-", "\\", "/"].join("|"), "g"), "_")
        .toUpperCase()
    ] = value as T;
  }

  public loadEnvs(envs: EnvPayload[]) {
    for (const { name, default: defaultValue, required, type } of envs) {
      this.loadEnv(name, type, defaultValue, required);
    }
  }

  public export() {
    return this.envs;
  }

  private convertArray<T>(raw: string): T | undefined {
    try {
      const value = JSON.parse(raw) as T;

      if (!Array.isArray(value)) return undefined;
      if (!value.length) return undefined;

      return value as T;
    } catch {
      return undefined;
    }
  }

  private convertBoolean(raw: string): boolean | undefined {
    if (!["true", "false"].includes(raw)) return undefined;
    return raw === "true";
  }

  private convertNumber(raw: string): number | undefined {
    const value = +raw;
    if (isNaN(value)) return undefined;
    return value;
  }

  private convertObject<T extends Object>(raw: string): T | undefined {
    try {
      const value = JSON.parse(raw) as T;
      if (Array.isArray(value)) return undefined;
      if (!Object.keys(value).length) return undefined;
      return value;
    } catch {
      return undefined;
    }
  }

  private convertString(raw: string): string | undefined {
    const value = `${raw}`;
    if (!value) return undefined;
    return value;
  }
}
