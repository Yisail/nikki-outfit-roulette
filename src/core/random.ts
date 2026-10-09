/** 非法数量返回空数组；不重复模式下最多抽取词池长度。不会修改输入。 */
export function drawRandom<T>(options: readonly T[], count: number, allowDuplicates = false): T[] {
  if (!Number.isFinite(count) || count <= 0 || options.length === 0) return [];
  const size = Math.floor(count);
  if (allowDuplicates) return Array.from({ length: size }, () => options[Math.floor(Math.random() * options.length)]);
  const pool = [...options];
  const result: T[] = [];
  for (let i = 0; i < Math.min(size, pool.length); i++) {
    const index = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[index]] = [pool[index], pool[i]];
    result.push(pool[i]);
  }
  return result;
}
