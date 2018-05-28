 <template>
  <div class="row">
    <div class="input-field col s12">
      <input :placeholder="placeholder" id="value" type="text" v-model="value">
      <label for="value" class="active">{{cond}}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-Scheduler-Add-form-input',
  props: ['placeholder', 'cond'],
  data() {
    return {
      value: '',
    };
  },
  mounted() {
  },
};
</script>
