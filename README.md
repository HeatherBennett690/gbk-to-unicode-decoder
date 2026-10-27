# gbk-to-unicode-decoder

Decodes GBK/GB2312 encoded Chinese text bytes to JavaScript strings without relying on the native TextDecoder.

## Usage

```javascript
import { Decode } from 'gbk-to-unicode-decoder';

const bytes = new Uint8Array([0xC4, 0xE3, 0xBA, 0xC3]); // "你好" in GBK
const text = Decode(bytes);
// text === "你好"
```

## Why this exists

The native `TextDecoder` is present in Node 11+ and all modern browsers, but not in every runtime or embedded environment. This library decodes a subset of GBK bytes by mapping known lead-trail byte pairs to Unicode code points. We trade completeness for zero dependencies and a small, predictable surface.

The mapping is a hand-curated table of common GBK sequences. Bytes not in the table are replaced with `\uFFFD`. Only one interpretation is supported: bytes in, string out.

## Edge cases

A truncated final byte at the end of input is replaced with `\uFFFD` rather than thrown. GBK byte pairs absent from the mapping also yield `\uFFFD`.
