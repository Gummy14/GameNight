import Vue from 'vue';
import Vuetify from 'vuetify/lib';
Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#f2654b',
        background: '#fbb969',
      }
    }
  },
  icons: {
    iconfont: 'mdi',
  }
});
