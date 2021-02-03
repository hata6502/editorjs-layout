import { EditorJSLayoutError } from "./EditorJSLayoutError";
import type {
  LayoutBlockToolConfig,
  LayoutBlockToolDispatchData,
} from "./LayoutBlockTool";
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

interface RenderContext {
  EditorJS: LayoutBlockToolConfig["EditorJS"];
  dispatchData: LayoutBlockToolDispatchData;
  editorJSConfig: LayoutBlockToolConfig["editorJSConfig"];
  readOnly: boolean;
}

interface RenderContainerProps extends RenderContext {
  data: LayoutBlockContainerData;
  itemContentData: LayoutBlockItemContentData;
}

const renderContainer = ({
  data,
  itemContentData,
  ...context
}: RenderContainerProps) => {
  const wrapper = document.createElement("div");

  wrapper.id = data.id;
  wrapper.className = data.className;
  wrapper.style.cssText = data.style;

  data.children.forEach((child) => {
    let childElement: HTMLDivElement;

    switch (child.type) {
      case "container": {
        childElement = renderContainer({
          ...context,
          data: child,
          itemContentData,
        });

        break;
      }

      case "item": {
        childElement = renderItem({
          ...context,
          data: child,
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
export type {
  LayoutBlockContainerData,
  RenderContainerProps,
  RenderContext,
  ValidatedLayoutBlockContainerData,
};
