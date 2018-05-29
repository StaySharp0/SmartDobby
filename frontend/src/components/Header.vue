<template>
  <header>
    <nav class="top-nav" :class="{ 'middle':middle, 'small':small }">
      <div class="container">
        <div class="nav-wrapper">
          <h2 class="header center">{{title}}</h2>
        </div>
        <a data-target="nav-mobile"
           class="top-nav left-btn sidenav-trigger full">
          <i v-if="menu" class="material-icons">menu</i>
        </a>
        <a class="top-nav right-btn" @click="backPage">
          <i v-if="close" class="material-icons">close</i>
        </a>
      </div>
    </nav>
    <ul id="nav-mobile" class="sidenav">
      <li><div class="user-view">
        <div class="background">
          <img src="../assets/office.jpeg">
        </div>
        <a href="#!name"><span class="white-text name">{{name}}</span></a>
        <a href="#!email"><span class="white-text email">{{email}}</span></a>
      </div></li>
      <!-- <li><a href="#!"><i class="material-icons">cloud</i>First Link With Icon</a></li> -->
      <!-- <li><a class="subheader">Subheader</a></li> -->
      <li><a class="waves-effect" href="#/" @click="pageMove">DashBoard</a></li>
      <li><a class="waves-effect" href="#/Remocon" @click="pageMove">Remocon</a></li>
      <li><a class="waves-effect" href="#/Scheduler" @click="pageMove">Scheduler</a></li>
      <li><a class="waves-effect" href="#/Mypage" @click="pageMove">MyPage</a></li>
      <li><div class="divider"></div></li>
      <li><a @click="logout">Logout</a></li>
    </ul>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: String,
    small: {
      type: Boolean,
      default: false,
    },
    middle: {
      type: Boolean,
      default: false,
    },
    menu: {
      type: Boolean,
      default: true,
    },
    close: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
      name: '',
      Sidenav: '',
    };
  },
  created() {
    const jwtInfo = JSON.parse(localStorage.getItem('dobbyInfo'));
    const jwt = JSON.parse(localStorage.getItem('dobby'));

    if (!jwtInfo && jwt) {
      this.$http.get('/api/auth/info', {
        headers: { 'x-access-token': jwt.token },
      }).then((res) => {
        const { data } = res.data;
        const item = {
          email: data.email,
          name: data.name,
        };
        this.email = item.email;
        this.name = item.name;

        localStorage.setItem('dobbyInfo', JSON.stringify(item));
      });
    } else if (jwtInfo) {
      this.email = jwtInfo.email;
      this.name = jwtInfo.name;
    }
  },
  mounted() {
    const elem = document.querySelector('.sidenav');
    this.Sidenav = window.M.Sidenav.init(elem, {});
  },
  methods: {
    logout() {
      localStorage.removeItem('dobby');
      localStorage.removeItem('dobbyInfo');
      location.replace('/signin');
    },
    backPage() {
      history.back();
    },
    pageMove() {
      this.Sidenav.close();
    },
  },
};
</script>

<style scoped>
  nav {
    color: #fff;
    background-color: #ee6e73;
    width: 100%;
    height: 56px;
    line-height: 56px;
  }
  nav.top-nav {
    height: 112px;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-bottom: 1px solid rgba(0,0,0,0.14);
    background-color: transparent;
  }
  nav.top-nav .container {
    margin: 0 65px;
    height: 100%;
    width: auto;
  }
  nav.top-nav h2.header {
    margin: 0;
    padding-top: 26px;color: #ee6e73;
    font-weight: 400;
  }
  nav.top-nav.middle h2.header {
    padding-top: 36px;
    font-size: 2.6rem;
  }
  nav.top-nav.small { height: 56px; }
  nav.top-nav.small .container { margin: 0 55px; }
  nav.top-nav.small h2.header {
    padding-top: 14px;
    font-size: 1.6rem;
  }

  nav.top-nav .left-btn,
  nav.top-nav .right-btn {
    position: absolute;
    top: 30px;
    height: 56px;
    margin: 0 18px;
    color: #ee6e73
  }
  nav.top-nav .left-btn { left: 5px; }
  nav.top-nav .right-btn { right: 5px; }
  nav.top-nav.small .left-btn,
  nav.top-nav.small .right-btn { top: 0; }
</style>
