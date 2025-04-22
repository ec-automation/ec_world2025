'use client';
import { useEffect, useState } from 'react';
import { useSocket } from './WebSocketProvider'; // Asegúrate de importar correctamente
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const CartIcon = () => {
  const { sendMessage, onMessage, isConnected } = useSocket();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Escuchar actualizaciones del carrito
    onMessage('cart_update', (data) => {
      if (data?.type === 'cart_update') {
        setCartCount(data.totalItems || 0);
      }
    });
  }, [onMessage]);

  useEffect(() => {
    if (isConnected) {
      // Pedir la cantidad del carrito al conectar
      sendMessage('get_cart_count', {});
      console.log('📤 Mensaje get_cart_count enviado');
    }
  }, [isConnected, sendMessage]);

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
