import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <textarea class="input textarea" placeholder="Опишите фотографию..." id="description-input"></textarea>
            <div class="form-error"></div>
            <button disabled="true" class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
          validateForm();
        },
      });
    }

    const descriptionInputElement = document.getElementById("description-input");
    const addButtonElement = document.getElementById("add-button");

    const validateForm = () => {
      const description = descriptionInputElement.value.trim();
      const isValid = description !== "" && imageUrl !== "";
      addButtonElement.disabled = !isValid;
    };

    descriptionInputElement.addEventListener("input", validateForm);

    addButtonElement.addEventListener("click", () => {
      setError("");

      const description = descriptionInputElement.value.trim();

      if (!description) {
        setError("Введите описание поста");
        return;
      }

      if (!imageUrl) {
        setError("Не выбрана фотография");
        return;
      }

      onAddPostClick({
        description,
        imageUrl,
      });
    });
  };

  render();
}