import type EditorJSClass from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";
import { v4 as uuidv4 } from "uuid";

interface LayoutBlockItemContentData {
  [index: string]: Pick<OutputData, "blocks"> | undefined;
}

interface ValidatedLayoutBlockItemContentData
  extends LayoutBlockItemContentData {}

const renderItemContent = ({
  EditorJS,
  data,
}: {
  EditorJS: typeof EditorJSClass;
  data: Pick<OutputData, "blocks">;
}) => {
  const editorJSHolderID = uuidv4();
  const wrapper = document.createElement("div");

  wrapper.id = editorJSHolderID;

  // TODO: bind editorJSConfig
  new EditorJS({
    holder: editorJSHolderID,
    data,
    minHeight: 0,
    readOnly: true,
  });

  return wrapper;
};

export { renderItemContent };
export type { LayoutBlockItemContentData, ValidatedLayoutBlockItemContentData };
