import { ITag } from "../tag/types";

export interface IArticle {
  link: string;
  description: string;
  state: string;
  note: string;
  id: string;
  color: string;
  image: string;
  title: string;
  domain: string;
  updatedAt: Date;
  createdAt: Date;
  tagIds: ITag[];
}

export enum ArticleStateEnum {
  AVAILABLE = "AVAILABLE",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}

// Search
export interface ISearchArticleResult {
  id: string;
  title: string;
  link: string;
  description: string;
  state: string;
  createdAt: Date;
}
