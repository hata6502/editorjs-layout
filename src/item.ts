import type { RenderContext } from "./container";
import { renderItemContent } from "./itemContent";
import type { LayoutBlockItemContentData } from "./itemContent";

interface LayoutBlockItemData {
  type: "item";
  id: Element["id"];
  className: Element["className"];
  style: CSSStyleDeclaration["cssText"];
  itemContentId: string;
}

interface ValidatedLayoutBlockItemData extends LayoutBlockItemData {}

interface RenderItemProps extends RenderContext {
  data: LayoutBlockItemData;
  itemContentData: LayoutBlockItemContentData;
}

const renderItem = ({ data, itemContentData, ...context }: RenderItemProps) => {
  const wrapper = document.createElement("div");

  wrapper.id = data.id;
  wrapper.className = data.className;
  wrapper.style.cssText = data.style;

  const editorJSData = itemContentData[data.itemContentId] ?? { blocks: [] };

  wrapper.append(
    renderItemContent({
      ...context,
      data: editorJSData,
      itemContentId: data.itemContentId,
    })
  );

  return wrapper;
};

export { renderItem };
export type {
  LayoutBlockItemData,
  RenderItemProps,
  ValidatedLayoutBlockItemData,
};
