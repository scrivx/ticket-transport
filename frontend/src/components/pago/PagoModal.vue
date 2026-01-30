<script setup lang="ts">
defineEmits(['cerrar'])
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
      <h3 class="text-xl font-semibold mb-4">
        Pago por Yape
      </h3>

      <div class="text-center space-y-4">
        <img
          src=""
          alt="QR Yape"
          class="mx-auto w-48"
        />

        <p class="text-lg font-bold text-indigo-600">
          Yapea al número:
        </p>
        <p class="text-2xl font-bold">
          999 888 777
        </p>

        <p class="text-sm text-gray-600">
          Envía el voucher de pago al WhatsApp
        </p>

        <a
          href="https://wa.me/+51914909703"
          target="_blank"
          class="block rounded-xl bg-green-600 py-3
                 font-semibold text-white hover:bg-green-700 transition"
        >
          📲 Enviar voucher por WhatsApp
        </a>
      </div>

      <button
        class="mt-6 w-full rounded-xl border py-2"
        @click="$emit('cerrar')"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>
