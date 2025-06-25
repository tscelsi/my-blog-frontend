export const focusRichTextFragment = (fragmentId: string) => {
  console.log(`Focusing on fragment with id: ${fragmentId}`);
  const fragment = document.querySelector(`[data-fragment-id="${fragmentId}"]`);
  if (fragment) {
    console.log(`Found fragment with id: ${fragmentId}`, fragment);
    const editor = fragment.querySelector(".ql-editor");
    if (editor) {
      editor.scrollIntoView({ behavior: "smooth" });
      // place cursor by focusing the editor
      (editor as HTMLElement).focus();
    } else {
      console.warn(`Editor not found in fragment with id: ${fragmentId}`);
    }
  } else {
    console.warn(`Fragment with id ${fragmentId} not found.`);
  }
};
