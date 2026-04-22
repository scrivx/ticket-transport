"use client";
import { create } from "zustand";
import type { AsientoViaje, Pasajero, Viaje, VentaCreatePayload } from "@/types";

interface ReservaStore {
  viaje: Viaje | null;
  selectedSeats: AsientoViaje[];
  pasajero: Pasajero | null;
  metodo_pago: VentaCreatePayload["metodo_pago"];
  setViaje: (viaje: Viaje) => void;
  toggleSeat: (seat: AsientoViaje) => void;
  clearSeats: () => void;
  setPasajero: (p: Pasajero) => void;
  setMetodoPago: (m: VentaCreatePayload["metodo_pago"]) => void;
  reset: () => void;
}

export const useReservaStore = create<ReservaStore>((set) => ({
  viaje: null,
  selectedSeats: [],
  pasajero: null,
  metodo_pago: "EFECTIVO",
  setViaje: (viaje) => set({ viaje, selectedSeats: [] }),
  toggleSeat: (seat) =>
    set((state) => {
      const exists = state.selectedSeats.some((s) => s.id === seat.id);
      return {
        selectedSeats: exists
          ? state.selectedSeats.filter((s) => s.id !== seat.id)
          : [...state.selectedSeats, seat],
      };
    }),
  clearSeats: () => set({ selectedSeats: [] }),
  setPasajero: (pasajero) => set({ pasajero }),
  setMetodoPago: (metodo_pago) => set({ metodo_pago }),
  reset: () =>
    set({ viaje: null, selectedSeats: [], pasajero: null, metodo_pago: "EFECTIVO" }),
}));
