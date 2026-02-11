export interface MenuItem {
  iconPath: string;
  label: string;
  route?: string;
  subitems?: MenuItem[];
}
