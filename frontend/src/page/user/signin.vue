<template>
  <div>
    <page-header title="Dobby" :menu="false"/>
    <div class="container">
      <div class="row">
        <br>
        <form class="col s12" @submit.prevent="sendPost">
          <div class="row">
            <div class="input-field col m6 s12">
              <input id="user_id" type="text" class="validate"
                     v-model="id">
              <label for="user_id">아이디</label>
            </div>
            <div class="input-field col m6 s12">
              <input id="user_passwd" type="password" class="validate"
                     v-model="passwd">
              <label for="user_passwd">비밀번호</label>
            </div>
          </div>
          <div class="row">
            <a href="signup" class="col s6 orange-text accent-2-text">Sign Up</a><br>
            <!-- <a href="#" class="col s6 orange-text accent-2-text">Find Password</a><br> -->
          </div>
          <button type="submit" name="action"
                  class="btn col s12 waves-effect waves-light">
            로그인 <i class="material-icons right">send</i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/Header';
import mt from 'moment';

export default {
  name: 'page-SignIn',
  data() {
    return {
      id: '',
      passwd: '',
    };
  },
  methods: {
    sendPost() {
      this.$http.post('/api/auth/signin', {
        id: this.id,
        passwd: this.passwd,
      }).then((res) => {
        const item = JSON.stringify({
          token: res.data.data,
          refreshTime: mt().add(7, 'days').valueOf(),
        });

        localStorage.setItem('dobby', item);
        location.href = '/';
        return res;
      }).catch((err) => {
        const res = err.response.data;
        window.alert(res.data.errMessage);
      });
    },
  },
  components: {
    'page-header': PageHeader,
  },
};
</script>
