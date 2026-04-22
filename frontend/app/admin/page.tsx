"use client";
import { useEffect, useState } from "react";
import { Bus, TicketCheck, Users, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardStats } from "@/services/stats";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import type { DashboardStats } from "@/types";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

const ESTADO_VENTA: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  PAGADA: "success",
  PENDIENTE: "warning",
  ANULADA: "destructive",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError("No se pudieron cargar las estadísticas."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Resumen de operaciones</p>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              title="Viajes hoy"
              value={stats.viajes_hoy}
              icon={Bus}
              description="Viajes programados para hoy"
            />
            <StatsCard
              title="Ventas totales"
              value={formatCurrency(stats.ventas_totales)}
              icon={TrendingUp}
              description="Ingresos acumulados"
            />
            <StatsCard
              title="Pasajeros registrados"
              value={stats.pasajeros_count}
              icon={Users}
              description="Total en el sistema"
            />
          </div>

          {/* Recent sales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ventas recientes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {stats.recent_sales.length === 0 ? (
                <p className="text-muted-foreground text-sm p-6">Sin ventas recientes.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pasajero</TableHead>
                      <TableHead>Ruta</TableHead>
                      <TableHead>Fecha viaje</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recent_sales.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-mono text-xs">#{v.id}</TableCell>
                        <TableCell>{v.pasajero ?? "—"}</TableCell>
                        <TableCell>
                          {v.origen && v.destino ? `${v.origen} → ${v.destino}` : "—"}
                        </TableCell>
                        <TableCell>{v.viaje_fecha ? formatShortDate(v.viaje_fecha) : "—"}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(v.total)}</TableCell>
                        <TableCell>
                          <Badge variant={ESTADO_VENTA[v.estado] ?? "secondary"}>
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

          {/* Upcoming trips */}
          {stats.proximos_viajes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Próximos viajes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ruta</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Precio base</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.proximos_viajes.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>
                          {v.ruta_info?.origen_nombre} → {v.ruta_info?.destino_nombre}
                        </TableCell>
                        <TableCell>{formatShortDate(v.fecha_viaje)}</TableCell>
                        <TableCell>{formatCurrency(v.precio_base)}</TableCell>
                        <TableCell>
                          <Badge variant={v.estado === "PROGRAMADO" ? "success" : "secondary"}>
                            {v.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
