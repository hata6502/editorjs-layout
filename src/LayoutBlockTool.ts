import type {
  API,
  BlockTool,
  BlockToolConstructorOptions,
} from "@editorjs/editorjs";
import type {
  SavedLayoutBlockContainerData,
  ValidatedLayoutBlockContainerData,
} from "./container";
import type {
  SavedLayoutBlockItemContentData,
  ValidatedLayoutBlockItemContentData,
} from "./itemContent";

interface LayoutBlockToolConfig {
  disableLayoutEditing: boolean;
  initialData: ValidatedLayoutBlockData;
}

interface SavedLayoutBlockData {
  itemContent: SavedLayoutBlockItemContentData;
  layout: SavedLayoutBlockContainerData;
}

interface ValidatedLayoutBlockData extends SavedLayoutBlockData {
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

  #itemContent: SavedLayoutBlockItemContentData;
  #layout: SavedLayoutBlockContainerData;

  constructor({
    api,
    config,
    data,
  }: BlockToolConstructorOptions<SavedLayoutBlockData, LayoutBlockToolConfig>) {
    this.#api = api;
    this.#wrapper = document.createElement("div");

    // Filter undefined and empty object.
    // See also: https://github.com/codex-team/editor.js/issues/1432
    if (config && "disableLayoutEditing" in config) {
      this.#config = config;
    }

    // Filter undefined and empty object.
    // See also: https://github.com/codex-team/editor.js/issues/1432
    if (data && "itemContent" in data) {
      this.#itemContent = data.itemContent;
      this.#layout = data.layout;
    } else {
      this.#itemContent = {};
      this.#layout = {};
    }
  }

  render() {
    this.renderWrapper();

    return this.#wrapper;
  }

  save(): SavedLayoutBlockData {
    return {
      itemContent: this.#itemContent,
      layout: this.#layout,
    };
  }

  validate(data: SavedLayoutBlockData) {
    const compatibilityCheck: ValidatedLayoutBlockData = data;

    return true;
  }

  dispatchData() {
    this.renderWrapper();
  }

  renderWrapper() {}
}

export { LayoutBlockTool };
export type {
  LayoutBlockToolConfig,
  SavedLayoutBlockData,
  ValidatedLayoutBlockData,
};
