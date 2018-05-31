<template>
  <div>
    <page-header title="Scheduler"  :menu="false" :close="true"/>

    <main style="margin-bottom: 30px">
      <div ref="container" class="container">
        <div class="row" style="margin-top:20px">
          <div class="input-field col s12">
            <input placeholder="Scheduler Name" id="name" type="text" v-model="name">
            <label for="name" class="active">Scheduler Name</label>
          </div>
          <div class="input-field col s12">
            <input placeholder="Cron-style Time" id="time" type="text" v-model="time">
            <label for="time" class="active">Time (s m h D M W)</label>
          </div>
        </div>
      </div>
      <div class="center" v-show="!viewSubmit">
        <a class="btn-floating btn-large waves-effect waves-light blur dropdown-trigger"
          data-target='addSchedulerSetting'><i class="material-icons">add</i></a>
      </div>
      <div class="center" v-show="viewSubmit">
        <a class="btn-floating btn-large waves-effect waves-light blur"
           @click="Submit"><i class="material-icons">send</i></a>
      </div>
      <ul id='addSchedulerSetting' class='dropdown-content'>
        <li v-show="viewTrigger">
          <a @click="AddSensorList">Sensor</a>
        </li>
        <li v-show="viewSensorCondition">
          <a @click="AddConditionValue('>')">&gt;</a>
          </li>
        <li v-show="viewSensorCondition">
          <a @click="AddConditionValue('>=')">&gt;=</a>
        </li>
        <li v-show="viewSensorCondition">
          <a @click="AddConditionValue('=')">=</a>
        </li>
        <li v-show="viewSensorCondition">
          <a @click="AddConditionValue('<')">&lt;</a>
        </li>
        <li v-show="viewSensorCondition">
          <a @click="AddConditionValue('<=')">&lt;=</a>
        </li>
        <li v-show="viewChain">
          <a @click="AddChain('AND')">AND</a>
        </li>
        <li v-show="viewChain">
          <a @click="AddChain('OR')">OR</a>
        </li>
        <li v-show="viewAction">
          <a @click="AddActionList">Action</a>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
import Vue from 'vue';
import _ from 'lodash';
import PageHeader from '@/components/Header';
import SensorList from '@/components/Scheduler/SensorList';
import SensorInput from '@/components/Scheduler/Input';
import SensorChain from '@/components/Scheduler/Chain';
import ActionList from '@/components/Scheduler/ActionList';

const SensorListClass = Vue.extend(SensorList);
const SensorInputClass = Vue.extend(SensorInput);
const SensorChainClass = Vue.extend(SensorChain);
const ActionListClass = Vue.extend(ActionList);

export default {
  name: 'page-Scheduler-Add',
  data() {
    return {
      viewSubmit: false,
      viewTrigger: true,
      viewSensorCondition: false,
      viewChain: false,
      viewAction: true,
      scheduler: [],
      name: '',
      time: '',
    };
  },
  components: {
    'page-header': PageHeader,
  },
  methods: {
    AddSensorList() {
      const instance = new SensorListClass();
      instance.$mount();
      this.$refs.container.appendChild(instance.$el);

      this.scheduler.push({
        type: 'sensor',
        item: instance,
      });

      this.viewTrigger = false;
      this.viewSensorCondition = true;
      this.viewChain = false;
      this.viewAction = false;
    },
    AddConditionValue(type) {
      const instance = new SensorInputClass({
        propsData: {
          placeholder: 'Condition Value',
          cond: type,
        },
      });
      instance.$mount();
      this.$refs.container.appendChild(instance.$el);

      this.scheduler.push({
        type: 'value',
        cond: type,
        item: instance,
      });

      this.viewTrigger = false;
      this.viewSensorCondition = false;
      this.viewChain = true;
      this.viewAction = true;
    },
    AddChain(type) {
      const instance = new SensorChainClass({
        propsData: {
          chain: type,
        },
      });
      instance.$mount();
      this.$refs.container.appendChild(instance.$el);

      this.scheduler.push({
        type: 'chain',
        chain: type,
        item: instance,
      });

      this.viewTrigger = true;
      this.viewSensorCondition = false;
      this.viewChain = false;
      this.viewAction = false;
    },
    AddActionList() {
      const instance = new ActionListClass();
      instance.$mount();
      this.$refs.container.appendChild(instance.$el);

      this.scheduler.push({
        type: 'action',
        item: instance,
      });

      this.viewSubmit = true;
    },
    Submit() {
      const params = _.map(this.scheduler, (s) => {
        switch (s.type) {
          case 'sensor':
            return {
              type: s.type,
              sid: s.item.selected,
            };
          case 'value':
            return {
              type: s.type,
              cond: s.cond,
              value: s.item.value,
            };
          case 'action':
            return {
              type: s.type,
              rid: s.item.selected,
            };
          case 'chain':
            return {
              type: s.type,
              chain: s.chain,
            };
          default:
            return null;
        }
      });
      this.$http.post('/api/scheduler/add', {
        name: this.name,
        time: this.time,
        params,
      }).then((res) => {
        alert('스케줄러 등록 성공');
        window.location.href = '#/Scheduler';
      });
    },
  },
  mounted() {
    const elems = document.querySelectorAll('.dropdown-trigger');
    const instances = window.M.Dropdown.init(elems, {});
  },
};
</script>

<style>
  .btn-floating.blur{
    background: rgba(233,233,233,.2);
  }

  .blur i{
    color: #666;
  }

  #addSchedulerSetting {
    transform: translateX(20px);
  }

  .dropdown-content {
    border-radius: 8px;
  }

  .dropdown-content li{
    text-align: center;
  }

  .dropdown-content li>a,
  .dropdown-content li>span{
    color: #666;
  }
</style>

