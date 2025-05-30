import { createFileRoute } from "@tanstack/react-router";
import { RichTextEditor } from "../components/RichTextEditor";

export const Route = createFileRoute("/editor")({
  component: Editor,
});

export default function Editor() {
  return (
    <div id="container">
      <RichTextEditor readOnly={false} defaultOps={null} />
    </div>
  );
}
