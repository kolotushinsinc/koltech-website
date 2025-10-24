# KolTech Line Refactoring Plan

## 🎯 Цель
Разбить монолитный файл `KolTechLine.tsx` (3350 строк) на модульные компоненты и хуки для улучшения читаемости, поддерживаемости и тестируемости кода.

## 📊 Текущее состояние
- **Файл**: `koltechline/client/src/pages/KolTechLine.tsx`
- **Строк кода**: ~3350
- **Проблемы**: 
  - Сложно отлаживать
  - Трудно найти нужную логику
  - Много дублирования
  - Смешана UI и бизнес-логика

## 🏗️ Новая структура

### 1. Компоненты UI (`/components/koltech-line/`)

#### ✅ `WallHeader.tsx` (СОЗДАН)
- Шапка текущей стены
- Кнопки Join/Call
- Статистика стены

#### `WallsList.tsx`
- Список всех стен
- Фильтры по категориям
- Поиск стен
- Скелетон загрузки

#### `MessageCard.tsx`
- Карточка одного сообщения
- Реакции
- Меню действий
- Attachments через ImageCarousel

#### `MessageInput.tsx`
- Форма ввода сообщения
- Загрузка файлов (drag & drop)
- Preview файлов
- Баннеры (Reply, Edit)

#### `WallSidebar.tsx`
- Информация о стене
- Trending tags
- Online users
- Quick actions

#### `FiltersPanel.tsx`
- Фильтры категорий
- Фильтры по участникам
- Популярные теги

#### `EmptyWallState.tsx`
- Placeholder когда стена не выбрана
- Кнопки "Choose Wall" / "Create Wall"

### 2. Custom Hooks (`/hooks/`)

#### `useWalls.ts`
**Ответственность**: Управление списком стен
```typescript
export const useWalls = () => {
  const [walls, setWalls] = useState<Wall[]>([]);
  const [allWalls, setAllWalls] = useState<Wall[]>([]);
  const [loadingWalls, setLoadingWalls] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const loadWalls = async () => { ... };
  const loadSingleWall = async (wallId: string) => { ... };
  
  return {
    walls,
    allWalls,
    loadingWalls,
    selectedCategory,
    setSelectedCategory,
    loadWalls,
    loadSingleWall
  };
};
```

#### `useMessages.ts`
**Ответственность**: Загрузка и управление сообщениями
```typescript
export const useMessages = (wallId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const loadMessages = async (page: number, reset: boolean) => { ... };
  const loadMoreMessages = () => { ... };
  
  return {
    messages,
    setMessages,
    loading,
    hasMore,
    loadMessages,
    loadMoreMessages
  };
};
```

#### `useMessageActions.ts`
**Ответственность**: Действия над сообщениями
```typescript
export const useMessageActions = () => {
  const handleSendMessage = async (data: SendMessageData) => { ... };
  const handleEditMessage = async (id: string, content: string) => { ... };
  const handleDeleteMessage = async (id: string) => { ... };
  const handleLike = async (id: string) => { ... };
  const handleReaction = async (id: string, emoji: string) => { ... };
  const handleReport = async (id: string, reason: string) => { ... };
  
  return {
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleLike,
    handleReaction,
    handleReport
  };
};
```

#### `useCommentActions.ts`
**Ответственность**: Действия над комментариями
```typescript
export const useCommentActions = () => {
  const [messageReplies, setMessageReplies] = useState<{[key: string]: Message[]}>({});
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  
  const createComment = async (messageId: string, content: string, parentId?: string) => { ... };
  const toggleReplies = async (messageId: string) => { ... };
  const handleCommentReaction = async (commentId: string, emoji: string) => { ... };
  const buildCommentTree = (comments: any[], messageId: string) => { ... };
  
  return {
    messageReplies,
    expandedReplies,
    createComment,
    toggleReplies,
    handleCommentReaction,
    buildCommentTree
  };
};
```

#### `useFileUpload.ts`
**Ответственность**: Загрузка файлов
```typescript
export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => { ... };
  const addFiles = (files: File[]) => { ... };
  const removeFile = (index: number) => { ... };
  const handleDragOver = (e: React.DragEvent) => { ... };
  const handleDrop = (e: React.DragEvent) => { ... };
  
  return {
    selectedFiles,
    filePreviews,
    isDragging,
    handleFileSelect,
    addFiles,
    removeFile,
    handleDragOver,
    handleDrop,
    setSelectedFiles,
    setFilePreviews
  };
};
```

