# editorjs-layout

Layout block tool for Editor.js.

Alternative solution: [editorjs-inline](https://github.com/hata6502/editorjs-inline)

### ✨ [Demo](https://hata6502.github.io/editorjs-layout/)

![demo](https://user-images.githubusercontent.com/7702653/105721139-97eb9100-5f67-11eb-8dca-dd4d89314377.gif)

## Install

```bash
$ npm i editorjs-layout
```

or

```html
<script src="https://cdn.jsdelivr.net/npm/editorjs-layout@latest"></script>
```

## Usage

Please see [demo HTML](https://github.com/hata6502/editorjs-layout/blob/main/docs/index.html).

## Config params

Please see type declaration of [LayoutBlockToolConfig](https://github.com/hata6502/editorjs-layout/blob/main/src/LayoutBlockTool.ts).

## Output data

Please see type declaration of [ValidatedLayoutBlockToolData](https://github.com/hata6502/editorjs-layout/blob/main/src/LayoutBlockTool.ts).

## Copied data

Please see type declaration of [LayoutBlockToolData](https://github.com/hata6502/editorjs-layout/blob/main/src/LayoutBlockTool.ts).

NOTE:
Copied block data by `ctrl+c` are not [validated](https://editorjs.io/blockapi#methods).
So copied block data and output block data may be different.
Please see also [this comment](https://github.com/codex-team/editor.js/issues/1280#issuecomment-706482368).

## Disclaimer

The following creations are included in this product:

- [ionic-team/ionicons](https://github.com/ionic-team/ionicons/blob/master/LICENSE)


## Rescursion Trick To add nested EditorJs Layouts

Create a base_config object that would work as a EditorJS Config

Create a Config object similar to tools that you want as the inner editor, and call it base_config
Create a Config object similar to tools that you want as the last inner editor, and call it last_line_config

Your goign to run create_editor_js_config(base_config, last_line_config, how_many_levels_you_want); into editorJSConfig variable and assign that to the layout tools as you see on line 236

Add lodash to where you load your scripts
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js" integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>


var editorJSConfig = {};
var base_config = {
    readOnly: false,
    tools: {
        layout: {
            class: EditorJSLayout
                .LayoutBlockTool,
            config: {
                EditorJS,
                editorJSConfig,
                enableLayoutEditing: false,
                enableLayoutSaving: true,
                initialData: {
                    itemContent: {
                        1: {
                            blocks: [{
                                type: "paragraph",
                                data: {
                                    text: "Start typing here",
                                },
                            }, ]
                        },
                    },
                    layout: {
                        type: "container",
                        id: "",
                        className: "",
                        style: "",
                        children: [{
                            type: "item",
                            id: "",
                            className: "",
                            style: "",
                            itemContentId: "1",
                        }, ],
                    },
                },
            },
            toolbox: {
                icon: `
    <svg xmlns='http://www.w3.org/2000/svg' width="16" height="16" viewBox='0 0 512 512'>
    <rect x='128' y='128' width='336' height='336' rx='57' ry='57' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/>
    <path d='M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/>
    </svg>
    `,
                title: "1 column level",
            },
        },
        header: {
            class: Header,
            inlineToolbar: true,
            // tunes: ['anyTuneName']
        },
        image: SimpleImage,
        list: {
            class: List,
            inlineToolbar: true,
        },
        checklist: {
            class: Checklist,
            inlineToolbar: true,
        },
        quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author',
            },
        },
        warning: Warning,
        code: {
            class: CodeTool,
        },
        delimiter: Delimiter,
        inlineCode: {
            class: InlineCode,
        },
        // linkTool: LinkTool,
        embed: Embed,
        table: {
            class: Table,
            inlineToolbar: true,
        },
    }
};
var last_line_config = {
    tools: {
        header: {
            class: Header,
            inlineToolbar: true,
        }
    }
};
var create_editor_js_config = function(
    base_config, last_line_config,
    desired_level, current_level = 1
    ) {
    if (desired_level ==
        current_level) {
        for (const [key,
                value
            ] of Object.entries(
                base_config.tools
                )) {
            if (value
                .hasOwnProperty(
                    "class") &&
                value.class.name ==
                "LayoutBlockTool") {
                value.config
                    .editorJSConfig = {
                        tools: last_line_config
                            .tools
                    };
            }
        }
        return base_config;
    }
    if (current_level <
        desired_level) {
        current_level++;
        var new_inner_config = _
            .cloneDeep(base_config);
        var inner_config =
            create_editor_js_config(
                new_inner_config,
                last_line_config,
                desired_level,
                current_level);
        for (const [key,
                value
            ] of Object.entries(
                base_config.tools
                )) {
            if (value
                .hasOwnProperty(
                    "class") &&
                value.class.name ==
                "LayoutBlockTool") {
                value.config
                    .editorJSConfig = {
                        tools: inner_config
                            .tools
                    };
            }
        }
        return base_config;
    }
    return base_config;
}
var editorJSConfig =
    create_editor_js_config(base_config,
        last_line_config, 2);
const editorConfig = {
    /**
     * Enable/Disable the read only mode
     */
    readOnly: false,
    /**
     * Wrapper of Editor
     */
    holder: 'editorjs',
    /**
     * Tools list
     */
    tools: {
        /**
         * Each Tool is a Plugin. Pass them via 'class' option with necessary settings {@link docs/tools.md}
         */
        oneheader: {
            class: EditorJSLayout
                .LayoutBlockTool,
            config: {
                EditorJS,
                editorJSConfig,
                enableLayoutEditing: false,
                enableLayoutSaving: true,
                initialData: {
                    itemContent: {
                        1: {
                            blocks: [{
                                type: "paragraph",
                                data: {
                                    text: "Start typing here",
                                },
                            }, ]
                        },
                    },
                    layout: {
                        type: "container",
                        id: "",
                        className: "",
                        style: "",
                        children: [{
                            type: "item",
                            id: "",
                            className: "",
                            style: "",
                            itemContentId: "1",
                        }, ],
                    },
                },
            },
            toolbox: {
                icon: `<svg xmlns='http://www.w3.org/2000/svg' width="16" height="16" viewBox='0 0 512 512'><rect x='128' y='128' width='336' height='336' rx='57' ry='57' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/><path d='M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>`,
                title: "1 column",
            },
        },
        header2column: {
            class: EditorJSLayout
                .LayoutBlockTool,
            config: {
                EditorJS,
                editorJSConfig,
                enableLayoutEditing: false,
                enableLayoutSaving: true,
                initialData: {
                    itemContent: {
                        1: {
                            blocks: [{
                                type: "paragraph",
                                data: {
                                    text: "Start typing here",
                                },
                            }, ]
                        },
                        2: {
                            blocks: [{
                                type: "paragraph",
                                data: {
                                    text: "Start typing here",
                                },
                            }, ]
                        },
                        3: {
                            blocks: [{
                                type: "paragraph",
                                data: {
                                    text: "Start typing here",
                                },
                            }, ]
                        },
                    },
                    layout: {
                        type: "container",
                        id: "",
                        className: "",
                        style: "",
                        children: [{
                            type: "item",
                            id: "",
                            className: "",
                            style: "",
                            itemContentId: "1",
                        }, {
                            type: "item",
                            id: "",
                            className: "",
                            style: "",
                            itemContentId: "2",
                        }, {
                            type: "item",
                            id: "",
                            className: "",
                            style: "",
                            itemContentId: "3",
                        }, ],
                    },
                },
            },
            toolbox: {
                icon: `<svg xmlns='http://www.w3.org/2000/svg' width="16" height="16" viewBox='0 0 512 512'><rect x='128' y='128' width='336' height='336' rx='57' ry='57' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/><path d='M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>`,
                title: "2 columns with header",
            },
        },
        header: {
            class: Header,
            config: {
                placeholder: 'Header'
            },
        },
        /**
         * Or pass class directly without any configuration
         */
        image: SimpleImage,
        list: {
            class: NestedList,
            inlineToolbar: true,
        },
        checklist: {
            class: Checklist,
            inlineToolbar: true,
        },
        quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author',
            },
        },
        warning: Warning,
        marker: {
            class: Marker,
        },
        code: {
            class: CodeTool,
        },
        delimiter: Delimiter,
        inlineCode: {
            class: InlineCode,
        },
        linkTool: LinkTool,
        raw: RawTool,
        embed: Embed,
        table: {
            class: Table,
            inlineToolbar: true,
        },
    },
    /**
     * This Tool will be used as default
     */
    defaultBlock: 'paragraph',
    /**
     * Initial Editor data
     */
    data: {},
    onReady: function() {
        saveButton.click();
    },
    onChange: function(api, event) {
        console.log(
            'something changed',
            event);
    },
}
/**
 * To initialize the Editor, create a new instance with configuration object
 * @see docs/installation.md for mode details
 */
var editor = new EditorJS(editorConfig);
/**
 * Saving button
 */
const saveButton = document
    .getElementById('saveButton');
/**
 * Toggle read-only button
 */
const toggleReadOnlyButton = document
    .getElementById(
        'toggleReadOnlyButton');
const readOnlyIndicator = document
    .getElementById('readonly-state');
/**
 * Saving example
 */
saveButton.addEventListener('click',
    function() {
        editor.save().then((
            savedData) => {
            cPreview.show(
                savedData,
                document
                .getElementById(
                    "output"
                    ));
        }).catch((error) => {
            console.error(
                'Saving error',
                error);
        });
    });
/**
 * Toggle read-only example
 */
toggleReadOnlyButton.addEventListener(
    'click', async () => {
        const readOnlyState =
            await editor
            .readOnly.toggle();
        readOnlyIndicator
            .textContent =
            readOnlyState ?
            'On' : 'Off';
    });
/**
 * Button for displaying blocks borders. Useful for UI development
 */
const showBlocksBoundariesButton =
    document.getElementById(
        "showBlocksBoundariesButton");
showBlocksBoundariesButton
    .addEventListener('click', () => {
        document.body.classList
            .toggle(
                "show-block-boundaries"
                )
    })
/**
 * Button for enabling the 'Thin' mode
 */
const enableThinModeButton = document
    .getElementById(
        "enableThinModeButton");
enableThinModeButton.addEventListener(
    'click', () => {
        document.body.classList
            .toggle("thin-mode")
        editor.destroy();
        editor = new EditorJS(
            editorConfig);
    })
/**
 * Toggler for toggling the dark mode
 */
const darkThemeToggler = document
    .getElementById("darkThemeToggler");
darkThemeToggler.addEventListener(
    'click', () => {
        document.body.classList
            .toggle("dark-mode");
        localStorage.setItem(
            'theme', document
            .body.classList
            .contains(
                "dark-mode") ?
            'dark' : 'default');
    });