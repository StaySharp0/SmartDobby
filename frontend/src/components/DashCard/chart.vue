<template>
  <div class='col s12 m6'>
    <div class='card'>
      <div class='card-content'>
        <div class='card-title'>
          {{item.type}} 차트
          <a class='card-btn'>
            <i class='material-icons' :class="{'green-text': item.link}">autorenew</i>
          </a>
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
          labels: ['16:10', '16:20', '16:30', '16:40', '16:50', '17:00'],
          data: [12, 19, 3, 5, 2, 3],
        };
      },
    },
  },
  data() {
    return {
      id: null,
      chart: null,
    };
  },
  mounted() {
    this.id = `chart${this._uid}`;
    const chartData = {
      type: 'line',
      data: {
        labels: this.item.labels,
        datasets: [{
          label: this.item.name,
          data: this.item.data,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
        }],
      },
    };

    Vue.nextTick(() => {
      const ctx = document.getElementById(this.id).getContext('2d');
      const chart = new window.Chart(ctx, chartData);
      this.chart = chart;
    });
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
