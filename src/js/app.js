import CategoryView from "/src/js/categoryView.js";
import ProductView from "/src/js/productView.js";

document.addEventListener("DOMContentLoaded", () => {
  CategoryView.setApp();
  ProductView.setApp();
  CategoryView.createCategoriesList();
  ProductView.createProductsList(ProductView.products);
});

window.onload = function () {
  const loader = document.querySelector("#loading");
  loader.style.display = "none";
  const container = document.querySelector("#container");
  container.style.display = "flex";
};