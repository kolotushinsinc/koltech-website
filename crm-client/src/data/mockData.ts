export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  created_at: string;
  updated_at: string;
}

export interface FeedbackMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Редизайн корпоративного сайта',
    description: 'Полная переработка дизайна и структуры корпоративного веб-сайта компании с акцентом на современный UI/UX',
    status: 'active',
    created_at: '2025-09-15T10:00:00Z',
    updated_at: '2025-09-28T14:30:00Z',
  },
  {
    id: '2',
    title: 'Мобильное приложение для клиентов',
    description: 'Разработка нативного мобильного приложения для iOS и Android с функциями отслеживания заказов',
    status: 'active',
    created_at: '2025-08-20T09:00:00Z',
    updated_at: '2025-09-25T16:45:00Z',
  },
  {
    id: '3',
    title: 'Интеграция платежной системы',
    description: 'Внедрение новой платежной системы с поддержкой международных транзакций и криптовалют',
    status: 'completed',
    created_at: '2025-07-10T11:30:00Z',
    updated_at: '2025-09-01T10:00:00Z',
  },
  {
    id: '4',
    title: 'CRM-система для отдела продаж',
    description: 'Создание кастомной CRM-системы для управления клиентской базой и аналитики продаж',
    status: 'active',
    created_at: '2025-09-01T08:00:00Z',
    updated_at: '2025-09-29T12:00:00Z',
  },
  {
    id: '5',
    title: 'Автоматизация складского учета',
    description: 'Разработка системы автоматизации складских процессов с интеграцией сканеров штрих-кодов',
    status: 'on_hold',
    created_at: '2025-06-15T13:00:00Z',
    updated_at: '2025-08-10T09:30:00Z',
  },
  {
    id: '6',
    title: 'Система аналитики и отчетности',
    description: 'Внедрение BI-системы для визуализации данных и генерации автоматических отчетов',
    status: 'completed',
    created_at: '2025-05-01T10:00:00Z',
    updated_at: '2025-07-15T15:00:00Z',
  },
];

export const mockFeedback: FeedbackMessage[] = [
  {
    id: '1',
    name: 'Алексей Петров',
    email: 'alex.petrov@example.com',
    message: 'Здравствуйте! Хотел бы узнать о возможности интеграции вашей CRM-системы с нашим существующим ERP. Есть ли у вас опыт работы с SAP?',
    status: 'new',
    created_at: '2025-09-30T15:30:00Z',
  },
  {
    id: '2',
    name: 'Мария Соколова',
    email: 'maria.sokolova@company.ru',
    message: 'Отличная работа с редизайном! Сайт стал намного быстрее и удобнее. Спасибо команде за профессионализм.',
    status: 'replied',
    created_at: '2025-09-29T11:20:00Z',
  },
  {
    id: '3',
    name: 'Дмитрий Иванов',
    email: 'd.ivanov@mail.com',
    message: 'Интересует разработка мобильного приложения для нашего бизнеса. Можете прислать коммерческое предложение и примеры работ?',
    status: 'new',
    created_at: '2025-09-30T09:45:00Z',
  },
  {
    id: '4',
    name: 'Елена Кузнецова',
    email: 'elena.k@example.com',
    message: 'После последнего обновления возникла небольшая проблема с отображением графиков в мобильной версии. Можете посмотреть?',
    status: 'read',
    created_at: '2025-09-28T14:15:00Z',
  },
  {
    id: '5',
    name: 'Сергей Волков',
    email: 'volkov.sergey@corp.ru',
    message: 'Хотим заказать аудит безопасности нашей системы. Какие у вас есть услуги в этом направлении?',
    status: 'new',
    created_at: '2025-09-30T16:00:00Z',
  },
  {
    id: '6',
    name: 'Ольга Морозова',
    email: 'olga.morozova@test.com',
    message: 'Благодарю за быструю реакцию на наш запрос! Все вопросы решены оперативно.',
    status: 'replied',
    created_at: '2025-09-27T10:30:00Z',
  },
];
