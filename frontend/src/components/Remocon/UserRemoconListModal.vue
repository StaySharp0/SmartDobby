<template>
  <div id="UserRemoconListModal" class="modal bottom-sheet">
    <div class="modal-content">
      <h4>Remocon List</h4>
      <ul class="collection" v-show="list.length">
        <a class="collection-item"
          v-for="r in list" :key="r.idx"
          @click="selecteSiganl(r)">
          {{r.name}}
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
  name: 'remocon-add-userList-modal',
  props: {
    eBus: {
      type: Object,
    },
  },
  data() {
    return {
      instance: '',
      list: [],
    };
  },
  methods: {
    selecteSiganl(r) {
      this.instance.close();

      this.eBus.$emit('selecteUserRemoconList', { rid: r.idx, name: r.name });
    },
    open(item) {
      this.$nextTick(() => {
        this.instance.open();
      });
    },
  },
  created() {
    this.eBus.$on('UserRemoconListModalOpen', this.open);
    this.$http.get('/api/remocon/list').then((res) => {
      this.list = res.data.data;
    });
  },
  mounted() {
    const elem = document.querySelector('#UserRemoconListModal');
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
