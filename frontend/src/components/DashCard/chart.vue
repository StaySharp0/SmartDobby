<template>
  <div class='col s12 m6'>
    <div class='card'>
      <div class='card-content'>
        <div class='card-title'>
          {{item.name}} 차트
        </div>
        <div class='row' style='margin:0'>
          <canvas :id='id'></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import mmnt from 'moment';
import _ from 'lodash';
import io from '@/router/io';

export default {
  name: 'card-chart',
  props: {
    item: {
      type: Object,
      default() {
        return {
          name: '5층 PC실 온도',
          type: '온도계',
          link: true,
          labels: [],
          data: [],
        };
      },
    },
  },
  data() {
    return {
      updateListenr: '',
      id: null,
      chart: null,
      chartData: {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: this.item.type,
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
          }],
        },
      },
      labels: [],
      data: [],
    };
  },
  created() {
    this.id = `chart${this._uid}`;

    this.$http.get(`/api/sensor/chart?sid=${this.item.sid}`)
      .then((response) => {
        const res = response.data;
        this.chartData.data.labels = _.map(res.data, c => mmnt(c.time, 'YYYY.MM.DD HH:mm:ss').format('HH:mm:ss'));
        this.chartData.data.datasets[0].data = _.map(res.data, c => c.value);

        Vue.nextTick(() => {
          const ctx = document.getElementById(this.id).getContext('2d');
          const chart = new window.Chart(ctx, this.chartData);
          this.chart = chart;
        });
      });

    const { sid } = this.item;
    const socket = io.getSocket();

    const updateListenr = `res/sensor/update/${sid}`;
    socket.on(updateListenr, (res) => {
      this.chart.data.labels.pop();
      this.chart.data.labels.push(mmnt(res.time, 'YYYY.MM.DD HH:mm:ss').format('HH:mm:ss'));

      this.chart.data.datasets[0].data.pop();
      this.chart.data.datasets[0].data.push(res.value);

      this.chart.update();
    });
    this.updateListenr = updateListenr;
  },
  destroyed() {
    const socket = io.getSocket();

    if (socket) {
      socket.off(this.updateListenr);
    }
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
</style>
