import { Article as IArticle } from "@/typings/article/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ArticleOptions from "./ArticleOptions";
import ToolTipText from "./TooltipText";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";

type Props = {
  articles: IArticle[];
};

const ArticlesList = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      {props.articles.map((article, index) => (
        <Card key={index} className="flex flex-col shadow-md">
          <CardHeader className="flex flex-col justify-around pb-0 pt-3">
            {/* title */}
            <CardTitle className="line-clamp-1">{article.title}</CardTitle>
            {/* domain */}
            <CardDescription className="line-clamp-1 font-bold">
              {article.domain}
            </CardDescription>
          </CardHeader>

          {/* content */}
          <CardContent className="flex w-full flex-row flex-wrap items-end justify-between pb-2 pt-0">
            <div className="flex flex-col gap-2">
              {/* badge */}
              {/* <div>
                  {article?.tagIds?.length > 0 &&
                    article.tagIds.map((tag, index) => (
                      <Badge
                        className="max-w-24 hover:cursor-pointer"
                        variant={"secondary"}
                        key={index}
                        onClick={() => {
                          if (
                            // ignore if already in query by tag page
                            routes.TagSavesPageRoute.to ===
                            window.location.pathname
                          ) {
                            return;
                          }

                          navigate(`/tags/saves?tag=${tag.name}`);
                        }}
                      >
                        <p className="overflow-hidden truncate font-semibold">
                          {tag.name}
                        </p>
                      </Badge>
                    ))}
                </div> */}

              {/* date */}
              <CardDescription className="text-sm text-muted-foreground">
                {dayjs(article.createdAt).format("MMMM DD, YYYY h:mm A")}
              </CardDescription>
            </div>

            {/* actions */}
            <div className="flex h-10 flex-row items-center justify-center gap-1">
              <Button className="w-fit" asChild>
                <a
                  rel="noopener noreferrer"
                  href={article.link}
                  target="_blank"
                >
                  <OpenInNewWindowIcon className="h-4 w-4" />
                </a>
              </Button>
              <ArticleOptions article={article} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArticlesList;
