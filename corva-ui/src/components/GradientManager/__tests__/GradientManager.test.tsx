import { render, screen, waitFor, within } from '@testing-library/react';
import { noop } from 'lodash';

import { ALREADY_EXISTS_MESSAGE, DEFAULT_GRADIENT_STOPS } from '../configuration/constants';
import { GradientManager as OriginalGradientManager } from '../GradientManager';
import { page } from './pageHelpers';
import { gradients } from './testData';

import type { GradientManagerProps } from '../GradientManagerProps';

// cast a type to keep property hints but fix missing props errors
const GradientManager: React.FC<Partial<GradientManagerProps>> = OriginalGradientManager;

describe('GradientManager', () => {

  beforeAll(() => {
    // reactSizeMe, ReactCursorPosition and probably Draggable not able to work without layout
    // faking size to have gradient bar 100px wide
    const width = 100;
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(width);
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width,
      height: width,
      top: 0, left: 0, bottom: width, right: width, x: 0, y: 0 } as any);
    jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(width);

  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should contain default built-in gradients', () => {
    render(
      <GradientManager
        gradientStops={[]}
        gradientId=""
        onChange={noop}
        gradients={[]}
      />
    );

    page.openGradientSelect();

    const list = within(screen.getByRole('listbox'));

    expect(list.getByText('Chromium')).toBeVisible();
    expect(list.getByText('Garden')).toBeVisible();
    expect(list.getByText('Standard')).toBeVisible();
    expect(list.getByText('Amber')).toBeVisible();
    expect(list.getByText('Volcano')).toBeVisible();
    expect(list.getByText('Cave')).toBeVisible();
  });

  it('should display the selected gradient name in the select', () => {
    render(
      <GradientManager
        gradientId="volcano"
        onChange={noop}
      />
    );

    expect(page.getTextOnSelect()).toEqual('Volcano');
  })

  it('should call onChange handler when user changes the selection', async () => {
    const changeHandler = jest.fn();
    render(
      <GradientManager
        gradientId="volcano"
        onChange={changeHandler}
      />
    );

    page.selectItemNamed('Garden');

    expect(changeHandler).toBeCalledWith({
      gradientId: 'garden',
      gradientStops: gradients.default.garden.gradientStops
    });
  })

  it('should be possible to override built-in gradients', () => {
    render(<GradientManager defaultGradients={[gradients.ice, gradients.fire]} />);

    page.openGradientSelect();

    const list = within(screen.getByRole('listbox'));

    expect(list.getByText('Fire')).toBeVisible();
    expect(list.getByText('Ice')).toBeVisible();
    expect(list.queryByText('Chromium')).toBeNull();
  });

  it('should be possible override default gradient stops', () => {
    const setGradients = jest.fn();
    render(<GradientManager
        gradients={[]}
        onGradientsChange={setGradients}
        defaultGradientStops={gradients.ice.gradientStops}
      />);

    page.openGradientSelect();
    page.addBtn().click();
    page.setNameValue('Rainbow');
    page.saveBtn().click();

    expect(setGradients).toBeCalledWith([expect.objectContaining({
      id: 'rainbow',
      name: 'Rainbow',
      gradientStops: gradients.ice.gradientStops
    })]);
  });

  it('it should allow adding a new gradient with a custom name', () => {
    const setGradients = jest.fn();
    render(<GradientManager
        gradients={[]}
        onGradientsChange={setGradients}
      />);

    page.openGradientSelect();
    page.addBtn().click();
    page.setNameValue('Rainbow');
    page.saveBtn().click();

    expect(setGradients).toBeCalledWith([expect.objectContaining({
      id: 'rainbow',
      name: 'Rainbow',
      gradientStops: expect.any(Array)
    })]);
  });

  it('should use a unique identifier for each added gradient', () => {
    const setGradients = jest.fn();
    const example = {
      ...gradients.fire,
      id: 'example'
    };

    render(<GradientManager
        gradients={[example]}
        onGradientsChange={setGradients}
      />);

    page.openGradientSelect();
    page.addBtn().click();
    page.setNameValue('Example');
    page.saveBtn().click();
    expect(setGradients).toBeCalledWith([
      example,
      expect.objectContaining({ id: 'example_1' }),
    ]);
  })

  it('should not allow adding a gradient with an empty name', () => {
    const setGradients = jest.fn();
    render(<GradientManager
      gradients={[]}
      onGradientsChange={setGradients}
    />);

    page.openGradientSelect();
    page.addBtn().click();
    expect(page.saveBtn().closest('button')).toBeDisabled();
    page.saveBtn().click();
    expect(setGradients).not.toBeCalled();
  });


  it('should not allow adding a gradient with a name that already exists', () => {
    const setGradients = jest.fn();
    render(<GradientManager
      gradients={[gradients.fire]}
      onGradientsChange={setGradients}
    />);

    page.openGradientSelect();
    page.addBtn().click();
    page.setNameValue('FiRe');
    expect(page.saveBtn().closest('button')).toBeDisabled();
    expect(screen.getByText(ALREADY_EXISTS_MESSAGE)).toBeVisible();
  });

  it('should disable the "delete" button when no gradient is selected', () => {
    const setGradients = jest.fn();
    render(<GradientManager
      gradients={[gradients.fire]}
      onGradientsChange={setGradients}
    />);

    expect(page.deleteBtn()).toBeNull();
  });

  it('should disable the "delete" button when a default gradient is selected', () => {
    const setGradients = jest.fn();
    render(<GradientManager
      gradients={[gradients.fire]}
      gradientId="garden"
      onGradientsChange={setGradients}
    />);

    expect(page.getTextOnSelect()).toEqual('Garden');
    expect(page.deleteBtn()).toBeNull();
  });

  it('it should allow deleting a gradient', () => {
    const setGradients = jest.fn();
    render(<GradientManager
      gradients={[gradients.fire, gradients.ice]}
      gradientId={gradients.fire.id}
      onGradientsChange={setGradients}
    />);

    expect(page.deleteBtn()).not.toBeDisabled();
    page.deleteBtn().click();
    expect(setGradients).toBeCalledWith([gradients.ice]);
  });

  it('should be possible to change a custom gradient name', () => {
    const setGradients = jest.fn();
    render(<GradientManager
      gradients={[gradients.fire, gradients.ice]}
      gradientId={gradients.fire.id}
      onGradientsChange={setGradients}
    />);

    page.editBtn().click();
    page.setNameValue('New Name');
    page.saveBtn().click();
    expect(setGradients).toBeCalledWith([{
      ...gradients.fire,
      name: 'New Name',
    }, gradients.ice])
  });

  it('should not call "onChange" while adding a new gradient before "save" is clicked', () => {
    const setGradients = jest.fn();
    const changeHandler = jest.fn();
    render(<GradientManager
      gradients={[]}
      gradientId={gradients.default.garden.id}
      onGradientsChange={setGradients}
      onChange={changeHandler}
    />);

    page.openGradientSelect();
    page.addBtn().click();
    expect(changeHandler).not.toBeCalled();
  });

  it('should not call "onChange" if editing of default gradient was cancelled', () => {
    const setGradients = jest.fn();
    const changeHandler = jest.fn();
    render(<GradientManager
      gradients={[]}
      gradientId={gradients.default.garden.id}
      onGradientsChange={setGradients}
      onChange={changeHandler}
    />);

    page.editBtn().click();
    page.cancelBtn().click();
    expect(changeHandler).not.toBeCalled();
  })

  it('should create a new gradient when trying to edit a default one', () => {
    const setGradients = jest.fn();
    const changeHandler = jest.fn();
    render(<GradientManager
      gradients={[]}
      gradientId={gradients.default.garden.id}
      onGradientsChange={setGradients}
      onChange={changeHandler}
    />);

    expect(page.getTextOnSelect()).toEqual(gradients.default.garden.name);
    page.editBtn().click();
    expect(page.getNameEditValue()).toEqual('My Gradient');
    expect(page.saveBtn()).not.toBeDisabled();
    page.saveBtn().click();
    expect(setGradients).toBeCalledWith([{
      ...gradients.default.garden,
      name: 'My Gradient',
      id: 'my_gradient',
    }]);
  });

  describe('gradientStops', () => {

    it('should display the selected gradient\'s stops in the gradient editor', async () => {
      render(<GradientManager
        gradientId={gradients.default.garden.id}
      />);

      await waitFor(() => expect(page.getStopValues()).toHaveLength(5), { timeout: 1000 });

      expect(page.getStopValues()).toEqual(gradients.default.garden.gradientStops);
    });

    it('should be possible to remove a stop if there is more than two stops', async () => {
      const setGradients = jest.fn();
      render(<GradientManager
        gradients={[gradients.fire]}
        gradientId={gradients.fire.id}
        onGradientsChange={setGradients}
      />);

      await waitFor(() => expect(page.getStopValues()).toHaveLength(3), { timeout: 1000 });

      page.editBtn().click();
      page.clickStop(1);
      page.deleteStopBtn().click();
      page.saveBtn().click();

      expect(setGradients).toBeCalledWith([
        {
          ...gradients.fire,
          gradientStops: [
            gradients.fire.gradientStops[0],
            // the stop with index 1 was removed
            gradients.fire.gradientStops[2],
          ]
        }
      ]);
    });

    it('should be possible to add a stop', async () => {
      const setGradients = jest.fn();
      render(<GradientManager
        gradients={[gradients.fire]}
        gradientId={gradients.fire.id}
        onGradientsChange={setGradients}
      />);

      page.editBtn().click();

      page.clickTrackAt(30);

      page.saveBtn().click();

      expect(setGradients).toBeCalledWith([
        {
          ...gradients.fire,
          gradientStops: [
            gradients.fire.gradientStops[0],
            {
              color: '#ffc900',
              pos: 30,
            },
            gradients.fire.gradientStops[1],
            gradients.fire.gradientStops[2],
          ]
        }
      ]);
    });
    // it('should be possible to move a stop', async () => {
    // TODO: make DnD work
    // });
  });

  describe('gradient groups visibility', () => {
    it('should normally have both custom and built-in gradient groups', () => {
      render(<GradientManager
        gradients={[gradients.fire]}
        gradientId={gradients.fire.id}
        onGradientsChange={noop}
      />);

      page.openGradientSelect();

      const items = page.getSelectOptions();
      expect(items).toContain('My Gradients');
      expect(items).toContain('Default Gradients');
    });


    it('should NOT have "Default Gradients" group if its empty', () => {
      render(<GradientManager
        gradients={[gradients.fire]}
        gradientId={gradients.fire.id}
        defaultGradients={[]}
        onGradientsChange={noop}
      />);

      page.openGradientSelect();

      const items = page.getSelectOptions();
      expect(items).not.toContain('Default Gradients');
    });

    it('should NOT have "My Gradients" group if its empty AND it is not possible to add new one', () => {
      render(<GradientManager
        gradients={[]}
        disableGradientsManagement
      />);

      page.openGradientSelect();

      const items = page.getSelectOptions();
      expect(items).not.toContain('My Gradients');
    });
  });
  describe('noname gradients support', () => {
    it('should be possible to save a noname gradient when "allowNoname" is set', () => {
      const changeHandler = jest.fn();
      render(<GradientManager
        gradients={[]}
        gradientId={gradients.default.garden.id}
        onChange={changeHandler}
        onGradientsChange={noop}
        allowNoname
      />);

      page.openGradientSelect();
      page.addBtn().click();

      page.saveBtn().click();

      expect(changeHandler).toBeCalledWith({
        gradientId: null,
        gradientStops: DEFAULT_GRADIENT_STOPS,
      });
    });
  });
});
