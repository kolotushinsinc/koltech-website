import { useState, useRef, ChangeEvent } from 'react';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectData: any) => void;
}

export function CreateProjectModal({ isOpen, onClose, onCreateProject }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    technologies: '',
    link: '',
    rating: '0',
    featured: 'false',
    status: 'active',
  });
  
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const previewImagesInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Веб-разработка',
    'Мобильная разработка',
    'AI-решения'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название проекта обязательно';
    }
    
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Краткое описание обязательно';
    }
    
    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'Полное описание обязательно';
    }
    
    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }
    
    if (!mainImage) {
      newErrors.mainImage = 'Главное изображение обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      
      // Очистка ошибки
      if (errors.mainImage) {
        setErrors(prev => ({ ...prev, mainImage: '' }));
      }
    }
  };

  const handlePreviewImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Ограничение в 10 изображений
      if (previewImages.length + files.length > 10) {
        alert('Максимальное количество изображений для предпросмотра - 10');
        return;
      }
      
      setPreviewImages(prev => [...prev, ...files]);
    }
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Создаем FormData для отправки на сервер
      const projectFormData = new FormData();
      projectFormData.append('title', formData.title);
      projectFormData.append('shortDescription', formData.shortDescription);
      projectFormData.append('fullDescription', formData.fullDescription);
      projectFormData.append('category', formData.category);
      
      if (mainImage) {
        projectFormData.append('mainImage', mainImage);
      }
      
      previewImages.forEach((image) => {
        projectFormData.append('previewImages', image);
      });
      
      // Здесь будет отправка на сервер
      // const response = await axios.post('https://api.koltech.dev/api/projects', projectFormData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      // Временно вызываем колбэк с данными формы
      onCreateProject({
        title: formData.title,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        category: formData.category,
        technologies: formData.technologies.split(',').map((tech: string) => tech.trim()).filter((tech: string) => tech),
        link: formData.link,
        rating: parseInt(formData.rating),
        featured: formData.featured === 'true',
        status: formData.status,
        mainImage,
        previewImages
      });
      
      // Сброс формы
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        category: '',
        technologies: '',
        link: '',
        rating: '0',
        featured: 'false',
        status: 'active',
      });
      setMainImage(null);
      setPreviewImages([]);
      
      // Закрытие модального окна
      onClose();
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Создать проект</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Название проекта
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition ${
                errors.title 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
              }`}
              placeholder="Введите название проекта"
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Краткое описание
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={2}
              className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition ${
                errors.shortDescription 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
              }`}
              placeholder="Краткое описание для списка проектов"
            />
            {errors.shortDescription && <p className="mt-1 text-sm text-red-400">{errors.shortDescription}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Категория
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition ${
                errors.category 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
              }`}
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Полное описание
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition ${
                errors.fullDescription
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
              }`}
              placeholder="Полное описание проекта"
            />
            {errors.fullDescription && <p className="mt-1 text-sm text-red-400">{errors.fullDescription}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Технологии (через запятую)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ссылка на проект
            </label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Рейтинг
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Статус
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              >
                <option value="active">Активный</option>
                <option value="completed">Завершен</option>
                <option value="on_hold">На паузе</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured === 'true'}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked ? 'true' : 'false' }))}
                className="w-4 h-4 text-blue-500 bg-slate-700/50 border border-white/10 rounded focus:ring-blue-500/50 focus:ring-2"
              />
              <span className="text-sm font-medium text-slate-300">Отображать на главной</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Главное изображение
            </label>
            <div
              onClick={() => mainImageInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                errors.mainImage 
                  ? 'border-red-500 bg-red-500/10' 
                  : 'border-white/20 hover:border-blue-500/50 hover:bg-blue-500/10'
              }`}
            >
              {mainImage ? (
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 text-blue-400 mb-2" />
                  <p className="text-white font-medium">{mainImage.name}</p>
                  <p className="text-slate-400 text-sm mt-1">Нажмите для замены</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-slate-400 mb-2" />
                  <p className="text-slate-300 font-medium">Загрузите главное изображение</p>
                  <p className="text-slate-400 text-sm mt-1">PNG, JPG или JPEG (макс. 10MB)</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={mainImageInputRef}
              onChange={handleMainImageChange}
              className="hidden"
              accept="image/*"
            />
            {errors.mainImage && <p className="mt-1 text-sm text-red-400">{errors.mainImage}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Изображения для предпросмотра ({previewImages.length}/10)
            </label>
            <div
              onClick={() => previewImagesInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/10 transition"
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-300 font-medium">Добавить изображения</p>
              <p className="text-slate-400 text-sm">PNG, JPG или JPEG (макс. 10MB)</p>
            </div>
            <input
              type="file"
              ref={previewImagesInputRef}
              onChange={handlePreviewImagesChange}
              className="hidden"
              accept="image/*"
              multiple
            />

            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-slate-700/50 rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePreviewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-slate-400 text-xs mt-1 truncate">{image.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Создание...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Создать проект
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}