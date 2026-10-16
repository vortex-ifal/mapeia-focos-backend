export type UserRole = 'citizen' | 'agent' | 'manager';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
