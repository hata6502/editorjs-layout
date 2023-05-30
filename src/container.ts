import {
    EditorJSLayoutError
} from "./EditorJSLayoutError";
import type {
    LayoutBlockToolConfig,
    LayoutBlockToolDispatchData,
} from "./LayoutBlockTool";
import {
    renderItem
} from "./item";
import type {
    LayoutBlockItemData,
    ValidatedLayoutBlockItemData
} from "./item";
import type {
    LayoutBlockItemContentData
} from "./itemContent";
interface LayoutBlockContainerData {
    type: "container";
    id: Element["id"];
    className: Element["className"];
    style: CSSStyleDeclaration["cssText"];
    children: (LayoutBlockContainerData | LayoutBlockItemData)[];
}
interface ValidatedLayoutBlockContainerData extends LayoutBlockContainerData {
    children: ( |
        ValidatedLayoutBlockContainerData |
        ValidatedLayoutBlockItemData
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
    wrapper_class: HTMLInputElement;
    itemContentData: LayoutBlockItemContentData;
}
const renderContainer = ({
    data,
    wrapper_class,
    itemContentData,
    ...context
}: RenderContainerProps) => {
    const wrapper = document.createElement("div");
    wrapper.id = data.id;
    wrapper.className = data.className;
    wrapper.style.cssText = data.style;
    var items = data.children;
    if (wrapper_class.value != undefined && wrapper_class.value) {
        wrapper.className = wrapper_class.value;
    }
    data.children.forEach((child) => {
        let childElement: HTMLDivElement;
        switch (child.type) {
            case "container": {
                childElement = renderContainer({
                    wrapper_class,
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
        child = (child as ValidatedLayoutBlockItemData);
        if (!child) return;
        var itemContentId = !child.itemContentId ? "" : child.itemContentId;
        childElement.setAttribute("item-content-id", itemContentId);
        var input = document.createElement("input");
        var label = document.createElement("label");
        input.classList.add("cdx-input");
        input.setAttribute("placeholder", "Child Container class");
        label.classList.add("d-flex");
        label.classList.add("margin-x");

        input.setAttribute("type", "text");
        var button = document.createElement("button");
        button.innerHTML = "Remove container";
        button.classList.add("cdx-button");
        button.classList.add("bold");
        button.classList.add("margin-left");

        button.addEventListener("click", function(e) {
            items;
            itemContentData;
            childElement;
            var target = (e.currentTarget as HTMLInputElement);
            if (!target.parentElement) return;
            if (!target.parentElement.parentElement) return;
            if (!target.parentElement.parentElement.parentElement) return;
            if (!target.parentElement.parentElement.parentElement.children) return;
            //delete items index
            var nodes = Array.prototype.slice.call(target.parentElement.parentElement.parentElement.children);
            var index = nodes.indexOf(target.parentElement.parentElement);
            items.splice(index, 1);
            delete itemContentData[itemContentId];
            childElement.remove();
        });
        input.value = child.className;
        input.addEventListener("keyup", (e) => {
            childElement;
            e = (e as KeyboardEvent);
            if (!e.currentTarget) return;
            var currentTarget = (e.currentTarget as HTMLInputElement);
            if (e.key.toLowerCase() == "meta" || e.altKey) {
                return;
            }
            var old_value = child.className;
            child.className = currentTarget.value;
            if (childElement.classList.contains(old_value)) {
                if (currentTarget.value.length == 0) {
                    childElement.classList.remove(old_value);
                } else {
                    childElement.classList.replace(old_value, child.className);
                }
            } else {
                childElement.classList.add(child.className);
            }
        });
        if (child.className != undefined) {
            input.value = child.className;
        }
        label.append(input);
        childElement.prepend(label);
        label.append(button);
        wrapper.append(childElement);

    });
    return wrapper;
};
export {
    renderContainer
};
export type {
    LayoutBlockContainerData,
    RenderContainerProps,
    RenderContext,
    ValidatedLayoutBlockContainerData,
};