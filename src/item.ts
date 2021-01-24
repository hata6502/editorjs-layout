interface SavedLayoutBlockItemData {
  type: "item";
  id: Element["id"];
  className: Element["className"];
  style: string;
  itemContentId: string;
}

interface ValidatedLayoutBlockItemData extends SavedLayoutBlockItemData {}

export type { SavedLayoutBlockItemData, ValidatedLayoutBlockItemData };
