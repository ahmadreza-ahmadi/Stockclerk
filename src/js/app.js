import CategoryView from "/src/js/categoryView.js";
import ProductView from "/src/js/productView.js";

document.addEventListener("DOMContentLoaded", () => {
  // fix height in mobile screen
  let vh = window.innerHeight * 0.01;
  document.querySelector("#container").style.setProperty('--vh', `${vh}px`);

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