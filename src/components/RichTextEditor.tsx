import Quill, { Delta, Op } from "quill";
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import "./rte.css";

type EditorType = {
  readOnly: boolean;
  defaultOps: Op[] | null;
  onTextChange?: (delta: Delta, oldDelta: Delta, source: string) => void;
};

export const RichTextEditor = forwardRef(
  ({ readOnly, defaultOps, onTextChange }: EditorType, ref) => {
    const containerRef = useRef(null);
    const defaultOpsRef = useRef(defaultOps);
    const onTextChangeRef = useRef(onTextChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        placeholder: "Type something...",
      });

      ref.current = quill;

      if (defaultOpsRef.current) {
        const delta = new Delta(defaultOpsRef.current);
        quill.setContents(delta);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref]);

    return <div className="w-full h-full" ref={containerRef}></div>;
  }
);
