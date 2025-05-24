function loadCartPage() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartSummaryDiv = document.getElementById("cart-summary");
  const payBtn = document.getElementById("pay-btn");

  if (!cartItemsDiv || !cartSummaryDiv || !payBtn) return;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    cartSummaryDiv.textContent = "";
    payBtn.style.display = "none";
    return;
  }

  cartItemsDiv.innerHTML = `<h3 class="cart-title">🧾 Items Ordered</h3>`;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    itemDiv.innerHTML = `
      <div class="item-left">
        <div class="item-name">${item.name}</div>
        <div class="quantity-controls">
          <button class="qty-btn" onclick="changeItemQty(${index}, -1)">−</button>
          <span class="qty">${item.quantity}</span>
          <button class="qty-btn" onclick="changeItemQty(${index}, 1)">+</button>
        </div>
      </div>
      <div class="item-right">
        <span class="item-total">$${itemTotal.toFixed(2)}</span>
        <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove item">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ffffff" viewBox="0 0 24 24">
        <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13H6.5L5 9zm5 2v8h2v-8H10zm4 0v8h2v-8h-2z"/>
      </svg>
      
        </button>
      </div>
    `;

    cartItemsDiv.appendChild(itemDiv);
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  cartSummaryDiv.innerHTML = `
    <div class="total-wrapper">
      <strong>Total: $${total.toFixed(2)}</strong>
    </div>
  `;

  payBtn.style.display = "block";
}

// Modal close handlers - only once registered on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const orderHistoryContainer = document.getElementById(
    "order-history-container"
  );
  const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];

  if (orders.length === 0) {
    orderHistoryContainer.innerHTML = "<p>No past orders found.</p>";
    return;
  }

  orderHistoryContainer.innerHTML = ""; // Clear before rendering

  orders.forEach((order, index) => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    // Parse date/time nicely
    const orderDate = new Date(order.date);
    const dateString = orderDate.toLocaleDateString(); // e.g. "5/19/2025"
    const timeString = orderDate.toLocaleTimeString(); // e.g. "3:45:23 PM"

    // Build items list HTML
    const itemsHtml = order.items
      .map(
        (item) =>
          `<li>${item.name} x ${item.quantity} - $${(
            item.price * item.quantity
          ).toFixed(2)}</li>`
      )
      .join("");

    orderDiv.innerHTML = `
      <h3>Order ID: ${order.id}</h3>
      <p><strong>Date:</strong> ${dateString}</p>
      <p><strong>Time:</strong> ${timeString}</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <hr />
    `;

    orderHistoryContainer.appendChild(orderDiv);
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const cancelBtn = document.getElementById('close-summary-btn');
  const modal = document.getElementById('order-summary-modal');

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});
