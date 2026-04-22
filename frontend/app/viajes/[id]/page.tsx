"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bus, Calendar, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SeatMap } from "@/components/seats/SeatMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getViaje } from "@/services/viajes";
import { getAsientosByViaje } from "@/services/asientos";
import { useReservaStore } from "@/stores/reservaStore";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import type { AsientoViaje, Viaje } from "@/types";

export default function ViajeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { viaje: storedViaje, selectedSeats, setViaje, toggleSeat } = useReservaStore();

  const [viaje, setViajeLocal] = useState<Viaje | null>(storedViaje);
  const [seats, setSeats] = useState<AsientoViaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [viajeData, seatsData] = await Promise.all([
          getViaje(Number(id)),
          getAsientosByViaje(Number(id)),
        ]);
        setViajeLocal(viajeData);
        setViaje(viajeData);
        setSeats(seatsData);
      } catch {
        setError("No se pudo cargar el viaje.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, setViaje]);

  function handleContinue() {
    router.push(`/reserva/confirmar?viajeId=${id}`);
  }

  const total = selectedSeats.length * parseFloat(viaje?.precio_base ?? "0");

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !viaje) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error ?? "Viaje no encontrado"}</p>
            <Button asChild variant="outline">
              <Link href="/viajes">Volver a viajes</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { ruta_info, horario_hora, fecha_viaje, precio_base, estado, vehiculo_placa, conductor_info } = viaje;
  const available = seats.filter((s) => s.estado === "DISPONIBLE").length;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
            <Link href="/viajes">
              <ArrowLeft className="h-4 w-4" />
              Volver a viajes
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Trip info + seat map */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={estado === "PROGRAMADO" ? "success" : "secondary"}>
                      {estado}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(precio_base)}<span className="text-sm font-normal text-muted-foreground">/asiento</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{formatTime(horario_hora)}</p>
                      <p className="text-sm font-medium mt-0.5">{ruta_info?.origen_nombre}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <ArrowRight className="h-5 w-5 text-primary" />
                      <div className="h-px w-full bg-border" />
                      <span className="text-xs text-muted-foreground">{ruta_info?.distancia_km} km</span>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">—</p>
                      <p className="text-sm font-medium mt-0.5">{ruta_info?.destino_nombre}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />{formatDate(fecha_viaje)}</span>
                    <span className="flex items-center gap-1.5"><Bus className="h-4 w-4 text-primary" />{vehiculo_placa}</span>
                    {conductor_info && (
                      <span className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-primary" />
                        {conductor_info.nombres} {conductor_info.apellidos}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{available} asientos disponibles</span>
                  </div>
                </CardContent>
              </Card>

              {/* Seat map */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Selecciona tu asiento</CardTitle>
                </CardHeader>
                <CardContent>
                  {seats.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay asientos registrados para este viaje.</p>
                  ) : (
                    <SeatMap seats={seats} selected={selectedSeats} onToggle={toggleSeat} />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Order summary */}
            <div className="space-y-4">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base">Resumen de reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ruta</span>
                      <span className="font-medium text-right">
                        {ruta_info?.origen_nombre} → {ruta_info?.destino_nombre}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha</span>
                      <span className="font-medium">{formatDate(fecha_viaje)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hora</span>
                      <span className="font-medium">{formatTime(horario_hora)}</span>
                    </div>
                  </div>

                  <Separator />

                  {selectedSeats.length > 0 ? (
                    <>
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Asientos seleccionados</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSeats.map((s) => (
                            <span key={s.id} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                              N° {s.numero_asiento}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
                      </div>
                      <Button className="w-full" onClick={handleContinue}>
                        Continuar
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Selecciona al menos un asiento para continuar.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
