import { API } from "@editorjs/editorjs";
import styles from "./item.css";
import { GridConfig } from "../Grid";
import { moveToNext, moveToPrev } from "../move";
import { createItemSettings, toggleSettingsDisplay } from "../settings";

export interface ItemData extends CSSStyleDeclaration {
  itemContent: Partial<any>;
  type: "item";
}

export const createItem = (
  allSettings: readonly HTMLDivElement[],
  dispatchAllSettings: (action: HTMLDivElement) => void,
  api: API,
  createItemContent: GridConfig["createItemContent"],
  readOnly: boolean,
  options?: {
    data?: Partial<ItemData>;
  }
) => {
  const item = document.createElement("div");

  item.classList.add(styles.item);
  item.dataset.type = "item";

  item.style.alignSelf = options?.data?.alignSelf || "auto";
  item.style.flexBasis = options?.data?.flexBasis || "auto";
  item.style.flexGrow = options?.data?.flexGrow || "0";
  item.style.flexShrink = options?.data?.flexShrink || "1";

  const applyStyles = (extended: Partial<CSSStyleDeclaration>) => {
    const { alignSelf, flexBasis, flexGrow, flexShrink } = item.style;
    const style: Partial<CSSStyleDeclaration> = {
      ...extended,
      alignSelf,
      flexBasis,
      flexGrow,
      flexShrink,
    };

    item.removeAttribute("style");

    Object.entries(style).forEach(([name, value]) => {
      if (value) {
        item.style[
          name as keyof Omit<CSSStyleDeclaration, "length" | "parentRule">
        ] = value;
      }
    });

    item.dataset.extended = Object.keys(extended)
      .map((name) => name.replace(/,/g, ""))
      .join(",");
  };

  const extendedData: Partial<ItemData> = { ...options?.data };

  delete extendedData.alignSelf;
  delete extendedData.flexBasis;
  delete extendedData.flexGrow;
  delete extendedData.flexShrink;
  delete extendedData.itemContent;
  delete extendedData.type;

  applyStyles(extendedData);

  if (!readOnly) {
    const settings = createItemSettings(api, {
      extended: extendedData,
      onAlignSelfChange: ({ target }) => {
        item.style.alignSelf = (target as HTMLSelectElement).value;
      },
      onDeleteClick: () => {
        if (item.parentNode) {
          item.parentNode.removeChild(item);

          api.tooltip.hide();
        }
      },
      onExtendedChange: ({ extended }) => applyStyles(extended),
      onFlexBasisChange: ({ target }) => {
        item.style.flexBasis = (target as HTMLInputElement).value;
      },
      onFlexGrowChange: ({ target }) => {
        item.style.flexGrow = (target as HTMLInputElement).value;
      },
      onFlexShrinkChange: ({ target }) => {
        item.style.flexShrink = (target as HTMLInputElement).value;
      },
      onMoveToNextClick: () => moveToNext(item),
      onMoveToPrevClick: () => moveToPrev(item),
      style: item.style,
    });

    item.addEventListener("click", ({ clientX, clientY }) => {
      const rect = item.getBoundingClientRect();

      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      allSettings.forEach((allSetting) =>
        toggleSettingsDisplay(allSetting, false)
      );
      toggleSettingsDisplay(
        settings,
        [
          { distance: Math.abs(offsetX), style: "left" },
          { distance: Math.abs(offsetX - item.clientWidth), style: "right" },
          { distance: Math.abs(offsetY), style: "top" },
          { distance: Math.abs(offsetY - item.clientHeight), style: "bottom" },
        ].sort((a, b) => a.distance - b.distance)[0].style
      );
    });

    item.appendChild(settings);
    dispatchAllSettings(settings);
  }

  item.appendChild(createItemContent({ data: options?.data?.itemContent }));

  return item;
};

export const saveItem = async (
  item: HTMLDivElement,
  saveItemContent: GridConfig["saveItemContent"]
): Promise<Partial<ItemData>> => {
  const extended: Partial<CSSStyleDeclaration> = Object.fromEntries(
    item.dataset.extended
      ?.split(",")
      .map((name) => [name, item.style[name as keyof CSSStyleDeclaration]]) ||
      []
  );

  return {
    ...extended,
    ...(item.style.alignSelf !== "auto" && { alignSelf: item.style.alignSelf }),
    ...(item.style.flexBasis !== "auto" && { flexBasis: item.style.flexBasis }),
    ...(item.style.flexGrow !== "0" && { flexGrow: item.style.flexGrow }),
    ...(item.style.flexShrink !== "1" && { flexShrink: item.style.flexShrink }),
    ...(item.lastElementChild && {
      itemContent: await saveItemContent(item.lastElementChild),
    }),
    type: "item",
  };
};
