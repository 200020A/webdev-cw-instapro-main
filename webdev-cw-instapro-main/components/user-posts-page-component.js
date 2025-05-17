import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost } from "../api.js";

export function renderUserPostsPageComponent({ appEl }) {
  const userId = posts.length > 0 ? posts[0].user.id : null;
  const userName = posts.length > 0 ? posts[0].user.name : "Пользователь";
  const userImageUrl = posts.length > 0 ? posts[0].user.imageUrl : "";

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
        <img src="${userImageUrl}" class="posts-user-header__user-image">
        <p class="posts-user-header__user-name">${userName}</p>
      </div>
      <ul class="posts">
        ${posts.map((post) => {
          return `
            <li class="post">
              <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}">
              </div>
              <div class="post-likes">
                <button data-post-id="${post.id}" class="like-button">
                  <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
                </button>
                <p class="post-likes-text">
                  Нравится: <strong>${post.likes.length}</strong>
                </p>
              </div>
              <p class="post-text">
                <span class="user-name">${post.user.name}</span>
                ${post.description}
              </p>
              <p class="post-date">
                ${new Date(post.createdAt).toLocaleString()}
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
              renderUserPostsPageComponent({ appEl });
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
              renderUserPostsPageComponent({ appEl });
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