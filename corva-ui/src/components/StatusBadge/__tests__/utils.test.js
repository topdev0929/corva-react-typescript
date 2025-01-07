import {
  isResolved,
  getDeductsFromScoreClass,
  getDeductsFromScoreValue,
  parseWellnessAlertFromJson,
  getLinkToDQPage,
} from '~/components/StatusBadge/utils';

describe('utils', () => {
  it('should return correct value (isResolved)', () => {
    expect(isResolved('Resolved')).toBe(true);
  });

  describe('getDeductsFromScoreClass', () => {
    const styles = { error: 'error', warn: 'warning', ok: 'ok', good: 'good' };
    it('should return ok', () => {
      expect(getDeductsFromScoreClass(styles, 10, false)).toEqual('ok');
    });

    it('should return an empty string if isResolved is true', () => {
      expect(getDeductsFromScoreClass(styles, 10, true)).toEqual('');
    });

    it('should return warning', () => {
      expect(getDeductsFromScoreClass(styles, 11, false)).toEqual('warning');
    });

    it('should return good', () => {
      expect(getDeductsFromScoreClass(styles, 4, false)).toEqual('good');
    });

    it('should return good', () => {
      expect(getDeductsFromScoreClass(styles, 41, false)).toEqual('error');
    });
  });

  describe('getDeductsFromScoreValue', () => {
    it('should return correct string', () => {
      expect(getDeductsFromScoreValue(4, false)).toEqual('4%');
    });

    it('should return correct string if isResolved false', () => {
      expect(getDeductsFromScoreValue(null, true)).toEqual('—');
    });
  });

  describe('parseWellnessAlertsFromJson', () => {
    const mockObject = {
      _id: 'id',
      asset_id: 'assetId',
      name: 'name',
      category: 'category',
      last_checked_at: 111111,
      message: 'message',
      status: 'status',
      status_reason: 'reason',
      status_updated_at: 111111,
      state: 'state',
      timestamp: 111111,
      note: 'note',
      is_throttled: false,
      segment: 'segment',
      metrics: {
        hole_depth: 10,
        state: 'state',
      },
      deducts_from_score: false,
    };
    it('should return null', () => {
      const mockInput = {
        ...mockObject,
        data: {
          ...mockObject.data,
          state: 'Issue',
          name: 'name',
          category: 'category',
        },
      };
      expect(parseWellnessAlertFromJson(mockInput)).toBeNull();
    });

    it('returns a parsed wellness alerts', () => {
      const result = parseWellnessAlertFromJson({ ...mockObject, data: { ...mockObject } });
      expect(result).toMatchObject({
        id: 'id',
        assetId: 'assetId',
        name: 'name',
        category: 'category',
        lastCheckedAt: 111111,
        message: 'message',
        status: 'status',
        statusReason: 'reason',
        statusUpdatedAt: 111111,
        state: 'Unknown',
        createdAt: 111111,
        note: 'note',
        isThrottled: false,
        segment: 'segment',
        metrics: {
          holeDepth: 10,
          state: 'state',
        },
        deductsFromScore: false,
      });
    });
  });

  it('should return correct link to DQ page', () => {
    expect(getLinkToDQPage({ assetId: 123, wellHubSlug: 'wellhub-slug' })).toEqual('/assets/123/wellhub-slug/Data Quality')
  });
});