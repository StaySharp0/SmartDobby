<template>
  <div>
    <page-header title="Macro Button" :middle="true" :menu="false" :close="true" />

    <main style="margin-bottom: 30px">
      <div class="container">
        <div class="row" style="margin-top:20px">
          <div class="input-field col s12">
            <input placeholder="Macro Name" id="name" type="text" v-model="name">
            <label for="name" class="active">Macro Name</label>
          </div>
          <ul class="collection" v-show="selected.length">
            <a class="collection-item"
              v-for="r in selected" :key="r.idx">
              {{r.name}}
            </a>
          </ul>
        </div>
        <div class="center">
          <a class="btn-floating btn-large waves-effect waves-light blur dropdown-trigger"
            href='#!' data-target='addMacroRemocon'><i class="material-icons">add</i></a>
        </div>
        <ul id='addMacroRemocon' class='dropdown-content'>
          <li><a @click="modalOpen">add</a></li>
          <li><a href="#!" @click="Submit">Submit</a></li>
        </ul>
      </div>
      <search-modal :eBus="eBus"/>
    </main>
  </div>
</template>

<script>
import Vue from 'vue';
import PageHeader from '@/components/Header';
import Modal from '@/components/Remocon/UserRemoconListModal';

const EventBus = new Vue();

export default {
  name: 'page-Remocon-Add-Macro',
  components: {
    'page-header': PageHeader,
    'search-modal': Modal,
  },
  data() {
    return {
      eBus: EventBus,
      name: '',
      selected: [],
    };
  },
  methods: {
    modalOpen() {
      this.eBus.$emit('UserRemoconListModalOpen', this.item);
    },
    selectedSearchRemocon(r) {
      this.selected.push(r);
    },
    Submit() {
      this.$http.post('/api/remocon/add/macro', {
        name: this.name,
        macro: this.selected,
      }).then((res) => {
        window.location.href = '#/Remocon';
      });
    },
  },
  created() {
    this.eBus.$on('selecteUserRemoconList', this.selectedSearchRemocon);
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
