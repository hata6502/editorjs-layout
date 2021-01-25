import type { OutputData } from "@editorjs/editorjs";
import { v4 as uuidv4 } from "uuid";
import type { LayoutBlockToolConfig } from "../LayoutBlockTool";

const createDialog = ({
  EditorJS,
  data,
  editorJSConfig,
  onClose,
}: {
  EditorJS: LayoutBlockToolConfig["EditorJS"];
  data: OutputData;
  editorJSConfig: LayoutBlockToolConfig["editorJSConfig"];
  onClose?: (event: { editorJSData: OutputData }) => void;
}) => {
  const dialog = document.createElement("dialog");

  dialog.style.maxWidth = "960px";
  dialog.style.top = "32px";
  dialog.style.width = "calc(100% - 64px)";

  const editorJSHolder = document.createElement("div");
  const editorJSHolderID = uuidv4();

  editorJSHolder.id = editorJSHolderID;

  dialog.append(editorJSHolder);

  const editorJS = new EditorJS({
    ...editorJSConfig,
    holder: editorJSHolderID,
    data,
  });

  const handleDialogClose = async () => {
    const editorJSData = await editorJS.save();

    editorJS.destroy();

    dialog.removeEventListener("close", handleDialogClose);
    dialog.remove();

    onClose?.({ editorJSData });
  };

  dialog.addEventListener("close", handleDialogClose);

  return dialog;
};

export { createDialog };
