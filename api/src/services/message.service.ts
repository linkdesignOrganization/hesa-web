import { Message, IMessage } from '../models/message.model';

export interface MessageFilters {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getMessages(filters: MessageFilters = {}) {
  const query: Record<string, unknown> = {};

  if (filters.type) {
    query.type = filters.type;
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.search) {
    const searchRegex = new RegExp(filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { contactName: searchRegex },
      { companyName: searchRegex },
    ];
  }

  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 50));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Message.countDocuments(query),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAllMessages(filters: MessageFilters = {}): Promise<IMessage[]> {
  const query: Record<string, unknown> = {};
  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    const searchRegex = new RegExp(filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { contactName: searchRegex },
      { companyName: searchRegex },
    ];
  }
  return Message.find(query).sort({ createdAt: -1 }).lean() as unknown as Promise<IMessage[]>;
}

export async function getMessageById(id: string): Promise<IMessage | null> {
  return Message.findById(id).lean() as unknown as Promise<IMessage | null>;
}

export async function createMessage(data: Partial<IMessage>): Promise<IMessage> {
  const message = await Message.create(data);
  return message.toObject();
}

export async function updateMessageStatus(
  id: string,
  status: 'nuevo' | 'en-proceso' | 'atendido'
): Promise<IMessage | null> {
  return Message.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean() as unknown as Promise<IMessage | null>;
}

export async function updateMessageNotes(
  id: string,
  notes: string
): Promise<IMessage | null> {
  return Message.findByIdAndUpdate(
    id,
    { notes },
    { new: true }
  ).lean() as unknown as Promise<IMessage | null>;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const result = await Message.findByIdAndDelete(id);
  return !!result;
}

export async function getNewMessagesCount(): Promise<number> {
  return Message.countDocuments({ status: 'nuevo' });
}

export async function getRecentMessages(limit: number = 5): Promise<IMessage[]> {
  return Message.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean() as unknown as Promise<IMessage[]>;
}
