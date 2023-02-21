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

    if (!title || !quantity || !selectedCategory) {
      this.showSnackbar("error", "همه فیلد های اجباری را پر کنید");
      return;
    };

    if (quantity == 0) {
      this.showSnackbar("error", "مقدار نمی تواند برابر صفر باشد");
      return;
    }

    Storage.saveProducts({ title, quantity, checkedUnit, selectedCategory, seller });

    this.products = Storage.getAllProducts();

    this.createProductsList(this.products);

    this.showSnackbar("confirm", "محصول با موفقیت اضافه شد");

    if (event.target.id === "add-new-product" || event.target.parentElement.id === "add-new-product") {
      this.showSnackbar("confirm", "محصول با موفقیت اضافه شد");
    } else {
      this.showSnackbar("confirm", "تغییرات با موفقیت ذخیره شد");
    };

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
      <td data-id="${item.id}" class="cursor-pointer edit-product">
        <svg class="pointer-events-none fill-primary w-4 h-4 lg:w-6 lg:h-6" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H11C11.41 1.25 11.75 1.59 11.75 2C11.75 2.41 11.41 2.75 11 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V13C21.25 12.59 21.59 12.25 22 12.25C22.41 12.25 22.75 12.59 22.75 13V15C22.75 20.43 20.43 22.75 15 22.75Z"/>
          <path d="M8.50032 17.6901C7.89032 17.6901 7.33032 17.4701 6.92032 17.0701C6.43032 16.5801 6.22032 15.8701 6.33032 15.1201L6.76032 12.1101C6.84032 11.5301 7.22032 10.7801 7.63032 10.3701L15.5103 2.49006C17.5003 0.500059 19.5203 0.500059 21.5103 2.49006C22.6003 3.58006 23.0903 4.69006 22.9903 5.80006C22.9003 6.70006 22.4203 7.58006 21.5103 8.48006L13.6303 16.3601C13.2203 16.7701 12.4703 17.1501 11.8903 17.2301L8.88032 17.6601C8.75032 17.6901 8.62032 17.6901 8.50032 17.6901ZM16.5703 3.55006L8.69032 11.4301C8.50032 11.6201 8.28032 12.0601 8.24032 12.3201L7.81032 15.3301C7.77032 15.6201 7.83032 15.8601 7.98032 16.0101C8.13032 16.1601 8.37032 16.2201 8.66032 16.1801L11.6703 15.7501C11.9303 15.7101 12.3803 15.4901 12.5603 15.3001L20.4403 7.42006C21.0903 6.77006 21.4303 6.19006 21.4803 5.65006C21.5403 5.00006 21.2003 4.31006 20.4403 3.54006C18.8403 1.94006 17.7403 2.39006 16.5703 3.55006Z"/>
          <path d="M19.8496 9.82978C19.7796 9.82978 19.7096 9.81978 19.6496 9.79978C17.0196 9.05978 14.9296 6.96978 14.1896 4.33978C14.0796 3.93978 14.3096 3.52978 14.7096 3.40978C15.1096 3.29978 15.5196 3.52978 15.6296 3.92978C16.2296 6.05978 17.9196 7.74978 20.0496 8.34978C20.4496 8.45978 20.6796 8.87978 20.5696 9.27978C20.4796 9.61978 20.1796 9.82978 19.8496 9.82978Z"/>
        </svg>
      </td>
      <td class="table-body">
        <p class="truncate">${item.title}</p>
      </td>
      <td class="table-body">
        <p class="truncate">${selectedCategory ? selectedCategory.title : "نامشخص"}</p>
      </td>
      <td class="table-body">
        <p class="truncate">${item.quantity} <span class="text-xs lg:text-base">${item.checkedUnit}</span></p>
      </td>
      <td class="table-body">
        <p class="truncate">${new Date(item.createdAt).toLocaleDateString(("fa-IR"))}</p>
      </td>
      <td data-id="${item.id}" class="cursor-pointer delete-product">
        <svg class="pointer-events-none fill-red-500 w-4 h-4 lg:w-6 lg:h-6" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 6.73001C20.98 6.73001 20.95 6.73001 20.92 6.73001C15.63 6.20001 10.35 6.00001 5.11998 6.53001L3.07998 6.73001C2.65998 6.77001 2.28998 6.47001 2.24998 6.05001C2.20998 5.63001 2.50998 5.27001 2.91998 5.23001L4.95998 5.03001C10.28 4.49001 15.67 4.70001 21.07 5.23001C21.48 5.27001 21.78 5.64001 21.74 6.05001C21.71 6.44001 21.38 6.73001 21 6.73001Z"/>
          <path d="M8.50001 5.72C8.46001 5.72 8.42001 5.72 8.37001 5.71C7.97001 5.64 7.69001 5.25 7.76001 4.85L7.98001 3.54C8.14001 2.58 8.36001 1.25 10.69 1.25H13.31C15.65 1.25 15.87 2.63 16.02 3.55L16.24 4.85C16.31 5.26 16.03 5.65 15.63 5.71C15.22 5.78 14.83 5.5 14.77 5.1L14.55 3.8C14.41 2.93 14.38 2.76 13.32 2.76H10.7C9.64001 2.76 9.62001 2.9 9.47001 3.79L9.24001 5.09C9.18001 5.46 8.86001 5.72 8.50001 5.72Z"/>
          <path d="M15.21 22.75H8.79002C5.30002 22.75 5.16002 20.82 5.05002 19.26L4.40002 9.19C4.37002 8.78 4.69002 8.42 5.10002 8.39C5.52002 8.37 5.87002 8.68 5.90002 9.09L6.55002 19.16C6.66002 20.68 6.70002 21.25 8.79002 21.25H15.21C17.31 21.25 17.35 20.68 17.45 19.16L18.1 9.09C18.13 8.68 18.49 8.37 18.9 8.39C19.31 8.42 19.63 8.77 19.6 9.19L18.95 19.26C18.84 20.82 18.7 22.75 15.21 22.75Z"/>
          <path d="M13.66 17.25H10.33C9.92002 17.25 9.58002 16.91 9.58002 16.5C9.58002 16.09 9.92002 15.75 10.33 15.75H13.66C14.07 15.75 14.41 16.09 14.41 16.5C14.41 16.91 14.07 17.25 13.66 17.25Z"/>
          <path d="M14.5 13.25H9.5C9.09 13.25 8.75 12.91 8.75 12.5C8.75 12.09 9.09 11.75 9.5 11.75H14.5C14.91 11.75 15.25 12.09 15.25 12.5C15.25 12.91 14.91 13.25 14.5 13.25Z"/>
        </svg>

      </td>
    </tr>
      `;
    });

    if (this.products.length < 1) result = `<div class="text-xs lg:text-lg my-3 lg:my-5">درحال حاضر محصولی وجود ندارد</div>`;

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
    this.showSnackbar("confirm", "محصول مورد نظر با موفقیت حذف شد");
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

    addNewProductBtn.id = "edit-existed-product";
    addNewProductBtn.innerHTML = `<svg class="fill-white w-4 lg:w-6" width="24" height="24" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 15.7C22 15.69 21.99 15.68 21.98 15.67C21.94 15.61 21.89 15.55 21.84 15.5C21.83 15.49 21.82 15.47 21.81 15.46C21 14.56 19.81 14 18.5 14C17.24 14 16.09 14.52 15.27 15.36C14.48 16.17 14 17.28 14 18.5C14 19.34 14.24 20.14 14.65 20.82C14.87 21.19 15.15 21.53 15.47 21.81C15.49 21.82 15.5 21.83 15.51 21.84C15.56 21.89 15.61 21.93 15.67 21.98C15.67 21.98 15.67 21.98 15.68 21.98C15.69 21.99 15.7 22 15.71 22C16.46 22.63 17.43 23 18.5 23C20.14 23 21.57 22.12 22.35 20.82C22.58 20.43 22.76 20 22.87 19.55C22.96 19.21 23 18.86 23 18.5C23 17.44 22.63 16.46 22 15.7ZM20.18 19.23H19.25V20.2C19.25 20.61 18.91 20.95 18.5 20.95C18.09 20.95 17.75 20.61 17.75 20.2V19.23H16.82C16.41 19.23 16.07 18.89 16.07 18.48C16.07 18.07 16.41 17.73 16.82 17.73H17.75V16.84C17.75 16.43 18.09 16.09 18.5 16.09C18.91 16.09 19.25 16.43 19.25 16.84V17.73H20.18C20.59 17.73 20.93 18.07 20.93 18.48C20.93 18.89 20.6 19.23 20.18 19.23Z" />
    <path opacity="0.4"
      d="M19.35 5.65995L13.06 2.27C12.4 1.91 11.6 1.91 10.93 2.27L4.64 5.65995C4.18 5.90995 3.89999 6.39998 3.89999 6.93998C3.89999 7.47998 4.18 7.96995 4.64 8.21995L10.93 11.61C11.26 11.79 11.63 11.88 11.99 11.88C12.35 11.88 12.72 11.79 13.05 11.61L19.34 8.21995C19.8 7.96995 20.08 7.47998 20.08 6.93998C20.1 6.39998 19.81 5.90995 19.35 5.65995Z" />
    <path opacity="0.4"
      d="M9.89999 12.79L4.05 9.86001C3.6 9.63001 3.07999 9.66001 2.64999 9.92001C2.21999 10.18 1.97 10.64 1.97 11.14V16.67C1.97 17.63 2.5 18.49 3.36 18.92L9.21001 21.8401C9.41001 21.9401 9.63001 21.99 9.85001 21.99C10.11 21.99 10.37 21.92 10.6 21.77C11.03 21.51 11.28 21.05 11.28 20.55V15.02C11.29 14.08 10.76 13.22 9.89999 12.79Z" />
    <path opacity="0.4"
      d="M22.03 11.15V15.74C22.02 15.73 22.01 15.71 22 15.7C22 15.69 21.99 15.68 21.98 15.67C21.94 15.61 21.89 15.55 21.84 15.5C21.83 15.49 21.82 15.47 21.81 15.46C21 14.56 19.81 14 18.5 14C17.24 14 16.09 14.52 15.27 15.36C14.48 16.17 14 17.28 14 18.5C14 19.34 14.24 20.14 14.65 20.82C14.82 21.11 15.03 21.37 15.26 21.61L14.79 21.85C14.59 21.95 14.37 22 14.15 22C13.89 22 13.63 21.93 13.39 21.78C12.97 21.52 12.71 21.06 12.71 20.56V15.04C12.71 14.08 13.24 13.22 14.1 12.79L19.95 9.87C20.4 9.64 20.92 9.66 21.35 9.93C21.77 10.19 22.03 10.65 22.03 11.15Z" />
  </svg>
  <p>ذخیره تغییرات</p>
