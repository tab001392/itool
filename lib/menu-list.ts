import {
  LucideIcon,
  LayoutDashboard,
  Users,
  ForkliftIcon,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export const getMenuList = (pathname: string): Group[] => {
  const isActive = (route: string): boolean => {
    // Ensure active only if the pathname matches exactly or starts with the route followed by a `/`
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: isActive("/dashboard"),
          icon: LayoutDashboard,
          submenus: [],
        },
        {
          href: "/forklifts",
          label: "Forklifts",
          active: isActive("/forklifts"),
          icon: ForkliftIcon,
          submenus: [],
        },
        {
          href: "/users",
          label: "Users",
          active: isActive("/users"),
          icon: Users,
          submenus: [],
        },
      ],
    },
  ];
};
