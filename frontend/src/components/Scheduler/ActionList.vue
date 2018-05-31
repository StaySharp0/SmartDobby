 <template>
  <div class="row" style="margin-bottom:0">
    <div class="input-field col s12">
      <select v-model="selected">
        <option v-for="r in remocon" :key="r.rid" :value="r.rid">{{r.name}}</option>
      </select>
      <label>Action</label>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'page-Scheduler-Add-form-ActionList',
  data() {
    return {
      selected: '',
      remocon: [],
    };
  },
  created() {
    this.$http.get('/api/remocon/list')
      .then((res) => {
        this.remocon = res.data.data;

        Vue.nextTick(() => {
          const elems = document.querySelectorAll('select');
          const instances = window.M.FormSelect.init(elems, {});
        });
      });
  },
  mounted() {
    Vue.nextTick(() => {
      const elems = document.querySelectorAll('select');
      const instances = window.M.FormSelect.init(elems, {});
    });
  },
};
</script>
