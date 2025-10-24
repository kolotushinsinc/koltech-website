# KolTech Line Integration Guide

## 🎯 Цель
Заменить монолитный KolTechLine.tsx (3350 строк) на модульную версию используя созданные hooks и компоненты.

## 📋 Что уже создано:

### Hooks:
- `useFileUpload` - управление файлами
- `useWalls` - управление стенами
- `useMessages` - управление сообщениями
- `useCommentActions` - действия с комментариями
- `useMessageActions` - действия с сообщениями

### Components:
- `WallHeader` - шапка стены
- `EmptyWallState` - placeholder
- `MessageInput` - форма ввода

### Utils:
- `wallHelpers` - вспомогательные функции
- `constants` - константы
- `types` - TypeScript интерфейсы

## 🔄 План интеграции:

### Вариант 1: Постепенная миграция (РЕКОМЕНДУЕТСЯ)
1. Создать `KolTechLine.new.tsx` с новой архитектурой
2. Протестировать новую версию
3. Когда всё работает - заменить старый файл

### Вариант 2: Прямая замена (РИСКОВАННО)
1. Сразу переписать KolTechLine.tsx
2. Может сломать функционал

## 📝 Пример новой структуры KolTechLine.tsx:

```typescript
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../hooks/useToast';

// Наши новые hooks
import { useWalls } from '../hooks/koltech-line/useWalls';
import { useMessages } from '../hooks/koltech-line/useMessages';
import { useFileUpload } from '../hooks/koltech-line/useFileUpload';
import { useMessageActions } from '../hooks/koltech-line/useMessageActions';
import { useCommentActions } from '../hooks/koltech-line/useCommentActions';

// Наши новые компоненты
import WallHeader from '../components/koltech-line/WallHeader';
import EmptyWallState from '../components/koltech-line/EmptyWallState';
import MessageInput from '../components/koltech-line/MessageInput';

const KolTechLine = () => {
  const { wallId } = useParams();
  const { user, isLoggedIn } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // Используем наши hooks
  const { walls, allWalls, loadingWalls, joinWall, leaveWall } = useWalls({
    userId: user?._id,
    selectedCategory: 'all'
  });
  
  const { messages, loading, loadMoreMessages, updateMessage, removeMessage } = useMessages({
    wallId: wallId || '',
    userId: user?._id
  });
  
  const fileUpload = useFileUpload((msg) => showWarning(msg));
  
  const messageActions = useMessageActions({
    userId: user?._id,
    onSuccess: showSuccess,
    onError: showError
  });
  
  const commentActions = useCommentActions({
    userId: user?._id,
    onError: showError
  });
  
  // Локальный state (только UI состояние)
  const [newMessage, setNewMessage] = useState('');
  const [showWalls, setShowWalls] = useState(false);
  
  const currentWall = allWalls.find(w => w.id === wallId);
  
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      {!wallId ? (
        <EmptyWallState 
          onShowWalls={() => setShowWalls(true)}
          onCreateWall={() => {}}
        />
      ) : (
        <>
          <WallHeader 
            currentWall={currentWall}
            isLoggedIn={isLoggedIn()}
            onJoinWall={joinWall}
            onStartKolophone={() => {}}
          />
          
          {/* Messages list */}
          <div className="messages">
            {messages.map(msg => (
              <MessageCard key={msg.id} message={msg} />
            ))}
          </div>
          
          <MessageInput 
            value={newMessage}
            onChange={setNewMessage}
            onSend={() => {}}
            {...fileUpload}
            currentWall={currentWall}
            isLoggedIn={isLoggedIn()}
            isMember={currentWall?.isMember || false}
          />
        </>
      )}
    </div>
  );
};
```

## ⚠️ Важно:

Я создал **инфраструктуру** (hooks + компоненты), но **НЕ ИНТЕГРИРОВАЛ** их в KolTechLine.tsx.

Старый файл остался нетронутым - это безопасно, ничего не сломалось.

## 🚀 Что делать дальше?

**Вариант A**: Я могу создать полную новую версию KolTechLine.tsx прямо сейчас
**Вариант B**: Ты сам постепенно мигрируешь код используя созданные hooks
**Вариант C**: Оставить как есть - hooks готовы для будущего использования

Что предпочитаешь?
