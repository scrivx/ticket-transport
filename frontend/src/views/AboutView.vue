<template>
  <section class="bg-gray-50">
    <!-- HERO -->
    <div class="relative bg-gray-300/95 rounded-xl">
      <div class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 class="text-4xl font-bold mb-4">Viaja seguro, rápido y sin colas</h1>
          <p class="text-lg opacity-90">
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

    <!-- QUIÉNES SOMOS -->
    <div class="max-w-6xl mx-auto px-6 py-16">
      <h2 class="text-3xl font-semibold mb-6 text-center">¿Quiénes somos?</h2>

      <p class="text-gray-700 max-w-3xl mx-auto text-center text-lg">
        Somos una empresa de transporte comprometida con brindar un servicio moderno, confiable y
        accesible. Nuestro objetivo es facilitar la compra de pasajes sin largas esperas ni
        complicaciones.
      </p>
    </div>

    <!-- CÓMO FUNCIONA -->
    <div class="bg-white py-16">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-semibold mb-12 text-center">¿Cómo funciona?</h2>

        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div class="p-6 rounded-lg shadow">
            <div class="text-4xl mb-3">🚌</div>
            <h3 class="font-semibold mb-2">Elige tu viaje</h3>
            <p class="text-gray-600 text-sm">Selecciona origen, destino y fecha.</p>
          </div>

          <div class="p-6 rounded-lg shadow">
            <div class="text-4xl mb-3">💺</div>
            <h3 class="font-semibold mb-2">Escoge tu asiento</h3>
            <p class="text-gray-600 text-sm">Visualiza los asientos disponibles en tiempo real.</p>
          </div>

          <div class="p-6 rounded-lg shadow">
            <div class="text-4xl mb-3">📲</div>
            <h3 class="font-semibold mb-2">Realiza el pago</h3>
            <p class="text-gray-600 text-sm">Paga fácilmente vía Yape o transferencia.</p>
          </div>

          <div class="p-6 rounded-lg shadow">
            <div class="text-4xl mb-3">✅</div>
            <h3 class="font-semibold mb-2">Confirma tu reserva</h3>
            <p class="text-gray-600 text-sm">Envía tu voucher y recibe tu confirmación.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- BENEFICIOS -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-semibold mb-12 text-center">¿Por qué elegirnos?</h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="font-semibold mb-2">⏱ Ahorra tiempo</h3>
            <p class="text-gray-600">Compra tu pasaje desde casa sin hacer colas.</p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="font-semibold mb-2">🔒 Seguro</h3>
            <p class="text-gray-600">Datos protegidos y confirmación directa por WhatsApp.</p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="font-semibold mb-2">📍 Fácil de usar</h3>
            <p class="text-gray-600">Interfaz simple y pensada para todos.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="bg-gray-300/95 rounded-xl py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">¿Listo para tu próximo viaje?</h2>
      <p class="mb-6 opacity-90">Reserva tu asiento en minutos y viaja con tranquilidad.</p>

      <RouterLink
        to="/reservar"
        class="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full font-semibold inline-block"
      >
        Reservar ahora
      </RouterLink>
    </div>
  </section>
</template>
