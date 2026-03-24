import { Timestamp } from 'firebase/firestore';

export interface Blog {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  createdAt: Timestamp;
  authorUid: string;
  views?: number;
}

export interface UserProfile {
  email: string;
  role: 'admin' | 'user';
}
