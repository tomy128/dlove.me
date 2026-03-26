<template>
  <div class="order-detail-page bg-gray-50 min-h-screen py-12">
    <div class="container-custom max-w-5xl">
      <OrderDetail :order-id="orderId" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import OrderDetail from '@/components/order/OrderDetail.vue';

const route = useRoute();
const orderId = computed(() => route.params.id);
</script>

<style scoped>
.container-custom {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container-custom {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .container-custom {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>