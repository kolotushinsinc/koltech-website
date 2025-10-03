import { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage';

interface ContactRequest extends Request {
  body: {
    name: string;
    email: string;
    company: string;
    service: string;
    message: string;
  };
  params: {
    id?: string;
  };
  query: {
    page?: string;
    limit?: string;
    read?: string;
  };
}

// Get all contact messages with pagination and filtering
export const getContactMessages = async (req: ContactRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const read = req.query.read;
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await ContactMessage.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: messages.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      messages
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single contact message by ID
export const getContactMessageById = async (req: ContactRequest, res: Response): Promise<void> => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new contact message
export const createContactMessage = async (req: ContactRequest, res: Response): Promise<void> => {
  try {
    const { name, email, company, service, message } = req.body;
    
    const contactMessage = new ContactMessage({
      name,
      email,
      company,
      service,
      message
    });
    
    await contactMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contactMessage
    });
  } catch (error) {
    console.error('Create contact message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark message as read
export const markMessageAsRead = async (req: ContactRequest, res: Response): Promise<void> => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete contact message
export const deleteContactMessage = async (req: ContactRequest, res: Response): Promise<void> => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};