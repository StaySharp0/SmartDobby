<template>
  <div>
    <page-header :small="true"/>
    <main>
      <div class="row">
        <div v-for="sensor in sensorList" :key="sensor._id">
          <card-sensor :item="sensor"/>
        </div>
        <card-remocon />
        <card-chart />
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
    const jwt = JSON.parse(localStorage.getItem('dobby'));

    this.$http.get('/api/sensor/list')
      .then((response) => {
        const res = response.data;
        this.sensorList = res.data;
      });
  },
  data() {
    return {
      sensorList: [],
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
