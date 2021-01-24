import type { OutputData } from "@editorjs/editorjs";

interface SavedLayoutBlockItemContentData {
  [index: string]: OutputData;
}

interface ValidatedLayoutBlockItemContentData
  extends SavedLayoutBlockItemContentData {}

export type {
  SavedLayoutBlockItemContentData,
  ValidatedLayoutBlockItemContentData,
};
