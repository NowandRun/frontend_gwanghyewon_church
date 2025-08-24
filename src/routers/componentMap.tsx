import { componentMap } from "../components/Map";
import { MenuItem } from "../types/types";

export function generateComponentMap(menuItems: MenuItem[], parentPath = ''): Record<string, React.ComponentType<any>> {
  const map: Record<string, React.ComponentType<any>> = {};

  menuItems.forEach((item) => {
    const fullPath = parentPath ? `${parentPath}/${item.path}` : item.path;

    const ParentElement = componentMap[fullPath];
    if (ParentElement) {
      // 부모 route → 'info' 와 'info/' 둘 다 넣기
      map[fullPath] = ParentElement;
      map[`${fullPath}/`] = ParentElement;
    }

    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        const childFullPath = child.path === '' ? `${fullPath}/` : `${fullPath}/${child.path}`;
        const ChildElement = componentMap[childFullPath] || componentMap[`${fullPath}/`];

        if (ChildElement) {
          map[childFullPath] = ChildElement;
        }
      });
    }
  });

  return map;
}
