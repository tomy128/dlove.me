<template>
  <div class="order-list-page bg-gray-50 min-h-screen py-12">
    <div class="container-custom max-w-5xl">
      <div class="flex items-center mb-8">
        <h1 class="text-3xl font-bold">我的订单</h1>
      </div>
      
      <OrderList />
    </div>
  </div>
</template>

<script setup>
import OrderList from '@/components/order/OrderList.vue';
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