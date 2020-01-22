export function singleton<K extends string, V>(k: K, v: V) {
  return { [k]: v } as { [k in K]: V };
}
