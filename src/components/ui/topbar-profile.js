import {Avatar, Dropdown, Label} from "@heroui/react";
import {ArrowRightFromSquare, Gear, Persons} from "@/components/icon/icons";
import {useAuthStore} from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";

export default function CustomTrigger() {
    const { t } = useTranslation("common");
    const authStore = useAuthStore();
    const { logout } = useAuth();

    const handleAction = async (key) => {
        if (key === "logout") {
            await logout();
        }
    };
    
  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar>
          <Avatar.Fallback delayMs={600}>{authStore.user?.user?.name?.[0]?.toUpperCase() || "-"}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="md">
              <Avatar.Fallback delayMs={600}>{authStore.user?.user?.name?.[0]?.toUpperCase() || "-"}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-sm leading-5 font-medium">{authStore.user?.user?.name || "User"}</p>
              <p className="text-xs leading-none text-(--color-text-muted)">{authStore.user?.user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu onAction={handleAction}>
          <Dropdown.Item id="profile" textValue="Profile">
            <div className="flex w-full items-center justify-between gap-2">
              <Label>{t("profile.profile")}</Label>
              <Persons className="size-3.5" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="settings" textValue="Settings">
            <div className="flex w-full items-center justify-between gap-2">
              <Label>{t("profile.settings")}</Label>
              <Gear className="size-3.5 text-muted" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="Logout" variant="danger">
            <div className="flex w-full items-center justify-between gap-2">
              <Label>{t("profile.logout")}</Label>
              <ArrowRightFromSquare className="size-3.5 text-danger" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}