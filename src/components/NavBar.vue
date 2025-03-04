<template>
  <v-app-bar app>
    <div>
      <img src="/logo.png" alt="Logo" class="logo" />
    </div>

    <v-spacer></v-spacer>

    <v-row
      no-gutters
      class="d-flex align-center"
      justify="center"
      style="width: 100%"
    >
      <v-col cols="12">
        <v-text-field
          append-inner-icon="mdi-magnify"
          label="Search templates"
          single-line
          @click:append-inner="onClick"
          hide-details
          full-width
          class="rounded-text-field"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-btn text @click="goHome">Home</v-btn>
    <v-btn text @click="goAbout">About</v-btn>
    <v-btn text @click="goContact">Contact</v-btn>
  </v-app-bar>
</template>

<script setup>
const goHome = () => {
  //   router.push({ name: "home" });
};

const goAbout = () => {
  //   router.push({ name: "about" });
};

const goContact = () => {
  //   router.push({ name: "contact" });
};

const onClick = () => {
  console.log("Search clicked!");
};
</script>

<style scoped>
.logo {
  margin: 16px;
  width: 130px;
  height: 80px;
}

.v-app-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.v-row {
  width: 100%;
}

.v-btn {
  text-transform: none;
}
</style>
