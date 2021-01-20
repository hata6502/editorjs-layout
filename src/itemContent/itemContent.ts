import { GridConfig } from '../Grid';

interface Data {
  html: string;
}

export const createItemContent: GridConfig<Data>['createItemContent'] = options => {
  const content = document.createElement('div');

  content.contentEditable = 'true';

  const html = options?.data?.html;

  content.textContent = (html !== undefined && html) || 'Item';

  return content;
};

export const saveItemContent: GridConfig<Data>['saveItemContent'] = content => ({
  html: content.innerHTML
});
