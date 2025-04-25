import { useEffect, useState } from 'react';
import { useSocket } from '../components/WebSocketProvider';

export default function useDarkMode() {
  const [theme, setTheme] = useState('light');
  const { sendMessage } = useSocket();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    if (typeof window !== "undefined") {
      localStorage.theme = newTheme;
      document.documentElement.classList.toggle('dark', newTheme === 'dark');

      // ✅ Solo enviamos si realmente cambió
      if (newTheme !== localStorage.theme) {
        sendMessage('update-preferences', { theme: newTheme });
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.theme || 'light';
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  return { theme, toggleTheme, setTheme };
}
