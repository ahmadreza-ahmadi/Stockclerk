// import satorage file
import Storage from "/src/js/storage.js";

// variables
const container = document.querySelector("#container");
const categoryTitle = document.querySelector("#category-name");
const addNewCategoryBtn = document.querySelector("#add-new-category");
const cancelAddNewCategoryBtn = document.querySelector("#cancel-add-new-category");
const toggleAddCategoryBtn = document.querySelector("#toggle-add-category");
const addCategorySection = document.querySelector("#add-category-section");

// class
class CategoryView {
  constructor() {
    addNewCategoryBtn.addEventListener("click", (event) => this.addNewCategory(event));
    cancelAddNewCategoryBtn.addEventListener("click", (event) => this.closeAddCategorySection(event));
    toggleAddCategoryBtn.addEventListener("click", (event => this.toggleAddCategory(event)));
    this.categories = [];
  }

  addNewCategory(event) {

    // fix refreshing page when click on submit button
    event.preventDefault();

    // set value of input in variable
    const title = categoryTitle.value;

    // don't continue when input is empty

    if (!title) {
      this.showSnackbar("error", "نام دسته بندی را بنویسید");
      return;
    };

    Storage.saveCategory(
      { title }
    );

    // update categories
    this.categories = Storage.getAllCategories();

    // add categories on DOM
    this.createCategoriesList();

    // empty input after add category
    categoryTitle.value = "";

    // close cateogry section
    this.closeAddCategorySection(event);

    // show snackbar
    this.showSnackbar("confirm", "دسته بندی با موفقیت اضافه شد");
  }

  setApp() {
    this.categories = Storage.getAllCategories();
  }

  createCategoriesList() {

    // options
    let result = "";

    if (Storage.getAllCategories().length < 1) result = `<option>اضافه کنید</option>`;

    // add option
    this.categories.forEach((category) => {
      result += `<option value="${category.id}">${category.title}</option>`;
    });

    // show options on DOM
    const categoriesOptions = document.querySelector("#product-category");
    categoriesOptions.innerHTML = result;
  }

  toggleAddCategory(event) {
    if ($(window).width() < 1024) {
      event.preventDefault();
      addCategorySection.classList.remove("opacity-0");
      addCategorySection.classList.add("h-[196px]");
      addCategorySection.classList.add("mb-4");
      addCategorySection.classList.add("lg:mb-6");
      toggleAddCategoryBtn.classList.add("translate-x-1300");
    }
  }

  closeAddCategorySection(event) {
    if ($(window).width() < 1024) {
      event.preventDefault();
      categoryTitle.value = "";
      addCategorySection.classList.add("opacity-0");
      addCategorySection.classList.remove("h-[196px]");
      addCategorySection.classList.add("h-0");
      addCategorySection.classList.remove("mb-4");
      addCategorySection.classList.remove("lg:mb-6");
      toggleAddCategoryBtn.classList.remove("translate-x-1300");
    }
  }

  showSnackbar(type, message) {

    let result = "";

    if (type === "confirm") {
      result = `
      <div class="flex items-center gap-2 lg:gap-3">
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.2" d="M24.285 3H11.715C6.255 3 3 6.255 3 11.715V24.27C3 29.745 6.255 33 11.715 33H24.27C29.73 33 32.985 29.745 32.985 24.285V11.715C33 6.255 29.745 3 24.285 3Z" fill="#4ADE80"/>
          <path d="M15.8702 23.3699C15.5702 23.3699 15.2852 23.2499 15.0752 23.0399L10.8302 18.7949C10.3952 18.3599 10.3952 17.6399 10.8302 17.2049C11.2652 16.7699 11.9852 16.7699 12.4202 17.2049L15.8702 20.6549L23.5802 12.9449C24.0152 12.5099 24.7352 12.5099 25.1702 12.9449C25.6052 13.3799 25.6052 14.0999 25.1702 14.5349L16.6652 23.0399C16.4552 23.2499 16.1702 23.3699 15.8702 23.3699Z" fill="#4ADE80"/>
        </svg>
        <p>${message}</p>
      </div>
      <svg id="close-snackbar" class="w-4 aspect-square cursor-pointer transition-all hover:scale-110" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 13L13 1" stroke="#707070" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13 13L1 1" stroke="#707070" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `;
    } else if (type === "error") {
      result = `
      <div class="flex items-center gap-2 lg:gap-3">
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.2" d="M24.285 3H11.715C6.255 3 3 6.255 3 11.715V24.27C3 29.745 6.255 33 11.715 33H24.27C29.73 33 32.985 29.745 32.985 24.285V11.715C33 6.255 29.745 3 24.285 3Z" fill="#F43F5E"/>
          <path d="M19.5891 18L23.0391 14.55C23.4741 14.115 23.4741 13.395 23.0391 12.96C22.6041 12.525 21.8841 12.525 21.4491 12.96L17.9991 16.41L14.5491 12.96C14.1141 12.525 13.3941 12.525 12.9591 12.96C12.5241 13.395 12.5241 14.115 12.9591 14.55L16.4091 18L12.9591 21.45C12.5241 21.885 12.5241 22.605 12.9591 23.04C13.1841 23.265 13.4691 23.37 13.7541 23.37C14.0391 23.37 14.3241 23.265 14.5491 23.04L17.9991 19.59L21.4491 23.04C21.6741 23.265 21.9591 23.37 22.2441 23.37C22.5291 23.37 22.8141 23.265 23.0391 23.04C23.4741 22.605 23.4741 21.885 23.0391 21.45L19.5891 18Z" fill="#F43F5E"/>
        </svg>      
        <p>${message}</p>
      </div>
      <svg id="close-snackbar" class="w-4 aspect-square cursor-pointer transition-all hover:scale-110" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 13L13 1" stroke="#707070" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13 13L1 1" stroke="#707070" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
            `;
    }

    const snackbar = document.querySelector("#snackbar");
    snackbar.innerHTML = result;

    snackbar.classList.add("show");

    function emptySnackbar() {
      result = "";
      snackbar.innerHTML = result;
    }

    let isCloseButtonClicked = false;
    document.querySelector("#close-snackbar").addEventListener("click", () => {
      isCloseButtonClicked = true;
      snackbar.classList.remove("show");
      emptySnackbar;
    });

    if (isCloseButtonClicked = false) return;

    setTimeout(() => {
      snackbar.classList.remove("show");

      emptySnackbar;
    }, 3000);
  }
}

export default new CategoryView();