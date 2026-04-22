"use client";
import { cn } from "@/lib/utils";
import type { AsientoViaje } from "@/types";

interface Props {
  seats: AsientoViaje[];
  selected: AsientoViaje[];
  onToggle: (seat: AsientoViaje) => void;
}

function SeatItem({
  seat,
  isSelected,
  onToggle,
}: {
  seat: AsientoViaje;
  isSelected: boolean;
  onToggle: (s: AsientoViaje) => void;
}) {
  const available = seat.estado === "DISPONIBLE";
  const occupied = seat.estado === "OCUPADO" || seat.estado === "RESERVADO";

  return (
    <button
      disabled={!available}
      onClick={() => onToggle(seat)}
      className={cn(
        "w-10 h-10 rounded-t-lg border-2 text-xs font-medium transition-all flex items-center justify-center",
        available && !isSelected && "border-green-400 bg-green-50 hover:bg-green-100 text-green-700",
        available && isSelected && "border-primary bg-primary text-primary-foreground scale-105 shadow-md",
        occupied && "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
      )}
      title={`Asiento ${seat.numero_asiento} — ${seat.estado}`}
    >
      {seat.numero_asiento}
    </button>
  );
}

export function SeatMap({ seats, selected, onToggle }: Props) {
  const sorted = [...seats].sort((a, b) => a.numero_asiento - b.numero_asiento);

  // Build rows of 4 (2+2 bus layout)
  const rows: AsientoViaje[][] = [];
  for (let i = 0; i < sorted.length; i += 4) {
    rows.push(sorted.slice(i, i + 4));
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-5 text-xs flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border-2 border-green-400 bg-green-50 inline-block" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border-2 border-primary bg-primary inline-block" />
          Seleccionado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border-2 border-gray-200 bg-gray-100 inline-block" />
          Ocupado
        </span>
      </div>

      {/* Bus diagram */}
      <div className="bg-muted/30 rounded-xl border p-6 inline-block min-w-[220px]">
        {/* Driver area */}
        <div className="flex items-center justify-end mb-4">
          <div className="text-xs text-muted-foreground border rounded px-2 py-1">🚌 Conductor</div>
        </div>

        <div className="flex flex-col gap-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* Left pair */}
              <div className="flex gap-1.5">
                {row[0] && (
                  <SeatItem
                    seat={row[0]}
                    isSelected={selected.some((s) => s.id === row[0].id)}
                    onToggle={onToggle}
                  />
                )}
                {row[1] && (
                  <SeatItem
                    seat={row[1]}
                    isSelected={selected.some((s) => s.id === row[1].id)}
                    onToggle={onToggle}
                  />
                )}
              </div>
              {/* Aisle */}
              <div className="w-4" />
              {/* Right pair */}
              <div className="flex gap-1.5">
                {row[2] && (
                  <SeatItem
                    seat={row[2]}
                    isSelected={selected.some((s) => s.id === row[2].id)}
                    onToggle={onToggle}
                  />
                )}
                {row[3] && (
                  <SeatItem
                    seat={row[3]}
                    isSelected={selected.some((s) => s.id === row[3].id)}
                    onToggle={onToggle}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
