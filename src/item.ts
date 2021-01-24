import type EditorJSClass from "@editorjs/editorjs";
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

const renderItem = ({
  EditorJS,
  data,
  itemContentData,
}: {
  EditorJS: typeof EditorJSClass;
  data: LayoutBlockItemData;
  itemContentData: LayoutBlockItemContentData;
}) => {
  const wrapper = document.createElement("div");

  wrapper.id = data.id;
  wrapper.className = data.className;
  wrapper.style.cssText = data.style;

  const editorJSData = itemContentData[data.itemContentId] ?? { blocks: [] };

  wrapper.append(renderItemContent({ EditorJS, data: editorJSData }));

  return wrapper;
};

export { renderItem };
export type { LayoutBlockItemData, ValidatedLayoutBlockItemData };
