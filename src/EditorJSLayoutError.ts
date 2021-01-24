class EditorJSLayoutError extends Error {
  constructor(...args: any[]) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EditorJSLayoutError);
    }

    this.name = "EditorJSLayoutError";
  }
}

export { EditorJSLayoutError };
