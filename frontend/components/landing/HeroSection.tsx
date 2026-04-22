"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HeroSection() {
  const router = useRouter();
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origen) params.set("origen", origen);
    if (destino) params.set("destino", destino);
    if (fecha) params.set("fecha", fecha);
    router.push(`/viajes?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-blue-900 text-white">
      {/* Glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[-100px] w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
        
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            Pasajes de bus en línea
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Viaja por el Perú
            <br />
            <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              sin complicaciones
            </span>
          </h1>

          <p className="text-lg text-blue-100/90 max-w-xl mx-auto">
            Reserva tu asiento en segundos. Sin filas, sin esperas.
            <span className="block font-medium text-white mt-1">
              El mejor precio garantizado.
            </span>
          </p>
        </div>

        {/* Search Card */}
        <div className="relative max-w-3xl mx-auto">
          
          {/* Glass card */}
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-6 sm:p-8">
            
            <form onSubmit={handleSearch} className="space-y-5">

              {/* Inputs grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    Origen
                  </Label>
                  <Input
                    placeholder="¿Desde dónde?"
                    value={origen}
                    onChange={(e) => setOrigen(e.target.value)}
                    className="h-11 rounded-xl border-muted text-foreground placeholder:text-muted-foreground bg-white focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    Destino
                  </Label>
                  <Input
                    placeholder="¿A dónde?"
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="h-11 rounded-xl border-muted text-foreground placeholder:text-muted-foreground bg-white focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    Fecha
                  </Label>
                  <Input
                    type="date"
                    value={fecha}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFecha(e.target.value)}
                    className="h-11 rounded-xl border-muted text-foreground placeholder:text-muted-foreground bg-white focus:ring-2 focus:ring-primary/40"
                  />
                </div>

              </div>

              {/* Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <Search className="h-5 w-5" />
                Buscar viajes
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </div>

          {/* subtle border glow */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
