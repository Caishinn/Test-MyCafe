//add to cart//

function addToCart(name, price, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, quantity }); // ✅ "name" must be used here
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`${name} added to cart!`);
}

function confirmOrder(cartItems) {
  const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const newOrder = {
    date: new Date().toISOString(),
    items: cartItems,
    total: total,
  };

  orderHistory.push(newOrder);
  localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

  // Optionally clear cart after order is confirmed
  localStorage.removeItem("cartItems");
  alert("Order confirmed! You can now view it in your Order History.");
}
