import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/typings/user/types";
import useLogout from "@/hooks/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "./ui/switch";
import { useTheme } from "./ThemeProvider";
import { useNavigate } from "react-router-dom";
import { LayoutDashboardIcon, ListIcon } from "lucide-react";
import { useViewArticleMode } from "@/hooks/useArticleViewMode";
import ToolTipText from "./TooltipText";
import { getFallbackName } from "@/lib/auth";

export function UserDropdownMenu({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { mode, setMode } = useViewArticleMode();

  function toggleTheme() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  if (!user) {
    return null;
  }

  function logUserOut() {
    logout();

    // invalidate
    queryClient.invalidateQueries({ queryKey: ["getMe"] });
  }

  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 hover:cursor-pointer">
          <AvatarImage src={user.picture} />
          <AvatarFallback>{getFallbackName(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* profile */}
        <DropdownMenuLabel className="flex flex-row items-center justify-start gap-2 py-1">
          {/* pic */}
          <div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.picture} />
              <AvatarFallback>{getFallbackName(user)}</AvatarFallback>
            </Avatar>
          </div>
          {/* name */}
          <div className="text-md font-normal">
            {`${user.firstName} ${user.lastName}`.trim()}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem onClick={() => navigate("/account")}>
            Account Settings
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
            Settings
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* teams */}
        {/* <DropdownMenuGroup className="py-1">
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
          <DropdownMenuSubContent>
          <DropdownMenuItem>Email</DropdownMenuItem>
          <DropdownMenuItem>Message</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>More...</DropdownMenuItem>
          </DropdownMenuSubContent>
          </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
          New Team
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
          </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}

        {/* support */}
        {/* <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
      <DropdownMenuSeparator /> */}
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem onClick={() => logUserOut()}>
            Log out
            {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* mode */}
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem
            className="flex w-full justify-between gap-2"
            onSelect={(e) => e.preventDefault()}
          >
            Dark Mode
            <Switch
              className="mr-2"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* mode */}
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem
            className="flex w-full justify-between gap-2"
            onSelect={(e) => e.preventDefault()}
          >
            <span> View</span>

            <div className="mr-2 flex flex-row items-center justify-center gap-2 py-1">
              <ToolTipText
                child={
                  <div
                    className={`p-[3px] hover:cursor-pointer ${mode === "gallery" && "rounded-sm border-2 border-input bg-background shadow-sm"}`}
                  >
                    <LayoutDashboardIcon
                      width={"20"}
                      height={"20"}
                      onClick={() => setMode("gallery")}
                    />
                  </div>
                }
                text={"Gallery view"}
              />

              {/* list icon */}
              <ToolTipText
                child={
                  <div
                    className={`p-[3px] hover:cursor-pointer ${mode === "list" && "rounded-sm border-2 border-input bg-background shadow-sm"}`}
                  >
                    <ListIcon
                      width={"20"}
                      height={"20"}
                      onClick={() => setMode("list")}
                    />
                  </div>
                }
                text={"List view"}
              />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
