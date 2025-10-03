export interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  mainImage: string;
  previewImages: string[];
  technologies: string[];
  link: string;
  rating: number;
  featured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}