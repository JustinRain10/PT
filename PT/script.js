// ---------------------------------------------------------------
// script.js
// Wires up the two API calls (Get All Products, Get Price) using
// Axios, talking to api.php, and updates the dropdown / price
// display in the DOM.
// ---------------------------------------------------------------

const productSelect = document.getElementById("productSelect");
const getPriceBtn = document.getElementById("getPriceBtn");
const priceDisplay = document.getElementById("priceDisplay");
const statusMsg = document.getElementById("statusMsg");

const API_BASE = "api.php";

// ---------- Step 2: Fetch and populate the dropdown (API 1) ----------

document.addEventListener("DOMContentLoaded", loadProducts);

function loadProducts() {
  productSelect.disabled = true;
  setStatus("Loading products...");

  axios
    .get(API_BASE, { params: { action: "products" } })
    .then((response) => {
      populateDropdown(response.data);
      setStatus("");
    })
    .catch((error) => {
      console.error("Failed to load products:", error);
      setStatus("Could not load products. Please refresh the page.");
    })
    .finally(() => {
      productSelect.disabled = false;
    });
}

function populateDropdown(products) {
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.product_id;
    option.textContent = product.product_name;
    productSelect.appendChild(option);
  });
}

// ---------- Step 3 & 4: Handle click, fetch price (API 2) ----------

getPriceBtn.addEventListener("click", handleGetPrice);

function handleGetPrice() {
  const selectedId = productSelect.value;

  if (!selectedId) {
    setStatus("Please select a product first.");
    return;
  }

  setStatus("Fetching price...");
  getPriceBtn.disabled = true;

  axios
    .get(API_BASE, { params: { action: "price", id: selectedId } })
    .then((response) => {
      updatePriceDisplay(response.data.price);
      setStatus("");
    })
    .catch((error) => {
      console.error("Failed to fetch price:", error);
      setStatus("Could not fetch price for this product.");
    })
    .finally(() => {
      getPriceBtn.disabled = false;
    });
}

function updatePriceDisplay(price) {
  const formattedPrice = Number(price).toFixed(2);
  priceDisplay.textContent = `Price : P ${formattedPrice}`;
}

function setStatus(message) {
  statusMsg.textContent = message;
}
