<template>
  <div>
    <page-header title="New Remocon" :middle="true" :menu="false" :close="true" />

    <main style="margin-bottom: 30px">
      <div class="container">
        <div class="row" style="margin-top:20px">
          <div class="input-field col s12">
            <select v-model="gid">
              <option v-for="g in gateways" :key="g.gid" :value="g.gid">{{g.name}}</option>
            </select>
            <label>Gateway</label>
          </div>
          <div class="input-field col s12">
            <input placeholder="Remocon Name" id="name" type="text" v-model="name">
            <label for="name" class="active">Remocon Name</label>
          </div>
          <div class="input-field col s12">
            <input placeholder="Model Name" id="model" type="text" v-model="model">
            <label for="model" class="active">Model Name</label>
          </div>
        </div>
        <div class="center" v-show="viewAdd">
          <a class="btn-floating btn-large waves-effect waves-light blur dropdown-trigger"
            href='#!' data-target='addMacroRemocon'><i class="material-icons">add</i></a>
        </div>
        <div class="center" v-show="viewSubmit">
          <a class="btn-floating btn-large waves-effect waves-light blur"
            @click="submitSearchButton"><i class="material-icons">send</i></a>
        </div>
        <ul id='addMacroRemocon' class='dropdown-content'>
          <li><a @click="modalOpen">Search</a></li>
          <li><a @click="learnRemocon">Learn</a></li>
          <!-- <li><a @click="Submit">Submit</a></li> -->
        </ul>
      </div>
      <serch-modal :eBus="eBus"/>
    </main>
  </div>
</template>

<script>
import Vue from 'vue';
import PageHeader from '@/components/Header';
import Modal from '@/components/Remocon/RemoconListModal';
import io from '@/router/io';

const EventBus = new Vue();

export default {
  name: 'page-Remocon-Add',
  components: {
    'page-header': PageHeader,
    'serch-modal': Modal,
  },
  data() {
    return {
      eBus: EventBus,
      gateways: [],
      resLearnListener: '',
      resTestListener: '',
      gid: '',
      rid: -1,
      name: '',
      model: '',

      viewAdd: true,
      viewSubmit: false,
    };
  },
  methods: {
    selectedSearchRemocon(item) {
      this.rid = item.rid;
      this.model = item.model;
      this.viewAdd = false;
      this.viewSubmit = true;
    },
    learnRemocon() {
      const socket = io.getSocket();

      // this.resLearnListener = `res/remocon/update/info/${sid}`;
      // // socket.on(this.resListener, this.resSubmit);
      socket.emit('req/remocon/learn', { gid: this.gid });
    },
    submitSearchButton() {
      console.log('submitSearchButton', { gid: this.gid, rid: this.rid, name: this.name });

      this.$http.post('/api/remocon/add/legacy', {
        gid: this.gid,
        rid: this.rid,
        name: this.name,
      }).then((res) => {
        window.location.href = '#/Remocon';
      });
    },
    modalOpen() {
      this.eBus.$emit('RemoconListModalOpen', this.item);
    },
  },
  created() {
    this.$http.get('/api/gateway/list')
      .then((response) => {
        const res = response.data;
        this.gateways = res.data;

        Vue.nextTick(() => {
          const elems = document.querySelectorAll('select');
          const instances = window.M.FormSelect.init(elems, {});
        });
      });

    this.eBus.$on('selecteRemoconList', this.selectedSearchRemocon);
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

#addMacroRemocon {
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
