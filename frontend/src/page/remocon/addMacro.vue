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
        </div>
        <div class="center">
          <a class="btn-floating btn-large waves-effect waves-light blur dropdown-trigger"
            href='#!' data-target='addMacroRemocon'><i class="material-icons">add</i></a>
        </div>
        <ul id='addMacroRemocon' class='dropdown-content'>
          <li><a href="#!" @click="AddRemoconList">Remocon</a></li>
          <li><a href="#!" @click="AddInterval">Interval</a></li>
          <li><a href="#!" @click="Submit">Submit</a></li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import PageHeader from '@/components/Header';

export default {
  name: 'page-Remocon-Add-Macro',
  components: {
    'page-header': PageHeader,
  },
  data() {
    return {
      name: '',
    };
  },
  methods: {
    AddRemoconList() {
    },
    AddInterval() {
    },
    Submit() {
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
