import Quill, { Delta, Op } from "quill";
import { Popover } from "radix-ui";
import {
  ForwardedRef,
  forwardRef,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./rte.css";
import {
  ArrowEnterLeft24Filled,
  TextBold24Filled,
  TextItalic24Filled,
  Checkmark24Filled,
  Link24Filled,
} from "@fluentui/react-icons";

type EditorType = {
  readOnly: boolean;
  defaultOps: Op[] | null;
  onTextChange?: (delta: Delta, oldDelta: Delta, source: string) => void;
};

export const RichTextEditorToolbar = ({ quill }: { quill: Quill | null }) => {
  const [linkValue, setLinkValue] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);

  const handleLinkClick = () => {
    if (!quill) {
      return;
    }
    if (quill) {
      const format = quill.getFormat();
      if (format.link) {
        quill.format("link", false);
      } else {
        setLinkOpen(true);
      }
    }
  };

  const handleLinkSubmit = () => {
    if (quill) {
      if (quill.getFormat().link) {
        quill.format("link", false);
      } else {
        quill.format("link", linkValue);
      }
    }
    setLinkValue("");
    setLinkOpen(false);
  };
  return (
    <div id="toolbar" className="gap-4 flex items-center">
      <button
        type="button"
        className="hover:opacity-80 cursor-pointer"
        aria-label="Bold"
        onClick={() => {
          if (quill) {
            quill.focus();
            const format = quill.getFormat();
            quill.format("bold", !format.bold);
          }
        }}
      >
        <TextBold24Filled />
      </button>
      <button
        type="button"
        className="hover:opacity-80 cursor-pointer"
        aria-label="Italic"
        onClick={() => {
          if (quill) {
            quill.focus();
            const format = quill.getFormat();
            quill.format("italic", !format.italic);
          }
        }}
      >
        <TextItalic24Filled />
      </button>
      <Popover.Root open={linkOpen}>
        <Popover.Anchor asChild>
          <button
            type="button"
            onClick={handleLinkClick}
            className="hover:opacity-80 cursor-pointer"
            aria-label="Insert link"
          >
            <Link24Filled />
          </button>
        </Popover.Anchor>
        <Popover.Content className="bg-bg p-2 rounded-md shadow-lg">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Enter URL"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              className="border border-text bg-bg rounded-md p-1 w-full"
            />
            <button
              type="button"
              onClick={() => setLinkOpen(false)}
              className="hover:opacity-80 cursor-pointer"
            >
              <ArrowEnterLeft24Filled />
            </button>
            <button
              type="button"
              onClick={handleLinkSubmit}
              className="hover:opacity-80 cursor-pointer"
            >
              <Checkmark24Filled />
            </button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
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
      const quill = new Quill(editorContainer, {
        modules: {
          toolbar: {
            container: "#toolbar",
          },
        },
      });
      quill.enable(!readOnly);
      setRef(ref, quill);

      if (defaultOpsRef.current) {
        const delta = new Delta(defaultOpsRef.current);
        quill.setContents(delta);
      }
      quill.getFormat;
      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      return () => {
        setRef(ref, null);
        container.innerHTML = "";
      };
    }, [ref]);

    return (
      <>
        <div
          spellCheck={false}
          className="w-full h-full"
          ref={containerRef}
        ></div>
      </>
    );
  }
);
