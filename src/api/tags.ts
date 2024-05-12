import api from "@/configs/api";
import { Tag } from "@/typings/tag/types";

export async function getAllTags(
  page = 1,
  limit = 50,
): Promise<{ total_records: number; data: Tag[] }> {
  const result = await api.get(`tag?page=${page}&limit=${limit}`);
  return result.data;
}
