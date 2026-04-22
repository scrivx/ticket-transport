import { api } from "./api";
import type { AsientoViaje } from "@/types";

export async function getAsientosByViaje(viajeId: number): Promise<AsientoViaje[]> {
  const data = await api.get<AsientoViaje[] | { results: AsientoViaje[] }>(
    `/asientos-viaje/?viaje=${viajeId}`
  );
  if (Array.isArray(data)) return data;
  return (data as { results: AsientoViaje[] }).results ?? [];
}
