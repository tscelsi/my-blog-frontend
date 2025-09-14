import { useMemo, useState } from "react";
import { Drawer } from "vaul";
import clsx from "clsx";
import { Button } from "../Button";
import { Memory } from "../../types";
import { useQuery } from "@tanstack/react-query";
import {
  getSharingInfoQueryOptions,
  useAddEditor,
  useAddReader,
  useMakeMemoryPublic,
  useRemoveEditor,
  useRemoveReader,
} from "../../queries/sharing_service";

export const ShareMemoryDrawer = ({
  memory,
  trigger,
}: {
  memory: Memory;
  trigger?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const { data: sharing, isLoading: sharingLoading } = useQuery(
    getSharingInfoQueryOptions(memory.id)
  );
  const addEditor = useAddEditor(memory.id);
  const removeEditor = useRemoveEditor(memory.id);
  const addReader = useAddReader(memory.id);
  const removeReader = useRemoveReader(memory.id);

  const currentIsPublic = useMemo(
    () => !((sharing && sharing.private) ?? memory.private),
    [sharing, memory.private]
  );
  const makePublicMutation = useMakeMemoryPublic(memory.id, !currentIsPublic);

  const [editorEmail, setEditorEmail] = useState("");
  const [readerEmail, setReaderEmail] = useState("");

  const handleTogglePublic = () => {
    makePublicMutation
      .mutateAsync()
      .catch((error) => console.error("Error setting public/private:", error));
  };

  const handleAddEditor = async () => {
    if (!editorEmail.trim()) return;
    try {
      await addEditor.mutateAsync({ email: editorEmail.trim() });
      setEditorEmail("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReader = async () => {
    if (!readerEmail.trim()) return;
    try {
      await addReader.mutateAsync({ email: readerEmail.trim() });
      setReaderEmail("");
    } catch (e) {
      console.error(e);
    }
  };

  const pending =
    addEditor.isPending ||
    addReader.isPending ||
    removeEditor.isPending ||
    removeReader.isPending ||
    makePublicMutation.isPending;

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        {trigger ? trigger : <Button className="text-start">[sharing]</Button>}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-dark-grey/10" />
        <Drawer.Content
          className={clsx(
            "bg-bg h-fit fixed bottom-0 left-0 right-0 outline-none border-t border-dark-grey",
            pending && "pointer-events-none text-dark-grey"
          )}
        >
          <div className="flex flex-col">
            <div className="p-4 border-b border-dark-grey">
              <div className="mb-2 flex items-center justify-between">
                <p className="opacity-70">Privacy</p>
                <Button onClick={handleTogglePublic}>
                  {currentIsPublic ? "[make private]" : "[make public]"}
                </Button>
              </div>
              <p className="text-sm opacity-60">
                {sharingLoading
                  ? "Loading..."
                  : currentIsPublic
                    ? "This memory is public"
                    : "This memory is private"}
              </p>
            </div>
            <div className="p-4 border-b border-dark-grey">
              <p className="mb-2 opacity-70">Editors</p>
              <div className="flex gap-2 mb-3">
                <input
                  value={editorEmail}
                  onChange={(e) => setEditorEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="flex-1 bg-transparent border border-dark-grey px-2 py-1 outline-none"
                  type="email"
                />
                <Button
                  onClick={handleAddEditor}
                  disabled={addEditor.isPending}
                >
                  [add]
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(sharing?.editors ?? []).map(({ id, email }) => (
                  <div
                    key={id}
                    className="flex items-center gap-2 border border-dark-grey px-2 py-1"
                  >
                    <span className="text-sm">{email}</span>
                    <button
                      className="text-xs opacity-60 hover:opacity-100"
                      onClick={() => removeEditor.mutate({ user_id: id })}
                    >
                      [remove]
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="mb-2 opacity-70">Readers</p>
              <div className="flex gap-2 mb-3">
                <input
                  value={readerEmail}
                  onChange={(e) => setReaderEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="flex-1 bg-transparent border border-dark-grey px-2 py-1 outline-none"
                  type="email"
                />
                <Button
                  onClick={handleAddReader}
                  disabled={addReader.isPending}
                >
                  [add]
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(sharing?.readers ?? []).map(({ id, email }) => (
                  <div
                    key={id}
                    className="flex items-center gap-2 border border-dark-grey px-2 py-1"
                  >
                    <span className="text-sm">{email}</span>
                    <button
                      className="text-xs opacity-60 hover:opacity-100"
                      onClick={() => removeReader.mutate({ user_id: id })}
                    >
                      [remove]
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
