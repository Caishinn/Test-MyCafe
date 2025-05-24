function formatTelegramMessage(order) {
  let message = `🧾 <b>New Order Received!</b>\n`;
  message += `🆔 <b>Order ID:</b> ${order.id}\n`;
  message += `📅 <b>Date:</b> ${new Date(order.date).toLocaleString()}\n\n`;
  message += `📦 <b>Items:</b>\n`;

  order.items.forEach((item) => {
    message += `• ${item.name} x${item.quantity} — $${(
      item.price * item.quantity
    ).toFixed(2)}\n`;
  });

  message += `\n💰 <b>Total:</b> $${order.total.toFixed(2)}`;
  return message;
}

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
