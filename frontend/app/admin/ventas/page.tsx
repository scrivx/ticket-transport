"use client";
import { useEffect, useState } from "react";
import { RefreshCw, TicketCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getVentas, confirmarPago } from "@/services/ventas";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import type { Venta } from "@/types";

const ESTADO_BADGE: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  PAGADA: "success",
  PENDIENTE: "warning",
  ANULADA: "destructive",
};

export default function AdminVentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getVentas();
      setVentas(data);
    } catch {
      toast.error("No se pudieron cargar las ventas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleConfirmar(id: number) {
    setConfirming(id);
    try {
      await confirmarPago(id);
      toast.success("Pago confirmado.");
      load();
    } catch {
      toast.error("No se pudo confirmar el pago.");
    } finally {
      setConfirming(null);
    }
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Ventas</h1>
          <p className="text-muted-foreground text-sm mt-1">Historial de reservas y pagos</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TicketCheck className="h-4 w-4 text-primary" />
            Todas las ventas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : ventas.length === 0 ? (
            <p className="text-muted-foreground text-sm p-6">Sin ventas registradas.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pasajero</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Fecha viaje</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventas.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono text-xs">#{v.id}</TableCell>
                    <TableCell>{v.pasajero ?? "—"}</TableCell>
                    <TableCell className="text-sm">
                      {v.origen && v.destino ? `${v.origen} → ${v.destino}` : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {v.viaje_fecha ? formatShortDate(v.viaje_fecha) : "—"}
                    </TableCell>
                    <TableCell className="text-sm">{v.metodo_pago}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(v.total)}</TableCell>
                    <TableCell>
                      <Badge variant={ESTADO_BADGE[v.estado] ?? "secondary"}>
                        {v.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {v.estado === "PENDIENTE" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConfirmar(v.id)}
                          disabled={confirming === v.id}
                        >
                          {confirming === v.id ? "..." : "Confirmar pago"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
