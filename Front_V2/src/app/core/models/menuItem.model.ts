export interface MenuItem {
  iconPath: string;
  label: string;
  route: string;
  // subitems?: MenuItem[]; Por ahora no hay sub menus desplegables, si lo hubiese, hay que poner ? a route.
}
