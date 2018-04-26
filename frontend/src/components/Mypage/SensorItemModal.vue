<template>
  <div id="SensorItemModal" class="modal bottom-sheet">
    <div class="modal-content">
      <h4>Sensor Setting</h4>
      <div class="row">
        <div class="input-field col m6 s12">
          <input id="name" type="text" class="validate"
                 :placeholder="item.origin.name"
                 v-model="item.ipt.name">
          <label for="name">sensor name</label>
        </div>
        <div class="input-field col m6 s12">
          <input id="ipt1" type="text" class="validate"
                 :placeholder="item.origin.cycle"
                 v-model="item.ipt.cycle">
          <label for="ipt1">주기</label>
        </div>
        <div class="input-field col m6 s6">
          <div class="switch input-field">
            <label class="active">메인</label>
             <label>
               Off
               <input type="checkbox" v-model="item.ipt.mainView">
               <span class="lever"></span>
               On
             </label>
           </div>
         </div>
        <div class="input-field col m6 s6">
          <div class="switch input-field">
            <label class="active">차트</label>
            <label>
              Off
              <input type="checkbox" v-model="item.ipt.chartView">
              <span class="lever"></span>
              On
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <a class="modal-action modal-close waves-effect waves-green btn-flat"
         @click="submit">확인</a>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'mypage-sensor-item-modal',
  props: {
    eBus: {
      type: Object,
    },
  },
  data() {
    return {
      instance: '',
      item: {
        origin: {
          id: 0,
          name: '4층 PC실 중앙 온도계',
          mainView: true,
          chartView: false,
          cycle: '5m',
        },
        ipt: {
          name: '4층 PC실 중앙 온도계',
          cycle: '5m',
          mainView: true,
          chartView: false,
        },
      },
    };
  },
  methods: {
    submit() {
    },
    open(item) {
      this.item.origin = _.clone(item);
      this.item.ipt = _.clone(item);
      this.$nextTick(() => {
        this.instance.open();
      });
    },
  },
  created() {
    this.eBus.$on('SensorItemModalOpen', this.open);
  },
  mounted() {
    const elem = document.querySelector('#SensorItemModal');
    this.instance = window.M.Modal.init(elem);
  },
};
</script>

<style scope>
  .modal.bottom-sheet {
    max-height: 65%;
  }
</style>
