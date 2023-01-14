import Storage from "/src/js/storage.js";

// variables
const addNewProductBtn = document.querySelector("#add-new-product");
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

    if (!title || !quantity || !selectedCategory) return;

    Storage.saveProducts({ title, quantity, checkedUnit, selectedCategory, seller });

    this.products = Storage.getAllProducts();

    console.log(this.products);

    this.createProductsList(this.products);

    productTitle.value = "";
    productQuantity.value = "";
    productSeller.value = "";
  }

  createProductsList(products) {
    let result = "";

    products.forEach(item => {
      const selectedCategory = Storage.getAllCategories().find(c => c.id == item.selectedCategory);

      result += `
      <tr class="flex items-center p-3 sm:p-6 flex-1 even:bg-primary-o20 product-list">
      <td class="opacity-0">
        <img src="./assets/images/trash.svg" alt="trash" data-id="${item.id}">
      </td>
      <td class="table-body">
        <p class="truncate">${item.title}</p>
      </td>
      <td class="table-body">
        <p class="truncate">${selectedCategory.title}</p>
      </td>
      <td class="table-body">
        <p class="truncate">${item.quantity} <span class="text-sm sm:text-xl">${item.checkedUnit}</span></p>
      </td>
      <td class="table-body">
        <p class="truncate">${new Date(item.createdAt).toLocaleDateString(("fa-IR"))}</p>
      </td>
      <td class="cursor-pointer delete-product">
        <img src="./assets/images/trash.svg" alt="trash" data-id="${item.id}" class="w-4 sm:w-6">
      </td>
    </tr>
      `;
    });

    if (this.products.length < 1) result = `<div class="text-base sm:text-2xl my-3 sm:my-6">درحال حاضر محصولی وجود ندارد</div>`;

    const productsDOM = document.querySelector("#products-list");
    productsDOM.innerHTML = result;

    const deleteBtns = [...document.querySelectorAll(".delete-product")];
    deleteBtns.forEach(item => {
      item.addEventListener("click", (event) => this.deleteProducts(event));
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
}

export default new ProductView();