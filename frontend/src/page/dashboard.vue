<template>
  <div>
    <page-header :small="true"/>
    <main>
      <div class="row">
        <card-sensor />
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
  data() {
    return {};
  },
  components: {
    'page-header': PageHeader,
    'card-sensor': CardSensor,
    'card-remocon': CardRemocon,
    'card-chart': CardChart,
  },
};
</script>
