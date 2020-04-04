<template>
  <v-app>
    <v-app-bar app color="primary" dark>Secret Hitler</v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App'
};
</script>
