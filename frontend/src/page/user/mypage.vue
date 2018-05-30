<template>
  <div>
    <page-header title="Dobby"/>
    <div v-for="g in gateways" :key="g.id">
      <h3>{{g.name}}</h3>
      <div class="row">
        <ul class="collection">
          <sensor-item v-for="item in g.sensor"
                       :key="item.id"
                       :eBus="eventBus"
                       :item="item"/>
        </ul>
      </div>
    </div>
    <sensor-item-modal :eBus="eventBus"/>
  </div>
</template>

<script>
import Vue from 'vue';
import PageHeader from '@/components/Header';
import Item from '@/components/Mypage/SensorItem';
import ItemModal from '@/components/Mypage/SensorItemModal';

const EventBus = new Vue();
export default {
  name: 'page-MyPage',
  created() {
    this.$http.get('/api/page/mypage')
      .then((response) => {
        const res = response.data;
        this.gateways = res.data;
      });
  },
  data() {
    return {
      eventBus: EventBus,
      gateways: '',
    };
  },
  components: {
    'page-header': PageHeader,
    'sensor-item': Item,
    'sensor-item-modal': ItemModal,
  },
};
</script>

<style>
  h3 {
    padding-left: 1rem;
    font-size: 1.65rem;
  }
</style>
