import type EditorJS from "@editorjs/editorjs";
import type {
  BlockTool,
  BlockToolConstructorOptions,
  EditorConfig,
} from "@editorjs/editorjs";
import { renderContainer } from "./container";
import type {
  LayoutBlockContainerData,
  ValidatedLayoutBlockContainerData,
} from "./container";
import type {
  LayoutBlockItemContentData,
  ValidatedLayoutBlockItemContentData,
} from "./itemContent";

interface LayoutBlockToolConfig {
  EditorJS: typeof EditorJS;
  editorJSConfig: Omit<
    EditorConfig,
    "holder" | "data" | "minHeight" | "readOnly"
  >;
  /** Reserved flag for the future */
  enableLayoutEditing: false;
  enableLayoutSaving: boolean;
  initialData: ValidatedLayoutBlockToolData;
}

interface LayoutBlockToolData {
  itemContent: LayoutBlockItemContentData;
  layout?: LayoutBlockContainerData;
}

interface ValidatedLayoutBlockToolData extends LayoutBlockToolData {
  itemContent: ValidatedLayoutBlockItemContentData;
  layout?: ValidatedLayoutBlockContainerData;
}

interface LayoutBlockToolDispatchData {
  (
    action: (prevData: {
      itemContent: LayoutBlockItemContentData;
      layout: LayoutBlockContainerData;
    }) => {
      itemContent: LayoutBlockItemContentData;
      layout: LayoutBlockContainerData;
    }
  ): void;
}

class LayoutBlockTool implements BlockTool {
  static get shortcut() {
    return "CMD+L";
  }

  static get toolbox() {
    return {
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512">
          <rect x="48" y="48" width="176" height="176" rx="20" ry="20" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
          <rect x="288" y="48" width="176" height="176" rx="20" ry="20" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
          <rect x="48" y="288" width="176" height="176" rx="20" ry="20" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
          <rect x="288" y="288" width="176" height="176" rx="20" ry="20" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
        </svg>
      `,
      title: "Layout",
    };
  }

  #config!: LayoutBlockToolConfig;
  #wrapper: HTMLDivElement;

  #itemContent: LayoutBlockItemContentData;
  #layout: LayoutBlockContainerData;

  constructor({
    config,
    data,
  }: BlockToolConstructorOptions<LayoutBlockToolData, LayoutBlockToolConfig>) {
    this.#wrapper = document.createElement("div");

    this.#itemContent = {};

    this.#layout = {
      type: "container",
      id: "",
      className: "",
      style: "",
      children: [],
    };

    // Filter undefined and empty object.
    // See also: https://github.com/codex-team/editor.js/issues/1432
    if (config && "EditorJS" in config) {
      this.#config = config;
      this.#itemContent = config.initialData.itemContent;

      if (config.initialData.layout) {
        this.#layout = config.initialData.layout;
      }
    }

    // Filter undefined and empty object.
    // See also: https://github.com/codex-team/editor.js/issues/1432
    if (data && "itemContent" in data) {
      this.#itemContent = data.itemContent;

      if (data.layout) {
        this.#layout = data.layout;
      }
    }
  }

  render() {
    this.renderWrapper();

    return this.#wrapper;
  }

  save(): LayoutBlockToolData {
    return {
      itemContent: this.#itemContent,
      layout: this.#config.enableLayoutSaving ? this.#layout : undefined,
    };
  }

  validate(data: LayoutBlockToolData) {
    const compatibilityCheck: ValidatedLayoutBlockToolData = data;

    return true;
  }

  #dispatchData: LayoutBlockToolDispatchData = (action) => {
    const data = action({
      itemContent: this.#itemContent,
      layout: this.#layout,
    });

    this.#itemContent = data.itemContent;
    this.#layout = data.layout;

    this.renderWrapper();
  };

  renderWrapper() {
    this.#wrapper.innerHTML = "";

    this.#wrapper.append(
      renderContainer({
        EditorJS: this.#config.EditorJS,
        data: this.#layout,
        dispatchData: this.#dispatchData,
        editorJSConfig: this.#config.editorJSConfig,
        itemContentData: this.#itemContent,
      })
    );
  }
}

export { LayoutBlockTool };
export type {
  LayoutBlockToolConfig,
  LayoutBlockToolData,
  LayoutBlockToolDispatchData,
  ValidatedLayoutBlockToolData,
};
