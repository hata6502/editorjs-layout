import { API } from '@editorjs/editorjs';
import addCubeOutline from './add-cube-outline.svg';
import addDocumentOutline from './add-document-outline.svg';
import addOutline from './add-outline.svg';
import arrowBackOutline from './arrow-back-outline.svg';
import arrowForwardOutline from './arrow-forward-outline.svg';
import closeOutline from './close-outline.svg';
import styles from './settings.css';

const createButton = (
  { tooltip }: API,
  html: string,
  name: string,
  options?: { onClick?: (event: MouseEvent) => void; size?: string }
) => {
  const button = document.createElement('button');

  button.classList.add('cdx-settings-button');

  if (options?.size) {
    button.style.height = options.size;
    button.style.width = options.size;
  }

  button.innerHTML = html;

  if (options?.onClick) {
    button.addEventListener('click', options.onClick);
  }

  button.addEventListener('mouseenter', () => tooltip.show(button, name));
  button.addEventListener('mouseleave', tooltip.hide);

  return button;
};

const createInputWithButton = (
  api: API,
  buttonHtml: string,
  buttonName: string,
  options?: {
    initialValue?: string;
    onButtonClick?: (event: MouseEvent) => void;
    onChange?: (event: Event) => void;
  }
) => {
  const container = document.createElement('div');

  container.classList.add(styles.inputWithButtonContainer);

  const input = document.createElement('input');

  input.classList.add(styles.inputWithButtonInput);

  input.size = 1;
  input.value = options?.initialValue || '';

  if (options?.onChange) {
    input.addEventListener('change', options.onChange);
  }

  container.appendChild(input);
  container.appendChild(
    createButton(api, buttonHtml, buttonName, { onClick: options?.onButtonClick, size: '18px' })
  );

  return container;
};

const createFreeSetting = (
  api: API,
  options?: {
    initialName?: string;
    initialValue?: string;
    onChange?: () => void;
    onDeleteClick?: (event: MouseEvent) => void;
  }
) => {
  const container = document.createElement('div');

  container.classList.add(styles.selectSettingContainer);

  container.dataset.name = options?.initialName || '';
  container.dataset.value = options?.initialValue || '';

  const name = document.createElement('input');

  name.classList.add(styles.selectSettingItem);
  name.value = options?.initialName || '';

  name.addEventListener('change', () => {
    container.dataset.name = name.value;

    if (options?.onChange) {
      options.onChange();
    }
  });

  container.appendChild(name);

  const value = createInputWithButton(api, closeOutline, 'Delete', {
    initialValue: options?.initialValue,
    onButtonClick: options?.onDeleteClick,
    onChange: ({ target }) => {
      container.dataset.value = (target as HTMLInputElement).value;

      if (options?.onChange) {
        options.onChange();
      }
    }
  });

  value.classList.add(styles.selectSettingItem);

  container.appendChild(value);

  return container;
};

const createInputSetting = (
  name: string,
  options?: { initialValue?: string; onChange?: (event: Event) => void; type?: string }
) => {
  const container = document.createElement('div');

  container.classList.add(styles.selectSettingContainer);

  const span = document.createElement('span');

  span.classList.add(styles.selectSettingItem, styles.selectSettingSpan);
  span.textContent = name;
  container.appendChild(span);

  const input = document.createElement('input');

  input.classList.add(styles.selectSettingItem);
  input.type = options?.type || 'text';
  input.value = options?.initialValue || '';

  if (options?.onChange) {
    input.addEventListener('change', options.onChange);
  }

  container.appendChild(input);

  return container;
};

const createSelectSetting = (
  name: string,
  values: string[],
  options?: { initialValue?: string; onChange?: (event: Event) => void }
) => {
  const container = document.createElement('div');

  container.classList.add(styles.selectSettingContainer);

  const span = document.createElement('span');

  span.classList.add(styles.selectSettingItem, styles.selectSettingSpan);
  span.textContent = name;
  container.appendChild(span);

  const select = document.createElement('select');

  select.classList.add(styles.selectSettingItem);

  if (options?.onChange) {
    select.addEventListener('change', options.onChange);
  }

  values.forEach(value => {
    const option = document.createElement('option');

    option.textContent = value;
    option.value = value;

    select.appendChild(option);
  });

  if (options?.initialValue) {
    select.value = options?.initialValue;
  }

  container.appendChild(select);

  return container;
};

