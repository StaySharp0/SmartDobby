<template>
  <div>
    <page-header title="Scheduler"/>

    <main>
      <div class="container">
        <div class="row" style="margin-top: 30px">
          <a class="waves-effect waves-light btn btn-rounding">강의시간 전 5층 에어컨 동작</a>
        </div>
      </div>
      <div class="center">
        <a class="btn-floating btn-large waves-effect waves-light blur dropdown-trigger"
           href='#/Scheduler/Add'><i class="material-icons">add</i></a>
      </div>
    </main>
  </div>
</template>

<script>
import PageHeader from '@/components/Header';

export default {
  name: 'page-Scheduler',
  data() {
    return {};
  },
  components: {
    'page-header': PageHeader,
  },
  created() {
    // this.$http.get('/api/scheduler/list')
    //   .then((response) => {
    //   });
  },
};
</script>

<style>
  .btn-rounding{
    margin-bottom: 10px;
    width: 100%;
    -webkit-box-shadow: none;
    box-shadow: none;
    background-color: transparent;
    color: #343434;
    cursor: pointer;
    border: 1px solid #343434;
    border-radius: 20px;
    -webkit-transition: background-color .2s;
    transition: background-color .2s;
  }

  .btn-floating.blur{
    background: rgba(233,233,233,.2);
  }

  .blur i{
    color: #666;
  }

  .dropdown-content {
    margin-top: 60px!important;
    margin-left: -21px!important;
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
