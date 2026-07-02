import {
  DropdownTrigger,
  Dropdown,
  DropdownPopover,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

const AppDropdown = ({
  label,
  value,
  items = [],
  icon: StartIcon,
  arrowIcon: ArrowIcon,
  onChange,
  selectionMode = "single",
  selectedKeys,
  className = "",
  triggerClassName = "",
}) => {
  return (
    <Dropdown>
      <DropdownTrigger className={triggerClassName}>
        <div
          className={`
            flex cursor-pointer items-center gap-2
            rounded-(--radius-lg) bg-(--color-surface-subtle) px-4 py-2.5
            text-[13px] font-semibold text-(--color-text-primary)
            transition-all duration-200 ease-in-out
            hover:bg-(--color-surface-hover)
            ${className}
          `}
        >
          {StartIcon && <StartIcon className="text-base" />}

          {label && (
            <span className="flex-1 text-left">
              {label}
              {value ? `: ${value}` : ""}
            </span>
          )}

          {ArrowIcon && <ArrowIcon className="text-sm" />}
        </div>
      </DropdownTrigger>

      <DropdownPopover>
        <DropdownMenu
          selectionMode={selectionMode}
          selectedKeys={selectedKeys}
          onAction={(key) => onChange?.(String(key))}
        >
          <Dropdown.Section>
          {items.map((item, index) => (
            <DropdownItem  id={item.value ?? `${item.name}-${index}`} key={item.value ?? `${item.label}-${index}`}>
              <Dropdown.ItemIndicator />
              {item.label}
            </DropdownItem>
          ))}
          </Dropdown.Section>
        </DropdownMenu>
      </DropdownPopover>
    </Dropdown>
  );
};

export default AppDropdown;