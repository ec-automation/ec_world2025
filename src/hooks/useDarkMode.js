import { useEffect, useState } from 'react';
import { useSocket } from '../components/WebSocketProvider'; // <-- Importante

export default function useDarkMode() {
  const [theme, setTheme] = useState('light');
  const { sendMessage } = useSocket();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    if (typeof window !== "undefined") {
      localStorage.theme = newTheme;
      document.documentElement.classList.toggle('dark', newTheme === 'dark');

      // 📤 Guardar en base de datos
      sendMessage('update-preferences', { theme: newTheme });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localTheme = localStorage.theme || 'light';
      setTheme(localTheme);
      document.documentElement.classList.toggle('dark', localTheme === 'dark');
    }
  }, []);

  return { theme, toggleTheme, setTheme };
}