import { useState, useEffect, useCallback } from 'react';
import { linkPreviewApi } from '../utils/api';

export interface LinkMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export const useLinkPreview = (text: string) => {
  const [linkPreviews, setLinkPreviews] = useState<Map<string, LinkMetadata>>(new Map());
  const [loading, setLoading] = useState(false);

  // Извлекаем URL из текста (с протоколом и без)
  const extractUrls = useCallback((text: string): string[] => {
    // Match both http(s):// URLs and domain-like patterns (e.g., vk.com/page)
    const urlRegex = /(https?:\/\/[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
    const matches = text.match(urlRegex);
    
    // Normalize URLs - add https:// if missing
    return (matches || []).map(url => 
      url.match(/^https?:\/\//) ? url : `https://${url}`
    );
  }, []);

  // Загружаем метаданные для URL
  const fetchPreview = useCallback(async (url: string) => {
    try {
      const response = await linkPreviewApi.getPreview(url);
      return response.metadata as LinkMetadata;
    } catch (error) {
      console.error('Error fetching link preview:', error);
      return {
        url,
        title: new URL(url).hostname
      };
    }
  }, []);

  // Автоматически загружаем превью при изменении текста
  useEffect(() => {
    const urls = extractUrls(text);
    
    if (urls.length === 0) {
      setLinkPreviews(new Map());
      return;
    }

    setLoading(true);

    // Загружаем превью только для первого найденного URL
    const firstUrl = urls[0];
    
    // Проверяем кэш для первого URL
    if (linkPreviews.has(firstUrl)) {
      setLinkPreviews(new Map([[firstUrl, linkPreviews.get(firstUrl)!]]));
      setLoading(false);
      return;
    }
    
    // Загружаем превью только для первого URL
    fetchPreview(firstUrl).then((metadata) => {
      const newPreviews = new Map([[firstUrl, metadata]]);
      setLinkPreviews(newPreviews);
      setLoading(false);
    });
  }, [text, extractUrls, fetchPreview]);

  return {
    linkPreviews,
    loading,
    hasLinks: linkPreviews.size > 0
  };
};
