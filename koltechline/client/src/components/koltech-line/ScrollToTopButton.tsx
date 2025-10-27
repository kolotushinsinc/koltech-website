import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  threshold?: number;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ threshold = 500 }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Отслеживаем прокрутку страницы с дебаунсингом
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      
      // Используем setTimeout для дебаунсинга, чтобы уменьшить количество обновлений состояния
      timeoutId = setTimeout(() => {
        setIsVisible(window.scrollY > threshold);
      }, 100);
    };

    // Добавляем обработчик события прокрутки
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Проверяем начальное положение прокрутки
    setIsVisible(window.scrollY > threshold);
    
    // Удаляем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [threshold]);

  // Функция для прокрутки страницы вверх (мгновенная прокрутка вместо плавной)
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed left-4 bottom-24 z-50 bg-dark-800/90 text-white p-3 rounded-full border border-dark-600 hover:bg-dark-600 transition-all shadow-lg backdrop-blur-sm animate-fade-in"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 text-primary-400" />
    </button>
  );
};

export default ScrollToTopButton;
