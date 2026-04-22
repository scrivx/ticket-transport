import Link from "next/link";
import { MapPin, Clock, Bus, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTime, formatShortDate, formatCurrency } from "@/lib/utils";
import type { Viaje } from "@/types";

const ESTADO_BADGE: Record<Viaje["estado"], "default" | "success" | "warning" | "destructive"> = {
  PROGRAMADO: "success",
  EN_CURSO: "default",
  FINALIZADO: "secondary" as never,
  CANCELADO: "destructive",
};

interface Props {
  viaje: Viaje;
}

export function TripCard({ viaje }: Props) {
  const { ruta_info, horario_hora, fecha_viaje, precio_base, estado, vehiculo_placa, conductor_info } = viaje;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-0">
        {/* Route header */}
        <div className="bg-primary/5 px-5 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-center min-w-[80px]">
                <p className="text-xl font-bold">{formatTime(horario_hora)}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[90px]">
                  {ruta_info?.origen_nombre}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 flex-1 min-w-[60px]">
                <ArrowRight className="h-4 w-4 text-primary" />
                <div className="h-px w-full bg-border" />
                <span className="text-xs text-muted-foreground">{ruta_info?.distancia_km} km</span>
              </div>
              <div className="text-center min-w-[80px]">
                <p className="text-xl font-bold">—</p>
                <p className="text-xs text-muted-foreground truncate max-w-[90px]">
                  {ruta_info?.destino_nombre}
                </p>
              </div>
            </div>
            <Badge variant={ESTADO_BADGE[estado]} className="ml-4 shrink-0">
              {estado}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {formatShortDate(fecha_viaje)}
            </span>
            <span className="flex items-center gap-1.5">
              <Bus className="h-3.5 w-3.5 text-primary" />
              {vehiculo_placa}
            </span>
            {conductor_info && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {conductor_info.nombres} {conductor_info.apellidos}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-2xl font-bold text-primary">{formatCurrency(precio_base)}</span>
              <span className="text-xs text-muted-foreground ml-1">/ asiento</span>
            </div>
            {estado === "PROGRAMADO" && (
              <Button asChild size="sm">
                <Link href={`/viajes/${viaje.id}`}>
                  Seleccionar asiento
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
