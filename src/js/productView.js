import Storage from "/src/js/storage.js";

// variables
const addNewProductBtn = document.querySelector("#add-new-product");
const editExistedProductBtn = document.querySelector("#edit-existed-product");
const searchInput = document.querySelector("#search-input");
const selctedSort = document.querySelector("#sort-products");

// form variables
const productTitle = document.querySelector("#product-name");
const productQuantity = document.querySelector("#product-quantity");
const productUnit1 = document.querySelector("#radio-of-unit-packet");
const productUnit2 = document.querySelector("#radio-of-unit-kilugram");
const productSelectedCategory = document.querySelector("#product-category");
const productSeller = document.querySelector("#product-seller");

class ProductView {
  constructor() {
    addNewProductBtn.addEventListener("click", (event) => this.addNewProduct(event));
    searchInput.addEventListener("input", (event) => this.searchProducts(event));
    selctedSort.addEventListener("change", (event) => this.sortProducts(event));

    this.products = [];
  }

  setApp() {
    this.products = Storage.getAllProducts();
  }

  addNewProduct(event) {
    event.preventDefault();
    const title = productTitle.value;
    const quantity = productQuantity.value;

    const unit1 = productUnit1;
    const unit2 = productUnit2;
    let checkedUnit = "";
    if (unit1.checked) checkedUnit = unit1.parentElement.innerText;
    else if (unit2.checked) checkedUnit = unit2.parentElement.innerText;

    const selectedCategory = productSelectedCategory.value;
    const seller = productSeller.value;

    if (quantity == 0) {
      this.showSnackbar("error", "مقدار نمی تواند برابر صفر باشد");
      return;
    }

    if (!title || !quantity || !selectedCategory) {
      this.showSnackbar("error", "همه فیلد های اجباری را پر کنید");
      return;
    };

    Storage.saveProducts({ title, quantity, checkedUnit, selectedCategory, seller });

    this.products = Storage.getAllProducts();

    this.createProductsList(this.products);

    if (event.target.id === "add-new-product" || event.target.parentElement.id === "add-new-product") this.showSnackbar("confirm", "محصول با موفقیت اضافه شد");

    productTitle.value = "";
    productQuantity.value = "";
    productSeller.value = "";
  }

  createProductsList(products) {
    let result = "";

    products.forEach(item => {
      const selectedCategory = Storage.getAllCategories().find(c => c.id == item.selectedCategory);

      result += `
      <tr class="flex items-center p-3 lg:p-5 flex-1 even:bg-primary-o20 product-list">
      <td class="cursor-pointer edit-product">
        <img src="./assets/images/edit.svg" alt="trash" data-id="${item.id}" class="w-4 lg:w-6">
      </td>
      <td class="table-body">
        <p class="truncate">${item.title}</p>
      </td>
      <td class="table-body">
        <p class="truncate">${selectedCategory.title}</p>
      </td>
      <td class="table-body">
        <p class="truncate">${item.quantity} <span class="text-sm lg:text-xl">${item.checkedUnit}</span></p>
      </td>
      <td class="table-body">
        <p class="truncate">${new Date(item.createdAt).toLocaleDateString(("fa-IR"))}</p>
      </td>
      <td class="cursor-pointer delete-product">
        <img src="./assets/images/trash.svg" alt="trash" data-id="${item.id}" class="w-4 lg:w-6">
      </td>
    </tr>
      `;
    });

    if (this.products.length < 1) result = `<div class="text-sm lg:text-xl my-3 lg:my-6">درحال حاضر محصولی وجود ندارد</div>`;

    const productsDOM = document.querySelector("#products-list");
    productsDOM.innerHTML = result;

    const deleteBtns = [...document.querySelectorAll(".delete-product")];
    deleteBtns.forEach(item => {
      item.addEventListener("click", (event) => this.deleteProducts(event));
    });

    const editBtns = [...document.querySelectorAll(".edit-product")];
    editBtns.forEach(item => {
      item.addEventListener("click", (event) => this.editProducts(event));
    });
  }

  searchProducts(event) {
    const value = event.target.value.trim();
    const filteredProducts = this.products.filter(product => product.title.includes(value));
    this.createProductsList(filteredProducts);
  }

  sortProducts(event) {
    const value = event.target.value;
    this.products = Storage.getAllProducts(value);
    this.createProductsList(this.products);
  }

  deleteProducts(event) {
    const productId = event.target.dataset.id;
    Storage.deleteProduct(productId);
    this.products = Storage.getAllProducts();
    this.createProductsList(this.products);
  }

  editProducts(event) {
    const productId = event.target.dataset.id;

    // finding ID of the product you want to edit
    const productToEdit = this.products.find(product => product.id == productId);

    // coversion category ID to category title
    const selectedCategory = Storage.getAllCategories().find(c => c.id == productToEdit.selectedCategory);

    // fill inputs with edited content
    productTitle.value = productToEdit.title;
    productQuantity.value = productToEdit.quantity;
    productSeller.value = productToEdit.seller;
    // category
    const options = [...productSelectedCategory.getElementsByTagName("option")];
    options.forEach(option => option.removeAttribute("selected"));
    options.find(option => option.innerText == selectedCategory.title).setAttribute("selected", "selected");
    // unit
    // remove checked attribute
    productUnit1.removeAttribute("checked");
    productUnit2.removeAttribute("checked");
    const unitsWrapper = document.querySelector("#units-wrapper");
    const labels = [...unitsWrapper.getElementsByTagName("label")];
    const targetLabelChildren = [...labels.find(label => label.innerText == productToEdit.checkedUnit).children];
    targetLabelChildren[0].setAttribute("checked", "checked");

    // show edit existed product button instead of add new product btn
    addNewProductBtn.classList.add("hidden");
    editExistedProductBtn.classList.remove("hidden");

    editExistedProductBtn.addEventListener("click", (event) => {
      event.preventDefault();

      document.querySelector("#snackbar").classList.remove("show");

      // when quantity is zero, return
      const quantity = productQuantity.value;
      if (quantity == 0) {
        this.showSnackbar("zeroQuantity");
        return;
      }

      this.addNewProduct(event);
      Storage.deleteProduct(productId);
      this.products = Storage.getAllProducts();
      this.createProductsList(this.products);

      // reset classes to past
      addNewProductBtn.classList.remove("hidden");
      editExistedProductBtn.classList.add("hidden");

      this.showSnackbar("confirm", "تغییرات با موفقیت ذخیره شد");
    });
  }

  showSnackbar(type, message) {
    const snackbar = document.querySelector("#snackbar");

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

    snackbar.innerHTML = result;

    setTimeout(() => {
      snackbar.classList.add("show");
    }, 500);

    function emptySnackbar() {
      result = "";
      snackbar.innerHTML = result;
    }

    let isCloseButtonClicked = false;
    document.querySelector("#close-snackbar").addEventListener("click", () => {
      snackbar.classList.remove("show");
      emptySnackbar;
      isCloseButtonClicked = true;
    });

    if (isCloseButtonClicked === false) {
      setTimeout(() => {
        snackbar.classList.remove("show");

        emptySnackbar;
      }, 3000);
    }
  }
}

export default new ProductView();