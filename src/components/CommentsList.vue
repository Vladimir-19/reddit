<template>
  <v-container>
    <!-- Posts Section -->
    <v-row class="justify-center">
      <v-col v-for="comment in comments" :key="comment.id" cols="12" md="10">
        <v-card outlined rounded="lg">
          <v-card-subtitle>
            <a :href="'/'" class="author-link" style="color: black">
              {{ comment.author }}
            </a>
            {{
              new Date(comment.date).toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, // format (AM/PM)
              })
            }}
          </v-card-subtitle>

          <v-card-text class="comment-text">
            <h2>{{ comment.text }}</h2>

            <div v-if="comment.image">
              <v-img :src="comment.image" />
            </div>
          </v-card-text>

          <v-card-actions class="d-flex justify-space-between">
            <div>
              <v-btn
                icon="mdi-pencil-outline"
                @click="editComment(comment.id)"
              ></v-btn>
              <v-btn
                icon="mdi-delete-outline"
                @click="deleteComment(comment.id)"
              ></v-btn>
            </div>
            <div>
              <v-btn
                :color="comment.likes > 0 ? 'blue' : 'gray'"
                @click="toggleLike(comment)"
                :icon="true"
                rounded
              >
                <v-icon>{{
                  comment.likes > 0 ? "mdi-heart" : "mdi-heart-outline"
                }}</v-icon>
              </v-btn>
              <span :style="{ color: comment.likes > 0 ? 'blue' : 'black' }">
                {{ comment.likes }}
              </span>
            </div>
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
  id: Math.floor(Math.random() * 1000) + 1, // Hardcoded post ID for now
  text: "",
  author: "Admin",
  image: "",
  likes: 0, // Initialize likes property
});
const editedComment = ref({
  id: null,
  text: "",
});

function toggleLike(comment) {
  comment.likes = comment.likes > 0 ? 0 : 1; // Toggle between liked (1) and unliked (0)
}

// Fetch comments when component is mounted
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3031/api/comments"); // Fetch comments for post_id 1
    comments.value = response.data.map((comment) => ({
      ...comment,
      likes: comment.likes || 0, // Ensure likes property is available
    }));
  } catch (err) {
    console.error("?err", err);
  }
});

// Methods
const addComment = () => {
  addDialog.value = true;
};

const submitNewComment = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3031/api/comments",
      newComment.value
    );
    comments.value.push(response.data);
    addDialog.value = false;
  } catch (err) {
    console.error(err);
  }
};

const editComment = (commentId) => {
  editedComment.value = { ...comments.value.find((c) => c.id === commentId) };
  editDialog.value = true;
};

const saveComment = async () => {
  try {
    const response = await axios.put(
      `http://localhost:3031/api/comments/${editedComment.value.id}`,
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
    await axios.delete(`http://localhost:3031/api/comments/${commentId}`);
    comments.value = comments.value.filter(
      (comment) => comment.id !== commentId
    );
  } catch (err) {
    console.error(err);
  }
};
</script>
