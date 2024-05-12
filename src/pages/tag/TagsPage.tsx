import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { getAllTags } from "@/api/tags";
import { ITag } from "@/typings/tag/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { search } from "fast-fuzzy";
import { useNavigate } from "react-router-dom";

const Tag = () => {
  const [localList, setLocalList] = useState<ITag[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    data: tags,
  } = useQuery({
    queryKey: ["get-all-tags", currPage],
    queryFn: async () => getAllTags(currPage),
  });

  function fuzzySearch(inputString: string) {
    if (tags?.data && inputString.length > 0) {
      const res = search(inputString, tags.data, {
        keySelector: (obj) => obj.name,
      });
      setLocalList(res);
      return;
    }

    // reset if input is empty
    setLocalList([]);
    return;
  }
  return (
    <div className="mx-auto w-full">
      {/* article grid */}
      <div className="mb-12 gap-4 px-8">
        {/* loading */}

        {/* {isLoading && <ArticleSkeleton numCards={6} />} */}
        <div className="mb-4 text-2xl font-semibold lg:mb-6">
          All tags
          {tags && tags?.total_records > 0 && (
            <span> {`(${tags.total_records})`} </span>
          )}
          {/* <Separator className="mt-2" /> */}
          {/* <Separator className="mt-2" /> */}
        </div>

        <Input
          className="mb-4 p-6 lg:mb-6"
          ref={inputRef}
          placeholder="Search for your tags"
          autoFocus={true}
          onChange={(e) => {
            e.preventDefault();
            fuzzySearch(e.target.value);
          }}
        />

        {/* show tags */}
        {isLoading && (
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((val, index) => (
              <Skeleton
                key={index}
                className="mx-1 h-8 w-[96px] gap-2 rounded-md px-4 py-2 font-semibold"
              />
            ))}
          </div>
        )}

        {/* initial */}
        {tags?.data && tags?.data?.length > 0 && localList.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.data.map((tag: ITag) => (
              <Badge
                className="mx-1 h-8 max-w-24 px-4 py-2 font-semibold hover:cursor-pointer"
                variant={"default"}
                key={tag.id}
                onClick={() => navigate(`/tags/saves?tag=${tag.name}`)}
              >
                <p className="overflow-hidden truncate font-semibold">
                  {tag.name}
                </p>
              </Badge>
            ))}
          </div>
        )}

        {/* fuzzy search */}
        {localList.length >= 0 && (
          <div className="flex flex-wrap gap-2">
            {localList.map((tag: ITag) => (
              <Badge
                className="mx-1 h-8 max-w-24 px-4 py-2 font-semibold hover:cursor-pointer"
                variant={"default"}
                key={tag.id}
                onClick={() => navigate(`/tags/saves?tag=${tag.name}`)}
              >
                <p className="overflow-hidden truncate font-semibold">
                  {tag.name}
                </p>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* pagination */}
      {/* <div className="bottom-0 mb-10">
        <ArticlePagination
          currentPage={currPage}
          setPage={setCurrPage}
          recordsPerPage={9}
          totalRecords={articles?.total_records || 0}
        />
      </div> */}
    </div>
  );
};

export default Tag;
