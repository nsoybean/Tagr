import { Tag } from "../tag/Tag";

export interface Article {
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
  tagIds: Tag[];
}
