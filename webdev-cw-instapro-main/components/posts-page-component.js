import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost } from "../api.js";
import { formatDistanceToNow, formatLikes } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${posts.map((post) => {
          return `
            <li class="post">
              <div class="post-header" data-user-id="${post.user.id}">
                <img src="${post.user.imageUrl}" class="post-header__user-image">
                <p class="post-header__user-name">${post.user.name}</p>
              </div>
              <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}">
              </div>
              <div class="post-likes">
                <button data-post-id="${post.id}" class="like-button">
                  <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
                </button>
                <p class="post-likes-text">
                  ${formatLikes(post.likes)}
                </p>
              </div>
              <p class="post-text">
                <span class="user-name">${post.user.name}</span>
                ${post.description}
              </p>
              <p class="post-date">
                ${formatDistanceToNow(post.createdAt)}
              </p>
            </li>
          `;
        }).join('')}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeButtonEl of document.querySelectorAll(".like-button")) {
    likeButtonEl.addEventListener("click", (event) => {
      event.stopPropagation();

      const postId = likeButtonEl.dataset.postId;
      const post = posts.find((post) => post.id === postId);

      if (!user) {
        alert("Вы должны быть авторизованы чтобы ставить лайки.");
        return;
      }

      if (post.isLiked) {
        dislikePost({ token: `Bearer ${user.token}`, postId })
          .then(({ post: updatedPost }) => {
            const postIndex = posts.findIndex((p) => p.id === postId);
            if (postIndex !== -1) {
              posts[postIndex] = updatedPost;
              renderPostsPageComponent({ appEl });
            }
          })
          .catch((error) => {
            console.error(error);
            alert("Ошибка при отмене лайка.");
          });
      } else {
        likePost({ token: `Bearer ${user.token}`, postId })
          .then(({ post: updatedPost }) => {
            const postIndex = posts.findIndex((p) => p.id === postId);
            if (postIndex !== -1) {
              posts[postIndex] = updatedPost;
              renderPostsPageComponent({ appEl });
            }
          })
          .catch((error) => {
            console.error(error);
            alert("Ошибка при постановке лайка.");
          });
      }
    });
  }
}