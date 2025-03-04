<template>
  <v-app>
    <v-main>
      <HomePage />
    </v-main>
    <CommentsList />
  </v-app>
</template>

<script setup>
import HomePage from "./components/HomePage.vue";
import CommentsList from "./components/CommentsList.vue";
</script>
