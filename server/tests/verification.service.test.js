import { describe, expect, it } from 'vitest';
import { serialMatches } from '../src/services/verification.service.js';

describe('serialMatches', () => {
  it('accepts formatting differences', () => expect(serialMatches('SN-001-AB', 'sn001ab')).toBe(true));
  it('accepts a small OCR typo in a long serial', () => expect(serialMatches('UD306SI01B522028A57000', 'UD306SI01B522028A57001')).toBe(true));
  it('rejects an unrelated serial', () => expect(serialMatches('SN-001', 'SN-999')).toBe(false));
});
