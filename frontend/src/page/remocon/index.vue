<template>
  <div>
    <page-header title="Remocon"/>

    <main>
      <div class="container">
        <div class="row" style="margin-top: 30px">
          <a class="waves-effect waves-light btn btn-rounding">4층 에어컨 전원 버튼</a>
          <a class="waves-effect waves-light btn btn-rounding">5층 에어컨 전원 버튼</a>
      </div>
      <div class="center">
        <a class="btn-floating btn-large waves-effect waves-light blur dropdown-trigger"
           href='#' data-target='addNewRemocon'><i class="material-icons">add</i></a>
      </div>
      <ul id='addNewRemocon' class='dropdown-content'>
        <li><a href="#!">새 리모컨</a></li>
        <li><a href="#/Remocon/Macro/add">매크로</a></li>
      </ul>
    </div>
    </main>
  </div>
</template>

<script>
import PageHeader from '@/components/Header';

export default {
  name: 'page-Remocon',
  data() {
    return {};
  },
  components: {
    'page-header': PageHeader,
  },
  mounted() {
    const elems = document.querySelectorAll('.dropdown-trigger');
    const instances = window.M.Dropdown.init(elems, {});
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

  .btn-rounding:hover,
  .btn-floating.blur {
    background: rgba(233,233,233,.2);
  }

  .blur i{
    color: #666;
  }

  #addNewRemocon {
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
