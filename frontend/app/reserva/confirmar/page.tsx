"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useReservaStore } from "@/stores/reservaStore";
import { createPasajero, createVenta } from "@/services/ventas";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { VentaCreatePayload } from "@/types";

type MetodoPago = VentaCreatePayload["metodo_pago"];

const METODOS: { value: MetodoPago; label: string }[] = [
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "YAPE", label: "Yape" },
  { value: "PLIN", label: "Plin" },
  { value: "TARJETA", label: "Tarjeta de crédito/débito" },
];

interface SuccessData {
  ventas: { id: number; codigo?: string }[];
  metodo: MetodoPago;
  asientos: number[];
}

function ConfirmarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viajeId = searchParams.get("viajeId");

  const { viaje, selectedSeats, reset } = useReservaStore();

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [tipoDoc, setTipoDoc] = useState<"DNI" | "CE">("DNI");
  const [numDoc, setNumDoc] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodo, setMetodo] = useState<MetodoPago>("EFECTIVO");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  if (!viaje || selectedSeats.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No hay asientos seleccionados.</p>
            <Button asChild><Link href="/viajes">Buscar viajes</Link></Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const total = selectedSeats.length * parseFloat(viaje.precio_base);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!numDoc || !nombres || !apellidos || !telefono) {
      toast.error("Completa todos los campos requeridos.");
      return;
    }

    setLoading(true);
    if (!viaje) return;
    try {
      const pasajero = await createPasajero({
        tipo_documento: tipoDoc,
        numero_documento: numDoc,
        nombres,
        apellidos,
        telefono,
      });

      const ventaResults = await Promise.all(
        selectedSeats.map((seat) =>
          createVenta({
            viaje_id: viaje.id,
            pasajero_id: pasajero.id!,
            asiento_viaje_id: seat.id,
            metodo_pago: metodo,
          })
        )
      );

      setSuccess({
        ventas: ventaResults.map((v) => ({ id: v.id })),
        metodo,
        asientos: selectedSeats.map((s) => s.numero_asiento),
      });
      reset();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al procesar la reserva.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-muted/30 flex items-center justify-center py-16">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center space-y-5">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">¡Reserva confirmada!</h2>
                <p className="text-muted-foreground text-sm">
                  Tu reserva ha sido procesada exitosamente.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asientos</span>
                  <span className="font-medium">N° {success.asientos.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método de pago</span>
                  <span className="font-medium">{success.metodo}</span>
                </div>
                {(success.metodo === "YAPE" || success.metodo === "PLIN") && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-xs">
                    Tu pago está pendiente de confirmación por el operador.
                  </div>
                )}
                {success.ventas.map((v, i) => (
                  <div key={v.id} className="flex justify-between">
                    <span className="text-muted-foreground">Código venta {i + 1}</span>
                    <span className="font-mono font-medium">#{v.id}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" asChild>
                <Link href="/viajes">Buscar más viajes</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
            <Link href={`/viajes/${viaje.id}`}>
              <ArrowLeft className="h-4 w-4" />
              Volver a selección de asientos
            </Link>
          </Button>

          <h1 className="text-2xl font-bold mb-6">Confirmar reserva</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Datos del pasajero</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="nombres">Nombres *</Label>
                        <Input id="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} placeholder="Juan Carlos" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="apellidos">Apellidos *</Label>
                        <Input id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} placeholder="García López" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="tipo-doc">Tipo de documento *</Label>
                        <Select value={tipoDoc} onValueChange={(v) => setTipoDoc(v as "DNI" | "CE")}>
                          <SelectTrigger id="tipo-doc">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="CE">Carnet de Extranjería</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="num-doc">Número de documento *</Label>
                        <Input id="num-doc" value={numDoc} onChange={(e) => setNumDoc(e.target.value)} placeholder="12345678" maxLength={12} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input id="telefono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="999 999 999" required />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Método de pago</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {METODOS.map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setMetodo(m.value)}
                          className={`border-2 rounded-xl p-3 text-sm font-medium transition-all ${
                            metodo === m.value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    {(metodo === "YAPE" || metodo === "PLIN") && (
                      <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
                        El pago digital quedará en estado <strong>Pendiente</strong> hasta que el operador lo confirme.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? "Procesando..." : `Confirmar y pagar ${formatCurrency(total)}`}
                </Button>
              </form>
            </div>

            {/* Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base">Tu reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ruta</span>
                    <span className="font-medium text-right">
                      {viaje.ruta_info?.origen_nombre} → {viaje.ruta_info?.destino_nombre}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha</span>
                    <span className="font-medium">{formatDate(viaje.fecha_viaje)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hora</span>
                    <span className="font-medium">{formatTime(viaje.horario_hora)}</span>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Asientos</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSeats.map((s) => (
                        <Badge key={s.id} variant="secondary">N° {s.numero_asiento}</Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary text-lg">{formatCurrency(total)}</span>
                  </div>
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

export default function ConfirmarPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmarContent />
    </Suspense>
  );
}
