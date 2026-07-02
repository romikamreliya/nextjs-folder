import { toast } from '@heroui/react';
import { t } from '@/lib/i18n';

const danger = (message) => {
    toast.danger(t("toast.error"), {
        description: message,
    });
}

const success = (message) => {
    toast.success(t("toast.success"), {
        description: message,
    });
}

const info = (message) => {
    toast.info(t("toast.info"), {
        description: message,
    });
}

const toastHelper = {danger, success, info};
export default toastHelper;