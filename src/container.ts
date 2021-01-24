import type {
  SavedLayoutBlockItemData,
  ValidatedLayoutBlockItemData,
} from "./item";

interface SavedLayoutBlockContainerData {
  type: "container";
  id: Element["id"];
  className: Element["className"];
  style: string;
  children: (SavedLayoutBlockContainerData | SavedLayoutBlockItemData)[];
}

interface ValidatedLayoutBlockContainerData
  extends SavedLayoutBlockContainerData {
  children: (
    | ValidatedLayoutBlockContainerData
    | ValidatedLayoutBlockItemData
  )[];
}

export type {
  SavedLayoutBlockContainerData,
  ValidatedLayoutBlockContainerData,
};
