import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSeparatorProps {
  date: Date;
  activeDates?: Date[]; // Dates that have messages
  onDateClick?: (date: Date) => void;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date, activeDates = [], onDateClick }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  // Make sure we're using the correct month (October, not September)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    // Create a new date with the same year, month, and day
    const newDate = new Date();
    newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return newDate;
  });
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    // Normalize dates by removing time information
    const normalizeDate = (d: Date): string => {
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    };
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const normalizedDate = normalizeDate(date);
    const normalizedToday = normalizeDate(today);
    const normalizedYesterday = normalizeDate(yesterday);
    
    // Check if date is today
    if (normalizedDate === normalizedToday) {
      return 'Today';
    }
    
    // Check if date is yesterday
    if (normalizedDate === normalizedYesterday) {
      return 'Yesterday';
    }
    
    // Format as day + month
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long'
    };
    
    // Use English locale instead of Russian
    return date.toLocaleDateString('en-US', options);
  };
  
  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Generate calendar days
  const generateCalendarDays = () => {
    // Normalize dates by removing time information
    const normalizeDate = (d: Date): string => {
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    };
    
    // Debug current month
    console.log('Current month in calendar:', currentMonth);
    console.log('Current month value:', currentMonth.getMonth());
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay();
    // Adjust for Monday as first day of week
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Days in current month
    const daysInMonth = lastDay.getDate();
    
    // Calculate total cells needed (previous month days + current month days + next month days)
    const totalCells = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;
    
    // Days from next month to show
    const daysFromNextMonth = totalCells - (daysFromPrevMonth + daysInMonth);
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      days.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Current month days
    const today = new Date();
    const normalizedToday = normalizeDate(today);
    const normalizedDate = normalizeDate(date);
    
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const normalizedCurrentDate = normalizeDate(currentDate);
      
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isToday: normalizedCurrentDate === normalizedToday,
        isActive: activeDates.some(activeDate => 
          normalizeDate(activeDate) === normalizedCurrentDate
        ),
        isSelected: normalizedDate === normalizedCurrentDate
      });
    }
    
    // Next month days
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Format month and year for display
  const formatMonthYear = (date: Date): string => {
    // Make sure we're displaying the correct month (JavaScript months are 0-based)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Days of the week
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="relative">
      {/* Date Separator - Left aligned and styled like Telegram */}
      <div className="flex items-center justify-start my-6">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="bg-dark-700/80 backdrop-blur-sm text-gray-300 px-4 py-1.5 rounded-full border border-dark-600 hover:bg-dark-600 transition-all flex items-center space-x-2 group ml-4"
        >
          <Calendar className="w-3.5 h-3.5 text-primary-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">{formatDate(date)}</span>
        </button>
      </div>
      
      {/* Calendar Popup */}
      {showCalendar && (
        <div 
          ref={calendarRef}
          className="absolute left-0 right-0 mx-auto top-full mt-2 z-50 bg-dark-700 border border-dark-600 rounded-xl shadow-2xl p-4 w-72 animate-scale-in"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={goToPrevMonth}
              className="p-1.5 rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <h3 className="text-white font-medium text-sm">
              {formatMonthYear(currentMonth)}
            </h3>
            
            <button 
              onClick={goToNextMonth}
              className="p-1.5 rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <button
                key={index}
                onClick={() => {
                  if (onDateClick && day.isCurrentMonth) {
                    onDateClick(day.date);
                    setShowCalendar(false);
                  }
                }}
                disabled={!day.isCurrentMonth}
                className={`
                  w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all
                  ${day.isCurrentMonth ? 'hover:bg-dark-600' : 'text-gray-600 cursor-default'}
                  ${day.isToday ? 'border border-primary-500 text-primary-400' : ''}
                  ${day.isActive && day.isCurrentMonth ? 'bg-primary-500/20' : ''}
                  ${day.isSelected ? 'bg-primary-500 text-white' : ''}
                `}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSeparator;
