import type { OutputData } from "@editorjs/editorjs";
import { v4 as uuidv4 } from "uuid";
import type { RenderContext } from "../container";
import { createDialog } from "./createDialog";

interface LayoutBlockItemContentData {
  [index: string]: Pick<OutputData, "blocks"> | undefined;
}

interface ValidatedLayoutBlockItemContentData
  extends LayoutBlockItemContentData {}

interface RenderItemContentProps extends RenderContext {
  data: OutputData;
  itemContentId: string;
}

const renderItemContent = ({
  EditorJS,
  data,
  dispatchData,
  editorJSConfig,
  itemContentId,
  readOnly,
}: RenderItemContentProps) => {
  const editorJSHolderID = uuidv4();
  const wrapper = document.createElement("div");

  wrapper.id = editorJSHolderID;

  if (!readOnly) {
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
      // @ts-expect-error
      dialog.showModal();
    });
  }

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
export type {
  LayoutBlockItemContentData,
  RenderItemContentProps,
  ValidatedLayoutBlockItemContentData,
};
