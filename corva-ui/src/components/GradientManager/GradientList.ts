import { find, map, reject, snakeCase, some } from 'lodash';
import {
  ALREADY_EXISTS_MESSAGE,
  GRADIENT_NEW_NAME,
  NAME_IS_MISSING_MESSAGE,
} from './configuration/constants';
import type { CustomGradient, GradientFillStop } from '~/types';

/**
 * An utility class used to manage Custom Gradients
 */
export class GradientList {

  gradients: CustomGradient[];
  defaultGradients: CustomGradient[];
  onGradientsChange: (gradients: CustomGradient[]) => void;

  constructor(
    gradients: CustomGradient[] = [],
    defaultGradients: CustomGradient[] = [],
    onGradientsChange: (gradients: CustomGradient[]) => void
  ) {
    this.gradients = gradients;
    this.defaultGradients = defaultGradients;
    this.onGradientsChange = onGradientsChange;
  }

  generateId(name: string) {
    const ids = new Set(map([...this.gradients, ...this.defaultGradients], 'id'));
    const id = snakeCase(name);
    let prefix = 0;
    while (ids.has(id + (prefix ? `_${prefix}` : ''))) {
      prefix += 1;
    }

    return id + (prefix ? `_${prefix}` : '');
  }

  public getById(id: string) {
    return find(this.gradients, { id }) || find(this.defaultGradients, { id });
  }

  public getByName(sampleName: string) {
    const sample = (sampleName || '').toLocaleLowerCase();
    return find(
      [...this.gradients, ...this.defaultGradients],
      ({ name }) => name.toLocaleLowerCase() === sample
    );
  }

  newName(name = GRADIENT_NEW_NAME) {
    let prefix = 0;
    while (this.getByName(name + (prefix ? ` ${prefix}` : ''))) {
      prefix += 1;
    }
    return name + (prefix ? ` ${prefix}` : '');
  }

  public isDefault(id: string) {
    return some(this.defaultGradients, { id });
  }

  public getHelperText({ name, allowNoname, gradientId }) {
    const emptyAndNotAllowed = !allowNoname && !name;

    if (emptyAndNotAllowed) {
      return {
        error: false,
        helperText: NAME_IS_MISSING_MESSAGE,
      };
    }

    const existing = this.getByName(name);

    const nameAlreadyUsed = existing && existing.id !== gradientId;
    if (nameAlreadyUsed) {
      return {
        error: true,
        helperText: ALREADY_EXISTS_MESSAGE,
      };
    }

    return null;
  };

  public add(name: string, gradientStops: GradientFillStop[]) {
    if (!name) {
      throw new Error(NAME_IS_MISSING_MESSAGE);
    }
    const names = this.gradients.map(({ name }) => name.toLocaleLowerCase());
    if (names.includes(name.toLocaleLowerCase())) {
      throw new Error(ALREADY_EXISTS_MESSAGE);
    }

    const id = this.generateId(name);
    const gradient = { id, name, gradientStops };
    this.onGradientsChange([...this.gradients, gradient]);
    return gradient;
  }

  public remove(id: string) {
    const gradients = reject(this.gradients, { id });
    this.onGradientsChange(gradients);
    return gradients;
  }

  public update(id: string, update: Partial<CustomGradient>) {
    const gradients =  this.gradients.map(current => {
      if (current.id === id) {
        return {
          ...current,
          ...update,
        };
      }
      return current;
    });
    this.onGradientsChange(gradients);
    return gradients;
  }
}
