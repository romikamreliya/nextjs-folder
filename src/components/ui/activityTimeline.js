import React from "react";
import DateTimeCell from "@/components/ui/dateTimeCell";
import { Clock, CheckCircle, ForbiddenCircle } from "@/components/icon/icons";

export default function ActivityTimeline({ 
    createdAt, 
    updatedAt, 
    createdLabel = "Created At", 
    updatedLabel = "Updated At",
    cancelledAt,
    cancelledLabel = "Cancelled At"
}) {
    const isCancelled = !!cancelledAt;
    
    // Determine dynamic properties based on status
    const node2Label = isCancelled ? cancelledLabel : updatedLabel;
    const node2Value = isCancelled ? cancelledAt : updatedAt;
    const Node2Icon = isCancelled ? ForbiddenCircle : CheckCircle;

    let lineBg = "bg-zinc-200 dark:bg-zinc-800";
    let node2CircleClass = "bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800";
    let node2LabelClass = "text-zinc-400 dark:text-zinc-600";
    let dateClass = "text-text-primary";
    let timeClass = "text-text-secondary/75";

    if (isCancelled) {
        lineBg = "bg-rose-500 dark:bg-rose-400";
        node2CircleClass = "bg-rose-500 dark:bg-rose-500 text-white border-transparent shadow-sm";
        node2LabelClass = "text-rose-500 dark:text-rose-400 font-semibold";
        dateClass = "text-rose-600 dark:text-rose-400 font-semibold";
        timeClass = "text-rose-500/75 dark:text-rose-400/60";
    } else if (updatedAt) {
        lineBg = "bg-zinc-900 dark:bg-zinc-100";
        node2CircleClass = "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-sm";
        node2LabelClass = "text-zinc-500 dark:text-zinc-400";
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-linear-to-br from-zinc-50/80 to-zinc-100/50 dark:from-zinc-900/80 dark:to-zinc-950/50 p-5 mt-2">
            <div className="relative flex items-center justify-between w-full gap-2 pt-1 px-1">
                {/* Node 1: Created */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm">
                        <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 leading-none">
                            {createdLabel}
                        </span>
                        <div className="mt-1">
                            <DateTimeCell value={createdAt} />
                        </div>
                    </div>
                </div>

                {/* Connector Line */}
                <div className={`flex-1 h-0.5 ml-2 mr-1 ${lineBg}`} />

                {/* Node 2: Updated or Cancelled */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${node2CircleClass}`}>
                        <Node2Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${node2LabelClass}`}>
                            {node2Label}
                        </span>
                        <div className="mt-1">
                            {node2Value ? (
                                <DateTimeCell value={node2Value} dateClass={dateClass} timeClass={timeClass} />
                            ) : (
                                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 italic whitespace-nowrap leading-none block pt-0.5">
                                    -
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
