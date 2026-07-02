import { VerifiedCheck, StatusPending, ForbiddenCircle, EmptyInfo, Archive, Lock, WarningCircle, Upload } from "@/components/icon/icons";
import { Chip } from "@heroui/react";

export const STATUS_CONFIG = {
  active: {
    label: "Active",
    className: "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/30 dark:text-emerald-300",
    icon: <VerifiedCheck className="size-3.5 shrink-0" />,
  },
  pending: {
    label: "Pending",
    className: "border-amber-300/60 bg-amber-100/70 text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-300",
    icon: <StatusPending className="size-3.5 shrink-0" />,
  },
  inactive: {
    label: "Inactive",
    className: "border-rose-300/60 bg-rose-100/70 text-rose-800 dark:border-rose-700/60 dark:bg-rose-950/30 dark:text-rose-300",
    icon: <ForbiddenCircle className="size-3.5 shrink-0" />,
  },
  archived: {
    label: "Archived",
    className: "border-slate-300/60 bg-slate-100/70 text-slate-800 dark:border-slate-700/60 dark:bg-slate-950/30 dark:text-slate-300",
    icon: <Archive className="size-3.5 shrink-0" />,
  },
  locked: {
    label: "Locked",
    className: "border-orange-300/60 bg-orange-100/70 text-orange-800 dark:border-orange-700/60 dark:bg-orange-950/30 dark:text-orange-300",
    icon: <Lock className="size-3.5 shrink-0" />,
  },
  expired: {
    label: "Expired",
    className: "border-red-300/60 bg-red-100/70 text-red-800 dark:border-red-700/60 dark:bg-red-950/30 dark:text-red-300",
    icon: <WarningCircle className="size-3.5 shrink-0" />,
  },
  discontinued: {
    label: "Discontinued",
    className: "border-gray-300/60 bg-gray-100/70 text-gray-800 dark:border-gray-700/60 dark:bg-gray-950/30 dark:text-gray-300",
    icon: <ForbiddenCircle className="size-3.5 shrink-0" />,
  },

  // ✅ No status from API → show this
  null: {
    label: "No Status",
    className: "border-border-subtle bg-surface-subtle text-text-secondary",
    icon: <EmptyInfo className="size-3.5 shrink-0" />,
  },
  draft: {
    label: "Draft",
    className: "border-zinc-300/60 bg-zinc-100/70 text-zinc-700 dark:border-zinc-600/60 dark:bg-zinc-800/30 dark:text-zinc-300",
    icon: <EmptyInfo className="size-3.5 shrink-0" />,
  },
  posted: {
    label: "Posted",
    className: "border-blue-300/60 bg-blue-100/70 text-blue-800 dark:border-blue-700/60 dark:bg-blue-950/30 dark:text-blue-300",
    icon: <VerifiedCheck className="size-3.5 shrink-0" />,
  },
  approved: {
    label: "Approved",
    className: "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/30 dark:text-emerald-300",
    icon: <VerifiedCheck className="size-3.5 shrink-0" />,
  },
  uploaded: {
    label: "Uploaded",
    className: "border-indigo-300/60 bg-indigo-100/70 text-indigo-800 dark:border-indigo-700/60 dark:bg-indigo-950/30 dark:text-indigo-300",
    icon: <Upload className="size-3.5 shrink-0" />,
  },
  verification_pending: {
    label: "Verification Pending",
    className: "border-amber-300/60 bg-amber-100/70 text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-300",
    icon: <StatusPending className="size-3.5 shrink-0" />,
  },
  verified: {
    label: "Verified",
    className: "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/30 dark:text-emerald-300",
    icon: <VerifiedCheck className="size-3.5 shrink-0" />,
  },
  partially_received: {
    label: "Partially Received",
    className: "border-blue-300/60 bg-blue-100/70 text-blue-800 dark:border-blue-700/60 dark:bg-blue-950/30 dark:text-blue-300",
    icon: <StatusPending className="size-3.5 shrink-0" />,
  },
  fully_received: {
    label: "Fully Received",
    className: "border-teal-300/60 bg-teal-100/70 text-teal-800 dark:border-teal-700/60 dark:bg-teal-950/30 dark:text-teal-300",
    icon: <VerifiedCheck className="size-3.5 shrink-0" />,
  },
  partially_paid: {
    label: "Partially Paid",
    className: "border-blue-300/60 bg-blue-100/70 text-blue-800 dark:border-blue-700/60 dark:bg-blue-950/30 dark:text-blue-300",
    icon: <StatusPending className="size-3.5 shrink-0" />,
  },
  paid: {
    label: "Paid",
    className: "border-teal-300/60 bg-teal-100/70 text-teal-800 dark:border-teal-700/60 dark:bg-teal-950/30 dark:text-teal-300",
    icon: <VerifiedCheck className="size-3.5 shrink-0" />,
  },
  closed: {
    label: "Closed",
    className: "border-slate-300/60 bg-slate-100/70 text-slate-700 dark:border-slate-600/60 dark:bg-slate-800/30 dark:text-slate-300",
    icon: <Lock className="size-3.5 shrink-0" />,
  },
  dispatched: {
    label: "Dispatched",
    className: "border-blue-300/60 bg-blue-100/70 text-blue-800 dark:border-blue-700/60 dark:bg-blue-950/30 dark:text-blue-300",
    icon: <VerifiedCheck className="size-3.5 shrink-0" />,
  },
  returned: {
    label: "Returned",
    className: "border-teal-300/60 bg-teal-100/70 text-teal-800 dark:border-teal-700/60 dark:bg-teal-950/30 dark:text-teal-300",
    icon: <VerifiedCheck className="size-3.5 shrink-0" />,
  },
  credit_note_pending: {
    label: "Credit Note Pending",
    className: "border-amber-300/60 bg-amber-100/70 text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-300",
    icon: <StatusPending className="size-3.5 shrink-0" />,
  },
  credit_note_received: {
    label: "Credit Note Received",
    className: "border-teal-300/60 bg-teal-100/70 text-teal-800 dark:border-teal-700/60 dark:bg-teal-950/30 dark:text-teal-300",
    icon: <VerifiedCheck className="size-3.5 shrink-0" />,
  },
  cancelled: {
    label: "Cancelled",
    className: "border-rose-300/60 bg-rose-100/70 text-rose-800 dark:border-rose-700/60 dark:bg-rose-950/30 dark:text-rose-300",
    icon: <ForbiddenCircle className="size-3.5 shrink-0" />,
  },
};

export const getStatusConfig = (status) => {
  // Boolean true/false support
  if (status === true)  return STATUS_CONFIG["active"];
  if (status === false) return STATUS_CONFIG["inactive"];

  // Normalize string to lowercase key
  const key = typeof status === "string" ? status.toLowerCase() : status;
  // If null / undefined / empty → return null config
  if (!key) return STATUS_CONFIG["null"];
  // If key exists → return it, else fallback to null config
  return STATUS_CONFIG[key] || STATUS_CONFIG["null"];
};

export const StatusChip = ({ status }) => {
  const config = getStatusConfig(status);

  return (
    <Chip
      size="sm"
      variant="soft"
      className={`h-6 w-fit min-w-max rounded-md border px-2 text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      <span className="inline-flex items-center gap-1 whitespace-nowrap">
        {config.icon}
        <span className="whitespace-nowrap">{config.label}</span>
      </span>
    </Chip>
  );
};
