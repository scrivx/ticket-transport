import { api } from "./api";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>("/stats/");
}
