<template>
  <v-app>
    <v-main>
      <HelloWorld />
    </v-main>
    <CommentsList />
  </v-app>
</template>

<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import CommentsList from "./components/CommentsList.vue";
</script>
