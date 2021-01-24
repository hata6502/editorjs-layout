export const moveToNext = (element: Element) => {
  const { parentElement } = element;

  if (!parentElement) {
    return;
  }

  const next = element.nextElementSibling;
  const type = next?.getAttribute("data-type");

  if (next && type) {
    if (type === "container") {
      parentElement.removeChild(element);
      next.insertBefore(
        element,
        (next.children.length > 1 && next.children[1]) || null
      );
    } else if (type === "item") {
      parentElement.removeChild(next);
      parentElement.insertBefore(next, element);
    }
  } else if (parentElement.parentElement?.dataset.type === "container") {
    parentElement.removeChild(element);
    parentElement.parentElement.insertBefore(
      element,
      parentElement.nextElementSibling
    );
  }
};

export const moveToPrev = (element: Element) => {
  const { parentElement } = element;

  if (!parentElement) {
    return;
  }

  const prev = element.previousElementSibling;
  const type = prev?.getAttribute("data-type");

  if (prev && type) {
    if (type === "container") {
      parentElement.removeChild(element);
      prev.appendChild(element);
    } else if (type === "item") {
      parentElement.removeChild(element);
      parentElement.insertBefore(element, prev);
    }
  } else if (parentElement.parentElement?.dataset.type === "container") {
    parentElement.removeChild(element);
    parentElement.parentElement.insertBefore(element, parentElement);
  }
};
