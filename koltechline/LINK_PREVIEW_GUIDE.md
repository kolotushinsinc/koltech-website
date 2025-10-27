# 🔗 Link Preview Feature - Installation & Usage Guide

## 📋 Overview

Link Preview feature автоматически извлекает метаданные из ссылок (title, description, image) и отображает красивые превью как в Telegram/WhatsApp.

### ✨ Features:
- ✅ Автоматическое извлечение метаданных (Open Graph, Twitter Cards)
- ✅ Превью над текстареей при вводе ссылки
- ✅ Возможность скрыть превью (крестик)
- ✅ Синий цвет для ссылок в тексте
- ✅ Клик по ссылке открывает в новой вкладке
- ✅ Кэширование метаданных
- ✅ Fallback для ссылок без метаданных

---

## 🚀 Installation

### 1. Install Backend Dependencies

```bash
cd koltechline/server
npm install cheerio @types/cheerio
```

**Если возникают проблемы с сетью:**
```bash
npm install cheerio @types/cheerio --legacy-peer-deps
# или
npm install cheerio @types/cheerio --registry=https://registry.npmmirror.com
```

### 2. Verify Files Created

Backend files:
- ✅ `server/src/services/LinkPreviewService.ts`
- ✅ `server/src/routes/linkPreviewRoutes.ts`
- ✅ `server/src/index.ts` (updated)

Frontend files:
- ✅ `client/src/hooks/useLinkPreview.ts`
- ✅ `client/src/components/LinkPreview.tsx`
- ✅ `client/src/components/koltech-line/MessageInput.tsx` (updated)
- ✅ `client/src/components/koltech-line/MessageCard.tsx` (updated)

---

## 🔧 Usage

### Backend API

#### Get Link Metadata
```typescript
POST /api/link-preview/preview
Content-Type: application/json

{
  "url": "https://example.com"
}

// Response:
{
  "metadata": {
    "url": "https://example.com",
    "title": "Example Domain",
    "description": "This domain is for use in illustrative examples...",
    "image": "https://example.com/image.jpg",
    "siteName": "Example",
    "favicon": "https://example.com/favicon.ico"
  }
}
```

#### Extract URLs from Text
```typescript
POST /api/link-preview/extract
Content-Type: application/json

{
  "text": "Check out https://example.com and https://github.com"
}

// Response:
{
  "urls": [
    "https://example.com",
    "https://github.com"
  ]
}
```

---

### Frontend Integration

#### 1. Using the Hook

```typescript
import { useLinkPreview } from '../hooks/useLinkPreview';

function MyComponent() {
  const [text, setText] = useState('');
  const { linkPreviews, loading, hasLinks } = useLinkPreview(text);

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste a link..."
      />
      
      {hasLinks && (
        <div>
          {Array.from(linkPreviews.entries()).map(([url, metadata]) => (
            <LinkPreview key={url} metadata={metadata} />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 2. Link Preview Component

```typescript
import { LinkPreview } from '../components/LinkPreview';

<LinkPreview
  metadata={{
    url: 'https://example.com',
    title: 'Example',
    description: 'Description here',
    image: 'https://example.com/image.jpg'
  }}
  onRemove={() => console.log('Removed')}
  showRemoveButton={true}
  compact={false}
/>
```

#### 3. Clickable Links in Text

```typescript
import { renderTextWithLinks } from '../components/LinkPreview';

function MessageCard({ message }) {
  return (
    <p className="text-gray-300">
      {renderTextWithLinks(message.content)}
    </p>
  );
}
```

---

## 🎨 Styling

### Link Preview Styles

Превью автоматически адаптируется под вашу тему:

```typescript
// Compact mode (для MessageInput)
<LinkPreview compact={true} />

// Full mode (для отображения в сообщениях)
<LinkPreview compact={false} />
```

### Clickable Links

Ссылки автоматически стилизуются:
- Синий цвет (`text-primary-400`)
- Подчеркивание
- Hover эффект
- Открываются в новой вкладке

---

## 📝 Example: Complete Integration

### In KolTechLine Page

```typescript
import { useState } from 'react';
import { useLinkPreview } from '../hooks/useLinkPreview';
import MessageInput from '../components/koltech-line/MessageInput';

