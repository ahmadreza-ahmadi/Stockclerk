// import satorage file
import Storage from "/src/js/storage.js";

// variables
const categoryTitle = document.querySelector("#category-name");
const addNewCategoryBtn = document.querySelector("#add-new-category");

// class
class CategoryView {
  constructor() {
    addNewCategoryBtn.addEventListener("click", (event) => this.addNewCategory(event));
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
}

export default new CategoryView();