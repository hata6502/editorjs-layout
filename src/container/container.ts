import { API } from '@editorjs/editorjs';
import styles from './container.css';
import { GridConfig } from '../Grid';
import { createItem, ItemData, saveItem } from '../item';
import { moveToNext, moveToPrev } from '../move';
import { createContainerSettings, toggleSettingsDisplay } from '../settings';

export interface ContainerData extends CSSStyleDeclaration {
  children: Partial<ContainerData | ItemData>[];
  type: 'container';
}

export const createContainer = (
  allSettings: readonly HTMLDivElement[],
  dispatchAllSettings: (action: HTMLDivElement) => void,
  api: API,
  createItemContent: GridConfig['createItemContent'],
  readOnly: boolean,
  options?: {
    data?: Partial<ContainerData>;
  }
) => {
  const container = document.createElement('div');

  container.classList.add(styles.container);
  container.dataset.type = 'container';

  container.style.alignContent = options?.data?.alignContent || 'normal';
  container.style.alignItems = options?.data?.alignItems || 'normal';
  container.style.alignSelf = options?.data?.alignSelf || 'auto';
  container.style.flexBasis = options?.data?.flexBasis || 'auto';
  container.style.flexDirection = options?.data?.flexDirection || 'row';
  container.style.flexGrow = options?.data?.flexGrow || '0';
  container.style.flexShrink = options?.data?.flexShrink || '1';
  container.style.flexWrap = options?.data?.flexWrap || 'nowrap';
  container.style.justifyContent = options?.data?.justifyContent || 'normal';

  const applyStyles = (extended: Partial<CSSStyleDeclaration>) => {
    const {
      alignContent,
      alignItems,
      alignSelf,
      flexBasis,
      flexDirection,
      flexGrow,
      flexShrink,
      flexWrap,
      justifyContent
    } = container.style;

    const style: Partial<CSSStyleDeclaration> = {
      ...extended,
      alignContent,
      alignItems,
      alignSelf,
      flexBasis,
      flexDirection,
      flexGrow,
      flexShrink,
      flexWrap,
      justifyContent
    };

    container.removeAttribute('style');

    Object.entries(style).forEach(([name, value]) => {
      if (value) {
        container.style[name as keyof Omit<CSSStyleDeclaration, 'length' | 'parentRule'>] = value;
      }
    });

    container.dataset.extended = Object.keys(extended)
      .map(name => name.replace(/,/g, ''))
      .join(',');
  };

  const extendedData: Partial<ContainerData> = { ...options?.data };

  delete extendedData.alignContent;
  delete extendedData.alignItems;
  delete extendedData.alignSelf;
  delete extendedData.flexBasis;
  delete extendedData.flexDirection;
  delete extendedData.flexGrow;
  delete extendedData.flexShrink;
  delete extendedData.flexWrap;
  delete extendedData.justifyContent;
  delete extendedData.children;
  delete extendedData.type;

  applyStyles(extendedData);

  if (!readOnly) {
    const settings = createContainerSettings(api, {
      extended: extendedData,
      onAlignContentChange: ({ target }) => {
        container.style.alignContent = (target as HTMLSelectElement).value;
      },
      onAlignItemsChange: ({ target }) => {
        container.style.alignItems = (target as HTMLSelectElement).value;
      },
      onAlignSelfChange: ({ target }) => {
        container.style.alignSelf = (target as HTMLSelectElement).value;
      },
      onDeleteClick: () => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);

          api.tooltip.hide();
        }
      },
      onExtendedChange: ({ extended }) => applyStyles(extended),
      onFlexBasisChange: ({ target }) => {
        container.style.flexBasis = (target as HTMLInputElement).value;
      },
      onFlexDirectionChange: ({ target }) => {
        container.style.flexDirection = (target as HTMLSelectElement).value;
      },
      onFlexGrowChange: ({ target }) => {
        container.style.flexGrow = (target as HTMLInputElement).value;
      },
      onFlexShrinkChange: ({ target }) => {
        container.style.flexShrink = (target as HTMLInputElement).value;
      },
      onFlexWrapChange: ({ target }) => {
        container.style.flexWrap = (target as HTMLSelectElement).value;
      },
      onJustifyContentChange: ({ target }) => {
        container.style.justifyContent = (target as HTMLSelectElement).value;
      },
      onNewContainerClick: () => {
        container.appendChild(
          createContainer(allSettings, dispatchAllSettings, api, createItemContent, readOnly, {
            data: { children: [{ type: 'item' }] }
          })
        );
      },
      onNewItemClick: () => {
        container.appendChild(
          createItem(allSettings, dispatchAllSettings, api, createItemContent, readOnly)
        );
      },
      onMoveToNextClick: () => moveToNext(container),
      onMoveToPrevClick: () => moveToPrev(container),
      style: container.style
    });

    container.addEventListener('click', ({ clientX, clientY, target }) => {
      if (target !== container) {
        return;
      }

      const rect = container.getBoundingClientRect();

      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      allSettings.forEach(allSetting => toggleSettingsDisplay(allSetting, false));
      toggleSettingsDisplay(
        settings,
        [
          { distance: Math.abs(offsetX), style: 'left' },
          { distance: Math.abs(offsetX - container.clientWidth), style: 'right' },
          { distance: Math.abs(offsetY), style: 'top' },
          { distance: Math.abs(offsetY - container.clientHeight), style: 'bottom' }
        ].sort((a, b) => a.distance - b.distance)[0].style
      );
    });

    container.appendChild(settings);
    dispatchAllSettings(settings);
  }

  if (options?.data?.children) {
    options.data.children.forEach(data => {
      if (data.type === 'container') {
        container.appendChild(
          createContainer(allSettings, dispatchAllSettings, api, createItemContent, readOnly, {
            data
          })
        );
      } else if (data.type === 'item') {
        container.appendChild(
          createItem(allSettings, dispatchAllSettings, api, createItemContent, readOnly, { data })
        );
      }
    });
  }

  return container;
};

