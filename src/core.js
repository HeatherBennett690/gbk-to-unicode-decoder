import { decode as decodeGbk } from './gbk-table.js';

export function Decode(bytes) {
  return decodeGbk(bytes);
}
