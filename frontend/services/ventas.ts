import { api } from "./api";
import type { Pasajero, Venta, VentaCreatePayload } from "@/types";

export async function createPasajero(data: Omit<Pasajero, "id" | "estado">): Promise<Pasajero> {
  return api.post<Pasajero>("/pasajeros/", data);
}

export async function createVenta(data: VentaCreatePayload): Promise<Venta> {
  return api.post<Venta>("/ventas/", data);
}

export async function getVentas(): Promise<Venta[]> {
  const data = await api.get<Venta[] | { results: Venta[] }>("/ventas/");
  if (Array.isArray(data)) return data;
  return (data as { results: Venta[] }).results ?? [];
}

export async function confirmarPago(id: number): Promise<Venta> {
  return api.post<Venta>(`/ventas/${id}/confirmar_pago/`, {});
}
