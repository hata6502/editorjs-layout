import type { OutputData } from "@editorjs/editorjs";
import { v4 as uuidv4 } from "uuid";
import type { LayoutBlockToolConfig } from "./LayoutBlockTool";

interface LayoutBlockItemContentData {
  [index: string]: Pick<OutputData, "blocks"> | undefined;
}

interface ValidatedLayoutBlockItemContentData
  extends LayoutBlockItemContentData {}

const renderItemContent = ({
  EditorJS,
  data,
  editorJSConfig,
}: {
  EditorJS: LayoutBlockToolConfig["EditorJS"];
  data: Pick<OutputData, "blocks">;
  editorJSConfig: LayoutBlockToolConfig["editorJSConfig"];
}) => {
  const editorJSHolderID = uuidv4();
  const wrapper = document.createElement("div");

  wrapper.id = editorJSHolderID;
  wrapper.style.cursor = "pointer";

  wrapper.addEventListener("click", () => {
    // TODO: open modal
  });

  new EditorJS({
    ...editorJSConfig,
    holder: editorJSHolderID,
    data,
    minHeight: 0,
    readOnly: true,
  });

  return wrapper;
};

export { renderItemContent };
export type { LayoutBlockItemContentData, ValidatedLayoutBlockItemContentData };
