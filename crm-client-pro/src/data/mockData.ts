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

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  avatar?: string;
  phone: string;
  status: 'active' | 'inactive';
  joined_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface ProProject {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  client_id: string;
  employee_id: string;
  budget: number;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'employee' | 'client';
  sender_name: string;
  message: string;
  timestamp: string;
  client_id: string;
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

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan.petrov@koltech.com',
    position: 'Senior Frontend Developer',
    department: 'Разработка',
    phone: '+7 (999) 123-45-67',
    status: 'active',
    joined_at: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Анна Смирнова',
    email: 'anna.smirnova@koltech.com',
    position: 'UI/UX Designer',
    department: 'Дизайн',
    phone: '+7 (999) 234-56-78',
    status: 'active',
    joined_at: '2023-03-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'Дмитрий Козлов',
    email: 'dmitry.kozlov@koltech.com',
    position: 'Backend Developer',
    department: 'Разработка',
    phone: '+7 (999) 345-67-89',
    status: 'active',
    joined_at: '2023-02-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Елена Волкова',
    email: 'elena.volkova@koltech.com',
    position: 'Project Manager',
    department: 'Управление',
    phone: '+7 (999) 456-78-90',
    status: 'active',
    joined_at: '2022-11-05T00:00:00Z',
  },
  {
    id: '5',
    name: 'Александр Новиков',
    email: 'alex.novikov@koltech.com',
    position: 'DevOps Engineer',
    department: 'Инфраструктура',
    phone: '+7 (999) 567-89-01',
    status: 'active',
    joined_at: '2023-04-12T00:00:00Z',
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Михаил Соколов',
    email: 'mikhail@techcorp.ru',
    company: 'TechCorp Solutions',
    phone: '+7 (495) 123-45-67',
    status: 'active',
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    name: 'Ольга Иванова',
    email: 'olga@innovate.com',
    company: 'Innovate Digital',
    phone: '+7 (495) 234-56-78',
    status: 'active',
    created_at: '2024-02-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Сергей Морозов',
    email: 'sergey@startuplab.io',
    company: 'StartupLab Inc.',
    phone: '+7 (495) 345-67-89',
    status: 'active',
    created_at: '2024-03-20T00:00:00Z',
  },
  {
    id: '4',
    name: 'Наталья Павлова',
    email: 'natalia@bizgroup.ru',
    company: 'BizGroup Holdings',
    phone: '+7 (495) 456-78-90',
    status: 'active',
    created_at: '2024-04-05T00:00:00Z',
  },
];

export const mockProProjects: ProProject[] = [
  {
    id: '1',
    title: 'E-commerce платформа',
    description: 'Разработка полнофункциональной платформы для онлайн-торговли с интеграцией платежных систем',
    status: 'in_progress',
    client_id: '1',
    employee_id: '1',
    budget: 2500000,
    deadline: '2025-12-31T00:00:00Z',
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-09-30T00:00:00Z',
  },
  {
    id: '2',
    title: 'Корпоративный портал',
    description: 'Создание внутреннего портала для управления документами и коммуникациями',
    status: 'in_progress',
    client_id: '2',
    employee_id: '4',
    budget: 1800000,
    deadline: '2025-11-15T00:00:00Z',
    created_at: '2025-07-15T00:00:00Z',
    updated_at: '2025-09-28T00:00:00Z',
  },
  {
    id: '3',
    title: 'Мобильное приложение',
    description: 'Разработка iOS и Android приложения для управления задачами',
    status: 'planning',
    client_id: '3',
    employee_id: '3',
    budget: 3200000,
    deadline: '2026-02-28T00:00:00Z',
    created_at: '2025-09-20T00:00:00Z',
    updated_at: '2025-09-25T00:00:00Z',
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'client',
    sender_name: 'Михаил Соколов',
    message: 'Здравствуйте! Хотел уточнить по срокам проекта E-commerce платформы.',
    timestamp: '2025-09-30T10:30:00Z',
    client_id: '1',
  },
  {
    id: '2',
    sender: 'employee',
    sender_name: 'Иван Петров',
    message: 'Добрый день! Согласно текущему плану, мы завершим разработку к концу декабря.',
    timestamp: '2025-09-30T10:35:00Z',
    client_id: '1',
  },
  {
    id: '3',
    sender: 'client',
    sender_name: 'Михаил Соколов',
    message: 'Отлично! А когда будет готова тестовая версия для демонстрации?',
    timestamp: '2025-09-30T10:40:00Z',
    client_id: '1',
  },
  {
    id: '4',
    sender: 'employee',
    sender_name: 'Иван Петров',
    message: 'Планируем показать первую версию через 2 недели.',
    timestamp: '2025-09-30T10:42:00Z',
    client_id: '1',
  },
  {
    id: '5',
    sender: 'client',
    sender_name: 'Ольга Иванова',
    message: 'Добрый день! Нужна консультация по интеграции с 1С.',
    timestamp: '2025-09-30T14:20:00Z',
    client_id: '2',
  },
  {
    id: '6',
    sender: 'employee',
    sender_name: 'Елена Волкова',
    message: 'Здравствуйте, Ольга! Конечно, давайте обсудим детали.',
    timestamp: '2025-09-30T14:25:00Z',
    client_id: '2',
  },
];
