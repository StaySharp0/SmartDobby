 <template>
  <div class="row" style="margin-bottom:0">
    <div class="input-field col s12">
      <!-- <select v-model="selected">
        <optgroup v-for="g in gateways" :key="g.id" :label="g.name">
          <option v-for="s in g.sensor" :key="s._id" :value="s._id">{{s.name}}</option>
        </optgroup>
      </select>
      <label>Sensor</label> -->
      <select class="action-list">
        <optgroup label="테스트 건물">
            <option value="1">Option 1 </option>
            <option value="2">Option 2</option>
        </optgroup>
        <optgroup label="테스트 건물">
            <option value="3">Option 3</option>
            <option value="4">Option 4</option>
        </optgroup>
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
      gateways: [],
    };
  },
  created() {
    // this.$http.get('/api/page/dashboard')
    //   .then((response) => {
    //     const res = response.data;
    //     this.gateways = res.data;

    //     Vue.nextTick(() => {
    //       const elems = document.querySelectorAll('select');
    //       const instances = window.M.FormSelect.init(elems, {});
    //     });
    //   });
  },
  mounted() {
    Vue.nextTick(() => {
      const elems = document.querySelectorAll('select');
      const instances = window.M.FormSelect.init(elems, {});
    });
  },
};
</script>
