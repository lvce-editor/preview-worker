export const createGeometryBuffer = (elementCount: number): ArrayBuffer | SharedArrayBuffer => {
  const entrySize = 9 * Float64Array.BYTES_PER_ELEMENT
  const size = Math.max(elementCount, 1) * entrySize
  if (typeof SharedArrayBuffer === 'function') {
    return new SharedArrayBuffer(size)
  }
  return new ArrayBuffer(size)
}
