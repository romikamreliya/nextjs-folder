"use client";

import React from "react";
import CustomTrigger from "./topbar-profile";
import AppSearch from "./search";
import LanguageSwitcher from "./languageSwitcher";
import ThemeToggle from "./themeToggle";
import CountrySwitcher from "./countrySwitcher";
import { useTranslation } from "@/hooks/useTranslation";
const { HamburgerMenu } = require("@/components/icon/icons");

export default function Topbar({ setSidebarOpen }) {
  const { t } = useTranslation(["sidebar", "common"]);
  return (
    <header className="h-14 bg-(--color-surface)/88 border-b border-(--color-border) backdrop-blur-md flex items-center px-3 md:px-6 sticky top-0 z-10 gap-3">

      {/* Hamburger - mobile only */}
      <button 
        onClick={() => setSidebarOpen?.(true)}
        className="md:hidden p-2 -ml-1 text-(--color-text-primary) hover:bg-(--color-hover) rounded-lg transition-colors shrink-0"
      >
        <HamburgerMenu className="w-5 h-5" />
      </button>

      {/* Left: Hamburger + Search */}
      <div className="flex items-center flex-1 min-w-0">
        {/* Search bar */}
        <AppSearch
          className="flex-1 max-w-md"
          enableQuickNav={true}
          placeholder={t("sidebar:searchModules") || "Search modules..."}
        />
      </div>

      {/* Right: Actions grouped */}
      <div className="flex items-center shrink-0 gap-1 sm:gap-3 overflow-visible">
        <CountrySwitcher />
        <ThemeToggle />
        <LanguageSwitcher />
        <div className="h-8 w-px mx-1 bg-surface-hover" />
        {/* User Avatar */}
        <CustomTrigger />
      </div>
    </header>
  );
}
