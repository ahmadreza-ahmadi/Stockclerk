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
      this.showSnackbar("zeroQuantity");
      return;
    }

    if (!title || !quantity || !selectedCategory) {
      this.showSnackbar("invalidProduct");
      return;
    };

    Storage.saveProducts({ title, quantity, checkedUnit, selectedCategory, seller });

    this.products = Storage.getAllProducts();

    this.createProductsList(this.products);

    if (event.target.id === "add-new-product" || event.target.parentElement.id === "add-new-product") this.showSnackbar("validProduct");

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

      this.showSnackbar("editedProduct");
    });
  }

  showSnackbar(style) {

    let result = "";

    if (style === "validProduct") {
      result = `
      <div class="flex items-center gap-2 lg:gap-3">
      <img src="./assets/images/tick.svg" alt="Tick">
          <p class="">محصول با موفقیت اضافه شد</p>
        </div>
        <img src="./assets/images/close-1.svg" alt="close" id="close-snackbar"
          class="w-4 cursor-pointer transition-all hover:scale-110">
          `;
    } else if (style === "editedProduct") {
      result = `
      <div class="flex items-center gap-2 lg:gap-3">
      <img src="./assets/images/tick.svg" alt="Tick">
      <p class="">تغییرات با موفقیت ذخیره شد</p>
        </div>
        <img src="./assets/images/close-1.svg" alt="close" id="close-snackbar"
          class="w-4 cursor-pointer transition-all hover:scale-110">
          `;
    } else if (style === "invalidProduct") {
      result = `
      <div class="flex items-center gap-2 lg:gap-3">
          <img src="./assets/images/close-square.svg" alt="Close">
          <p class="">همه فیلد های اجباری را پر کنید</p>
          </div>
          <img src="./assets/images/close-1.svg" alt="close" id="close-snackbar"
          class="w-4 cursor-pointer transition-all hover:scale-110">
      `;
    } else if (style === "zeroQuantity") {
      result = `
      <div class="flex items-center gap-2 lg:gap-3">
          <img src="./assets/images/close-square.svg" alt="Close">
          <p class="">مقدار نمی تواند برابر صفر باشد</p>
          </div>
          <img src="./assets/images/close-1.svg" alt="close" id="close-snackbar"
          class="w-4 cursor-pointer transition-all hover:scale-110">
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

export default new ProductView();