<template>
  <v-app id="main" :style="{background: $vuetify.theme.themes[theme].background}">
    <v-app-bar app color="primary">
      <v-toolbar-title class="headline text-uppercase">
          <span>Secret</span>
          <span class="font-weight-light">HITLER</span>
        </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  computed:{
    theme(){
      return 'light'
    }
  }
};
</script>
