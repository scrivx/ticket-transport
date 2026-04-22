"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TripCard } from "@/components/trips/TripCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getViajes } from "@/services/viajes";
import type { Viaje } from "@/types";

function TripSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[140px] w-full rounded-xl" />
      <Skeleton className="h-[140px] w-full rounded-xl" />
      <Skeleton className="h-[140px] w-full rounded-xl" />
    </div>
  );
}

function ViajesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [origen, setOrigen] = useState(searchParams.get("origen") ?? "");
  const [destino, setDestino] = useState(searchParams.get("destino") ?? "");
  const [fecha, setFecha] = useState(searchParams.get("fecha") ?? "");

  const fetchViajes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = { estado: "PROGRAMADO" };
      if (fecha) params.fecha_viaje = fecha;
      const data = await getViajes(params);
      setViajes(data);
    } catch {
      setError("No se pudieron cargar los viajes. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [fecha]);

  useEffect(() => {
    fetchViajes();
  }, [fetchViajes]);

  const filtered = viajes.filter((v) => {
    const origenMatch =
      !origen ||
      v.ruta_info?.origen_nombre?.toLowerCase().includes(origen.toLowerCase());
    const destinoMatch =
      !destino ||
      v.ruta_info?.destino_nombre?.toLowerCase().includes(destino.toLowerCase());
    return origenMatch && destinoMatch;
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origen) params.set("origen", origen);
    if (destino) params.set("destino", destino);
    if (fecha) params.set("fecha", fecha);
    router.push(`/viajes?${params.toString()}`);
    fetchViajes();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Buscar viajes</h1>
            <p className="text-muted-foreground text-sm">
              Encuentra y reserva tu próximo viaje
            </p>
          </div>

          {/* Filters */}
          <form
            onSubmit={handleSearch}
            className="bg-background border rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-3 items-end"
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="f-origen">Origen</Label>
              <Input
                id="f-origen"
                placeholder="Ciudad de origen"
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="f-destino">Destino</Label>
              <Input
                id="f-destino"
                placeholder="Ciudad de destino"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="f-fecha">Fecha</Label>
              <Input
                id="f-fecha"
                type="date"
                value={fecha}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <Button type="submit" className="shrink-0">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </form>

          {/* Results */}
          {loading ? (
            <TripSkeleton />
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={fetchViajes}>
                Reintentar
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No hay viajes disponibles</p>
              <p className="text-sm mt-1">Prueba con otros filtros o una fecha diferente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {filtered.length} viaje{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
              </p>
              {filtered.map((v) => (
                <TripCard key={v.id} viaje={v} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ViajesPage() {
  return (
    <Suspense fallback={null}>
      <ViajesContent />
    </Suspense>
  );
}
