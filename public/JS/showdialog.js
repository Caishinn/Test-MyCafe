let selectedItem = "";
let selectedPrice = 0;

function showDialog(itemName, price) {
  selectedItem = itemName;
  selectedPrice = price;

  document.getElementById("dialog-title").textContent = `Customize your ${itemName}`;
  document.getElementById("dialog-qty").value = 1;

  const dialog = document.getElementById("customize-dialog");
  dialog.classList.remove("hidden");
  document.body.classList.add("modal-open");

  // Add event listener to detect click outside
  setTimeout(() => {
    window.addEventListener("click", outsideClickHandler);
  }, 0);
}

function updateQty(amount) {
  const qtyInput = document.getElementById("dialog-qty");
  const current = parseInt(qtyInput.value) || 1;
  qtyInput.value = Math.max(1, current + amount);
}

function closeDialog() {
  const dialog = document.getElementById("customize-dialog");
  dialog.classList.add("hidden");
  document.body.classList.remove("modal-open");
  window.removeEventListener("click", outsideClickHandler);
}

function outsideClickHandler(event) {
  const dialog = document.getElementById("customize-dialog");
  const content = dialog.querySelector(".dialog-content");
  if (!content.contains(event.target)) {
    closeDialog();
  }
}

function confirmAdd() {
  const qty = parseInt(document.getElementById("dialog-qty").value) || 1;
  const sugar = document.querySelector('input[name="sugar"]:checked')?.value || "100%";
  const size = document.querySelector('input[name="size"]:checked')?.value || "Medium";

  const fullItemName = `${selectedItem} (${size}, ${sugar} sugar)`;
  addToCart(fullItemName, selectedPrice, qty);

  closeDialog();
}