export const saveContainer = async (
  container: HTMLDivElement,
  saveItemContent: GridConfig['saveItemContent']
): Promise<Partial<ContainerData>> => {
  const extended: Partial<CSSStyleDeclaration> = Object.fromEntries(
    container.dataset.extended
      ?.split(',')
      .map(name => [name, container.style[name as keyof CSSStyleDeclaration]]) || []
  );

  const childrenDataPromises: Promise<Partial<ContainerData | ItemData>>[] = Array.from(
    container.children
  )
    .filter(
      child =>
        child.getAttribute('data-type') === 'container' ||
        child.getAttribute('data-type') === 'item'
    )
    .map(
      child =>
        (child.getAttribute('data-type') === 'container' &&
          saveContainer(child as HTMLDivElement, saveItemContent)) ||
        saveItem(child as HTMLDivElement, saveItemContent)
    );

  const childrenData = await Promise.all(childrenDataPromises);

  return {
    ...extended,
    ...(container.style.alignContent !== 'normal' && {
      alignContent: container.style.alignContent
    }),
    ...(container.style.alignItems !== 'normal' && { alignItems: container.style.alignItems }),
    ...(container.style.alignSelf !== 'auto' && { alignSelf: container.style.alignSelf }),
    ...(container.style.flexBasis !== 'auto' && { flexBasis: container.style.flexBasis }),
    ...(container.style.flexDirection !== 'row' && {
      flexDirection: container.style.flexDirection
    }),
    ...(container.style.flexGrow !== '0' && { flexGrow: container.style.flexGrow }),
    ...(container.style.flexShrink !== '1' && { flexShrink: container.style.flexShrink }),
    ...(container.style.flexWrap !== 'nowrap' && { flexWrap: container.style.flexWrap }),
    ...(container.style.justifyContent !== 'normal' && {
      justifyContent: container.style.justifyContent
    }),
    ...(childrenData.length !== 0 && { children: childrenData }),
    type: 'container'
  };
};
