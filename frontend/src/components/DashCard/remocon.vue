<template>
  <div class="col s12 m6">
    <div class="card">
      <div class="card-content">
        <div class="card-title">
          {{item.type}}
          <a class="card-btn">
            <i class="material-icons" :class="{'green-text': item.link}">autorenew</i>
          </a>
        </div>
        <div class="row" style="margin:0">
          <div class="data-value">
            <a class="btn-floating waves-effect waves-light red">
              <i class="material-icons">settings_remote</i>
            </a>
          </div>
          <div class="data-script"><br>
            <div>{{item.name}}</div><br>
            <div>{{item.descript}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card-remocon',
  props: {
    item: {
      type: Object,
      default() {
        return {
          name: '5층 PC실 에어컨',
          type: '리모콘',
          link: true,
          value: '16°C',
          descript: '에어컨 전원 버튼',
        };
      },
    },
  },
};
</script>

<style>
.card .card-content {
  padding-top: 10px
}
.card .card-content .card-title {
  padding-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid rgba(0,0,0,0.14);
}
.card .card-btn {
  position: absolute;
  right: 15px;
  color: #333
}

.data-value {
  position: relative;
  float: left;
  width: 30%; height: 0;
  padding-bottom: 30%;
}
.data-value .value {
  position: absolute;
  text-align: center;
  width: 88px;
  font-size: 24px;
  color: #ffab40;
  top: calc(50% - 18px);
  left: calc(50% - 44px);
}

.data-value .btn-floating {
  width: 80px; height: 80px;
  position: absolute;
  top: calc(50% - 40px);
  left: calc(50% - 40px);
}
.data-value .btn-floating i {
  font-size: 36px; line-height: 80px;
}
.data-script {
  position: relative;
  float: left;
  width: 65%;
  margin-left: 5%;
  text-align: center;
}
</style>
