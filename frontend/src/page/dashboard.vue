<template>
  <div>
    <page-header :small="true"/>
    <main>
      <div v-for="g in gateways" :key="g.id">
        <h3>{{g.name}}</h3>
        <div class="row" v-for="sensor in g.sensor" :key="sensor._id">
          <card-sensor :item="sensor"/>
          <card-chart v-if="sensor.chart" :item="sensor"/>
          <!-- <card-remocon /> -->
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import PageHeader from '@/components/Header';
import CardSensor from '@/components/DashCard/sensor';
import CardRemocon from '@/components/DashCard/remocon';
import CardChart from '@/components/DashCard/chart';

export default {
  name: 'page-DashBoard',
  created() {
    this.$http.get('/api/page/dashboard')
      .then((response) => {
        const res = response.data;
        this.gateways = res.data;
      });
  },
  data() {
    return {
      gateways: [],
    };
  },
  components: {
    'page-header': PageHeader,
    'card-sensor': CardSensor,
    'card-remocon': CardRemocon,
    'card-chart': CardChart,
  },
};
</script>

<style>
  h3 {
    padding-left: 1rem;
    font-size: 1.65rem;
  }
</style>
