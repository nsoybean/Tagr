import { IArticle } from "@/typings/article/types";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

// This type is used to define the shape of our data.
// They define the data that will be displayed, how it will be formatted, sorted and filtered.
// note:
// accessorKey: The key to access the data in the data object.
// header: top cell of table
// cell: data cell
export const ArticleColumns: ColumnDef<IArticle>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-default font-bold">Title</div>,
    cell: ({ row }) => {
      return <div className="line-clamp-1 pr-2">{row.getValue("title")}</div>;
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-default font-bold">Description</div>,
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1 pr-2">{row.getValue("description")}</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-default font-bold">Created At</div>,
    cell: ({ row }) => {
      const date: any = row.getValue("createdAt");
      const formattedData = dayjs(date).format("MMMM DD, YYYY h:mm A"); // eg. April 8, 2024 10:51 PM
      return <div className="">{formattedData}</div>;
    },
  },
];
