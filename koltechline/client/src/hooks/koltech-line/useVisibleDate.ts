import { useState, useEffect, useCallback } from 'react';

interface UseVisibleDateProps {
  messagesLength: number;
}

/**
 * Hook для отслеживания текущей видимой даты при прокрутке сообщений
 */
export const useVisibleDate = ({ messagesLength }: UseVisibleDateProps) => {
  const [currentVisibleDate, setCurrentVisibleDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Форматирование даты для сравнения (убираем время)
  const formatDateForComparison = useCallback((date: Date): string => {
    // Создаем новую дату только с годом, месяцем и днем (без времени)
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    // Возвращаем timestamp для надежного сравнения
    return normalized.getTime().toString();
  }, []);

  // Проверка, является ли дата сегодняшней
  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  // Обработчик прокрутки для отслеживания видимой даты
  const handleScroll = useCallback(() => {
    // Получаем все секции с датами
    const dateSections = Array.from(document.querySelectorAll('[id^="date-"]'));
    
    if (dateSections.length === 0) return;
    
    // Находим верхнюю видимую секцию с датой
    const visibleSections = dateSections.filter(section => {
      const rect = section.getBoundingClientRect();
      // Считаем секцию видимой, если её верхняя часть находится в пределах видимой области или чуть выше
      return rect.top <= 200 && rect.bottom > 0;
    });
    
    if (visibleSections.length === 0) return;
    
    // Сортируем по позиции (сверху вниз)
    const sortedSections = visibleSections.sort((a, b) => {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      return rectA.top - rectB.top;
    });
    
    // Используем самую верхнюю видимую секцию с датой
    const topSection = sortedSections[0];
    const dateId = topSection.id;
    
    if (dateId.startsWith('date-')) {
      // dateKey теперь timestamp, поэтому нужно преобразовать его обратно в дату
      const timestamp = parseInt(dateId.replace('date-', ''));
      if (!isNaN(timestamp)) {
        // Создаем новый объект даты из timestamp
        const newDate = new Date(timestamp);
        
        // Проверяем, отличается ли эта дата от текущей отображаемой
        if (!currentVisibleDate || 
            formatDateForComparison(newDate) !== formatDateForComparison(currentVisibleDate)) {
          
          // Обновляем текущую видимую дату фактической датой из сообщения
          // Это гарантирует, что заголовок всегда показывает дату сообщений, которые сейчас в поле зрения
          setCurrentVisibleDate(newDate);
          
          // Также обновляем выбранную дату, чтобы она соответствовала текущей видимой дате
          // Это гарантирует, что календарь показывает правильную выбранную дату
          setSelectedDate(newDate);
          
          console.log('Прокрутка: Обновлена дата на:', newDate.toDateString());
        }
      }
    }
  }, [currentVisibleDate, formatDateForComparison]);

  // Настройка обработчика прокрутки
  useEffect(() => {
    if (messagesLength === 0) return;
    
    // Инициализируем сегодняшней датой, если дата не установлена
    if (!currentVisibleDate) {
      setCurrentVisibleDate(new Date());
    }
    
    // Добавляем обработчик события прокрутки
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Вызываем один раз при монтировании для установки начальной даты
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [messagesLength, handleScroll, currentVisibleDate]);

  // Обработчик клика по дате в календаре
  const handleDateClick = useCallback((date: Date, activeDates: Date[]) => {
    setSelectedDate(date);
    
    // Немедленно обновляем текущую видимую дату, чтобы она соответствовала выбранной дате
    // Это гарантирует, что заголовок обновится сразу при клике на дату
    setCurrentVisibleDate(date);
    
    // Прокручиваем к секции с датой, если она существует
    const dateKey = formatDateForComparison(date);
    const dateElement = document.getElementById(`date-${dateKey}`);
    
    if (dateElement) {
      // Если элемент с датой существует, прокручиваем к нему
      // Используем block: 'start', чтобы прокрутить к началу секции с датой
      // Это покажет первое сообщение этой даты в верхней части области просмотра
      dateElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      console.log(`Прокрутка к началу сообщений для ${date.toDateString()}`);
    } else {
      // Если дата не существует, находим ближайшую дату с сообщениями
      const clickedTimestamp = parseInt(dateKey);
      
      // Преобразуем все активные даты в timestamps для сравнения
      const activeTimestamps = activeDates.map(d => parseInt(formatDateForComparison(d)));
      
      if (activeTimestamps.length > 0) {
        // Сортируем timestamps, чтобы найти ближайшую дату в прошлом
        // Это гарантирует, что мы прокрутим к прошлым сообщениям, а не к будущим
        const pastTimestamps = activeTimestamps.filter(ts => ts <= clickedTimestamp);
        
        // Если нет дат в прошлом, используем самую старую доступную дату
        const nearestTimestamp = pastTimestamps.length > 0 
          ? Math.max(...pastTimestamps)  // Получаем самую последнюю дату в прошлом
          : Math.min(...activeTimestamps);  // Если нет прошлых дат, получаем самую старую дату
        
        // Прокручиваем к ближайшей дате
        const nearestElement = document.getElementById(`date-${nearestTimestamp}`);
        if (nearestElement) {
          nearestElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Обновляем текущую видимую дату, чтобы она соответствовала ближайшей дате
          const nearestDate = new Date(nearestTimestamp);
          setCurrentVisibleDate(nearestDate);
          
          console.log(`Прокрутка к ближайшей дате в прошлом: ${new Date(nearestTimestamp).toDateString()}`);
          
          return {
            nearestDate,
            message: `Нет сообщений на ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}. Показаны ближайшие сообщения.`
          };
        }
      }
    }
    
    return { nearestDate: null, message: '' };
  }, [formatDateForComparison]);

  return {
    currentVisibleDate,
    selectedDate,
    setCurrentVisibleDate,
    setSelectedDate,
    handleDateClick,
    formatDateForComparison
  };
};
