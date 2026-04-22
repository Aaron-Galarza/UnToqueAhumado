import { User } from './user.model';
import db from '../../data/data.json';

const users: User[] = db.users as User[];

export const findByEmail = (email: string): User | undefined => {
  return users.find(u => u.email === email);
};