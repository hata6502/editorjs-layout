import type { OutputData } from "@editorjs/editorjs";

interface LayoutBlockItemContentData {
  [index: string]: OutputData;
}

interface ValidatedLayoutBlockItemContentData
  extends LayoutBlockItemContentData {}

export type { LayoutBlockItemContentData, ValidatedLayoutBlockItemContentData };
