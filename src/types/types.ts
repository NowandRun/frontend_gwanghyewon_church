export interface MenuItem {
	path: string;
	subtitle?: string;
	label: string;
	children?: MenuItem[];
  }