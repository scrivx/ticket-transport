import { Search, MousePointerClick, CreditCard, Ticket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Busca tu ruta",
    description: "Ingresa tu origen, destino y fecha para ver todos los viajes disponibles.",
    step: "01",
  },
  {
    icon: MousePointerClick,
    title: "Elige tu asiento",
    description: "Visualiza el mapa del bus y selecciona el asiento que prefieras.",
    step: "02",
  },
  {
    icon: CreditCard,
    title: "Paga en segundos",
    description: "Acepta efectivo, Yape, Plin o tarjeta de crédito/débito.",
    step: "03",
  },
  {
    icon: Ticket,
    title: "Recibe tu ticket",
    description: "Obtén tu código de reserva y preséntalo al abordar.",
    step: "04",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
            Fácil y rápido
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            ¿Cómo funciona?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Reserva tu pasaje en menos de 2 minutos. Sin registro requerido.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative flex flex-col items-center text-center group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-border" />
                )}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-7 w-7 text-primary" />
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
