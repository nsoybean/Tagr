import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  DotsVerticalIcon,
  CopyIcon,
  Cross2Icon,
  Pencil1Icon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { DeleteIcon, PlusIcon, TagIcon, TrashIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveArticle,
  deleteArticle,
  tagArticle,
  unarchiveArticle,
  updateArticleMetaById,
} from "@/api/articles";
import toast from "react-hot-toast";
import { Article } from "@/typings/article/type";
import { useEffect, useRef, useState } from "react";
import ConfirmationDialog from "./Dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { AxiosError } from "axios";

type Props = {
  article: Article;
};

function didTagsChange(array1: string[], array2: string[]) {
  // Check if the lengths of both arrays are the same
  if (array1.length !== array2.length) {
    return true;
  }

  // Sort both arrays based on the 'name' property
  const sortedArray1 = array1.slice().sort((a, b) => a.localeCompare(b));
  const sortedArray2 = array2.slice().sort((a, b) => a.localeCompare(b));

  // Iterate through both sorted arrays and compare the 'name' property of each object
  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return true;
    }
  }

  // If all comparisons passed, the arrays are equal
  return false;
}

const ArticleOptions = ({ article }: Props) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [tagDialogOpen, setTagDialogOpen] = useState<boolean>(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [currToast, setCurrToast] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [articleMetaData, setArticleMetaData] = useState<{
    title: string;
  } | null>(null);

  // copy of original tags
  let originalTags: string[] = [];
  if (article?.tags) {
    originalTags = article?.tags.map((tag) => tag.name);
  }

  // if user open add tags dialog, load current tags into state
  useEffect(() => {
    if (article && article?.tags) {
      setTagList(article?.tags.map((tag) => tag.name));
    }
  }, [tagDialogOpen]);

  // delete article
  const { mutate: deleteArticleById } = useMutation({
    mutationFn: deleteArticle,
    onSuccess: (data) => {
      toast.dismiss(currToast);
      toast.success("Link deleted!");

      // invalidate query
      if (article.state === "AVAILABLE") {
        queryClient.invalidateQueries({ queryKey: ["get-all-articles"] });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["get-all-archived-articles"],
        });
      }
    },
    onError: (error) => {
      toast.dismiss(currToast);
      toast.error(`Error!`);
    },
    onSettled: () => {},
  });

  // archive article
  const { mutate: archiveArticleById } = useMutation({
    mutationFn: archiveArticle,
    onSuccess: (data) => {
      toast.dismiss(currToast);
      toast.success("Link archived!");

      // invalidate query
      queryClient.invalidateQueries({ queryKey: ["get-all-articles"] });
      queryClient.invalidateQueries({
        queryKey: ["get-all-archived-articles"],
      });
    },
    onError: (error) => {
      toast.dismiss(currToast);
      toast.error(`Error!`);
    },
    onSettled: () => {},
  });

  // unarchive
  const { mutate: unarchiveArticleById } = useMutation({
    mutationFn: unarchiveArticle,
    onSuccess: (data) => {
      toast.dismiss(currToast);
      toast.success("Link restored!");
    },
    onError: (error) => {
      alert(`Error`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-articles"] });
      queryClient.invalidateQueries({
        queryKey: ["get-all-archived-articles"],
      });
    },
  });

  // adding tags
  const { mutate: tagArticleById } = useMutation({
    mutationFn: tagArticle,
    onSuccess: (data) => {
      toast.dismiss(currToast);
      toast.success("Tags saved!");

      // invalidate query
      queryClient.invalidateQueries({
        queryKey: ["get-all-tags"],
      });

      if (article.state === "AVAILABLE") {
        queryClient.invalidateQueries({
          queryKey: ["get-all-articles"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["get-all-archived-articles"],
        });
      }
    },
    onError: (error) => {
      if (
        error instanceof AxiosError &&
        error.response?.data?.statusCode === 400 // bad request
      ) {
        toast.dismiss(currToast);
        toast.error(`${error.response?.data?.message}`);
        return;
      }
      toast.dismiss(currToast);
      toast.error(`Error!`);
    },
    onSettled: () => {},
  });

  // updating metadata (title)
  const { mutate: updateArticle } = useMutation({
    mutationFn: updateArticleMetaById,
    onSuccess: (data) => {
      toast.dismiss(currToast);
      toast.success("Updated!");

      // invalidate query
      if (article.state === "AVAILABLE") {
        queryClient.invalidateQueries({ queryKey: ["get-all-articles"] });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["get-all-archived-articles"],
        });
      }
    },
    onError: (error) => {
      toast.dismiss(currToast);
      toast.error(`Error!`);
    },
    onSettled: () => {},
  });

  async function copyTextToClipboard(link: string) {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied!");
    }
  }

  async function menuItemSelect() {
    const toastId = toast.loading("Deleting...");
    setCurrToast(toastId);
    deleteArticleById({ id: article._id });
  }

  async function toggleTagDialog() {
    setTagDialogOpen((prev) => !prev);
    setTagList([]);
    if (tagInputRef.current) {
      tagInputRef.current.value = "";
    }
  }

  async function toggleRenameDialog() {
    setRenameDialogOpen((prev) => !prev);
    // if (tagInputRef.current) {
    //   tagInputRef.current.value = "";
    // }
  }

  function upsertTagValue(tag: string) {
    const trimmedTag = tag.trim();

    // alert if more than limit
    if (tagList.length >= 5) {
      toast.error("Maximum 5 tags");
      return;
    }

    // reset if empty space
    if (trimmedTag === "") {
      if (tagInputRef.current) {
        tagInputRef.current.value = "";
      }
      return;
    }

    if (!tagList.some((tag) => tag === trimmedTag)) {
      // create deep copy of array and set state
      const newTagList = [...tagList];
      newTagList.push(trimmedTag);
      setTagList(newTagList);
    }

    // reset
    if (tagInputRef.current) {
      tagInputRef.current.value = "";
      tagInputRef.current.focus();
    }
  }

  function removeTagByIndex(index: number) {
    const newTagList = tagList.filter((_, i) => i !== index);
    setTagList(newTagList);
  }

  return (
    <>
      {/* setting modal to false, prevent drop down from remaining open */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-full">
            <DotsVerticalIcon width={"18"} height={"18"} />
          </Button>
          {/* <Button variant="outline" className="">
            <span>Options</span>
          </Button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()}
              onClick={() => setOpenDialog(true)}
            >
              <TrashIcon width={"18"} height={"18"} className="mr-2" />
              Delete
              {/* <DropdownMenuShortcut>⌘ ⌫</DropdownMenuShortcut> */}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copyTextToClipboard(article.link)}>
              <CopyIcon width={"18"} height={"18"} className="mr-2" /> Copy link
            </DropdownMenuItem>
            {article.state === "AVAILABLE" && (
              <DropdownMenuItem onClick={() => toggleTagDialog()}>
                <TagIcon width={"18"} height={"18"} className="mr-2" /> Tag
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => toggleRenameDialog()}
            >
              <Pencil1Icon width={"18"} height={"18"} className="mr-2" /> Rename
            </DropdownMenuItem>
            {/* temp commented out archive feature */}
            {/* <DropdownMenuItem
              onClick={() => {
                if (article.state === "AVAILABLE") {
                  const toastId = toast.loading("Archiving...");
                  setCurrToast(toastId);
                  archiveArticleById({ id: article._id });
                } else {
                  const toastId = toast.loading("Restoring...");
                  setCurrToast(toastId);
                  unarchiveArticleById({ id: article._id });
                }
              }}
            >
              <ArchiveIcon width={"18"} height={"18"} className="mr-2" />
              {article.state === "AVAILABLE" ? "Archive" : "Restore"}
            </DropdownMenuItem> */}

            {/* temp commented out till implemented */}
            {/* <DropdownMenuItem>
              <StarIcon width={"18"} height={"18"} className="mr-2" /> Favourite
            </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator />
          <DropdownMenuItem>
          <ReaderIcon width={"18"} height={"18"} className="mr-2" />
          Add notes
        </DropdownMenuItem> */}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* alert dialog */}
      <ConfirmationDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        cb={menuItemSelect}
        title="Are you sure?"
        description="This action cannot be undone. This will delete the link."
      />

      {/* add tags dialog */}
      <Dialog onOpenChange={toggleTagDialog} open={tagDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
            <DialogDescription>
              They help you to find your articles more easily
            </DialogDescription>
          </DialogHeader>

          {/* tags */}
          {/* render tag as badge */}
          {tagList && tagList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tagList.map((tag, index) => (
                <Badge key={index} className="max-w-24" variant={"secondary"}>
                  <p className="overflow-hidden truncate"> {tag}</p>
                  <Cross2Icon
                    onClick={() => {
                      removeTagByIndex(index);
                    }}
                    className="ml-2 h-4 w-4 flex-shrink-0 hover:cursor-pointer"
                  />
                </Badge>
              ))}
            </div>
          ) : (
            <></>
          )}
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label className="sr-only">Link</Label>
              <Input
                ref={tagInputRef}
                // value={() => {
                //   (function () {
                //     if (tagInputRef.current) {
                //       return tagInputRef.current.value;
                //     }
                //     return "hi";
                //   })();
                // }}
                // onChange={(e) => setNewTag(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              variant={"default"}
              className="px-3"
              onClick={() => {
                if (tagInputRef.current) {
                  upsertTagValue(tagInputRef.current.value);
                }
              }}
            >
              <span className="sr-only">Add tag</span>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant={
                  didTagsChange(originalTags, tagList) ? "default" : "secondary"
                }
                disabled={!didTagsChange(originalTags, tagList)}
                onClick={() => {
                  tagArticleById({ id: article._id, tags: tagList });
                }}
              >
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* rename dialog */}
      <Dialog onOpenChange={toggleRenameDialog} open={renameDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Link</DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label className="sr-only">Link</Label>
              <Input
                defaultValue={article.title}
                onChange={(e) =>
                  setArticleMetaData({ title: e.target.value.trim() })
                }
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant={"default"}
                disabled={
                  !articleMetaData?.title ||
                  articleMetaData?.title === article?.title
                }
                onClick={() => {
                  if (articleMetaData?.title) {
                    updateArticle({
                      id: article._id,
                      title: articleMetaData?.title,
                    });
                  }
                }}
              >
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArticleOptions;
