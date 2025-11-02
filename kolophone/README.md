# Kolophone - WebRTC Video Calling Platform

Система видеозвонков с использованием WebRTC, mediasoup и Socket.IO.

## Структура проекта

```
kolophone/
├── client/          # React клиент
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.tsx      # Главная страница
│   │   │   └── MeetingRoom.tsx   # Комната видеозвонка
│   │   ├── hooks/
│   │   │   └── useWebRTC.ts      # WebRTC логика
│   │   └── App.tsx
│   └── package.json
│
└── server/          # Node.js сервер
    ├── src/
    │   ├── config/              # Конфигурация
    │   ├── models/              # MongoDB модели
    │   ├── services/            # Бизнес-логика
    │   └── index.ts
    └── package.json
```

## Установка и запуск

### 1. Установка зависимостей

#### Server
```bash
cd kolophone/server
npm install
```

#### Client
```bash
cd kolophone/client
npm install
```

### 2. Конфигурация

Server уже настроен с `.env` файлом:
```env
PORT=3001
MONGODB_URI=mongodb+srv://...
MEDIASOUP_LISTEN_IP=0.0.0.0
MEDIASOUP_ANNOUNCED_IP=127.0.0.1
CLIENT_URL=http://localhost:5173
```

### 3. Запуск

#### Запустить Server (в одном терминале)
```bash
cd kolophone/server
npm run dev
```

Server запустится на `http://localhost:3001`

#### Запустить Client (в другом терминале)
```bash
cd kolophone/client
npm run dev
```

Client запустится на `http://localhost:5173`

## Использование

1. Откройте `http://localhost:5173` в браузере
2. Нажмите "Создать новую комнату" или введите код существующей комнаты
3. Разрешите доступ к камере и микрофону
4. Откройте ту же комнату в другой вкладке/браузере для тестирования

## Функционал

### Текущий функционал
- ✅ Создание комнат
- ✅ Присоединение к комнатам по коду
- ✅ Видео и аудио трансляция
- ✅ Включение/выключение камеры
- ✅ Включение/выключение микрофона
- ✅ Завершение звонка
- ✅ Автоматическое удаление пустых комнат

### Планируется
- ⏳ Демонстрация экрана
- ⏳ Авторизация через koltech-line
- ⏳ История звонков
- ⏳ Запись звонков
- ⏳ Чат во время звонка
- ⏳ Виртуальные фоны

## Технологии

### Client
- React + TypeScript
- Vite
- TailwindCSS
- mediasoup-client
- socket.io-client

### Server
- Node.js + TypeScript
- Express
- Socket.IO
- mediasoup (WebRTC SFU)
- MongoDB + Mongoose

## Архитектура

### WebRTC Flow

1. **Клиент подключается** к Socket.IO серверу
2. **Получает RTP capabilities** роутера
3. **Создает mediasoup device** с этими capabilities
4. **Присоединяется к комнате**
5. **Создает send transport** для отправки медиа
6. **Создает recv transport** для приема медиа
7. **Produce** - начинает отправлять видео/аудио
8. **Consume** - начинает получать медиа от других участников

### Компоненты

#### useWebRTC Hook
Управляет всей WebRTC логикой:
- Подключение к серверу
- Управление медиа устройствами
- Создание и управление transports
- Управление producers и consumers
- Обработка событий от других участников

#### MeetingRoom Component
UI для видеозвонка:
- Отображение локального видео
- Отображение видео других участников
- Кнопки управления (микрофон, камера, завершить)

## Troubleshooting

### Камера/микрофон не работают
- Проверьте разрешения браузера
- Убедитесь что используете HTTPS или localhost

### Не видно других участников
- Проверьте что server запущен
- Проверьте консоль браузера на ошибки
- Убедитесь что оба клиента в одной комнате

### Server не запускается
- Проверьте что MongoDB доступна
- Проверьте что порт 3001 свободен
- Проверьте RTC порты 10000-10100

## Разработка

### Server
```bash
cd kolophone/server
npm run dev  # Development с hot reload
npm run build  # Production build
npm start  # Запуск production
```

### Client
```bash
cd kolophone/client
npm run dev  # Development
npm run build  # Production build
npm run preview  # Preview production build
```

## Следующие шаги

1. **Установить зависимости** для client и server
2. **Запустить оба сервера**
3. **Протестировать** базовый функционал
4. **Добавить демонстрацию экрана**
5. **Интегрировать с koltech-line** для авторизации

## Лицензия

MIT
