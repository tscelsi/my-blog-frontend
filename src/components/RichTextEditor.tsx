import Quill, { Delta, Op } from "quill";
import {
  ForwardedRef,
  forwardRef,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import "./rte.css";

type EditorType = {
  readOnly: boolean;
  defaultOps: Op[] | null;
  onTextChange?: (delta: Delta, oldDelta: Delta, source: string) => void;
};

export const RichTextEditor = forwardRef(
  (
    { readOnly, defaultOps, onTextChange }: EditorType,
    ref: ForwardedRef<Quill | null>
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultOpsRef = useRef(defaultOps);
    const onTextChangeRef = useRef(onTextChange);

    function setRef<T>(ref: ForwardedRef<T>, value: T) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && "current" in ref) {
        (ref as RefObject<T>).current = value;
      }
    }

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
    });

    useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current?.enable(!readOnly);
      }
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {});
      quill.enable(!readOnly);
      setRef(ref, quill);

      if (defaultOpsRef.current) {
        const delta = new Delta(defaultOpsRef.current);
        quill.setContents(delta);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      return () => {
        setRef(ref, null);
        container.innerHTML = "";
      };
    }, [ref]);

    return (
      <div
        spellCheck={false}
        className="w-full h-full"
        ref={containerRef}
      ></div>
    );
  }
);