`   ;

    addNewProductBtn.addEventListener("click", (event) => {
      event.preventDefault();

      // when quantity is zero, return
      const quantity = productToEdit.quantity;

      Storage.deleteProduct(productId);
      this.products = Storage.getAllProducts();
      this.createProductsList(this.products);

      addNewProductBtn.id = "add-new-product";
      addNewProductBtn.innerHTML = `<svg class="fill-white w-4 lg:w-6" width="24" height="24" viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 15.7C22 15.69 21.99 15.68 21.98 15.67C21.94 15.61 21.89 15.55 21.84 15.5C21.83 15.49 21.82 15.47 21.81 15.46C21 14.56 19.81 14 18.5 14C17.24 14 16.09 14.52 15.27 15.36C14.48 16.17 14 17.28 14 18.5C14 19.34 14.24 20.14 14.65 20.82C14.87 21.19 15.15 21.53 15.47 21.81C15.49 21.82 15.5 21.83 15.51 21.84C15.56 21.89 15.61 21.93 15.67 21.98C15.67 21.98 15.67 21.98 15.68 21.98C15.69 21.99 15.7 22 15.71 22C16.46 22.63 17.43 23 18.5 23C20.14 23 21.57 22.12 22.35 20.82C22.58 20.43 22.76 20 22.87 19.55C22.96 19.21 23 18.86 23 18.5C23 17.44 22.63 16.46 22 15.7ZM20.18 19.23H19.25V20.2C19.25 20.61 18.91 20.95 18.5 20.95C18.09 20.95 17.75 20.61 17.75 20.2V19.23H16.82C16.41 19.23 16.07 18.89 16.07 18.48C16.07 18.07 16.41 17.73 16.82 17.73H17.75V16.84C17.75 16.43 18.09 16.09 18.5 16.09C18.91 16.09 19.25 16.43 19.25 16.84V17.73H20.18C20.59 17.73 20.93 18.07 20.93 18.48C20.93 18.89 20.6 19.23 20.18 19.23Z" />
      <path opacity="0.4"
        d="M19.35 5.65995L13.06 2.27C12.4 1.91 11.6 1.91 10.93 2.27L4.64 5.65995C4.18 5.90995 3.89999 6.39998 3.89999 6.93998C3.89999 7.47998 4.18 7.96995 4.64 8.21995L10.93 11.61C11.26 11.79 11.63 11.88 11.99 11.88C12.35 11.88 12.72 11.79 13.05 11.61L19.34 8.21995C19.8 7.96995 20.08 7.47998 20.08 6.93998C20.1 6.39998 19.81 5.90995 19.35 5.65995Z" />
      <path opacity="0.4"
        d="M9.89999 12.79L4.05 9.86001C3.6 9.63001 3.07999 9.66001 2.64999 9.92001C2.21999 10.18 1.97 10.64 1.97 11.14V16.67C1.97 17.63 2.5 18.49 3.36 18.92L9.21001 21.8401C9.41001 21.9401 9.63001 21.99 9.85001 21.99C10.11 21.99 10.37 21.92 10.6 21.77C11.03 21.51 11.28 21.05 11.28 20.55V15.02C11.29 14.08 10.76 13.22 9.89999 12.79Z" />
      <path opacity="0.4"
        d="M22.03 11.15V15.74C22.02 15.73 22.01 15.71 22 15.7C22 15.69 21.99 15.68 21.98 15.67C21.94 15.61 21.89 15.55 21.84 15.5C21.83 15.49 21.82 15.47 21.81 15.46C21 14.56 19.81 14 18.5 14C17.24 14 16.09 14.52 15.27 15.36C14.48 16.17 14 17.28 14 18.5C14 19.34 14.24 20.14 14.65 20.82C14.82 21.11 15.03 21.37 15.26 21.61L14.79 21.85C14.59 21.95 14.37 22 14.15 22C13.89 22 13.63 21.93 13.39 21.78C12.97 21.52 12.71 21.06 12.71 20.56V15.04C12.71 14.08 13.24 13.22 14.1 12.79L19.95 9.87C20.4 9.64 20.92 9.66 21.35 9.93C21.77 10.19 22.03 10.65 22.03 11.15Z" />
    </svg>
    <p>افزودن به محصولات</p>
      `;
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