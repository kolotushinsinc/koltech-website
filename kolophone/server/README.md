# Kolophone Server

WebRTC видеозвонки с использованием mediasoup и Socket.IO.

## Технологии

- **Node.js** + **TypeScript**
- **Express** - HTTP сервер
- **Socket.IO** - WebSocket коммуникация
- **mediasoup** - WebRTC SFU (Selective Forwarding Unit)
- **MongoDB** - База данных для хранения комнат
- **Mongoose** - ODM для MongoDB

## Установка

```bash
npm install
```

## Конфигурация

Создайте файл `.env` (уже создан):

```env
PORT=3001
MONGODB_URI=mongodb+srv://...
MEDIASOUP_LISTEN_IP=0.0.0.0
MEDIASOUP_ANNOUNCED_IP=127.0.0.1
CLIENT_URL=http://localhost:5173
```

## Запуск

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Архитектура

### Структура проекта

```
server/
├── src/
│   ├── config/          # Конфигурация
│   │   ├── database.ts  # MongoDB подключение
│   │   └── mediasoup.ts # mediasoup настройки
│   ├── models/          # Mongoose модели
│   │   └── Room.ts      # Модель комнаты
│   ├── services/        # Бизнес-логика
│   │   ├── MediasoupService.ts  # Управление mediasoup
│   │   └── SocketHandler.ts     # Socket.IO обработчики
│   ├── types/           # TypeScript типы
│   │   └── index.ts
│   └── index.ts         # Точка входа
├── .env
├── package.json
└── tsconfig.json
```

### Основные компоненты

#### MediasoupService
Управляет mediasoup workers, routers, transports, producers и consumers.

#### SocketHandler
Обрабатывает Socket.IO события:
- `getRouterRtpCapabilities` - Получение RTP capabilities роутера
- `joinRoom` - Присоединение к комнате
- `createWebRtcTransport` - Создание WebRTC транспорта
- `connectTransport` - Подключение транспорта
- `produce` - Начало передачи медиа (камера/микрофон)
- `consume` - Начало приема медиа от других участников
- `pauseProducer` / `resumeProducer` - Управление медиа потоками

## WebRTC Flow

1. **Клиент подключается** к Socket.IO серверу
2. **Получает RTP capabilities** роутера
3. **Создает device** на клиенте с этими capabilities
4. **Присоединяется к комнате** (joinRoom)
5. **Создает send transport** для отправки медиа
6. **Создает recv transport** для приема медиа
7. **Produce** - начинает отправлять видео/аудио
8. **Consume** - начинает получать медиа от других участников

## Порты

- **3001** - HTTP/WebSocket сервер
- **10000-10100** - RTC порты для mediasoup

## Безопасность

На данный момент авторизация не реализована. В будущем будет интеграция с koltech-line для проверки JWT токенов.

## Масштабирование

mediasoup поддерживает несколько workers для распределения нагрузки. Количество workers настраивается при инициализации MediasoupService.

## Мониторинг

Health check endpoint: `GET /health`

## Troubleshooting

### mediasoup worker died
Проверьте доступность RTC портов (10000-10100)

### MongoDB connection error
Проверьте MONGODB_URI в .env файле

### CORS errors
Убедитесь что CLIENT_URL правильно настроен
