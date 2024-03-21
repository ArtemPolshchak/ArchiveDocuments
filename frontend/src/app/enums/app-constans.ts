export const TOKEN_KEY = 'token';

export class Role {
  static readonly ADMIN = 'ADMIN';
  static readonly MODERATOR = 'MODERATOR';
  static readonly GUEST = 'GUEST';
}

export const ADMIN_MENU_ITEMS: string[] = ['documents',  'category',  'users'];
export const MODERATOR_MENU_ITEMS: string[] = ['documents',  'category'];
export const GUEST_MENU_ITEMS: string[] = ['category', 'documents'];

