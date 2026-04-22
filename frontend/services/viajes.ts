import { api } from "./api";
import type { Viaje } from "@/types";

export interface ViajesParams {
  fecha_viaje?: string;
  estado?: string;
  ruta?: number;
}

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export async function getViajes(params: ViajesParams = {}): Promise<Viaje[]> {
  const query = new URLSearchParams();
  if (params.fecha_viaje) query.set("fecha_viaje", params.fecha_viaje);
  if (params.estado) query.set("estado", params.estado);
  if (params.ruta) query.set("ruta", String(params.ruta));
  const qs = query.toString() ? `?${query.toString()}` : "";
  const data = await api.get<Viaje[] | PaginatedResponse<Viaje>>(`/viajes/${qs}`);
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

export async function getViaje(id: number): Promise<Viaje> {
  return api.get<Viaje>(`/viajes/${id}/`);
}
