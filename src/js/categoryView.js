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
    if (!title) return;

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
    this.showSnackbar();
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
      addCategorySection.classList.add("h-[196px]")
      toggleAddCategoryBtn.classList.add("-translate-y-full");
      container.classList.remove("pt-[52px]");  
    }
  }

  closeAddCategorySection(event) {
    if ($(window).width() < 1024) {
      event.preventDefault();
      categoryTitle.value = "";
      addCategorySection.classList.add("opacity-0");
      addCategorySection.classList.remove("h-[196px]")
      addCategorySection.classList.add("h-0")
      toggleAddCategoryBtn.classList.remove("-translate-y-full");
      container.classList.add("pt-[52px]");  
    }
  }

  showSnackbar() {
    const snackbar = document.querySelector("#cateogory-snackbar");
    snackbar.classList.add("show");
    setTimeout(() => {
      snackbar.classList.remove("show");
    }, 3000);
    document.querySelector("#close-cateogory-snackbar").addEventListener("click", () => {
      snackbar.classList.remove("show");
    });
  }
}

export default new CategoryView();