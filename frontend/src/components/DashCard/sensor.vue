<template>
  <div class="col s12 m6">
    <div class="card">
      <div class="card-content">
        <div class="card-title">
          {{item.type}}
          <a class="card-btn">
            <i class="material-icons"
              :class="{'green-text': item.link}"
              @click="refresh">
              autorenew
            </i>
          </a>
        </div>
        <div class="row" style="margin:0">
          <div class="data-value">
            <div class="value">{{item.value}}{{unitString}}</div>
          </div>
          <div class="data-script"><br>
            <div>{{item.name}}</div><br>
            <div>{{item.history}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from '@/router/io';
import Vue from 'vue';
import { updateLocale } from 'moment';

export default {
  name: 'card-sensor',
  props: {
    item: {
      type: Object,
      default() {
        return {
          gid: 1,
          sid: 1,
          history: 'YYYY.MM.DD HH:HH:SS',
          name: '테스트 온도센서',
          type: 'temperature',
          value: '16',
          period: '1h',
          link: true,
          chart: false,
          dashboard: true,
        };
      },
    },
  },
  data() {
    return {
      updateListenr: '',
    };
  },
  computed: {
    unitString() {
      const iconClass = {
        temperature: '°C',
        humidity: '%',
      };

      return iconClass[this.item.type];
    },
  },
  methods: {
    refresh() {
      const { gid, sid } = this.item;
      const socket = io.getSocket();

      if (socket) {
        socket.emit('req/sensor/refresh', { gid, sid });
      }
    },
  },
  created() {
    const { gid, sid } = this.item;
    const socket = io.getSocket();

    const updateListenr = `res/sensor/update/${sid}`;
    socket.on(updateListenr, (res) => {
      this.item.value = res.value;
      this.item.history = res.time;
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
