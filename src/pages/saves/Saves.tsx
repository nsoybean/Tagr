import { useEffect, useState } from "react";
import { parseAuthFromRedirectUrl } from "@/lib/auth";
import { setAuthToken } from "@/configs/auth";
import { useQuery } from "@tanstack/react-query";
import { getAllArticles } from "@/api/articles";
import { Button } from "@/components/ui/button";
import ArticlePagination from "@/components/ArticlePagination";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import {
  DotsHorizontalIcon,
  DotsVerticalIcon,
  Pencil1Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { SaveArticleInput } from "@/components/SaveArticleInput";
import yetti from "/cuteCreativeYeti.jpeg";
import Articles from "@/components/Articles";
import toast from "react-hot-toast";
import { useViewArticleMode } from "@/hooks/useArticleViewMode";
import ArticlesList from "@/components/ArticlesList";
import ArticleSkeletonList from "@/components/ArticleSkeletonList";
import useLogout from "@/hooks/useLogout";
import { storage } from "@/lib/storage";
import Folders from "@/components/Folders";
import { Separator } from "@/components/ui/separator";
import { Folder, IParentFolderHierarchy } from "@/typings/folder/type";
import AddNew from "@/components/AddNew";
import { ROOT_FOLDER__VALUE, useFolder } from "@/hooks/FolderProvider";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleStateEnum } from "@/typings/article/type";
import {
  ChevronRight,
  CircleEllipsisIcon,
  FolderIcon,
  LucideArrowRight,
  ShieldEllipsis,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FolderHierarchyBreadCrumb from "@/components/FolderHierarchyBreadCrumb";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

// import { DataTable } from "@/components/articleTable/data-table";
// import { ArticleColumns } from "@/components/articleTable/columns";

type Props = {
  state?: ArticleStateEnum;
};

const Saves = ({ state: articleState = ArticleStateEnum.AVAILABLE }: Props) => {
  const [currPage, setCurrPage] = useState(1);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [isFolderEllipseOpen, setIsFolderEllipseOpen] = useState(false);
  const { mode } = useViewArticleMode();
  const { logout } = useLogout();
  const { folderId } = useParams();
  const { setFolder } = useFolder();
  const [dropParentFolder, setDropParentFolder] = useState<string | null>(null);
  const navigate = useNavigate();

  // update folder id context
  let currFolderId = folderId || ROOT_FOLDER__VALUE;
  useEffect(() => {
    if (folderId) {
      setFolder(folderId);
    } else {
      setFolder(ROOT_FOLDER__VALUE);
    }
  }, [folderId]);

  useEffect(() => {
    // temp: remove old storage items
    localStorage.removeItem("leaf:color-theme");
    localStorage.removeItem("leaf-ui-theme");
    localStorage.removeItem("leaf-ui-theme");
    localStorage.removeItem("leaf:authToken");

    // parse token and save in storage after SSO redirect
    const url = window.location.href;
    if (url.includes("access_token")) {
      const userAuth = parseAuthFromRedirectUrl(url);

      if (userAuth.accessToken) {
        setAuthToken(userAuth.accessToken);
        // set login during first login
        storage.set("login001", "true");
        // clear local window url
        window.history.replaceState("", "", "/saves");
      } else {
        toast.error("Failed authentication");
      }
    }

    // force users with old session to log out
    // wont affect users with new login as key is set above after login
    const login_001 = storage.get("login001");
    if (!login_001) {
      storage.set("login001", "true");
      logout();
    }
  }, []);

  useEffect(() => {
    if (dropParentFolder) {
      console.log("🚀 dropParentFolder:", dropParentFolder);
    }
  }, [dropParentFolder]);

  // scroll to top of page every page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currPage]);

  const {
    isLoading,
    error,
    data: articles,
  } = useQuery({
    queryKey: ["get-all-articles", currPage, folderId],
    queryFn: async () =>
      getAllArticles({
        folderId: currFolderId,
        page: currPage,
        limit: 9,
      }),
  });

  // filter away current folder from list, if any
  let filteredFolders: Folder[] = [];
  if (articles) {
    filteredFolders = articles.folders.data.filter(
      (folder) => folder._id !== currFolderId,
    );
  }

  const handleScroll = () => {
    const buffer = 25; // Adjust this value as needed. To account for desktop bookmark bar etc which is not included in window innerheight.
    if (
      window.innerHeight + document.documentElement.scrollTop + buffer <=
        document.documentElement.offsetHeight ||
      isLoading
    ) {
      return;
    }
    // fetchData();
    // TODO @sb: implement infinite scroll
    // console.log("fetching data...");
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  function renderEmptyArticlesState() {
    return (
      <div className="container mx-auto flex justify-center py-16">
        <div className="flex flex-col items-center justify-center gap-10">
          <img className="w-[180px] rounded-full md:w-[220px]" src={yetti} />

          {/* text */}
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-md scroll-m-20">Start by adding a link!</h1>

            <SaveArticleInput
              trigger={
                <Button>
                  <span>Add Link</span>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              }
              setIsOpen={setIsAddLinkDialogOpen}
              isOpen={isAddLinkDialogOpen}
              onEventListener={false}
            />
          </div>
        </div>
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;

    if (!over) {
      return null;
    }

    // move link into folder
    // TODO @sb: enable move folder too

    const linkId = event.active.id;
    // const targetFolderId =
    setDropParentFolder(event.over ? (event.over.id as string) : null);
  }

  return (
    // main
    <DndContext onDragEnd={handleDragEnd}>
      <main className="mx-auto w-full">
        <div className="flex flex-col gap-3">
          {/* header */}
          <div className="mt-2 flex flex-row items-center justify-between">
            {articles?.parentFolderHierarchy ? (
              <FolderHierarchyBreadCrumb
                parentFolderHierarchy={articles?.parentFolderHierarchy}
              />
            ) : (
              // base, no hierarchy
              <div className="ml-2 text-xl font-semibold"> Saves </div>
            )}
            <AddNew
              trigger={
                <Button variant="outline">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New
                </Button>
              }
            />
          </div>

          {/* divider */}
          <Separator />

          {/* content (gallery mode) */}
          {mode === "gallery" && (
            <div className="">
              {/* is loading */}
              {isLoading && (
                <div className="mb-12 flex flex-col gap-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ArticleSkeleton numCards={6} />
                  </div>
                </div>
              )}

              {/* folder */}
              {filteredFolders.length > 0 && (
                <div className="mb-8 mt-1">
                  <h2 className="mb-1 ml-2"> Folders </h2>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                    <Folders folders={filteredFolders} />
                  </div>
                </div>
              )}

              {/* articles */}
              {articles?.bookmarks?.data &&
                articles.bookmarks.data.length > 0 && (
                  <div className="">
                    <h2 className="mb-1 ml-2"> Links </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Articles articles={articles.bookmarks.data} />
                    </div>
                  </div>
                )}

              {/* articles (empty state) */}
              {articles?.bookmarks?.data &&
                articles.bookmarks.total_records === 0 &&
                renderEmptyArticlesState()}
            </div>
          )}

          {/* content (list mode) */}
          {mode === "list" && (
            <div className="">
              {/* is loading */}
              {isLoading && <ArticleSkeletonList numCards={5} />}

              {/* folder */}
              {filteredFolders.length > 0 && (
                <div className="mb-8 mt-1">
                  <h2 className="ml-2"> Folders </h2>
                  <Folders folders={filteredFolders} />
                </div>
              )}

              {/* articles */}
              {articles?.bookmarks?.data &&
                articles.bookmarks.data.length > 0 && (
                  <div className="">
                    <h2 className="ml-2">Links </h2>
                    <ArticlesList articles={articles.bookmarks.data} />
                  </div>
                )}

              {/* articles (empty state) */}
              {articles?.bookmarks?.data &&
                articles.bookmarks.total_records === 0 &&
                renderEmptyArticlesState()}
            </div>
          )}
        </div>

        {/* pagination */}
        <div className="bottom-0 mb-10 mt-12">
          <ArticlePagination
            currentPage={currPage}
            setPage={setCurrPage}
            recordsPerPage={9}
            totalRecords={articles?.bookmarks.total_records || 0}
          />
        </div>

        {/* {isFolderEllipseOpen && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-[35px] w-[35px] rounded-full hover:bg-slate-200"
            >
              <DotsVerticalIcon width={"16"} height={"16"} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={(e) => e.preventDefault()}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <TrashIcon width={"18"} height={"18"} className="mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => toggleRenameDialog()}
              >
                <Pencil1Icon width={"18"} height={"18"} className="mr-2" />{" "}
                Rename
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )} */}
      </main>
    </DndContext>
  );
};

export default Saves;
