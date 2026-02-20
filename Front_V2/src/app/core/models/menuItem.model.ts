export interface MenuItem {
  iconPath: string;
  label: string;
  route: string;
  roles?: string[]; // Por ahora opcional hasta que haya roles.
}
