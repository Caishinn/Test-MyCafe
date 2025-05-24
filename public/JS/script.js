// Load cart and history from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

// Save functions
function saveOrderHistory() {
  localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Generate unique order ID
function generateOrderId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

// Update cart item count in header
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    el.innerText = count;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

// Change quantity by delta
function changeQty(id, delta) {
  const input = document.getElementById(id);
  let value = parseInt(input.value) || 1;
  value = Math.max(1, value + delta);
  input.value = value;
}
function changeItemQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }
  saveCart();
  loadCartPage();
  updateCartCount();
}

// Qty buttons
function increaseQty(btn) {
  const input = btn.parentElement.querySelector("input");
  input.value = parseInt(input.value) + 1;
}

function decreaseQty(btn) {
  const input = btn.parentElement.querySelector("input");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  loadCartPage();
  updateCartCount();
}

// Confirm Payment + Show Modal Summary
function confirmPayment() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const orderId = generateOrderId();
  const orderDate = new Date();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fill in modal data
  document.getElementById("summary-id").textContent = orderId;
  document.getElementById("summary-date").textContent =
    orderDate.toLocaleString();
  document.getElementById("summary-total").textContent = total.toFixed(2);

  const summaryItems = document.getElementById("summary-items");
  summaryItems.innerHTML = "";

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.quantity} — $${(
      item.price * item.quantity
    ).toFixed(2)}`;
    summaryItems.appendChild(li);
  });

  // Show modal and lock background scroll
  const modal = document.getElementById("order-summary-modal");
  modal.classList.add("show");
  modal.style.display = "flex";
  document.body.classList.add("modal-open");

  // Close modal handler
  const closeButton = document.querySelector(".close-button");
  if (closeButton) {
    closeButton.onclick = () => {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    };
  }

  // Final confirmation (Place Order button)
  const placeOrderBtn = document.getElementById("final-confirm-btn");
  if (placeOrderBtn) {
    placeOrderBtn.onclick = () => {
      const newOrder = {
        id: orderId,
        date: orderDate.toISOString(),
        items: [...cart],
        total: total,
      };

      // 1. Send receipt to Telegram
      const message = formatTelegramMessage(newOrder);
      sendToTelegram(message);

      // 2. Save order to history at the start of the array (newest first)
      orderHistory.unshift(newOrder);
      saveOrderHistory();

      // 3. Clear cart
      cart = [];
      saveCart();
      updateCartCount();

      // 4. Close modal and redirect
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");

      alert("✅ Payment successful! Order saved.");
      window.location.href = "index.html";
    };
  }
}

// Close modal handlers
window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("order-summary-modal");

  document.querySelector(".close-button").addEventListener("click", () => {
    modal.classList.remove("show");
    setTimeout(() => (modal.style.display = "none"), 300);
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      setTimeout(() => (modal.style.display = "none"), 300);
    }
  });

  loadCartPage();
  updateCartCount();
});

function sendToTelegram(message) {
  fetch("/send-telegram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        console.log("✅ Telegram message sent!");
      } else {
        console.error("❌ Telegram error:", data.error);
      }
    })
    .catch((err) => {
      console.error("❌ Telegram fetch failed:", err);
    });
}

const clearBtn = document.getElementById("clear-history-btn");
const historyData = JSON.parse(localStorage.getItem("orderHistory") || "[]");

if (historyData.length === 0) {
  clearBtn.disabled = true;
  clearBtn.classList.add("disabled");
} else {
  clearBtn.disabled = false;
}

clearBtn.addEventListener("click", function () {
  const confirmed = confirm("Are you sure you want to clear all order history?");
  if (confirmed) {
    localStorage.removeItem("orderHistory");
    location.reload();
  }
});

window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
