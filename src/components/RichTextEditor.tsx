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
import "../styles/rte.css";
import {
  ArrowEnterLeftFilled,
  TextBold16Filled,
  TextItalic16Filled,
  Checkmark16Filled,
  Link16Filled,
} from "@fluentui/react-icons";
import clsx from "clsx";

type EditorType = {
  readOnly: boolean;
  defaultOps: Op[] | null;
  setQuillInstance?: (quill: Quill) => void;
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
    <div
      id="toolbar"
      className="gap-2 flex items-center border-b border-dark-grey"
    >
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
        <TextBold16Filled />
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
        <TextItalic16Filled />
      </button>
      <Popover.Root open={linkOpen}>
        <Popover.Anchor asChild>
          <button
            type="button"
            onClick={handleLinkClick}
            className="hover:opacity-80 cursor-pointer"
            aria-label="Insert link"
          >
            <Link16Filled />
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
              <ArrowEnterLeftFilled />
            </button>
            <button
              type="button"
              onClick={handleLinkSubmit}
              className="hover:opacity-80 cursor-pointer"
            >
              <Checkmark16Filled />
            </button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export const RichTextEditor = forwardRef(
  (
    { readOnly, defaultOps, onTextChange, setQuillInstance }: EditorType,
    ref: ForwardedRef<Quill | null>
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onTextChangeRef = useRef(onTextChange);
    const [localQuillInstance, setLocalQuillInstance] = useState<Quill | null>(
      null
    );

    useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        const delta = new Delta(defaultOps || []);
        ref.current.setContents(delta);
      }
    }, [defaultOps]);

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
      const delta = new Delta(defaultOps || []);
      quill.setContents(delta);
      quill.getFormat;
      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });
      if (!readOnly) {
        quill.focus();
        quill.setSelection(quill.getLength() - 1, 0);
      }
      if (setQuillInstance) setQuillInstance(quill);
      setLocalQuillInstance(quill);

      return () => {
        setRef(ref, null);
        container.innerHTML = "";
      };
    }, [ref]);

    return (
      <div
        className={clsx(
          "w-full h-full focus-within:border-light-grey",
          !readOnly && "border border-dark-grey rounded-sm"
        )}
      >
        {!readOnly && <RichTextEditorToolbar quill={localQuillInstance} />}
        <div spellCheck={false} ref={containerRef}></div>
      </div>
    );
  }
);
