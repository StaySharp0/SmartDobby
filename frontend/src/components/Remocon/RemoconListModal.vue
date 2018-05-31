<template>
  <div id="RemoconListModal" class="modal bottom-sheet">
    <div class="modal-content">
      <h4>Remocon Search</h4>
      <div class="row">
        <div class="input-field col s12">
          <input placeholder="Remocon Name" id="name" type="text" v-model="searchName">
          <label for="searchName" class="active">Remocon Name</label>
        </div>
      </div>
      <ul class="collection"
          v-show="resSearchNmae.length"
          v-for="s in resSearchNmae" :key="s.idx">
        <a class="collection-item" @click="selecteSiganl(s)">
          {{s.name}}
          <span class="badge">{{s.model}}</span>
        </a>
      </ul>
    </div>
    <div class="modal-footer">
      <a class="modal-action modal-close waves-effect waves-green btn-flat">확인</a>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import io from '@/router/io';

export default {
  name: 'remocon-add-list-modal',
  props: {
    eBus: {
      type: Object,
    },
  },
  data() {
    return {
      instance: '',
      resListener: '',

      searchName: '',
      resSearchNmae: [],
      selectedSiganl: '',
    };
  },
  watch: {
    searchName(val) {
      if (val.length) {
        this.$http.get(`/api/remocon/signal/list?search=${val}`)
          .then((res) => {
            this.resSearchNmae = res.data.data;
          });
      }
    },
  },
  methods: {
    selecteSiganl(s) {
      this.instance.close();
      this.searchName = '';
      this.resSearchNmae = [];

      this.eBus.$emit('selecteRemoconList', { rid: s.idx, model: s.model });
    },
    open(item) {
      this.$nextTick(() => {
        this.instance.open();
      });
    },
  },
  created() {
    this.eBus.$on('RemoconListModalOpen', this.open);
  },
  mounted() {
    const elem = document.querySelector('#RemoconListModal');
    this.instance = window.M.Modal.init(elem, { dismissible: false });
  },
};
</script>

<style scope>
  .modal.bottom-sheet {
    max-height: 65%;
  }
  .modal .modal-content {
    padding-bottom: 0;
  }
  .collection {
    max-height: 190px;
    overflow-y: scroll;
  }
</style>
