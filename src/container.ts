import type { LayoutBlockItemData, ValidatedLayoutBlockItemData } from "./item";

interface LayoutBlockContainerData {
  type: "container";
  id: Element["id"];
  className: Element["className"];
  style: string;
  children: (LayoutBlockContainerData | LayoutBlockItemData)[];
}

interface ValidatedLayoutBlockContainerData extends LayoutBlockContainerData {
  children: (
    | ValidatedLayoutBlockContainerData
    | ValidatedLayoutBlockItemData
  )[];
}

export type { LayoutBlockContainerData, ValidatedLayoutBlockContainerData };
