import React from 'react';
import { X, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { LinkMetadata } from '../hooks/useLinkPreview';

// Skeleton loader for link previews
export const LinkPreviewSkeleton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className="relative">
      <div
        className={`block rounded-xl border border-dark-600 bg-gradient-to-br from-dark-700 to-dark-800 overflow-hidden animate-pulse ${
          compact ? 'p-2' : 'p-3'
        }`}
      >
        {/* Верхняя часть: Favicon + Заголовок + Описание */}
        <div className="flex items-start space-x-3 mb-3">
          {/* Favicon placeholder */}
          <div className="flex-shrink-0">
            <div className="w-5 h-5 bg-dark-600 rounded"></div>
          </div>

          {/* Контент */}
          <div className="flex-1 min-w-0">
            {/* Заголовок placeholder */}
            <div className="h-4 bg-dark-600 rounded-full w-3/4 mb-2"></div>

            {/* Описание placeholder - только если не compact */}
            {!compact && (
              <div className="space-y-1 mb-2">
                <div className="h-2 bg-dark-600 rounded-full w-full"></div>
                <div className="h-2 bg-dark-600 rounded-full w-5/6"></div>
                <div className="h-2 bg-dark-600 rounded-full w-4/6"></div>
              </div>
            )}

            {/* URL placeholder */}
            <div className="h-2 bg-dark-600 rounded-full w-1/3"></div>
          </div>
        </div>

        {/* Нижняя часть: Изображение placeholder - только если не compact */}
        {!compact && (
          <div className="w-full h-32 bg-dark-600 rounded-lg"></div>
        )}
      </div>
    </div>
  );
};

interface LinkPreviewProps {
  metadata: LinkMetadata;
  onRemove?: () => void;
  showRemoveButton?: boolean;
  compact?: boolean;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  metadata,
  onRemove,
  showRemoveButton = false,
  compact = false
}) => {
  const hasMetadata = metadata.title || metadata.description || metadata.image;

  // Если нет метаданных - не показываем превью
  if (!hasMetadata && !compact) {
    return null;
  }

  return (
    <div className="relative group">
      <a
        href={metadata.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block rounded-xl border border-dark-600 bg-gradient-to-br from-dark-700 to-dark-800 overflow-hidden hover:border-primary-500/50 transition-all ${
          compact ? 'p-2' : 'p-3'
        }`}
      >
        {/* Верхняя часть: Favicon + Заголовок + Описание */}
        <div className="flex items-start space-x-3 mb-3">
          {/* Favicon или иконка */}
          <div className="flex-shrink-0">
            {metadata.favicon ? (
              <img
                src={metadata.favicon}
                alt=""
                className="w-5 h-5 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <LinkIcon className="w-5 h-5 text-primary-400" />
            )}
          </div>

          {/* Контент */}
          <div className="flex-1 min-w-0">
            {/* Заголовок */}
            {metadata.title && (
              <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                {metadata.title}
              </h4>
            )}

            {/* Описание - показываем больше текста */}
            {metadata.description && !compact && (
              <p className="text-gray-400 text-xs line-clamp-3 mb-2 leading-relaxed">
                {metadata.description}
              </p>
            )}

            {/* URL */}
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span className="truncate">
                {metadata.siteName || new URL(metadata.url).hostname}
              </span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Нижняя часть: Большое изображение на всю ширину (как в Telegram) */}
        {metadata.image && !compact && (
          <div className="w-full">
            <img
              src={metadata.image}
              alt={metadata.title || ''}
              className="w-full h-auto max-h-64 object-contain rounded-lg bg-dark-900"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </a>

      {/* Кнопка удаления */}
      {showRemoveButton && onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 p-1.5 bg-dark-900/80 hover:bg-red-500 text-gray-400 hover:text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Компонент для отображения превью в MessageInput (над текстареей)
export const LinkPreviewInput: React.FC<{
  previews: Map<string, LinkMetadata>;
  onRemove: (url: string) => void;
}> = ({ previews, onRemove }) => {
  if (previews.size === 0) return null;

  // Only show preview for the first link
  const [firstUrl, firstMetadata] = Array.from(previews.entries())[0];

  return (
    <div className="space-y-2 mb-2">
      <LinkPreview
        key={firstUrl}
        metadata={firstMetadata}
        onRemove={() => onRemove(firstUrl)}
        showRemoveButton
        compact
      />
    </div>
  );
};

// Утилита для рендеринга текста с кликабельными ссылками
export const renderTextWithLinks = (text: string): React.ReactNode => {
  // Match both http(s):// URLs and domain-like patterns (e.g., vk.com/page)
  const urlRegex = /(https?:\/\/[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      // Add https:// if URL doesn't have protocol
      const href = part.match(/^https?:\/\//) ? part : `https://${part}`;
      
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:text-primary-300 underline transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};
