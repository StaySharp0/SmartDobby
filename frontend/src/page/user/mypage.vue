<template>
  <div>
    <page-header title="Dobby"/>
    <div v-for="g in gateways" :key="g.id">
      <div class="row" style="margin-bottom: 0">
        <h3 class="col s12" v-show="!g.viewGatewayEdit">
        {{g.name}}
        <i class="material-icons blue-grey-text text-darken-2"
          @click="g.viewGatewayEdit = !g.viewGatewayEdit">edit</i>
        </h3>
        <div class="input-field  col s11" style="margin-top: 25px; margin-bottom: 0"
          v-show="g.viewGatewayEdit" >
          <input id="name" type="text" class="validate"
                 :placeholder="g.name" :value="editGatewayName" />
          <label for="name" class="active">gateway name</label>
          <i class="btn-editSubmit material-icons blue-grey-text text-darken-2"
            v-show="g.viewGatewayEdit" @click="updateGatewayName(g)">edit</i>
        </div>
      </div>
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
import _ from 'lodash';
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
        this.gateways = _.map(res.data, (gateway) => {
          const rtn = _.defaults({ viewGatewayEdit: false }, gateway);

          return rtn;
        });
      });
  },
  data() {
    return {
      eventBus: EventBus,
      gateways: '',
      editGatewayName: '',
    };
  },
  components: {
    'page-header': PageHeader,
    'sensor-item': Item,
    'sensor-item-modal': ItemModal,
  },
  methods: {
    updateGatewayName(g) {
      const gateway = g;

      this.$http.post('/api/gateway/name', {
        gid: gateway.id,
        name: this.editGatewayName,
      }).then((response) => {
        const res = response.data;

        if (res.status) gateway.name = this.editGatewayName;
      });

      gateway.viewGatewayEdit = false;
    },
  },
};
</script>

<style>
  h3 {
    padding-left: 1rem;
    font-size: 1.65rem;
  }
  h3 i{
    float: right;
    margin-right: 5px;
  }
  .btn-editSubmit {
    position: absolute;
    right: -20px;
    top: 5px;
  }
</style>
