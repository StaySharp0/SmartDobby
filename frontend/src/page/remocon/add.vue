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
        <div class="center">
          <a class="btn-floating btn-large waves-effect waves-light blur dropdown-trigger"
            href='#!' data-target='addMacroRemocon'><i class="material-icons">add</i></a>
        </div>
        <ul id='addMacroRemocon' class='dropdown-content'>
          <li><a @click="searchRemocon">Search</a></li>
          <li><a @click="learnRemocon">Learn</a></li>
          <li><a @click="Submit">Submit</a></li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import Vue from 'vue';
import PageHeader from '@/components/Header';
import io from '@/router/io';

export default {
  name: 'page-Remocon-Add',
  components: {
    'page-header': PageHeader,
  },
  data() {
    return {
      gateways: [],
      resLearnListener: '',
      resTestListener: '',
      gid: '',
      name: '',
      model: '',
    };
  },
  methods: {
    searchRemocon() {
    },
    learnRemocon() {
      const socket = io.getSocket();

      this.resLearnListener = `res/remocon/update/info/${sid}`;
      // socket.on(this.resListener, this.resSubmit);
      socket.emit('req/remocon/learn', { gid: this.gid });
    },
    Submit() {
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
