import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { addArticle } from "@/api/articles";
import toast from "react-hot-toast";
import { ForwardIcon } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import { AxiosError } from "axios";
import { useFolder } from "@/hooks/FolderProvider";

type Props = {
  trigger?: any; // dialog trigger
  onEventListener: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SaveArticleInput = (props: Props) => {
  const [url, setUrl] = useState("");
  // const [isOpen, setIsOpen] = useState(false);
  const [currToast, setCurrToast] = useState("");
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const { folder: currFolderId } = useFolder();

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  const { mutate, status } = useMutation({
    mutationFn: addArticle,
    onSuccess: (data) => {
      setUrl("");
      props.setIsOpen(false);
      if (inputRef?.current) {
        inputRef.current.blur();
      }
      toast.dismiss(currToast);
      toast.success("Link Added!");
    },

    onError: (error) => {
      let axiosError = error as AxiosError;
      toast.dismiss(currToast);
      if (axiosError.response?.status === 422) {
        toast.error(`Invalid link`);
      } else {
        toast.error(`Error!`);
      }
      setUrl("");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-articles"] });
    },
  });

  const onKeyPress = async (event: KeyboardEvent) => {
    // open dialog
    if (props.onEventListener) {
      if ((event.metaKey || event.ctrlKey) && event.key === "l") {
        event.preventDefault();
        props.setIsOpen(true);
      }
    }

    // Check if the 'esp key' key is pressed
    if (event.key === "Escape") {
      // remove focus and clear input
      if (inputRef.current) {
        setUrl("");
        inputRef.current.blur();
      }
    }

    // Check if the 'enter key' key is pressed and the focus is on the input
    if (event.key === "Enter" && document.activeElement === inputRef.current) {
      if (inputRef.current) {
        saveArticle(inputRef.current.value);
      }
    }
  };

  async function saveArticle(inputUrl: string) {
    if (!currFolderId) {
      toast.error("Current folder unknown");
      return;
    }

    if (inputUrl.trim() !== "") {
      const toastId = toast.loading("Saving...");
      setCurrToast(toastId);

      mutate({ link: inputUrl.trim(), parentFolderId: currFolderId });
    }
  }

  return (
    <Dialog onOpenChange={props.setIsOpen} open={props.isOpen}>
      {props.trigger && <DialogTrigger asChild>{props.trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New link</DialogTitle>
          <DialogDescription>Enter the link you wish to save</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              placeholder="https://example.com"
              ref={inputRef}
              value={url}
              id="link"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => {
              if (inputRef.current) {
                saveArticle(inputRef.current.value);
              }
            }}
          >
            <span className="sr-only">Save</span>
            <ForwardIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
