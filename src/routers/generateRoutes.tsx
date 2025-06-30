import { RouteObject } from 'react-router-dom';
import React from 'react';
import { MenuItem } from "../types/types";
import { componentMap } from "../components/Map";

export function generateRoutes(menuItems: MenuItem[], parentPath = ''): RouteObject[] {
  return menuItems.map((item) => {
    const fullPath = parentPath ? `${parentPath}/${item.path}` : item.path;
    const ParentElement = componentMap[fullPath];

    const route: RouteObject = {
      path: item.path,
      element: ParentElement ? <ParentElement /> : undefined,
    };

    if (item.children && item.children.length > 0) {
      route.children = item.children.map((child) => {
        const childFullPath = `${fullPath}/${child.path}`;
        const ChildElement = componentMap[childFullPath] || componentMap[`${fullPath}/`];

        if (child.path === '') {
          // index route
          return {
            index: true,
            element: ChildElement ? <ChildElement /> : undefined,
          };
        } else {
          return {
            path: child.path,
            element: ChildElement ? <ChildElement /> : undefined,
            children: child.children ? generateRoutes(child.children, childFullPath) : undefined,
          };
        }
      });
    }

    return route;
  });
}
