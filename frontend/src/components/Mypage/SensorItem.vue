<template>
  <li class="collection-item avatar">
    <i class="circle" :class="[icon]"></i>
    <span class="title">{{item.name}}</span>
    <p>{{item.status}}<br>
       {{item.history}}
    </p>
    <a href="#SensorItemModal" class="secondary-content modal-trigger" @click="modalOpen">
      <i class="material-icons blue-grey-text text-darken-2">settings</i>
    </a>
  </li>
</template>

<script>
export default {
  name: 'MyPage-Sensor-Item',
  props: {
    item: {
      type: Object,
      default() {
        return {
          id: 0,
          type: 'temperature',
          name: '4층 PC실 중앙 온도계',
          status: '정상',
          history: 'yy-mm-dd HH:MM',
          mainView: true,
          chartView: false,
          cycle: '5m',
        };
      },
    },
    eBus: {
      type: Object,
    },
  },
  computed: {
    icon() {
      const iconClass = {
        temperature: 'fas fa-thermometer-empty orange',
        humidity: 'fas fa-tint blue',
      };

      return iconClass[this.item.type];
    },
  },
  methods: {
    modalOpen() {
      this.eBus.$emit('SensorItemModalOpen', this.item);
    },
  },
};
</script>
