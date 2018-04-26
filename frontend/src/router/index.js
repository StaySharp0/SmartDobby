import Vue from 'vue';
import Router from 'vue-router';
import _ from 'lodash';
import mt from 'moment';

import SignIn from '@/page/user/signin';
import SignUp from '@/page/user/signup';
import MyPage from '@/page/user/mypage';

import DashBoard from '@/page/dashboard';
// import Remocon from '@/page/remocon/index';
// import RemoconAdd from '@/page/remocon/add';

Vue.use(Router);

const inLogin = ['SignIn', 'SignUp'];
const verifyJWTinRouter = (to, from, next) => {
  const jwt = JSON.parse(localStorage.getItem('dobby'));
  const loginless = _.indexOf(inLogin, to.name) !== -1;

  if (jwt) {
    const now = mt().valueOf();

    // Refresh Token
    if (now > jwt.refreshTime) {
      Vue.prototype.$http.get('/api/auth/refresh', {
        headers: { 'x-access-token': jwt.token },
      }).then((res) => {
        const item = JSON.stringify({
          token: res.data.data,
          refreshTime: mt().add(7, 'days').valueOf(),
        });

        localStorage.setItem('dobby', item);
      });
    }

    if (loginless) next('/');
    else next();
  } else if (loginless) next();
  else next('/signin');
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'DashBoard',
      component: DashBoard,
      beforeEnter: verifyJWTinRouter,
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      beforeEnter: verifyJWTinRouter,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      beforeEnter: verifyJWTinRouter,
    },
    {
      path: '/Mypage',
      name: 'MyPage',
      component: MyPage,
      beforeEnter: verifyJWTinRouter,
    },
    // {
    //   path: '/Remocon',
    //   name: 'Remocon',
    //   component: Remocon,
    // },
    // {
    //   path: '/Remocon/add',
    //   name: 'RemoconAdd',
    //   component: RemoconAdd,
    // },
  ],
});
