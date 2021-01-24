interface LayoutBlockItemData {
  type: "item";
  id: Element["id"];
  className: Element["className"];
  style: string;
  itemContentId: string;
}

interface ValidatedLayoutBlockItemData extends LayoutBlockItemData {}

export type { LayoutBlockItemData, ValidatedLayoutBlockItemData };
