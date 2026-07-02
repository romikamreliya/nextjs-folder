import { formatDateTime } from "@/lib/utils";

/**
 * Reusable table cell for displaying a date + time from an ISO string.
 * @param {{ value: string | Date | null | undefined }} props
 */
export default function DateTimeCell({ value, dateClass, timeClass }) {
    const formatted = formatDateTime(value);
    if (!formatted) return <span className="text-xs text-text-secondary">—</span>;
    return (
        <div className="flex flex-col whitespace-nowrap">
            <p className={`text-sm font-medium leading-5 ${dateClass || "text-text-primary"}`}>{formatted.date}</p>
            <span className={`mt-0.5 text-[11px] font-normal leading-4 ${timeClass || "text-text-secondary/75"}`}>{formatted.time}</span>
        </div>
    );
}
