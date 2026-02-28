<script setup lang="ts">
defineEmits(['cerrar'])
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div class="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
      <h3 class="text-xl font-semibold mb-4 text-zinc-100">Pago por Yape</h3>

      <div class="text-center space-y-4">
        <img src="@/assets/QR-YAPE.png" alt="QR Yape" class="mx-auto w-48" />

        <p class="text-lg font-bold text-zinc-300">Yapea al número:</p>
        <p class="text-2xl font-bold text-zinc-100">999 888 777</p>

        <p class="text-sm text-zinc-400">Envía el voucher de pago al WhatsApp</p>

        <a
          href="https://wa.me/+51914909703"
          target="_blank"
          class="block rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 transition"
        >
          📲 Enviar voucher por WhatsApp
        </a>
      </div>

      <button
        class="mt-6 w-full rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 py-2 transition"
        @click="$emit('cerrar')"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>
