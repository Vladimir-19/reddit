<template>
  <NavBar />

  <v-container>
    <!-- Posts Section -->
    <v-row class="justify-center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="post-card" outlined>
          <v-card-title class="headline">First Post</v-card-title>
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero.
          </v-card-text>
        </v-card>

        <v-card class="post-card" outlined>
          <v-card-title class="headline">Second Post</v-card-title>
          <v-card-text>
            Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh
            elementum imperdiet.
          </v-card-text>
        </v-card>

        <v-card class="post-card" outlined>
          <v-card-title class="headline">Third Post</v-card-title>
          <v-card-text>
            Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue
            semper porta. Mauris massa.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// import { ref } from "vue";
import NavBar from "./NavBar.vue";

// const loaded = ref(false);
// const loading = ref(false);
</script>

<style scoped>
.post-card {
  margin-bottom: 20px;
}
</style>
