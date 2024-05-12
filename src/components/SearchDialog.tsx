import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ISearchArticle } from "@/typings/search/articles";
import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";
import { Skeleton } from "./ui/skeleton";
import { ArticleStateEnum } from "@/typings/article/types";
import { search } from "@/api/articles";
import useAuth from "@/hooks/useAuth";
import { getFallbackName } from "@/lib/auth";
import dayjs from "dayjs";

type Props = {};

const SearchDialog = (props: Props) => {
  const [searchDialogOpen, setSearchDialogOpen] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [searchArticleResult, setsearchArticleResult] = useState<
    ISearchArticle[]
  >([]);

  const { data: user } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchDialogOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // reset search results everytime search dialog open/close
  useEffect(() => {
    setsearchArticleResult([]);
  }, [searchDialogOpen]);

  const handleOnSearchChange = useDebouncedCallback(async (e: string) => {
    if (e === "" || !e) {
      return;
    }

    // reset results
    setsearchArticleResult([]);

    // call search api
    setIsSearchLoading(true);
    const results = await search({ term: e });
    setIsSearchLoading(false);

    // set results
    if (results && results.length > 0) {
      setsearchArticleResult(results);
    } else {
      setsearchArticleResult([]);
    }
  }, 300);

  function renderSearchArticleResult(articleResults: ISearchArticle[]) {
    // filter array into available and archive states
    let availableArticles = articleResults.filter(
      (article) => article.state === ArticleStateEnum.AVAILABLE,
    );
    let archiveArticles = articleResults.filter(
      (article) => article.state === ArticleStateEnum.ARCHIVED,
    );
    return (
      <div className="p-1">
        {/* available articles */}
        {availableArticles && availableArticles.length > 0 && (
          <CommandGroup>
            {availableArticles.map((article) => {
              return (
                <CommandItem
                  key={article.id}
                  onSelect={() => {
                    setSearchDialogOpen((open) => !open);
                    window.open(article.link, "_blank", "noopener,noreferrer");
                  }}
                >
                  <div className="flex w-full flex-row items-start justify-between">
                    <div className="space-1 flex w-3/4 flex-col">
                      <div className="line-clamp-1">{article.title}</div>
                      <div className="line-clamp-1 text-muted-foreground">
                        {article.description}
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      {dayjs(article.createdAt).format("D MMM YYYY")}
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* archived articles */}
        {archiveArticles && archiveArticles.length > 0 && (
          <CommandGroup heading="Archived">
            <CommandSeparator />
            {archiveArticles.map((article) => {
              return (
                <CommandItem
                  key={article.id}
                  onSelect={() => {
                    setSearchDialogOpen((open) => !open);
                    window.open(article.link, "_blank", "noopener,noreferrer");
                  }}
                >
                  <div className="flex w-full flex-row items-start justify-between">
                    <div className="space-1 flex w-3/4 flex-col">
                      <div className="line-clamp-1">{article.title}</div>
                      <div className="line-clamp-1 text-muted-foreground">
                        {article.description}
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      {dayjs(article.createdAt).format("D MMM YYYY")}
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </div>
    );
  }

  return (
    <>
      <Button variant={"outline"} onClick={() => setSearchDialogOpen(true)}>
        <div className="flex flex-row items-center justify-center gap-4">
          <span>Search</span>
          <MagnifyingGlassIcon className="ml-1 h-5 w-5 shrink-0 opacity-50" />
          {/* keyboard shortcut - only non-mobile */}
          <div className="hidden sm:flex">
            <kbd className="text-md flex flex-row items-center justify-center rounded-md border px-1 text-start">
              <span>⌘</span>
            </kbd>
            <kbd className="text-md flex flex-row items-center justify-center rounded-md border px-1 text-start">
              <span>K</span>
            </kbd>
          </div>
        </div>
      </Button>

      {/* search dialog */}
      <CommandDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <div className="flex h-fit flex-row items-center border-b px-3 pt-1">
          <MagnifyingGlassIcon className="mr-2 h-5 w-5 shrink-0 opacity-50" />
          <Input
            placeholder={
              user
                ? `Search ${`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}'s Yetti`
                : "Search Yetti"
            }
            className="text-md flex h-fit w-full border-0 bg-transparent py-2 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            onChange={(e) => handleOnSearchChange(e.target.value)}
          />
        </div>
        <CommandList>
          {/* if empty */}
          {!isSearchLoading && <CommandEmpty>No results found.</CommandEmpty>}

          {/* loading */}
          {isSearchLoading && (
            <div className="flex flex-col space-y-4 p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[250px] rounded-md" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[250px] rounded-md" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          )}

          {/* results */}
          {searchArticleResult &&
            searchArticleResult.length > 0 &&
            renderSearchArticleResult(searchArticleResult)}
        </CommandList>
        <CommandShortcut />
      </CommandDialog>
    </>
  );
};

export default SearchDialog;
