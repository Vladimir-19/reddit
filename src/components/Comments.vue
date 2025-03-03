<template>
  <v-container>
    <v-row>
      <v-col v-for="comment in comments" :key="comment.id" cols="12" md="6">
        <v-card>
          <v-card-title>{{ comment.author }}</v-card-title>
          <v-card-subtitle>{{
            new Date(comment.created_at).toLocaleString()
          }}</v-card-subtitle>
          <v-card-text>
            <div>{{ comment.text }}</div>
            <div v-if="comment.image_url">
              <v-img :src="comment.image_url" />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="editComment(comment)">Edit</v-btn>
            <v-btn @click="deleteComment(comment.id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>Edit Comment</v-card-title>
        <v-card-text>
          <v-textarea v-model="editedComment.text" label="Comment Text" />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="editDialog = false">Cancel</v-btn>
          <v-btn text @click="saveComment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn color="primary" @click="addComment">Add Comment</v-btn>

    <v-dialog v-model="addDialog" max-width="500px">
      <v-card>
        <v-card-title>Add Comment</v-card-title>
        <v-card-text>
          <v-textarea v-model="newComment.text" label="Comment Text" />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="addDialog = false">Cancel</v-btn>
          <v-btn text @click="submitNewComment">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State variables
const comments = ref([]);
const editDialog = ref(false);
const addDialog = ref(false);
const newComment = ref({
  post_id: 1, // Hardcoded post ID for now
  text: "",
  author: "Admin",
  image_url: "",
});
const editedComment = ref({
  id: null,
  text: "",
});

// Fetch comments when component is mounted
onMounted(async () => {
  try {
    const response = await axios.get("/api/comments/1"); // Fetch comments for post_id 1
    comments.value = response.data;
  } catch (err) {
    console.error(err);
  }
});

// Methods
const addComment = () => {
  addDialog.value = true;
};

const submitNewComment = async () => {
  try {
    const response = await axios.post("/api/comments", newComment.value);
    comments.value.push(response.data);
    addDialog.value = false;
  } catch (err) {
    console.error(err);
  }
};

const editComment = (comment) => {
  editedComment.value = { ...comment };
  editDialog.value = true;
};

const saveComment = async () => {
  try {
    const response = await axios.put(
      `/api/comments/${editedComment.value.id}`,
      {
        text: editedComment.value.text,
      }
    );
    const index = comments.value.findIndex(
      (comment) => comment.id === editedComment.value.id
    );
    comments.value[index] = response.data;
    editDialog.value = false;
  } catch (err) {
    console.error(err);
  }
};

const deleteComment = async (commentId) => {
  try {
    await axios.delete(`/api/comments/${commentId}`);
    comments.value = comments.value.filter(
      (comment) => comment.id !== commentId
    );
  } catch (err) {
    console.error(err);
  }
};
</script>
