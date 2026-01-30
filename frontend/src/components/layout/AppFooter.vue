<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-slate-900/55 text-slate-400">
    <div class="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-3">
      <div>
        <span class="text-lg font-semibold tracking-wide text-slate-200">
          Turismo
          <span class="text-indigo-600 font-bold">W<strong class="text-red-600">J</strong>L</span>
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

    <div class="border-t border-slate-800/60 py-4 text-center text-xs">
      &copy; {{ currentYear }} Transportes WJL — Todos los derechos reservados
    </div>
  </footer>
</template>
