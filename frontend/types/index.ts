export interface Ciudad {
  id: number;
  nombre: string;
  departamento: string;
}

export interface Ruta {
  id: number;
  origen: number;
  destino: number;
  origen_nombre: string;
  destino_nombre: string;
  distancia_km: string;
  estado: boolean;
}

export interface Vehiculo {
  id: number;
  placa: string;
  tipo: "COMBI" | "BUS";
  capacidad: number;
  marca: string;
  modelo: string;
  estado: boolean;
}

export interface Conductor {
  id: number;
  licencia: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  estado: boolean;
}

export interface Horario {
  id: number;
  hora_salida: string;
  hora_llegada_estimada: string;
}

export interface ViajeRutaInfo {
  id: number;
  origen: number;
  destino: number;
  origen_nombre: string;
  destino_nombre: string;
  distancia_km: string;
  estado: boolean;
}

export interface Viaje {
  id: number;
  ruta: number;
  ruta_info: ViajeRutaInfo;
  vehiculo: number;
  vehiculo_placa: string;
  conductor: number;
  conductor_info: Conductor;
  horario: number;
  horario_hora: string;
  fecha_viaje: string;
  precio_base: string;
  estado: "PROGRAMADO" | "EN_CURSO" | "FINALIZADO" | "CANCELADO";
}

export interface AsientoViaje {
  id: number;
  viaje: number;
  asiento: number;
  numero_asiento: number;
  estado: "DISPONIBLE" | "RESERVADO" | "OCUPADO";
}

export interface Pasajero {
  id?: number;
  tipo_documento: "DNI" | "CE";
  numero_documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  estado?: boolean;
}

export interface VentaCreatePayload {
  viaje_id: number;
  pasajero_id: number;
  asiento_viaje_id: number;
  metodo_pago: "EFECTIVO" | "YAPE" | "PLIN" | "TARJETA";
}

export interface Ticket {
  id: number;
  venta: number;
  viaje: number;
  pasajero: number;
  asiento_viaje: number;
  precio_final: string;
  codigo: string;
  estado: "VENDIDO" | "USADO" | "ANULADO";
}

export interface Venta {
  id: number;
  fecha_venta: string;
  total: string;
  metodo_pago: "EFECTIVO" | "YAPE" | "PLIN" | "TARJETA";
  estado: "PENDIENTE" | "PAGADA" | "ANULADA";
  tickets_info?: Ticket[];
  viaje_fecha?: string;
  origen?: string;
  destino?: string;
  pasajero?: string;
  telefono?: string;
}

export interface DashboardStats {
  viajes_hoy: number;
  ventas_totales: number;
  pasajeros_count: number;
  proximos_viajes: Viaje[];
  recent_sales: Venta[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
  is_staff: boolean;
  is_superuser: boolean;
  username: string;
}

export interface ReservaState {
  viajeId: number | null;
  viaje: Viaje | null;
  selectedSeats: AsientoViaje[];
  pasajero: Pasajero | null;
  metodo_pago: VentaCreatePayload["metodo_pago"];
}
