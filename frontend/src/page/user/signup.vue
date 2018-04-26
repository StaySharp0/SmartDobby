<template>
  <div>
    <page-header title="Dobby" :menu="false" :close="true"/>
    <div class="container">
      <div class="row">
        <br>
        <form class="col s12" @submit.prevent="sendPost">
          <div class="row">
            <div class="input-field col m6 s12">
              <input id="user_id" type="email" class="validate"
                     placeholder="이메일"
                     v-model="id">
              <label for="user_id">아이디</label>
            </div>
            <div class="input-field col m6 s12">
              <input id="user_passwd" type="password" class="validate"
                     placeholder="영문(대소문자) 및 숫자 조합 6 ~ 20자"
                     v-model="passwd">
              <label for="user_passwd">비밀번호</label>
            </div>
            <div class="input-field col m6 s12">
              <input id="user_confirm" type="password" class="validate"
                     placeholder=" "
                     v-model="confirm">
              <label for="user_confirm">비밀번호 재입력</label>
            </div>
            <div class="input-field col m6 s12">
              <input id="user_name" type="text" class="validate"
                     placeholder=" "
                     v-model="name">
              <label for="user_name">이름</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col m6 s12">
              <input id="user_passwd_problem" type="text" class="validate"
                     placeholder="가장 좋아하는 동물은?"
                     v-model="passwd_problem">
              <label for="user_passwd_problem">비밀번호 질문</label>
            </div>
            <div class="input-field col m6 s12">
              <input id="user_passwd_solution" type="text" class="validate"
                     placeholder="고양이"
                     v-model="passwd_solution">
              <label for="user_passwd_solution">비밀번호 답변</label>
            </div>
          </div>
          <button type="submit" name="action"
                  class="btn col s12 waves-effect waves-light">
            회원가입 <i class="material-icons right">send</i>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/Header';


export default {
  name: 'page-SignUp',
  data() {
    return {
      id: '',
      passwd: '',
      confirm: '',
      name: '',
      passwd_problem: '',
      passwd_solution: '',
    };
  },
  methods: {
    sendPost() {
      this.$http.post('/api/auth/signup', {
        id: this.id,
        passwd: this.passwd,
        confirm: this.confirm,
        name: this.name,
        passwd_problem: this.passwd_problem,
        passwd_solution: this.passwd_solution,
      }).then((res) => {
        window.alert('회원가입을 축하드립니다.');
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
