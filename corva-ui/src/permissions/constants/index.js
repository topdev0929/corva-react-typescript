import { stringifyPermission } from '../utils';
import { ABILITIES } from './abilities';
import settingsApps from './settingsApps';
import appsPermissions from './appsPermissions';

export * from './abilities';

export const PERMISSIONS = {
  companySelectorView: stringifyPermission({
    resource_class: 'company_selector',
    ability: ABILITIES.view,
  }),
  userCreate: stringifyPermission({
    resource_class: 'User',
    ability: ABILITIES.create,
  }),
  getUserUpdate: userId =>
    stringifyPermission({
      resource_class: 'User',
      ability: ABILITIES.update,
      resource_id: userId,
    }),
  canViewCorvaAppVersion: stringifyPermission({
    resource_class: 'corva_app_version',
    ability: ABILITIES.view,
  }),
  documentationEdit: stringifyPermission({
    resource_class: 'Document',
    ability: ABILITIES.edit,
  }),
  documentationCreate: stringifyPermission({
    resource_class: 'Document',
    ability: ABILITIES.create,
  }),
  documentationDestroy: stringifyPermission({
    resource_class: 'Document',
    ability: ABILITIES.destroy,
  }),
  canUpdateWellQC: stringifyPermission({
    resource_class: 'well_qc',
    ability: ABILITIES.update,
  }),
  getFeedItemDestroy: feedId =>
    stringifyPermission({
      resource_class: 'Activity',
      ability: ABILITIES.destroy,
      resource_id: feedId,
    }),
  getCommentDestroy: commentId =>
    stringifyPermission({
      resource_class: 'Comment',
      ability: ABILITIES.destroy,
      resource_id: commentId,
    }),
  getAlertUpdate: alertId =>
    stringifyPermission({
      resource_class: 'Alert',
      ability: ABILITIES.update,
      resource_id: alertId,
    }),
  getAlertDestroy: alertId =>
    stringifyPermission({
      resource_class: 'Alert',
      ability: ABILITIES.destroy,
      resource_id: alertId,
    }),
  streamVisibilityEdit: stringifyPermission({
    resource_class: 'stream',
    ability: ABILITIES.edit,
  }),
  userImpersonate: stringifyPermission({
    resource_class: 'user',
    ability: ABILITIES.impersonate,
  }),
  getDashboardUpdate: dashboardId =>
    stringifyPermission({
      resource_class: 'Dashboard',
      ability: ABILITIES.update,
      resource_id: dashboardId,
    }),
  canCreateDashboard: stringifyPermission({
    resource_class: 'Dashboard',
    ability: ABILITIES.create,
  }),
  canCopyUsers: stringifyPermission({
    resource_class: 'Group',
    ability: ABILITIES.copy_users,
  }),
  canViewDocumentsInfo: stringifyPermission({
    resource_class: 'documents_info',
    ability: ABILITIES.view,
  }),
  canViewCostsInfo: stringifyPermission({
    resource_class: 'costs_info',
    ability: ABILITIES.view,
  }),
  canViewBillingCost: stringifyPermission({
    resource_class: 'billing_visualization_cost',
    ability: ABILITIES.view,
  }),
  canReadBillingInfo: stringifyPermission({
    resource_class: 'Usage',
    ability: ABILITIES.read,
  }),
  canUpdateTiers: stringifyPermission({
    resource_class: 'Tier',
    ability: ABILITIES.update,
  }),
  canReadTiers: stringifyPermission({
    resource_class: 'Tier',
    ability: ABILITIES.read,
  }),
  canCreateTiers: stringifyPermission({
    resource_class: 'Tier',
    ability: ABILITIES.create,
  }),
  canDestroyTiers: stringifyPermission({
    resource_class: 'Tier',
    ability: ABILITIES.destroy,
  }),
  canUpdatePlatformSubscriptions: stringifyPermission({
    resource_class: 'PlatformSubscription',
    ability: ABILITIES.update,
  }),
  canReadPlatformSubscriptions: stringifyPermission({
    resource_class: 'PlatformSubscription',
    ability: ABILITIES.read,
  }),
  canCreatePlatformSubscriptions: stringifyPermission({
    resource_class: 'PlatformSubscription',
    ability: ABILITIES.create,
  }),
  canDestroyPlatformSubscriptions: stringifyPermission({
    resource_class: 'PlatformSubscription',
    ability: ABILITIES.destroy,
  }),
  canViewPurchasesPage: stringifyPermission({
    resource_class: 'company_purchase',
    ability: ABILITIES.access,
  }),
  canReadPermissions: stringifyPermission({
    resource_class: 'Permission',
    ability: ABILITIES.read,
  }),
  canViewUserPermissions: stringifyPermission({
    resource_class: 'mng_permissions_user_btn',
    ability: ABILITIES.view,
  }),
  canViewGroupPermissions: stringifyPermission({
    resource_class: 'mng_permissions_group_btn',
    ability: ABILITIES.view,
  }),
  canShareGroup: stringifyPermission({
    resource_class: 'Group',
    ability: ABILITIES.share,
  }),
  getAppStreamUpdate: appStreamId =>
    stringifyPermission({
      resource_class: 'AppStream',
      ability: ABILITIES.update,
      resource_id: appStreamId,
    }),
  canViewAlertValidationFilters: stringifyPermission({
    resource_class: 'alert_validation_filters',
    ability: ABILITIES.view,
  }),
  canViewAlertSubscriptionFilters: stringifyPermission({
    resource_class: 'alert_subscription_filters',
    ability: ABILITIES.view,
  }),
  getCanDestroyAlertDefinition: alertDefinitionId =>
    stringifyPermission({
      resource_class: 'AlertDefinition',
      ability: ABILITIES.destroy,
      resource_id: alertDefinitionId,
    }),
  getCanUpdateAlertDefinition: alertDefinitionId =>
    stringifyPermission({
      resource_class: 'AlertDefinition',
      ability: ABILITIES.update,
      resource_id: alertDefinitionId,
    }),
  canCreateAlertDashboard: stringifyPermission({
    resource_class: 'alert_dashboard',
    ability: ABILITIES.create,
  }),
  canUpdateAlertDashboard: stringifyPermission({
    resource_class: 'alert_dashboard',
    ability: ABILITIES.edit,
  }),
  canViewAlertCompanyField: stringifyPermission({
    resource_class: 'alert_company_field',
    ability: ABILITIES.view,
  }),
  canViewDashboardSharingCompany: stringifyPermission({
    resource_class: 'dashboard_sharing_company',
    ability: ABILITIES.view,
  }),
  canViewDashboardSharingSharedWith: stringifyPermission({
    resource_class: 'dashboard_sharing_shared_with',
    ability: ABILITIES.view,
  }),
  canViewConfigPage: stringifyPermission({
    resource_class: 'config_page',
    ability: ABILITIES.access,
  }),
  canAccessRequestApp: stringifyPermission({
    resource_class: 'request_app',
    ability: ABILITIES.access,
  }),
  canAccessUserSettingsWidgets: stringifyPermission({
    resource_class: 'user_settings_widgets',
    ability: ABILITIES.access,
  }),
  // dev center
  canViewDevCenter: stringifyPermission({
    resource_class: 'dev_center',
    ability: ABILITIES.access,
  }),
  getCanReadAppPackages: appId =>
    stringifyPermission({
      resource_class: 'App',
      ability: 'read_packages',
      resource_id: appId,
    }),
  canViewAppPackageSelector: stringifyPermission({
    resource_class: 'app_package_selector',
    ability: ABILITIES.view,
  }),
  canAccessProvisioning: stringifyPermission({
    resource_class: 'provisioning',
    ability: ABILITIES.access,
  }),
  // Assets permissions
  getCanUpdateAsset: assetId =>
    stringifyPermission({
      resource_class: 'Asset',
      ability: ABILITIES.update,
      resource_id: assetId,
    }),
  getCanUpdateParentAssetAsset: assetId =>
    stringifyPermission({
      resource_class: 'Asset',
      ability: 'update_parent_asset',
      resource_id: assetId,
    }),
  getCanCopyActivities: assetId =>
    stringifyPermission({
      resource_class: 'Asset',
      ability: ABILITIES.copy_activities,
      resource_id: assetId,
    }),
  rigCreate: stringifyPermission({
    ability: ABILITIES.create,
    resource_class: 'Rig',
  }),
  wellCreate: stringifyPermission({
    ability: ABILITIES.create,
    resource_class: 'Well',
  }),
  programCreate: stringifyPermission({
    ability: ABILITIES.create,
    resource_class: 'Program',
  }),
  padCreate: stringifyPermission({
    ability: ABILITIES.create,
    resource_class: 'Pad',
  }),
  padUpdate: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'Pad',
  }),
  canManagePadFracFleets: stringifyPermission({
    ability: 'manage_frac_fleets',
    resource_class: 'Pad',
  }),
  fracFleetCreate: stringifyPermission({
    ability: ABILITIES.create,
    resource_class: 'FracFleet',
  }),
  drilloutUnitCreate: stringifyPermission({
    ability: ABILITIES.create,
    resource_class: 'DrilloutUnit',
  }),
  canQCDrillstring: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'drillstring_qc',
  }),
  canCalibrateDrillstring: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'drillstring_calibration',
  }),
  canViewAppOwnersFilter: stringifyPermission({
    ability: ABILITIES.view,
    resource_class: 'app_owners_filter',
  }),
  canViewSaveOffsetWells: stringifyPermission({
    ability: ABILITIES.view,
    resource_class: 'save_offset_wells',
  }),
  canViewGenerateDRM: stringifyPermission({
    ability: ABILITIES.view,
    resource_class: 'corva.driller_roadmap-generate_drm',
  }),
  canUpdateWorkflow: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'Workflow',
  }),
  canViewColumnMapperTemplate: stringifyPermission({
    ability: ABILITIES.view,
    resource_class: 'column_mapper_template',
  }),

  ...settingsApps,
  ...appsPermissions,
};
