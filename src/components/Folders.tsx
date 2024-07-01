import { FolderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./theme-provider";
import { routes } from "@/router";
import { Folder } from "@/typings/folder/type";
import FolderOptions from "./FolderOptions";
import { useViewArticleMode } from "@/hooks/useArticleViewMode";
import { useDroppable } from "@dnd-kit/core";
import { Children, cloneElement, useEffect } from "react";
import React from "react";

function DroppableWrapper({
  id,
  children,
}: {
  id: any;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  // Clone each child and add the dynamic classname
  const childrenWithClassName = Children.map(children, (child) => {
    // Ensure the child is a valid element before cloning
    if (React.isValidElement(child)) {
      return cloneElement(child as React.ReactElement, {
        className:
          `${child.props.className || ""} ${isOver ? "bg-muted" : ""}`.trim(),
      });
    }
    return child;
  });

  return <div ref={setNodeRef}>{childrenWithClassName}</div>;
}

type Props = {
  folders: Folder[];
};

const Folders = (props: Props) => {
  const navigate = useNavigate();
  const { mode } = useViewArticleMode();

  return props.folders.map((folder, index) => (
    // folder card
    <DroppableWrapper
      key={index}
      id={`droppable-${folder._id}`}
      children={
        <div
          className={`h-15 ${mode === "list" && "my-2"} flex flex-row items-center rounded-md border border-input bg-background px-4 py-2 shadow-sm hover:bg-accent hover:text-accent-foreground`}
          onClick={() => {
            navigate(`/saves/folder/${folder._id}`);
          }}
        >
          {/* icon and name */}
          <div className="flex flex-grow flex-row items-center overflow-hidden">
            <FolderIcon className="mr-3 h-5 w-5 shrink-0" />
            <div className="truncate"> {folder.name} </div>
          </div>

          {/* options */}
          <div
            className="ml-2 flex items-center"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the folder click event
            }}
          >
            <FolderOptions folder={folder} />
          </div>
        </div>
      }
    />
  ));
};

export default Folders;
