<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-transparent text-zinc-500">
    <div class="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-3">
      <div>
        <span class="block">
          <span class="inline text-blue-400/50">Ticket</span>
          <span class="inline text-red-400/50">Way</span>
        </span>
        <p class="mt-2 text-sm">
          Transporte interprovincial, pasajeros y encomiendas con gestión moderna.
        </p>
      </div>

      <div class="flex flex-col gap-2 text-sm">
        <a href="/about" class="hover:text-white">Acerca</a>
        <a href="/contact" class="hover:text-white">Contacto</a>
        <a href="/privacy" class="hover:text-white">Privacidad</a>
      </div>

      <div class="flex gap-4 md:justify-end text-sm">
        <a href="#">Facebook</a>
        <a href="#">WhatsApp</a>
        <a href="#">Instagram</a>
      </div>
    </div>

    <div class="border-t border-zinc-800/60 py-4 text-center text-xs">
      &copy; {{ currentYear }} TicketWay. Todos los derechos reservados.
    </div>
  </footer>
</template>
