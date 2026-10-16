export type UserRole = 'citizen' | 'agent' | 'manager';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  cpf?: string | null;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
