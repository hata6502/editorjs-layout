import type { OutputData } from "@editorjs/editorjs";
import { v4 as uuidv4 } from "uuid";
import type {
  LayoutBlockToolConfig,
  LayoutBlockToolDispatchData,
} from "../LayoutBlockTool";
import { createDialog } from "./createDialog";

interface LayoutBlockItemContentData {
  [index: string]: Pick<OutputData, "blocks"> | undefined;
}

interface ValidatedLayoutBlockItemContentData
  extends LayoutBlockItemContentData {}

const renderItemContent = ({
  EditorJS,
  data,
  dispatchData,
  editorJSConfig,
  itemContentId,
}: {
  EditorJS: LayoutBlockToolConfig["EditorJS"];
  data: OutputData;
  dispatchData: LayoutBlockToolDispatchData;
  editorJSConfig: LayoutBlockToolConfig["editorJSConfig"];
  itemContentId: string;
}) => {
  const editorJSHolderID = uuidv4();
  const wrapper = document.createElement("div");

  wrapper.id = editorJSHolderID;
  wrapper.style.cursor = "pointer";

  wrapper.addEventListener("click", () => {
    const dialog = createDialog({
      EditorJS,
      data,
      editorJSConfig,
      onClose: async ({ editorJSData }) =>
        dispatchData(({ itemContent, layout }) => ({
          itemContent: {
            ...itemContent,
            [itemContentId]: {
              blocks: editorJSData.blocks,
            },
          },
          layout: layout,
        })),
    });

    document.body.append(dialog);
    dialog.showModal();
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
