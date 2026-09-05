import { describe, expect, it } from 'vitest';
import { assignmentWhere } from '../src/utils/filters.js';

describe('assignmentWhere', () => {
  it('places the selected location on the related hardware asset', () => {
    expect(assignmentWhere({ area: 'Delhi Indane Divisional Office' })).toEqual({ asset: { area: 'Delhi Indane Divisional Office' } });
  });
  it('combines location with status', () => {
    expect(assignmentWhere({ area: 'Ambala AFS', status: 'active' })).toEqual({ asset: { area: 'Ambala AFS' }, isActive: true });
  });
});
