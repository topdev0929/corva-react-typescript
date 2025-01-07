import { CustomGradient, GradientFillStop } from '~/types';

/**
 * This component actually do two separate things.
 * It allow user to pick a gradient from the list of predefined and custom
 * gradients.
 *
 * The other function is to allow a user to manage custom gradients.
 *
 * There is also a possibility to edit gradient stops.
 */
export interface GradientManagerProps {
  /**
   * A currently selected gradient id
   */
  gradientId: string;

  /**
   * Only used when gradient can not be found by gradientId or gradientId is not provided.
   * This may happen if a custom gradient was deleted elsewhere but trace or other entity
   * still keeps gradient stops values. A user may recover the deleted custom gradient
   * by start editing it and save these stops as a new custom gradient.
   */
  gradientStops?: GradientFillStop[];

  /**
   * A change handler function
   * Called each time a user picks a gradient from the list or gradient stops
   * for the current gradient was changed
   */
  onChange: (changes: { gradientId: string, gradientStops: GradientFillStop[] }) => void;

  /**
  * A list of custom gradients.
  * NOTE: the built-in gradient are NOT included here.
  */
  gradients: CustomGradient[];

  /**
   * A custom gradients setter.
   * Called each time user gradients are added, removed or changed.
   * Changes include name, id, or gradient stops change.
   * When not provided, the behavior is the same as for disableGradientManagement: true :
   * Gradient edit/add/remove controls are disabled.
   */
  onGradientsChange?: (gradients: CustomGradient[]) => void;

  /**
   * When set to true Gradient edit/add/remove controls are disabled.
   * Set this property to true when you are sending gradient update requests to prevent
   * user input and therefore multiple simultaneous changes.
   */
  disableGradientsManagement?: boolean;

  /**
   * A default gradients list.
   * In most cases you don't need to provide it.
   * The predefined list of gradients is used if this property is not defined.
   */
  defaultGradients?: CustomGradient[];

  /**
   * In most cases you do not need to provide this value.
   * It defaults to the Garden gradient stops from internal constant.
   */
  defaultGradientStops?: GradientFillStop[];

  /**
   * A callback that is called when a user starts or stops editing gradients.
   * Use it to prevent form submit while gradient is still edit mode.
   */
  onGradientEditStateChange?: (isGradientEditorOpen: boolean) => void;

  /**
   * Allow to save a noname gradient.
   * If a user saves a noname gradient then onChange will be called with
   * no gradientId and no user gradients will be updated.
   *
   * This mode is useful in case when a user has a large amount of traces and
   * wants to assign different gradients to each trace but doesn't want
   * to have so many custom gradients.
   */
  allowNoname?: boolean;

  /**
   * scale options for Gradient editor component
   */
  scaleOptions?: {
    scaleFrom?: number;
    scaleTo?: number;
    scaleUnit?: string;
  }
}

