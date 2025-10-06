import { parse as parseYaml } from "yaml";
import { parseMcpJson } from "./parseMcpJson";
export function parseMcpYaml(text: string) {
  const obj = parseYaml(text);
  return parseMcpJson(JSON.stringify(obj));
}
