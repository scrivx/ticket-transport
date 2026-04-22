import Link from "next/link";
import { Bus } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-primary text-lg mb-3">
              <Bus className="h-5 w-5" />
              TicketWay
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              La forma más sencilla de reservar tu pasaje de bus. Seguro, rápido y confiable.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Navegar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/viajes" className="hover:text-primary transition-colors">Buscar Viajes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span>Lunes a Viernes, 9am – 6pm</span>
              </li>
              <li>
                <span>contacto@ticketway.pe</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TicketWay. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