const createExtendedSettings = (
  api: API,
  options?: {
    initialSettings?: Partial<CSSStyleDeclaration>;
    onExtendedChange?: (event: { extended: Partial<CSSStyleDeclaration> }) => void;
  }
) => {
  const container = document.createElement('div');
  const settingsContainer = document.createElement('div');

  const handleExtendedChange = () => {
    const extended: Partial<CSSStyleDeclaration> = Object.fromEntries(
      Array.from(settingsContainer.children).map(child => [
        child.getAttribute('data-name'),
        child.getAttribute('data-value')
      ])
    );

    if (options?.onExtendedChange) {
      options.onExtendedChange({ extended });
    }
  };

  const createSetting = (createSettingOptions?: {
    initialName?: string;
    initialValue?: string;
  }) => {
    const setting = createFreeSetting(api, {
      initialName: createSettingOptions?.initialName,
      initialValue: createSettingOptions?.initialValue,
      onChange: handleExtendedChange,
      onDeleteClick: () => {
        settingsContainer.removeChild(setting);

        handleExtendedChange();
      }
    });

    return setting;
  };

  if (options?.initialSettings) {
    Object.entries(options.initialSettings).forEach(([name, value]) =>
      settingsContainer.appendChild(createSetting({ initialName: name, initialValue: value }))
    );
  }

  container.appendChild(settingsContainer);

  container.appendChild(
    createButton(api, addOutline, 'New CSS setting', {
      onClick: () => settingsContainer.appendChild(createSetting()),
      size: '18px'
    })
  );

  return container;
};

export const createContainerSettings = (
  api: API,
  options?: {
    extended?: Partial<CSSStyleDeclaration>;
    onAlignContentChange?: (event: Event) => void;
    onAlignItemsChange?: (event: Event) => void;
    onAlignSelfChange?: (event: Event) => void;
    onDeleteClick?: (event: MouseEvent) => void;
    onExtendedChange?: (event: { extended: Partial<CSSStyleDeclaration> }) => void;
    onFlexBasisChange?: (event: Event) => void;
    onFlexDirectionChange?: (event: Event) => void;
    onFlexGrowChange?: (event: Event) => void;
    onFlexShrinkChange?: (event: Event) => void;
    onFlexWrapChange?: (event: Event) => void;
    onJustifyContentChange?: (event: Event) => void;
    onNewContainerClick?: (event: MouseEvent) => void;
    onNewItemClick?: (event: MouseEvent) => void;
    onMoveToNextClick?: (event: MouseEvent) => void;
    onMoveToPrevClick?: (event: MouseEvent) => void;
    style?: CSSStyleDeclaration;
  }
) => {
  const container = document.createElement('div');

  container.classList.add(styles.settings);

  container.appendChild(
    createButton(api, closeOutline, 'Delete', { onClick: options?.onDeleteClick })
  );

  container.appendChild(
    createButton(api, arrowBackOutline, 'Move to preview', {
      onClick: options?.onMoveToPrevClick
    })
  );

  container.appendChild(
    createButton(api, arrowForwardOutline, 'Move to next', {
      onClick: options?.onMoveToNextClick
    })
  );

  container.appendChild(
    createButton(api, addCubeOutline, 'New container', {
      onClick: options?.onNewContainerClick
    })
  );

  container.appendChild(
    createButton(api, addDocumentOutline, 'New item', { onClick: options?.onNewItemClick })
  );

  container.appendChild(
    createSelectSetting(
      'alignContent',
      [
        'normal',
        'center',
        'start',
        'end',
        'flex-start',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
        'stretch'
      ],
      { initialValue: options?.style?.alignContent, onChange: options?.onAlignContentChange }
    )
  );

  container.appendChild(
    createSelectSetting(
      'alignItems',
      ['normal', 'stretch', 'center', 'start', 'end', 'flex-start', 'flex-end'],
      { initialValue: options?.style?.alignItems, onChange: options?.onAlignItemsChange }
    )
  );

  container.appendChild(
    createSelectSetting(
      'alignSelf',
      [
        'auto',
        'normal',
        'center',
        'start',
        'end',
        'self-start',
        'self-end',
        'flex-start',
        'flex-end',
        'stretch'
      ],
      { initialValue: options?.style?.alignSelf, onChange: options?.onAlignSelfChange }
    )
  );

  container.appendChild(
    createInputSetting('flexBasis', {
      initialValue: options?.style?.flexBasis,
      onChange: options?.onFlexBasisChange
    })
  );

  container.appendChild(
    createSelectSetting('flexDirection', ['row', 'row-reverse', 'column', 'column-reverse'], {
      initialValue: options?.style?.flexDirection,
      onChange: options?.onFlexDirectionChange
    })
  );

  container.appendChild(
    createInputSetting('flexGrow', {
      initialValue: options?.style?.flexGrow,
      onChange: options?.onFlexGrowChange,
      type: 'number'
    })
  );

  container.appendChild(
    createInputSetting('flexShrink', {
      initialValue: options?.style?.flexShrink,
      onChange: options?.onFlexShrinkChange,
      type: 'number'
    })
  );

  container.appendChild(
    createSelectSetting('flexWrap', ['nowrap', 'wrap'], {
      initialValue: options?.style?.flexWrap,
      onChange: options?.onFlexWrapChange
    })
  );

  container.appendChild(
    createSelectSetting(
      'justifyContent',
      [
        'normal',
        'center',
        'start',
        'end',
        'flex-start',
        'flex-end',
        'left',
        'right',
        'space-between',
        'space-around',
        'space-evenly',
        'stretch'
      ],
      { initialValue: options?.style?.justifyContent, onChange: options?.onJustifyContentChange }
    )
  );

  container.appendChild(
    createExtendedSettings(api, {
      initialSettings: options?.extended,
      onExtendedChange: options?.onExtendedChange
    })
  );

  return container;
};

