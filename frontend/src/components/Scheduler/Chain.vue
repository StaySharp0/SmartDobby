<template>
  <div class="row">
    <div class="col s12 center">
      <div style="font-weight:bold">{{chain}}</div>
      <i class="material-icons">keyboard_arrow_down</i>
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-Scheduler-Add-form-chain',
  props: ['chain'],
};
</script>
