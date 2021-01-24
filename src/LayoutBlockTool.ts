import type EditorJSClass from "@editorjs/editorjs";
import type {
  API,
  BlockTool,
  BlockToolConstructorOptions,
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
  EditorJS: typeof EditorJSClass;
  disableLayoutEditing: boolean;
  initialData: ValidatedLayoutBlockToolData;
}

interface LayoutBlockToolData {
  itemContent: LayoutBlockItemContentData;
  layout: LayoutBlockContainerData;
}

interface ValidatedLayoutBlockToolData extends LayoutBlockToolData {
  itemContent: ValidatedLayoutBlockItemContentData;
  layout: ValidatedLayoutBlockContainerData;
}

class LayoutBlockTool implements BlockTool {
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

  #api: API;
  #config!: LayoutBlockToolConfig;
  #wrapper: HTMLDivElement;

  #itemContent: LayoutBlockItemContentData;
  #layout: LayoutBlockContainerData;

  constructor({
    api,
    config,
    data,
  }: BlockToolConstructorOptions<LayoutBlockToolData, LayoutBlockToolConfig>) {
    this.#api = api;
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
    if (config && "disableLayoutEditing" in config) {
      this.#config = config;

      const initialData = config.initialData;

      this.#itemContent = initialData.itemContent;
      this.#layout = initialData.layout;
    }

    // Filter undefined and empty object.
    // See also: https://github.com/codex-team/editor.js/issues/1432
    if (data && "itemContent" in data) {
      this.#itemContent = data.itemContent;
      this.#layout = data.layout;
    }
  }

  render() {
    this.renderWrapper();

    return this.#wrapper;
  }

  save(): LayoutBlockToolData {
    return {
      itemContent: this.#itemContent,
      layout: this.#layout,
    };
  }

  validate(data: LayoutBlockToolData) {
    const compatibilityCheck: ValidatedLayoutBlockToolData = data;

    return true;
  }

  dispatchData({
    itemContent,
    layout,
  }: {
    itemContent?: LayoutBlockItemContentData;
    layout?: LayoutBlockContainerData;
  }) {
    if (itemContent) {
      this.#itemContent = itemContent;
    }

    if (layout) {
      this.#layout = layout;
    }

    this.renderWrapper();
  }

  renderWrapper() {
    this.#wrapper.innerHTML = "";

    this.#wrapper.append(
      renderContainer({
        EditorJS: this.#config.EditorJS,
        data: this.#layout,
        itemContentData: this.#itemContent,
      })
    );
  }
}

export { LayoutBlockTool };
export type {
  LayoutBlockToolConfig,
  LayoutBlockToolData,
  ValidatedLayoutBlockToolData,
};
