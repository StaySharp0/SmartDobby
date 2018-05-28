<template>
  <div>
    <page-header title="Scheduler"  :menu="false" :close="true"/>

    <main style="margin-bottom: 30px">
      <div ref="container" class="container">
        <div class="row" style="margin-top:20px">
          <div class="input-field col s12">
            <input placeholder="Scheduler Name" id="name" type="text" v-model="name">
            <label for="name">Scheduler Name</label>
          </div>
        </div>
      </div>
      <div class="center" v-show="!viewSubmit">
        <a class="btn-floating btn-large waves-effect waves-light blur dropdown-trigger"
           href='#!' data-target='addSchedulerSetting'><i class="material-icons">add</i></a>
      </div>
      <div class="center" v-show="viewSubmit">
        <a class="btn-floating btn-large waves-effect waves-light blur"
           href='#!'><i class="material-icons">send</i></a>
      </div>
      <ul id='addSchedulerSetting' class='dropdown-content'>
        <li v-show="viewTrigger">
          <a href="#!" @click="AddSensorList">Sensor</a>
        </li>
        <li v-show="viewTrigger">
          <a href="#!" @click="AddTime">Time</a>
        </li>
        <li v-show="viewSensorCondition">
          <a href="#!" @click="AddConditionValue('>')">&gt;</a>
          </li>
        <li v-show="viewSensorCondition">
          <a href="#!" @click="AddConditionValue('>=')">&gt;=</a>
        </li>
        <li v-show="viewSensorCondition">
          <a href="#!" @click="AddConditionValue('=')">=</a>
        </li>
        <li v-show="viewSensorCondition">
          <a href="#!" @click="AddConditionValue('<')">&lt;</a>
        </li>
        <li v-show="viewSensorCondition">
          <a href="#!" @click="AddConditionValue('<=')">&lt;=</a>
        </li>
        <li v-show="viewChain">
          <a href="#!" @click="AddChain('AND')">AND</a>
        </li>
        <li v-show="viewChain">
          <a href="#!" @click="AddChain('OR')">OR</a>
        </li>
        <li v-show="viewAction">
          <a href="#!" @click="AddActionList">Action</a>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
import Vue from 'vue';
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
      viewAction: false,
      scheduler: [],
      name: '',
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
    AddTime() {
      const instance = new SensorInputClass({
        propsData: {
          placeholder: 'Time',
          cond: 'time',
        },
      });
      instance.$mount();
      this.$refs.container.appendChild(instance.$el);

      this.scheduler.push({
        type: 'time',
        item: instance,
      });

      this.viewTrigger = false;
      this.viewSensorCondition = false;
      this.viewChain = true;
      this.viewAction = true;
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
    // this.$http.get('/api/scheduler/add')
    //   .then((response) => {
    //     const res = response.data;
    //     this.gateways = res.data;

    //     Vue.nextTick(() => {
    //       const elems = document.querySelectorAll('select');
    //       const instances = window.M.FormSelect.init(elems, {});
    //     });
    //   });
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

