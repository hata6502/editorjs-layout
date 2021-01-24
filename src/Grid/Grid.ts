import { API, BlockTool, ToolSettings } from "@editorjs/editorjs";
import styles from "./Grid.css";
import gridOutline from "./grid-outline.svg";
import { ContainerData, createContainer, saveContainer } from "../container";
import { createItemContent, saveItemContent } from "../itemContent";
import { toggleSettingsDisplay } from "../settings";

export interface GridConfig<T = any> extends ToolSettings {
  /** Function for creating DOM element in each item */
  createItemContent: (options?: { data?: Partial<T> }) => Element;

  /** Initial data for creating Grid block */
  initialData: Partial<ContainerData>;

  /** By setting true, layout can't be edited. */
  readOnly: boolean;

  /** Function for saving data of each item */
  saveItemContent: (content: Element) => T | Promise<T>;
}

class Grid implements BlockTool {
  static get toolbox() {
    return {
      icon: gridOutline,
      title: "Grid",
    };
  }

  protected readonly allSettings: HTMLDivElement[];

  protected api: API;

  protected config: GridConfig;

  protected container: HTMLDivElement;

  constructor({
    api,
    config,
    data,
  }: {
    api: API;
    config?: Partial<GridConfig>;
    data?: Partial<ContainerData>;
  }) {
    this.allSettings = [];
    this.api = api;

    // @ts-ignore
    this.config = {
      createItemContent: config?.createItemContent || createItemContent,
      initialData: config?.initialData || { children: [{ type: "item" }] },
      readOnly: config?.readOnly || false,
      saveItemContent: config?.saveItemContent || saveItemContent,
    };

    this.container = createContainer(
      this.allSettings,
      this.dispatchAllSettings,
      this.api,
      this.config.createItemContent,
      this.config.readOnly,
      {
        data:
          ((!data || Object.keys(data).length === 0) &&
            this.config.initialData) ||
          data,
      }
    );
  }

  render() {
    setTimeout(() => {
      const block = this.container.parentElement?.parentElement;

      if (!block) {
        return;
      }

      const handleFocusChange = () => {
        // Check selection in order to type.
        const isFocused =
          block.classList.contains("ce-block--focused") ||
          this.container.contains(document.getSelection()?.anchorNode || null);

        this.container.classList.toggle(styles.preview, !isFocused);

        if (!isFocused) {
          this.allSettings.forEach((settings) =>
            toggleSettingsDisplay(settings, false)
          );
        }
      };

      document.addEventListener("selectionchange", handleFocusChange);

      const observer = new MutationObserver(handleFocusChange);

      observer.observe(block, {
        attributeFilter: ["class"],
        attributes: true,
      });
    });

    return this.container;
  }

  save() {
    return saveContainer(this.container, this.config.saveItemContent);
  }

  validate(data: Partial<ContainerData>) {
    return this.container.parentNode !== null && Boolean(data.children);
  }

  protected dispatchAllSettings = (action: HTMLDivElement) => {
    this.allSettings.push(action);
  };
}

export default Grid;
