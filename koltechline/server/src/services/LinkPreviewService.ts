import axios from 'axios';
import * as cheerio from 'cheerio';

type CheerioAPI = ReturnType<typeof cheerio.load>;

interface LinkMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

class LinkPreviewService {
  private cache: Map<string, LinkMetadata> = new Map();
  private readonly timeout = 5000; // 5 секунд таймаут

  // Извлекаем метаданные из URL
  async fetchMetadata(url: string): Promise<LinkMetadata> {
    // Проверяем кэш
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    try {
      // Валидация URL
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Invalid protocol');
      }

      // Загружаем страницу
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KolTechBot/1.0; +https://koltech.dev)'
        },
        maxRedirects: 5
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Извлекаем метаданные
      const metadata: LinkMetadata = {
        url,
        title: this.extractTitle($),
        description: this.extractDescription($),
        image: this.extractImage($, url),
        siteName: this.extractSiteName($),
        favicon: this.extractFavicon($, url)
      };

      // Кэшируем на 1 час
      this.cache.set(url, metadata);
      setTimeout(() => this.cache.delete(url), 3600000);

      return metadata;
    } catch (error) {
      console.error('Error fetching link metadata:', error);
      
      // Возвращаем минимальные данные
      return {
        url,
        title: this.extractDomainName(url)
      };
    }
  }

  private extractTitle($: CheerioAPI): string | undefined {
    // Пробуем разные источники
    return (
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      undefined
    );
  }

  private extractDescription($: CheerioAPI): string | undefined {
    return (
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      undefined
    );
  }

  private extractImage($: CheerioAPI, baseUrl: string): string | undefined {
    const image = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('link[rel="image_src"]').attr('href');

    if (!image) return undefined;

    // Конвертируем относительный URL в абсолютный
    try {
      return new URL(image, baseUrl).href;
    } catch {
      return undefined;
    }
  }

  private extractSiteName($: CheerioAPI): string | undefined {
    return (
      $('meta[property="og:site_name"]').attr('content') ||
      undefined
    );
  }

  private extractFavicon($: CheerioAPI, baseUrl: string): string | undefined {
    const favicon = 
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      '/favicon.ico';

    try {
      return new URL(favicon, baseUrl).href;
    } catch {
      return undefined;
    }
  }

  private extractDomainName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  // Извлекаем все ссылки из текста
  extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches || [];
  }
}

export default new LinkPreviewService();
