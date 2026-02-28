<template>
  <section class="bg-transparent text-zinc-200">
    <!-- HERO -->
    <div class="relative bg-zinc-900/50 border border-zinc-800/60 backdrop-blur-md rounded-xl">
      <div class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 class="text-4xl font-bold mb-4 text-zinc-100">Viaja seguro, rápido y sin colas</h1>
          <p class="text-lg opacity-90 text-zinc-400">
            Somos una plataforma digital de reserva de pasajes que te permite elegir tu asiento y
            pagar de forma sencilla desde tu celular.
          </p>
        </div>

        <img
          src="./../../public/transport.jpg"
          alt="Viaje en bus"
          class="rounded-xl shadow-lg w-full"
        />
      </div>
    </div>
    <!-- CÓMO FUNCIONA -->
    <div class="bg-transparent py-16">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-semibold mb-12 text-center text-zinc-100">¿Cómo funciona?</h2>

        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div
            class="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/60 shadow-sm backdrop-blur-sm"
          >
            <div class="text-4xl mb-3">🚌</div>
            <h3 class="font-semibold mb-2 text-zinc-200">Elige tu viaje</h3>
            <p class="text-zinc-500 text-sm">Selecciona origen, destino y fecha.</p>
          </div>

          <div
            class="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/60 shadow-sm backdrop-blur-sm"
          >
            <div class="text-4xl mb-3">💺</div>
            <h3 class="font-semibold mb-2 text-zinc-200">Escoge tu asiento</h3>
            <p class="text-zinc-500 text-sm">Visualiza los asientos disponibles en tiempo real.</p>
          </div>

          <div
            class="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/60 shadow-sm backdrop-blur-sm"
          >
            <div class="text-4xl mb-3">📲</div>
            <h3 class="font-semibold mb-2 text-zinc-200">Realiza el pago</h3>
            <p class="text-zinc-500 text-sm">Paga fácilmente vía Yape o transferencia.</p>
          </div>

          <div
            class="p-6 rounded-lg bg-zinc-900/40 border border-zinc-800/60 shadow-sm backdrop-blur-sm"
          >
            <div class="text-4xl mb-3">✅</div>
            <h3 class="font-semibold mb-2 text-zinc-200">Confirma tu reserva</h3>
            <p class="text-zinc-500 text-sm">Envía tu voucher y recibe tu confirmación.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- BENEFICIOS -->
    <div class="bg-transparent py-16">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-semibold mb-12 text-center text-zinc-100">¿Por qué elegirnos?</h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-xl shadow-sm backdrop-blur-sm"
          >
            <h3 class="font-semibold mb-2 text-zinc-200">⏱ Ahorra tiempo</h3>
            <p class="text-zinc-400">Compra tu pasaje desde casa sin hacer colas.</p>
          </div>

          <div
            class="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-xl shadow-sm backdrop-blur-sm"
          >
            <h3 class="font-semibold mb-2 text-zinc-200">🔒 Seguro</h3>
            <p class="text-zinc-400">Datos protegidos y confirmación directa por WhatsApp.</p>
          </div>

          <div
            class="bg-zinc-900/40 border border-zinc-800/60 p-6 rounded-xl shadow-sm backdrop-blur-sm"
          >
            <h3 class="font-semibold mb-2 text-zinc-200">📍 Fácil de usar</h3>
            <p class="text-zinc-400">Interfaz simple y pensada para todos.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div
      class="bg-zinc-900/50 border border-zinc-800/60 rounded-xl py-16 text-center backdrop-blur-md"
    >
      <h2 class="text-3xl font-bold mb-4 text-zinc-100">¿Listo para tu próximo viaje?</h2>
      <p class="mb-6 opacity-90 text-zinc-400">
        Reserva tu asiento en minutos y viaja con tranquilidad.
      </p>

      <RouterLink
        to="/reservar"
        class="bg-zinc-100 text-zinc-900 hover:bg-zinc-300 px-8 py-3 rounded-full font-semibold inline-block transition"
      >
        Reservar ahora
      </RouterLink>
    </div>
  </section>
</template>
