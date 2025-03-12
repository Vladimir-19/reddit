<template>
  <v-container>
    <v-row class="justify-center">
      <v-col v-for="comment in comments" :key="comment.id" cols="12" md="10">
        <v-card outlined rounded="lg">
          <v-card-subtitle>
            <a :href="'/'" class="author-link" style="color: black">
              {{ comment.author }}
              {{
                comment.parent
                  ? "Replying to " + comment.parent
                  : "Main Comment"
              }}
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
        <!-- Render Replies Recursively -->
        <v-row v-if="comment.replies.length > 0" class="ml-5">
          <v-col
            v-for="reply in comment.replies"
            :key="reply.id"
            cols="12"
            md="10"
          >
            <v-card outlined rounded="lg">
              <v-card-subtitle>
                <a :href="'/'" class="author-link" style="color: black">
                  {{ reply.author }}
                </a>
                {{
                  new Date(reply.date).toLocaleString("en-US", {
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
                <h2>{{ reply.text }}</h2>

                <div v-if="reply.image">
                  <v-img :src="reply.image" />
                </div>
              </v-card-text>

              <v-card-actions class="d-flex justify-space-between">
                <div>
                  <v-btn
                    icon="mdi-pencil-outline"
                    @click="editComment(reply.id)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete-outline"
                    @click="deleteComment(reply.id)"
                  ></v-btn>
                </div>
                <div>
                  <v-btn
                    :color="reply.likes > 0 ? 'blue' : 'gray'"
                    @click="toggleLike(reply)"
                    :icon="true"
                    rounded
                  >
                    <v-icon>{{
                      reply.likes > 0 ? "mdi-heart" : "mdi-heart-outline"
                    }}</v-icon>
                  </v-btn>
                  <span :style="{ color: reply.likes > 0 ? 'blue' : 'black' }">
                    {{ reply.likes }}
                  </span>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Edit and Add Dialogs -->
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
  comment.likes = comment.likes > 0 ? 0 : 1;
}

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3031/api/comments");
    const allComments = response.data.map((comment) => ({
      ...comment,
      likes: comment.likes || 0,
    }));

    const commentsMap = allComments.reduce((map, comment) => {
      map[comment.id] = { ...comment, replies: [] };
      return map;
    }, {});

    const commentsWithReplies = [];
    allComments.forEach((comment) => {
      if (comment.parent) {
        commentsMap[comment.parent].replies.push(comment);
      } else {
        commentsWithReplies.push(commentsMap[comment.id]);
      }
    });

    comments.value = commentsWithReplies;
  } catch (err) {
    console.error("?err", err);
  }
});

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