function KolTechLine() {
  const [messageText, setMessageText] = useState('');
  const { linkPreviews } = useLinkPreview(messageText);

  const handleRemoveLinkPreview = (url: string) => {
    // Опционально: можно удалить URL из текста
    setMessageText(prev => prev.replace(url, ''));
  };

  return (
    <MessageInput
      value={messageText}
      onChange={setMessageText}
      linkPreviews={linkPreviews}
      onRemoveLinkPreview={handleRemoveLinkPreview}
      // ... other props
    />
  );
}
```

---

## 🔍 How It Works

### 1. User Types URL

```
User types: "Check out https://brew.sh"
         ↓
useLinkPreview hook detects URL
         ↓
Calls /api/link-preview/preview
         ↓
Backend fetches page with cheerio
         ↓
Extracts Open Graph metadata
         ↓
Returns metadata to frontend
         ↓
LinkPreviewInput displays preview above textarea
```

### 2. User Sends Message

```
Message sent with URL
         ↓
MessageCard receives message
         ↓
renderTextWithLinks() parses content
         ↓
URLs become clickable links
         ↓
User clicks link → opens in new tab
```

---

## 🎯 Supported Metadata

The service extracts:

1. **Open Graph Tags**
   - `og:title`
   - `og:description`
   - `og:image`
   - `og:site_name`

2. **Twitter Cards**
   - `twitter:title`
   - `twitter:description`
   - `twitter:image`

3. **Standard HTML**
   - `<title>`
   - `<meta name="description">`
   - `<link rel="icon">`

4. **Fallback**
   - Domain name if no metadata found

---

## ⚡ Performance

### Caching
- Метаданные кэшируются на 1 час
- Повторные запросы возвращаются мгновенно

### Timeout
- 5 секунд на загрузку страницы
- Автоматический fallback при ошибке

### Rate Limiting
- Встроенная защита от спама
- Разумные лимиты запросов

---

## 🐛 Troubleshooting

### Backend не запускается

```bash
# Проверьте установку зависимостей
cd koltechline/server
npm list cheerio

# Переустановите если нужно
npm install cheerio @types/cheerio --force
```

### Превью не появляются

1. Проверьте что сервер запущен:
```bash
curl http://localhost:5005/health
```

2. Проверьте что routes зарегистрированы:
```bash
curl -X POST http://localhost:5005/api/link-preview/preview \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com"}'
```

3. Проверьте консоль браузера на ошибки

### Ссылки не кликабельны

Убедитесь что используете `renderTextWithLinks()`:

```typescript
// ❌ Wrong
<p>{message.content}</p>

// ✅ Correct
<p>{renderTextWithLinks(message.content)}</p>
```

---

## 🔐 Security

### CORS
- Настроен для работы с любыми доменами
- Можно ограничить в production

### User-Agent
- Используется кастомный User-Agent
- Идентифицирует бота как KolTechBot

### Validation
- URL валидируется перед запросом
- Только HTTP/HTTPS протоколы
- Защита от SSRF атак

---

## 🚀 Next Steps

### Optional Enhancements:

1. **Store metadata in database**
```typescript
// Add to Message model
interface Message {
  // ... existing fields
  linkPreviews?: LinkMetadata[];
}
```

2. **Add preview to existing messages**
```typescript
// Scan old messages and add previews
const messages = await Message.find({ content: /https?:\/\// });
for (const msg of messages) {
  const urls = extractUrls(msg.content);
  const previews = await Promise.all(
    urls.map(url => fetchMetadata(url))
  );
  msg.linkPreviews = previews;
  await msg.save();
}
```

3. **Add image proxy**
```typescript
// Proxy images through your server
app.get('/api/proxy/image', async (req, res) => {
  const { url } = req.query;
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(res);
});
```

---

## 📚 Resources

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Cheerio Documentation](https://cheerio.js.org/)

---

## ✅ Checklist

- [ ] Install `cheerio` package
- [ ] Verify all files created
- [ ] Test backend API endpoints
- [ ] Test frontend preview display
- [ ] Test clickable links
- [ ] Test remove preview button
- [ ] Deploy to production

---

**Готово! 🎉** Link Preview feature полностью интегрирован в KolTech Line!