export const createItemSettings = (
  api: API,
  options?: {
    extended?: Partial<CSSStyleDeclaration>;
    onAlignSelfChange?: (event: Event) => void;
    onDeleteClick?: (event: MouseEvent) => void;
    onExtendedChange?: (event: { extended: Partial<CSSStyleDeclaration> }) => void;
    onFlexBasisChange?: (event: Event) => void;
    onFlexGrowChange?: (event: Event) => void;
    onFlexShrinkChange?: (event: Event) => void;
    onMoveToNextClick?: (event: MouseEvent) => void;
    onMoveToPrevClick?: (event: MouseEvent) => void;
    style?: CSSStyleDeclaration;
  }
) => {
  const container = document.createElement('div');

  container.classList.add(styles.settings);

  // To prevent settings position change.
  container.addEventListener('click', event => event.stopPropagation());

  container.appendChild(
    createButton(api, closeOutline, 'Delete', { onClick: options?.onDeleteClick })
  );

  container.appendChild(
    createButton(api, arrowBackOutline, 'Move to preview', {
      onClick: options?.onMoveToPrevClick
    })
  );

  container.appendChild(
    createButton(api, arrowForwardOutline, 'Move to next', {
      onClick: options?.onMoveToNextClick
    })
  );

  container.appendChild(
    createSelectSetting(
      'alignSelf',
      [
        'auto',
        'normal',
        'center',
        'start',
        'end',
        'self-start',
        'self-end',
        'flex-start',
        'flex-end',
        'stretch'
      ],
      { initialValue: options?.style?.alignSelf, onChange: options?.onAlignSelfChange }
    )
  );

  container.appendChild(
    createInputSetting('flexBasis', {
      initialValue: options?.style?.flexBasis,
      onChange: options?.onFlexBasisChange
    })
  );

  container.appendChild(
    createInputSetting('flexGrow', {
      initialValue: options?.style?.flexGrow,
      onChange: options?.onFlexGrowChange,
      type: 'number'
    })
  );

  container.appendChild(
    createInputSetting('flexShrink', {
      initialValue: options?.style?.flexShrink,
      onChange: options?.onFlexShrinkChange,
      type: 'number'
    })
  );

  container.appendChild(
    createExtendedSettings(api, {
      initialSettings: options?.extended,
      onExtendedChange: options?.onExtendedChange
    })
  );

  return container;
};

export const toggleSettingsDisplay = (settings: HTMLDivElement, force: string | false) => {
  settings.classList.toggle(styles.settingsActive, Boolean(force));
  settings.classList.remove(
    styles.settingsBottom,
    styles.settingsLeft,
    styles.settingsRight,
    styles.settingsTop
  );

  if (force === 'bottom') {
    settings.classList.add(styles.settingsBottom);
  } else if (force === 'left') {
    settings.classList.add(styles.settingsLeft);
  } else if (force === 'right') {
    settings.classList.add(styles.settingsRight);
  } else if (force === 'top') {
    settings.classList.add(styles.settingsTop);
  }
};
