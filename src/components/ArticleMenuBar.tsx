import { TagIcon } from "lucide-react";
import { Menubar, MenubarMenu } from "./ui/menubar";
import { Link2Icon, ArchiveIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { getUrlPath } from "@/lib/url";
import { Button } from "./ui/button";
import { IRouteProps } from "@/typings/route/types";

type Props = {};

export const menuLinks: IRouteProps[] = [
  { name: "Saves", href: "/saves", icon: Link2Icon },
  { name: "Archives", href: "/archives", icon: ArchiveIcon },
  { name: "Tags", href: "/tags", icon: TagIcon },
];

const ArticleMenuBar = (props: Props) => {
  const navigate = useNavigate();

  return (
    <Menubar className="hidden min-w-40 items-center gap-2 lg:flex lg:h-fit lg:flex-col lg:p-2">
      {menuLinks.map((link, index) => {
        return (
          <MenubarMenu key={index}>
            <Button
              variant={"ghost"}
              className={`flex w-full flex-row items-center justify-start rounded-md p-2 text-sm ${getUrlPath() === link.href && "bg-secondary"}`}
              onClick={() => navigate(link.href)}
            >
              {<link.icon className="mr-2 h-4 w-4" />}
              <span> {link.name}</span>
            </Button>
          </MenubarMenu>
        );
      })}
    </Menubar>
  );
};

export default ArticleMenuBar;
