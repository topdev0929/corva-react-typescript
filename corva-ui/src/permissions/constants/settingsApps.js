import { stringifyPermission } from '../utils';
import { ABILITIES } from './abilities';

export default {
  // SETTINGS APPS
  canUpdateDrillingAFEApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-AFE_settings_app',
  }),
  canUpdateCompletionAFEApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-AFE_settings_app',
  }),
  canUpdateDrillingSurfaceEquipmentApp: stringifyPermission({
    ability: ABILITIES.update,
    // TODO: Duma to update to the right resource class once added on API by Skubiy
    resource_class: 'corva.completion.settings-surfaceEquipment_settings_app',
  }),
  canUpdateCompletionSurfaceEquipmentApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-surfaceEquipment_settings_app',
  }),
  canUpdateCasingApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-casing_settings_app',
  }),

  canUpdateDrillingCostsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-costs_settings_app',
  }),
  canUpdateCompletionCostsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-costs_settings_app',
  }),

  canUpdateDrillingCrewsContactApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-crewsContact_settings_app',
  }),
  canUpdateCompletionCrewsContactApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-crewsContact_settings_app',
  }),

  canUpdateWHOApp: stringifyPermission({
    ability: ABILITIES.update,
    // TODO: Duma to update to the right resource class once added on API by Skubiy
    resource_class: 'corva.completion.settings-generalInfo_settings_app',
  }),

  canUpdateJobSettingsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-jobSettings_settings_app',
  }),

  canUpdateDrillingDrillstringsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-drillstrings_settings_app',
  }),
  canUpdateCompletionDrillstringsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-drillstrings_settings_app',
  }),
  canUpdateWellSectionsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-offsetWells_settings_app',
  }),
  canUpdateFormationsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-formations_settings_app',
  }),
  canUpdateMapApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-map_settings_app',
  }),
  canUpdateDrillingFluidChecksApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-fluidChecks_settings_app',
  }),
  canUpdateCompletionFluidChecksApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-fluidChecks_settings_app',
  }),
  canUpdateOffsetWellsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-offsetWells_settings_app',
  }),
  canUpdateOperationDiariesApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-operationDiaries_settings_app',
  }),
  canUpdateDrillingOperationSummariesApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-operationSummaries_settings_app',
  }),
  canUpdateCompletionOperationSummariesApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-operationSummaries_settings_app',
  }),
  canUpdatePlugDepthsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-plugs_settings_app',
  }),
  canUpdatePlugSheetApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-plugs_settings_app',
  }),
  canUpdatePressureGradientApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-pressureGradient_settings_app',
  }),
  canUpdateStageActualApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-stageActual_settings_app',
  }),
  canUpdateStageDesignApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-stageDesign_settings_app',
  }),
  canUpdateActualSurveysApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'settings-actualSurveys_settings_app',
  }),
  canUpdatePlanSurveysApp: stringifyPermission({
    ability: ABILITIES.update,
    // TODO: Duma to update to the right resource class once added on API by Skubiy
    resource_class: 'settings-actualSurveys_settings_app',
  }),
  canUpdateTimeLogApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-timeLog_settings_app',
  }),
  canUpdateWellGoalsApp: stringifyPermission({
    ability: ABILITIES.update,
    resource_class: 'corva.completion.settings-well-goals-ui_settings_app',
  }),
};
