import { formatDate } from "../utils/date_stuff";
import { Input } from "./inputs";

type MemoryTitleProps = {
  isEditing: boolean;
  updatedMemoryTitle: string;
  setUpdatedMemoryTitle: (title: string) => void;
  originalMemoryTitle: string;
  updatedAt: string;
};

export const MemoryTitle = ({
  isEditing,
  updatedMemoryTitle,
  setUpdatedMemoryTitle,
  originalMemoryTitle,
  updatedAt,
}: MemoryTitleProps) => {
  return (
    <div className="border-b border-dark-grey py-2 px-6">
      <div>
        {!isEditing ? (
          <h3 className="text-2xl font-bold">{updatedMemoryTitle}</h3>
        ) : (
          <Input
            defaultValue={originalMemoryTitle}
            onChange={(e) => {
              setUpdatedMemoryTitle(e.target.value);
            }}
          />
        )}
      </div>
      <h6>last updated: {formatDate(updatedAt, true)}</h6>
    </div>
  );
};
