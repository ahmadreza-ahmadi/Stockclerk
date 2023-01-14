// class
export default class Storage {

  // get and sort categories from local storage
  static getAllCategories() {

    // get all categories from local storage
    const savedCategories = JSON.parse(localStorage.getItem("category")) || [];

    // sort categories per created time
    return savedCategories.sort((a, b) => {
      return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
    });

  }
  // add new and edited categories to local storage
  static saveCategory(categoryToSave) {

    // get saved categories
    const savedCategories = Storage.getAllCategories();

    // find existed categories
    const existedItem = savedCategories.find(category => category.id === categoryToSave.id);
    if (existedItem) {
      // edit
      existedItem.title = categoryToSave.title;
    } else {
      // new
      categoryToSave.id = new Date().getTime();
      categoryToSave.createdAt = new Date().toISOString();
      savedCategories.push(categoryToSave);
    }

    // set new and edited categories to local storage
    localStorage.setItem("category", JSON.stringify(savedCategories));
  }

  // get and sort products from local storage
  static getAllProducts(sort = "newest") {

    // get all products from local storage
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];

    // sort products per created time
    return savedProducts.sort((a, b) => {
      if (sort === "newest") {
        return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
      } else if (sort === "oldest") {
        return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;
      }
    });

  }

  // add new and edited products to local storage
  static saveProducts(productToSave) {

    // get saved products
    const savedProducts = Storage.getAllProducts();

    // find existed products
    const existedItem = savedProducts.find(category => category.id === productToSave.id);
    if (existedItem) {
      // edit
      existedItem.title = productToSave.title;
      existedItem.category = productToSave.selectedCategory;
      existedItem.quantity = productToSave.quantity;
      existedItem.unit = productToSave.checkedUnit;
      existedItem.seller = productToSave.seller;
    } else {
      // new
      productToSave.id = new Date().getTime();
      productToSave.createdAt = new Date().toISOString();
      savedProducts.push(productToSave);
    }

    // set new and edited categories to local storage
    localStorage.setItem("products", JSON.stringify(savedProducts));
  }

  // delete prodcut when click of trash of this product
  static deleteProduct(id) {
    const savedProducts = Storage.getAllProducts();
    const filterdProducts = savedProducts.filter(product => product.id !== parseInt(id));
    localStorage.setItem("products", JSON.stringify(filterdProducts));
  }
}