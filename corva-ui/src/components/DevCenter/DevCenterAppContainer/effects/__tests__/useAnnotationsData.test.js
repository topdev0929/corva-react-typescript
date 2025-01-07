import { renderHook } from '@testing-library/react-hooks';
import { useAnnotationsData } from '~/components/DevCenter/DevCenterAppContainer/effects';

const ASSET_ID = 111;
const COMPANY_ID = 222;

describe('useAnnotationsData', () => {
  const app = {
    package: {
      manifest: {
        application: {
          ui: {
            disable_platform_annotations: false,
          }
        }
      }
    },
    id: 'test-app',
    segment: ['drilling'],
  };
  const appData = {
    well: {
      asset_id: ASSET_ID, company_id: COMPANY_ID,
    },
  };
  const currentDashboardAppsLastAnnotations = [
    { id: 'test-app', last_app_annotation: { data: { text: 'Annotation text 1' } } },
    { id: 'test-app', last_app_annotation: { data: { text: 'Annotation text 2' } } },
  ];

  it('should return correct values if the app supports annotations and last annotations exists', () => {
    const { result } = renderHook(() =>
      useAnnotationsData({ app, appData, currentDashboardAppsLastAnnotations }),
    );

    expect(result.current).toEqual({
      assetIdForAnnotation: ASSET_ID,
      assetCompanyId: COMPANY_ID,
      isAppSupportsAnnotations: true,
      appLastAnnotation: currentDashboardAppsLastAnnotations[0].last_app_annotation,
    });
  });

  it('should return null for appLastAnnotation when last annotation does not exist', () => {
    const { result } = renderHook(() =>
      useAnnotationsData({ app, appData, currentDashboardAppsLastAnnotations: [] }),
    );

    expect(result.current.appLastAnnotation).toBeNull();
  });

  it('should return null for appLastAnnotation if app does not support annotations', () => {
    const CompletionApp = { package: { manifest: { application: { ui: { disable_platform_annotations: false } } } }, id: 'completion-app', segment: [] };

    const { result } = renderHook(() =>
      useAnnotationsData({ app: CompletionApp, appData, currentDashboardAppsLastAnnotations }),
    );

    expect(result.current.appLastAnnotation).toBeNull();
  });

  it('should return null for appLastAnnotation when app is dev center CLI app', () => {
    const { result } = renderHook(() =>
      useAnnotationsData({
        app: { package: { manifest: { application: { ui: { disable_platform_annotations: false } } } }, id: 'dev-center-cli', segment: ['drilling'] },
        appData,
        currentDashboardAppsLastAnnotations,
      }),
    );

    expect(result.current.appLastAnnotation).toBeNull();
  });

  it('should return null for appLastAnnotation when currentDashboardAppsLastAnnotations is null', () => {
    const { result } = renderHook(() =>
      useAnnotationsData({ app, appData, currentDashboardAppsLastAnnotations: null }),
    );

    expect(result.current.appLastAnnotation).toBeNull();
  });

  it('should return null for appLastAnnotation when isAppSupportsAnnotations is false', () => {
    const { result } = renderHook(() =>
      useAnnotationsData({
        app: { package: { manifest: { application: { ui: { disable_platform_annotations: true } } } }, id: 'test-app', segment: ['drilling'] },
        appData,
        currentDashboardAppsLastAnnotations,
      }),
    );

    expect(result.current.appLastAnnotation).toBeNull();
  });
});
