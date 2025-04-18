import { useState, useEffect } from "react";
import { useWebSocketContext } from "./WebSocketProvider";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CartIcon = () => {
  const { sendMessage } = useWebSocketContext(); // ✅ Solo llamamos el hook una vez
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleCartUpdate = (data) => {
      if (data.type === "cart_update") {
        setCartCount(data.totalItems);
      }
    };

    const socketRef = window.socketRef || null; // 🔹 Obtiene el socket globalmente
    if (socketRef) {
      // Wait for the socket to connect before sending the message
      if (socketRef.connected) {
        sendMessage({ type: "get_cart_count" }); // ✅ Pedimos la cantidad al backend
        console.log("get_cart_count sent");
      } else {
        socketRef.on('connect', () => {
          sendMessage({ type: "get_cart_count" });
          console.log("get_cart_count sent2");
        });
      }
      socketRef.on("cart_update", handleCartUpdate);
    }

    return () => {
      if (socketRef) {
        socketRef.off("cart_update", handleCartUpdate);
      }
    };
  }, [sendMessage]);

  return (
    <div className="relative cursor-pointer">
      <ShoppingCartIcon className="text-white text-3xl" />
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
