import {
  Search,
  Close,
  AltArrowRight,
  Widget,
  Chart2,
  List,
  Code
} from "@/components/icon/icons";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
// import { useGet } from "@/hooks/useApi";
// import { API_LIST } from "@/lib/api-const";
import AppToast from "@/components/ui/toast";
import HighlightText from "@/components/ui/highlight";


const QUICK_NAV_ITEMS = [
  {
    titleKey: "nav.dashboard",
    sectionKey: "sections.menu",
    href: "/dashboard",
    icon: Widget,
    check: () => true
  },
  {
    titleKey: "nav.analytics",
    sectionKey: "sections.menu",
    href: "#",
    icon: Chart2,
    check: () => true
  },
  {
    titleKey: "nav.demoTable",
    sectionKey: "sections.menu",
    href: "/demo-table",
    icon: List,
    check: () => true
  },
  {
    titleKey: "nav.componentShowcase",
    sectionKey: "sections.menu",
    href: "/component-showcase",
    icon: Code,
    check: () => true
  }
];

const AppSearch = ({
  value,
  onChange,
  placeholder,
  className = "",
  inputClassName = "",
  debounceMs = 400,
  enableQuickNav = false,
}) => {
  const { t } = useTranslation(["common", "sidebar"]);
  const resolvedPlaceholder = placeholder ?? t("common:table.search");
  const [searchValue, setSearchValue] = React.useState(value || "");
  const debounceTimer = React.useRef(null);
  const router = useRouter();

  // Sync internal state with prop value when it changes externally
  React.useEffect(() => {
    setSearchValue(value || "");
  }, [value]);

  // Quick navigation state
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const containerRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Fetch permissions for Quick Navigation (commented out for demo)
  // const { data: myPermissionsRes, isSuccess: permissionsLoaded, isError: permissionsError } = useGet(
  //   ["getMyPermissions"],
  //   API_LIST.getMyPermissions,
  //   {},
  //   { enabled: enableQuickNav }
  // );

  // const permissionKeys = React.useMemo(() => {
  //   if (!enableQuickNav) return [];
  //   return extractPermissionKeys(myPermissionsRes);
  // }, [myPermissionsRes, enableQuickNav]);

  const permissionsLoaded = true;
  const permissionsError = false;
  const permissionKeys = [];
  const permsDone = true;

  // Filter items based on permissions and search query
  const filteredItems = React.useMemo(() => {
    if (!enableQuickNav) return [];
    
    // First, filter by permissions
    const visibleItems = QUICK_NAV_ITEMS.filter((item) => {
      // While permissions are loading, show items. Once settled, enforce checks.
      if (!permsDone) return true;
      return item.check(permissionKeys);
    });

    // Then, filter by search query if user typed something
    if (!searchValue.trim()) return visibleItems;

    const query = searchValue.toLowerCase().trim();
    return visibleItems.filter((item) => {
      const title = t(`sidebar:${item.titleKey}`).toLowerCase();
      const section = t(`sidebar:${item.sectionKey}`).toLowerCase();
      return title.includes(query) || section.includes(query);
    });
  }, [enableQuickNav, permissionKeys, permsDone, searchValue, t]);

  // Adjust activeIndex state when filtered items change
  React.useEffect(() => {
    setActiveIndex(0);
  }, [filteredItems]);

  // Group filtered items by section for visually structured layout
  const groupedSections = React.useMemo(() => {
    const sections = [];
    filteredItems.forEach((item, index) => {
      let section = sections.find((s) => s.sectionKey === item.sectionKey);
      if (!section) {
        section = {
          sectionKey: item.sectionKey,
          items: [],
        };
        sections.push(section);
      }
      section.items.push({
        ...item,
        flatIndex: index,
      });
    });
    return sections;
  }, [filteredItems]);

  // Scroll active item into view
  const activeItemRef = React.useRef(null);
  React.useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  // Click outside listener
  React.useEffect(() => {
    if (!enableQuickNav) return;
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [enableQuickNav]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleChange = (val) => {
    setSearchValue(val);

    if (enableQuickNav) {
      setIsOpen(true);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // Set new timer — API call fires only after user stops typing
    debounceTimer.current = setTimeout(() => {
      onChange?.(val);
    }, debounceMs);
  };

  const handleNavigate = (item) => {
    if (item.href === "#") {
      AppToast.info(t("common:status.comingSoon", { feature: t(`sidebar:${item.titleKey}`) }));
    } else {
      router.push(item.href);
    }
    setIsOpen(false);
    setSearchValue("");
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (enableQuickNav) {
      if (e.key === "ArrowDown" && isOpen) {
        e.preventDefault();
        setActiveIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === "ArrowUp" && isOpen) {
        e.preventDefault();
        setActiveIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
      } else if (e.key === "Enter" && isOpen) {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          handleNavigate(filteredItems[activeIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        // Single ESC: close dropdown + clear text at once
        setIsOpen(false);
        setSearchValue("");
        inputRef.current?.blur();
      }
    } else {
      // Table search mode: ESC clears the search
      if (e.key === "Escape" && searchValue) {
        e.preventDefault();
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        setSearchValue("");
        onChange?.("");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`
        relative flex h-10 w-full items-center gap-2.5
        rounded-lg border border-border-subtle bg-(--color-bg-subtle)
        px-2.5 transition-all duration-200 ease-in-out
        focus-within:border-(--color-input-focus)
        focus-within:ring-1 focus-within:ring-(--color-input-focus)
        ${className}
      `}
    >
      <Search className="shrink-0 text-lg text-text-secondary" />

      <input
        ref={inputRef}
        name="search"
        placeholder={resolvedPlaceholder}
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          if (enableQuickNav) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className={`
          w-full border-none bg-transparent
          font-[inherit] text-sm text-(--color-text-primary)
          outline-none placeholder:text-(--color-input-placeholder)
          ${inputClassName}
        `}
      />

      {searchValue && (
        <span
          title={t("common:table.escToClear")}
          className="flex items-center gap-1 shrink-0 animate-fade-in"
        >
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border-subtle bg-(--color-bg-subtle) text-[10px] font-mono font-semibold text-(--color-text-muted) leading-none select-none shadow-sm">
            ESC
          </kbd>
        </span>
      )}

      {searchValue && (
        <button
          type="button"
          onClick={() => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            setSearchValue("");
            if (enableQuickNav) {
              setIsOpen(false);
            } else {
              onChange?.("");
            }
          }}
          className="flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-1 text-(--color-text-muted) hover:bg-(--color-hover) hover:text-(--color-text-primary) transition-colors"
        >
          <Close className="text-base" />
        </button>
      )}

      {/* Quick Navigation Dropdown Popover */}
      {enableQuickNav && isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-(--color-surface) border border-(--color-border) rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[380px]">
          <div className="px-4 py-2.5 bg-(--color-bg-subtle) border-b border-(--color-border) flex items-center justify-between shrink-0">
            <span className="text-[11px] font-bold text-(--color-text-muted) uppercase tracking-wider">
              {t("sidebar:sections.quickNav")}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-(--color-text-muted)">
                No modules found
              </div>
            ) : (
              groupedSections.map((section) => (
                <div key={section.sectionKey} className="flex flex-col">
                  {/* Sticky Group Header */}
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-(--color-text-muted) uppercase tracking-wider bg-zinc-50/80 dark:bg-zinc-900/80 border-y border-border-subtle/50 backdrop-blur-xs sticky top-0 z-10 my-1 first:mt-0">
                    {t(`sidebar:${section.sectionKey}`)}
                  </div>

                  {/* Group Items */}
                  {section.items.map((item) => {
                    const isActive = item.flatIndex === activeIndex;
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.titleKey}
                        ref={isActive ? activeItemRef : null}
                        onMouseEnter={() => setActiveIndex(item.flatIndex)}
                        onClick={() => handleNavigate(item)}
                        className={`relative flex items-center justify-between pl-4 pr-3.5 py-2.5 cursor-pointer transition-all duration-150 rounded-lg mx-1.5 my-0.5 ${
                          isActive 
                            ? "bg-(--color-hover) text-(--color-text-primary)" 
                            : "text-(--color-text-secondary)"
                        }`}
                      >
                        {/* Active indicator bar */}
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 rounded-r bg-(--color-text-primary) transition-all duration-150 ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"}`} />

                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0 ${
                            isActive ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <HighlightText
                              text={t(`sidebar:${item.titleKey}`)}
                              query={searchValue}
                              className="text-sm font-semibold leading-tight text-(--color-text-primary)"
                            />
                          </div>
                        </div>
                        <AltArrowRight className={`w-4 h-4 text-(--color-text-muted) transition-all duration-200 ${isActive ? "translate-x-1 opacity-100 text-(--color-text-primary)" : "opacity-60"}`} />
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-(--color-border) bg-(--color-bg-subtle) shrink-0">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] text-(--color-text-muted) font-medium">
                <kbd className="inline-flex items-center px-1 py-0.5 rounded border border-border-subtle bg-(--color-surface) text-[10px] font-mono leading-none shadow-sm">↑</kbd>
                <kbd className="inline-flex items-center px-1 py-0.5 rounded border border-border-subtle bg-(--color-surface) text-[10px] font-mono leading-none shadow-sm">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1 text-[11px] text-(--color-text-muted) font-medium">
                <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border-subtle bg-(--color-surface) text-[10px] font-mono leading-none shadow-sm">↵</kbd>
                Open
              </span>
              <span className="flex items-center gap-1 text-[11px] text-(--color-text-muted) font-medium">
                <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border-subtle bg-(--color-surface) text-[10px] font-mono leading-none shadow-sm">ESC</kbd>
                {searchValue ? "Close / Clear" : "Close"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSearch;