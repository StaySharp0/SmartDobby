<template>
  <div>
    <page-header title="New Macro Button" :small="true" :menu="false" :close="true" />

    <main>
      <div class="container">
        <div class="row" style="margin-top: 30px">
          <a class="waves-effect waves-light btn btn-rounding">4층 에어컨 전원 버튼</a>
        </div>
        <div class="row" style="margin-top: 10px">
          <div class="input-field offset-s3 col s6">
            <i class="material-icons prefix">timer</i>
            <input id="icon_telephone" type="number" class="validate">
            <label for="icon_telephone">period</label>
          </div>
        </div>
        <div class="row" style="margin-top: 30px">
          <a class="waves-effect waves-light btn btn-rounding">5층 에어컨 전원 버튼</a>
        </div>
        <div class="row" style="margin-top: 10px">
          <div class="input-field offset-s3 col s6">
            <i class="material-icons prefix">timer</i>
            <input id="icon_telephone" type="number" class="validate">
            <label for="icon_telephone">period</label>
          </div>
        </div>
        <div class="row" style="margin-top: 10px">
          <a href="#modal1" class="waves-effect  btn btn-rounding dash  modal-trigger">+</a>
        </div>
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
.dropdown-content li>a, .dropdown-content li>span {
	color: #666;
}
</style>
