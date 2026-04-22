"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Bus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getViajes } from "@/services/viajes";
import { formatCurrency, formatShortDate, formatTime } from "@/lib/utils";
import type { Viaje } from "@/types";

const ESTADO_BADGE: Record<Viaje["estado"], "success" | "default" | "secondary" | "destructive"> = {
  PROGRAMADO: "success",
  EN_CURSO: "default",
  FINALIZADO: "secondary",
  CANCELADO: "destructive",
};

export default function AdminViajesPage() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getViajes();
      setViajes(data);
    } catch {
      toast.error("No se pudieron cargar los viajes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Viajes</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestión de viajes programados</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bus className="h-4 w-4 text-primary" />
            Todos los viajes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : viajes.length === 0 ? (
            <p className="text-muted-foreground text-sm p-6">Sin viajes registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Conductor</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viajes.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-mono text-xs">#{v.id}</TableCell>
                    <TableCell className="font-medium">
                      {v.ruta_info?.origen_nombre} → {v.ruta_info?.destino_nombre}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatShortDate(v.fecha_viaje)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{formatTime(v.horario_hora)}</TableCell>
                    <TableCell className="text-sm font-mono">{v.vehiculo_placa}</TableCell>
                    <TableCell className="text-sm">
                      {v.conductor_info
                        ? `${v.conductor_info.nombres} ${v.conductor_info.apellidos}`
                        : "—"}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(v.precio_base)}</TableCell>
                    <TableCell>
                      <Badge variant={ESTADO_BADGE[v.estado]}>
                        {v.estado}
                      </Badge>
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
