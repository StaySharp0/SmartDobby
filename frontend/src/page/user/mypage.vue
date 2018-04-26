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
  data() {
    return {
      eventBus: EventBus,
      gateways: [{
        id: 0,
        name: '4층 PC실',
        sensor: [{
          id: 0,
          type: 'temperature',
          name: '4층 PC실 중앙 온도계',
          status: '정상',
          history: 'yy-mm-dd HH:MM',
          mainView: true,
          chartView: false,
          cycle: '10m',
        },
        {
          id: 1,
          type: 'humidity',
          name: '4층 PC실 중앙 습도계',
          status: '정상',
          history: 'yy-mm-dd HH:MM',
          mainView: true,
          chartView: false,
          cycle: '5m',
        }],
      },
      {
        id: 1,
        name: '5층 PC실',
        sensor: [{
          id: 0,
          type: 'temperature',
          name: '5층 PC실 중앙 온도계',
          status: '정상',
          history: 'yy-mm-dd HH:MM',
          mainView: false,
          chartView: false,
          cycle: '5m',
        },
        {
          id: 1,
          type: 'humidity',
          name: '5층 PC실 중앙 습도계',
          status: '정상',
          history: 'yy-mm-dd HH:MM',
          mainView: true,
          chartView: true,
          cycle: '10m',
        }],
      }],
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
