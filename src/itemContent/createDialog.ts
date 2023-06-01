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
  // Make be not able to click inner
  dialog.style.width = "calc(100% - 64px)";
  dialog.style.height = "100%";

  let editorJSHolder = document.createElement("div") as HTMLElement;
  const editorJSHolderID = uuidv4();

  editorJSHolder.id = editorJSHolderID;
  editorJSHolder.classList.add("editorjs-layout");
  dialog.append(editorJSHolder);

  const editorJS = new EditorJS({
    ...editorJSConfig,
    holder: editorJSHolderID,
    data,
  });

  const handleDialogClick = (event: MouseEvent) => {
    if (!(event.target instanceof Node) || !event.target.isEqualNode(dialog)) {
      return;
    }

    dialog.close();
  };

  dialog.addEventListener("click", handleDialogClick);

  const handleDialogClose = async () => {
    const editorJSData = await editorJS.save();

    editorJS.destroy();

    dialog.removeEventListener("click", handleDialogClick);
    dialog.removeEventListener("close", handleDialogClose);
    dialog.remove();

    onClose?.({ editorJSData });
  };

  dialog.addEventListener("close", handleDialogClose);

  return dialog;
};

export { createDialog };
