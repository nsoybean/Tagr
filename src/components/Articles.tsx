import { Article as IArticle } from "@/typings/article/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArrowRight } from "lucide-react";
import ArticleOptions from "./ArticleOptions";
import ToolTipText from "./TooltipText";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import randomColor from "randomcolor";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { routes } from "@/router";

type Props = {
  articles: IArticle[];
};

const Articles = (props: Props) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  function generateColorBaseOnSeed(seed: string) {
    const randomColorBase = theme === "light" ? "light" : "dark";
    const color = randomColor({
      luminosity: randomColorBase,
      seed: seed,
    });
    return color;
  }

  return (
    <>
      {props.articles.map((article, index) => (
        <Card key={index} className="flex flex-col justify-between">
          {/* header */}
          <CardHeader className="p-3">
            {/* if img exist */}
            {article.image ? (
              <div className="mb-2 h-32 w-full rounded-lg object-cover object-center sm:h-40 lg:h-32">
                <img
                  src={article.image}
                  alt={"image"}
                  className="h-full w-full rounded-lg object-cover object-center"
                />
              </div>
            ) : (
              // else fallback to link[0] letter
              <div
                style={{
                  // dynamically generate color based on link
                  backgroundColor:
                    generateColorBaseOnSeed(article.link) || "#87c3ff",
                }}
                className={`relative
                    mb-2 flex h-32 w-full items-center justify-start overflow-hidden rounded-lg pl-[30px]  text-[150px] font-bold sm:h-40 lg:h-32`}
              >
                {article?.domain?.charAt(0) || "P"}
              </div>
            )}
            {/* title and desc */}
            <div className="flex flex-col justify-around gap-2">
              <ToolTipText
                child={
                  <CardTitle className="line-clamp-2">
                    {article.title}
                  </CardTitle>
                }
                text={article.title}
              />
              <ToolTipText
                child={
                  <CardDescription className="line-clamp-2">
                    {article.description}
                  </CardDescription>
                }
                text={article.description}
              />
            </div>
          </CardHeader>
          {/* content */}
          {article?.tagIds?.length > 0 && (
            <CardContent className="flex w-full flex-row flex-wrap items-center justify-start gap-2 px-3">
              {article.tagIds.map((tag, index) => (
                <Badge
                  className="max-w-24 hover:cursor-pointer"
                  variant={"secondary"}
                  key={index}
                  onClick={() => {
                    if (
                      // ignore if already in query by tag page
                      routes.TagSavesPageRoute.to === window.location.pathname
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
            </CardContent>
          )}
          <CardFooter className="w-full gap-1">
            <Button className="w-full" asChild>
              <a rel="noopener noreferrer" href={article.link} target="_blank">
                <span>Visit</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <ArticleOptions article={article} />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default Articles;
