import { name, description } from "@@/package.json";

export function getScriptTitle() {
  return `${name} ${__VERSION__} "${description}"`;
}
