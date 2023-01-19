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
      this.showSnackbar("invalidCategory");
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
    this.showSnackbar("validCategory");
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
      toggleAddCategoryBtn.classList.remove("translate-x-1300");
    }
  }

  showSnackbar(style) {

    let result = "";

    if (style === "validCategory") {
      result = `
      <div class="flex items-center gap-2 lg:gap-3">
      <img src="./assets/images/tick.svg" alt="Tick">
          <p class="">دسته بندی با موفقیت اضافه شد</p>
        </div>
        <img src="./assets/images/close-1.svg" alt="close" id="close-snackbar"
          class="w-4 lg:w-6 cursor-pointer transition-all hover:scale-110">
          `;
    } else if (style === "invalidCategory") {
      result = `
      <div class="flex items-center gap-2 lg:gap-3">
          <img src="./assets/images/close-square.svg" alt="Close">
          <p class="">نام دسته بندی را بنویسید</p>
          </div>
          <img src="./assets/images/close-1.svg" alt="close" id="close-snackbar"
          class="w-4 lg:w-6 cursor-pointer transition-all hover:scale-110">
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