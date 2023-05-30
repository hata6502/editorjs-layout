require('./index.css').toString();
import type EditorJS from "@editorjs/editorjs";
import type {
    BlockTool,
    BlockToolConstructorOptions,
    EditorConfig,
} from "@editorjs/editorjs";
import {
    renderContainer
} from "./container";
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
    editorJSConfig: Omit <
        EditorConfig,
    "holder" | "data" | "minHeight" | "readOnly" >
    ;
    /** Reserved flag for the future */
    enableLayoutEditing: false;
    enableLayoutSaving: boolean;
    initialData: ValidatedLayoutBlockToolData;
}
interface LayoutBlockToolData {
    itemContent: LayoutBlockItemContentData;
    layout ? : LayoutBlockContainerData;
}
interface ValidatedLayoutBlockToolData extends LayoutBlockToolData {
    itemContent: ValidatedLayoutBlockItemContentData;
    layout ? : ValidatedLayoutBlockContainerData;
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
    static get isReadOnlySupported() {
        return true;
    }
    static get shortcut() {
        return "";
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
    #readOnly: boolean;
    #wrapper: HTMLDivElement;
    #wrapper_class: HTMLInputElement;
    #api: any;
    #itemContent: LayoutBlockItemContentData;
    #layout: LayoutBlockContainerData;
    constructor({
        config,
        data,
        api,
        readOnly,
    }: BlockToolConstructorOptions < LayoutBlockToolData, LayoutBlockToolConfig > ) {
        this.#readOnly = readOnly;
        this.#wrapper = document.createElement("div");
        this.#wrapper_class = document.createElement("input");
        this.#itemContent = {};
        this.#api = api;
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
    renderSettings() {
        var _layout = this.#layout;
        var _wrapper = this.#wrapper;
        var _dispatch = this.#dispatchData;
        var _itemContent = this.#itemContent;
        var _this = this;
        var _api = this.#api;
        const settings = [{
            name: 'Add column',
            icon: `<svg fill="#000000" width="20" height="20" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>plus-frame</title><path d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 26.016v-20q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408zM8 16q0 0.832 0.576 1.44t1.44 0.576h4v4q0 0.832 0.576 1.408t1.408 0.576 1.408-0.576 0.608-1.408v-4h4q0.8 0 1.408-0.576t0.576-1.44-0.576-1.408-1.408-0.576h-4v-4q0-0.832-0.608-1.408t-1.408-0.608-1.408 0.608-0.576 1.408v4h-4q-0.832 0-1.44 0.576t-0.576 1.408z"></path></svg>`,
            button_click: function() {
                _layout;
                _dispatch;
                _this;
                var id = crypto.randomUUID();
                _layout.children.push({
                    type: "item",
                    id: "",
                    className: "",
                    style: "",
                    itemContentId: id
                });
                _itemContent[id] = JSON.parse('{"blocks":[{"type":"paragraph","data":{"text":"Start typing here"}}]}');
                _this.render();
                _api.toolbar.close();
            }
        }];
        const wrapper = document.createElement('div');
        settings.forEach(tune => {
            let button = document.createElement('div');
            button.classList.add('cdx-settings-button');
            button.innerHTML = tune.icon;
            wrapper.appendChild(button);
            button.addEventListener('click', () => {
                tune.button_click();
                return true;
            });
        });
        return wrapper;
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
        var label = document.createElement("label");
        this.#wrapper_class.setAttribute("placeholder", "Container class");
        this.#wrapper_class.classList.add("cdx-input");
        this.#wrapper_class.setAttribute("type", "text");
        this.#wrapper_class.classList.add("wrapper_class");
        label.append(this.#wrapper_class);
        this.#wrapper.append(label);

        this.#wrapper.append(
            renderContainer({
                EditorJS: this.#config.EditorJS,
                data: this.#layout,
                wrapper_class: this.#wrapper_class,
                dispatchData: this.#dispatchData,
                editorJSConfig: this.#config.editorJSConfig,
                itemContentData: this.#itemContent,
                readOnly: this.#readOnly,
            })
        );
    }
}
export {
    LayoutBlockTool
};
export type {
    LayoutBlockToolConfig,
    LayoutBlockToolData,
    LayoutBlockToolDispatchData,
    ValidatedLayoutBlockToolData,
};