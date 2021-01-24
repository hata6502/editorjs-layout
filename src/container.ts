import { EditorJSLayoutError } from "./EditorJSLayoutError";
import type { LayoutBlockToolConfig } from "./LayoutBlockTool";
import { renderItem } from "./item";
import type { LayoutBlockItemData, ValidatedLayoutBlockItemData } from "./item";
import type { LayoutBlockItemContentData } from "./itemContent";

interface LayoutBlockContainerData {
  type: "container";
  id: Element["id"];
  className: Element["className"];
  style: CSSStyleDeclaration["cssText"];
  children: (LayoutBlockContainerData | LayoutBlockItemData)[];
}

interface ValidatedLayoutBlockContainerData extends LayoutBlockContainerData {
  children: (
    | ValidatedLayoutBlockContainerData
    | ValidatedLayoutBlockItemData
  )[];
}

const renderContainer = ({
  EditorJS,
  data,
  editorJSConfig,
  itemContentData,
}: {
  EditorJS: LayoutBlockToolConfig["EditorJS"];
  data: LayoutBlockContainerData;
  editorJSConfig: LayoutBlockToolConfig["editorJSConfig"];
  itemContentData: LayoutBlockItemContentData;
}) => {
  const wrapper = document.createElement("div");

  wrapper.id = data.id;
  wrapper.className = data.className;
  wrapper.style.cssText = data.style;

  data.children.forEach((child) => {
    let childElement: HTMLDivElement;

    switch (child.type) {
      case "container": {
        childElement = renderContainer({
          EditorJS,
          data: child,
          editorJSConfig,
          itemContentData,
        });

        break;
      }

      case "item": {
        childElement = renderItem({
          EditorJS,
          data: child,
          editorJSConfig,
          itemContentData,
        });

        break;
      }

      default: {
        const exhaustiveCheck: never = child;

        throw new EditorJSLayoutError();
      }
    }

    wrapper.append(childElement);
  });

  return wrapper;
};

export { renderContainer };
export type { LayoutBlockContainerData, ValidatedLayoutBlockContainerData };
