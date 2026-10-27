import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Decode } from '../src/index.js';

test('decodes empty bytes to empty string', () => {
  assert.equal(Decode(new Uint8Array([])), '');
});

test('decodes ASCII bytes directly', () => {
  assert.equal(Decode(new Uint8Array([0x41, 0x42, 0x43])), 'ABC');
});

test('decodes ASCII mixed with bytes >= 0x80', () => {
  const input = new Uint8Array([0x48, 0x65, 0x6C, 0x6C, 0x6F]);
  assert.equal(Decode(input), 'Hello');
});

test('decodes single ASCII digit', () => {
  assert.equal(Decode(new Uint8Array([0x30])), '0');
  assert.equal(Decode(new Uint8Array([0x39])), '9');
});

test('decodes single ASCII letter', () => {
  assert.equal(Decode(new Uint8Array([0x41])), 'A');
  assert.equal(Decode(new Uint8Array([0x42])), 'B');
});

test('decodes ASCII punctuation', () => {
  assert.equal(Decode(new Uint8Array([0x21])), '!');
  assert.equal(Decode(new Uint8Array([0x40])), '@');
});

test('decodes single GBK ideographic character', () => {
  const bytes = new Uint8Array([0xB0, 0xA1]);
  assert.equal(Decode(bytes), '\u554A');
});

test('decodes a GBK punctuation character', () => {
  const bytes = new Uint8Array([0xA1, 0xA1]);
  assert.equal(Decode(bytes), '\u3000');
});

test('decodes fullwidth exclamation', () => {
  const bytes = new Uint8Array([0xA1, 0xE1]);
  assert.equal(Decode(bytes), '\uFF01');
});

test('decodes fullwidth letter A', () => {
  const bytes = new Uint8Array([0xA2, 0xA1]);
  assert.equal(Decode(bytes), '\uFF21');
});

test('decodes mixed ASCII and GBK sequence', () => {
  const bytes = new Uint8Array([0x41, 0xB0, 0xA1, 0x42]);
  assert.equal(Decode(bytes), 'A\u554AB');
});

test('decodes Chinese word', () => {
  const bytes = new Uint8Array([0xC4, 0xE3, 0xBA, 0xC3]);
  // C4E3 -> 0x4F60 (你), BAC3 -> 0x597D (好)
  assert.equal(Decode(bytes), '\u4F60\u597D');
});

test('handles trailing byte at end of input', () => {
  const bytes = new Uint8Array([0x41, 0xB0]);
  assert.equal(Decode(bytes), 'A\uFFFD');
});

test('handles trailing byte alone', () => {
  const bytes = new Uint8Array([0xB0]);
  assert.equal(Decode(bytes), '\uFFFD');
});

test('decodes multiple ASCII bytes', () => {
  const bytes = new Uint8Array([0x30, 0x31, 0x32, 0x33]);
  assert.equal(Decode(bytes), '0123');
});