### 3. Utils/Helpers (`/utils/koltech-line/`)

#### `wallHelpers.ts`
```typescript
export const getCategoryIcon = (category: string) => { ... };
export const getCategoryColor = (category: string) => { ... };
export const formatTime = (date: Date) => { ... };
export const extractTagsFromContent = (content: string) => { ... };
```

#### `constants.ts`
```typescript
export const categories = [ ... ];
export const participantRanges = [ ... ];
export const popularTags = [ ... ];
```

### 4. Types (`/types/koltech-line.ts`)
```typescript
export interface Message { ... }
export interface Wall { ... }
export interface FilePreview { ... }
// и т.д.
```

## 📝 План реализации

### Фаза 1: Подготовка ✅ ЗАВЕРШЕНА
- [x] Создать план рефакторинга
- [x] Создать WallHeader компонент
- [x] Создать types файл (koltech-line.ts)
- [x] Создать utils/helpers (constants.ts, wallHelpers.ts)

### Фаза 2: Hooks ✅ ЗАВЕРШЕНА
- [x] Создать useWalls
- [x] Создать useMessages
- [x] Создать useMessageActions
- [x] Создать useCommentActions
- [x] Создать useFileUpload

### Фаза 3: UI Components ✅ ЗАВЕРШЕНА
- [x] Создать MessageCard
- [x] Создать MessageInput
- [x] Создать EmptyWallState
- [ ] Создать WallsList (опционально - можно добавить позже)
- [ ] Создать WallSidebar (опционально - можно добавить позже)
- [ ] Создать FiltersPanel (опционально - можно добавить позже)

### Фаза 4: Интеграция ✅ В ПРОЦЕССЕ
- [x] Создать KolTechLine.new.tsx с использованием новых компонентов
- [x] Добавить отдельный роут /koltech-line-new для тестирования
- [x] Исправить ошибки типов в MessageCard
- [ ] Протестировать функциональность
- [ ] Добавить недостающие компоненты (Header с переключателем стен)
- [ ] Оптимизация и финальная проверка
- [ ] Заменить старый KolTechLine.tsx на новый

### Фаза 5: Оптимизация
- [ ] Мемоизация компонентов (React.memo)
- [ ] useMemo/useCallback где нужно
- [ ] Code splitting (lazy loading)

## 🎯 Ожидаемый результат

### До:
```
KolTechLine.tsx - 3350 строк
```

### После:
```
KolTechLine.tsx - ~300 строк (композиция компонентов)
├── components/koltech-line/
│   ├── WallHeader.tsx - ~100 строк
│   ├── WallsList.tsx - ~200 строк
│   ├── MessageCard.tsx - ~150 строк
│   ├── MessageInput.tsx - ~200 строк
│   ├── WallSidebar.tsx - ~250 строк
│   ├── FiltersPanel.tsx - ~150 строк
│   └── EmptyWallState.tsx - ~50 строк
├── hooks/
│   ├── useWalls.ts - ~150 строк
│   ├── useMessages.ts - ~200 строк
│   ├── useMessageActions.ts - ~400 строк
│   ├── useCommentActions.ts - ~300 строк
│   └── useFileUpload.ts - ~150 строк
├── utils/koltech-line/
│   ├── wallHelpers.ts - ~100 строк
│   └── constants.ts - ~50 строк
└── types/
    └── koltech-line.ts - ~100 строк
```

**Итого**: ~2500 строк распределены по 15+ файлам вместо одного монолита

## ✅ Преимущества

1. **Читаемость**: Каждый файл отвечает за одну задачу
2. **Поддерживаемость**: Легко найти и исправить баги
3. **Тестируемость**: Можно тестировать каждый компонент/хук отдельно
4. **Переиспользование**: Hooks можно использовать в других компонентах
5. **Performance**: Можно оптимизировать отдельные части
6. **Collaboration**: Несколько разработчиков могут работать параллельно

## 🚀 Следующие шаги

Хочешь чтобы я:
1. Продолжил создавать компоненты и хуки по этому плану?
2. Или сначала обсудим/скорректируем план?
3. Или начнем с конкретной части (например, сначала все hooks, потом компоненты)?

Скажи что предпочитаешь и я продолжу! 💪
