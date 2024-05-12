import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllArchivedArticles } from "@/api/articles";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import ArticlePagination from "@/components/ArticlePagination";
import blankSlateContent from "/blankSlateContent.svg";
import Articles from "@/components/Articles";
import { useViewArticleMode } from "@/hooks/useArticleViewMode";
import ArticlesList from "@/components/ArticlesList";
import ArticleSkeletonList from "@/components/ArticleSkeletonList";

const Archives = () => {
  const [currPage, setCurrPage] = useState(1);
  const { mode } = useViewArticleMode();

  // scroll to top of page every page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currPage]);

  const {
    isLoading,
    error,
    data: articles,
  } = useQuery({
    queryKey: ["get-all-archived-articles", currPage],
    queryFn: async () => getAllArchivedArticles(currPage),
  });

  // empty
  if (!isLoading && articles?.total_records === 0) {
    return (
      <div className="container mx-auto flex justify-center px-8 py-16">
        <div className="flex flex-col items-center justify-center gap-10">
          <img className="w-[220px] md:w-[320px]" src={blankSlateContent} />

          {/* text */}
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-md scroll-m-20">No archived articles</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      {/* article grid (gallery mode) */}
      {mode === "gallery" && (
        <div className="mb-12 grid grid-cols-1 gap-4 px-8 md:grid-cols-2 lg:grid-cols-3">
          {/* loading */}
          {isLoading && <ArticleSkeleton numCards={6} />}

          {/* show articles */}
          {articles && <Articles articles={articles.data} />}
        </div>
      )}

      {/* article list (list mode) */}
      {mode === "list" && (
        <div className="mb-12 gap-4 px-8">
          {/* loading */}
          {isLoading && <ArticleSkeletonList numCards={5} />}

          {/* show articles */}
          {articles && <ArticlesList articles={articles.data} />}
        </div>
      )}

      {/* pagination */}
      <div className="bottom-0 mb-10">
        <ArticlePagination
          currentPage={currPage}
          setPage={setCurrPage}
          recordsPerPage={9}
          totalRecords={articles?.total_records || 0}
        />
      </div>
    </div>
  );
};

export default Archives;
