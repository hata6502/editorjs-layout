import type {
  LayoutBlockToolConfig,
  LayoutBlockToolDispatchData,
} from "./LayoutBlockTool";
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
  dispatchData,
  editorJSConfig,
  itemContentData,
}: {
  EditorJS: LayoutBlockToolConfig["EditorJS"];
  data: LayoutBlockItemData;
  dispatchData: LayoutBlockToolDispatchData;
  editorJSConfig: LayoutBlockToolConfig["editorJSConfig"];
  itemContentData: LayoutBlockItemContentData;
}) => {
  const wrapper = document.createElement("div");

  wrapper.id = data.id;
  wrapper.className = data.className;
  wrapper.style.cssText = data.style;

  const editorJSData = itemContentData[data.itemContentId] ?? { blocks: [] };

  wrapper.append(
    renderItemContent({
      EditorJS,
      data: editorJSData,
      dispatchData,
      editorJSConfig,
      itemContentId: data.itemContentId,
    })
  );

  return wrapper;
};

export { renderItem };
export type { LayoutBlockItemData, ValidatedLayoutBlockItemData };
