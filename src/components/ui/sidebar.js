"use client";

import React from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import AppToast from "@/components/ui/toast";

// import { useGet } from "@/hooks/useApi";
// import { API_LIST } from "@/lib/api-const";
// import { useAuthStore } from "@/store/authStore";
import CompanySwitcher from "./companySwitcher";

const { Widget, Chart2, Close, List, Code } = require("@/components/icon/icons");

// ── Sidebar Navigation Items ─────────────────────────────────────────────────
// Add your project's sidebar sections and items here.
// Each item can have a `permissionKey` for permission-gated visibility.
const SIDEBAR_ITEMS = [
  {
    sectionKey: "sections.menu",
    items: [
      { titleKey: "nav.dashboard", icon: Widget, href: "/dashboard" },
      { titleKey: "nav.analytics", icon: Chart2,  href: "#" },
      { titleKey: "nav.demoTable", icon: List, href: "/demo-table" },
      { titleKey: "nav.componentShowcase", icon: Code, href: "/component-showcase" },
    ]
  },
  // Add more sections here:
  // {
  //   sectionKey: "sections.administration",
  //   items: [
  //     { titleKey: "nav.users", icon: Users, href: "/users", permissionKey: "administration.users" },
  //   ]
  // },
];

export default function Sidebar({ isSidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const { t } = useTranslation(["sidebar", "common"]);

  // ── API: Fetch user's countries (commented out for demo) ─────────────────
  // const { setCountries, setCurrentCountry, currentCountry } = useAuthStore();
  // const { data: myCountriesRes, isSuccess: countriesLoaded } = useGet(["getMyCountries"], API_LIST.getMyCountries, {});
  // useEffect(() => {
  //   if (!countriesLoaded) return;
  //   const list = Array.isArray(myCountriesRes?.data) ? myCountriesRes.data : [];
  //   setCountries(list);
  //   if (!list.length) return;
  //   const match = currentCountry && list.find((c) => c.id === currentCountry.id);
  //   setCurrentCountry(match || list[0]);
  // }, [countriesLoaded, myCountriesRes]);

  // ── API: Fetch user's permissions (commented out for demo) ───────────────
  // const { data: myPermissionsRes, isSuccess: permissionsLoaded, isError: permissionsError } = useGet(["getMyPermissions"], API_LIST.getMyPermissions, {});
  // const sidebarPermKeys = extractPermissionKeys(myPermissionsRes);
  // Use permission checks to filter sidebar items:
  // const canViewUsers = hasScopedPermission(sidebarPermKeys, "administration.users", "view");

  const NavItem = ({ item }) => {
    const isActive = pathname === item.href;
    return (
      <NextLink
        onClick={()=> {
          if (item.href == "#") {
            AppToast.info(t("common:status.comingSoon", { feature: t(item.titleKey) }));
          }
        }}
        href={item.href}
        className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-(--radius-lg) transition-all duration-200 font-medium text-sm hover:translate-x-1 ${
          isActive
            ? "bg-(--color-bg) text-(--color-text-primary) shadow-(--shadow-xs)"
            : "text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-hover)"
        }`}
      >
        {isActive && <div className=" absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r bg-linear-to-b from-(--color-text-primary) to-text-secondary animate-fade-in"/>}
        <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-(--color-text-primary)" : ""}`} />
        {t(item.titleKey)}
      </NextLink>
    );
  };

  return (
    <aside className={`w-64 h-screen bg-(--color-surface)/94 border-r border-(--color-border) backdrop-blur-lg flex flex-col fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
      {/* Company Switcher Header */}
      <div className="p-4 flex items-center justify-between gap-2 shrink-0 min-w-0">
        <div className="flex-1 min-w-0 w-full">
          <CompanySwitcher />
        </div>
        <button 
          onClick={() => setSidebarOpen(false)} 
          className="md:hidden p-1.5 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors shrink-0 ml-1"
        >
          <Close className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 px-4 py-2 flex flex-col gap-6 overflow-y-auto">

        {/* Sidebar items — no permission gating in demo mode */}
        {SIDEBAR_ITEMS.map((section) => (
          <div key={section.sectionKey}>
            <p className="text-xs font-bold text-(--color-text-muted) uppercase tracking-wider mb-3 px-4">{t(section.sectionKey)}</p>
            <div className="flex flex-col space-y-1">
              {section.items.map((item) => (
                <NavItem key={item.titleKey} item={item} />
              ))}
            </div>
          </div>
        ))}

      </div>

    </aside>
  );
}
