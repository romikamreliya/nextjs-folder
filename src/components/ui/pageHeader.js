import React from "react";
import {
    List,
    Calendar,
    FileText,
    CardSend,
    Bill,
    Package,
    ShoppingCart,
    AdjustmentIcon,
    Users,
    DollarSign,
    VerifiedCheck,
    Star,
    Tag,
    Box,
    Briefcase,
    Buildings,
    Shop,
    ShieldUser,
    Widget,
    Chart2
} from "@/components/icon/icons";

// Map page title to the exact corresponding sidebar icon
function getHeaderIcon(title) {
    if (!title) return Widget;
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("chart of accounts") || lowerTitle.includes("chart of account")) {
        return List;
    }
    if (lowerTitle.includes("financial year")) {
        return Calendar;
    }
    if (lowerTitle.includes("account statement")) {
        return FileText;
    }
    if (lowerTitle.includes("supplier payment")) {
        return CardSend;
    }
    if (lowerTitle.includes("supplier invoice")) {
        return Bill;
    }
    if (lowerTitle.includes("grn") || lowerTitle.includes("goods receipt")) {
        return FileText;
    }
    if (lowerTitle.includes("asn") || lowerTitle.includes("shipment notice")) {
        return Package;
    }
    if (lowerTitle.includes("purchase order")) {
        return ShoppingCart;
    }
    if (lowerTitle.includes("stock adjustment")) {
        return AdjustmentIcon;
    }
    if (lowerTitle.includes("customer")) {
        return Users;
    }
    if (lowerTitle.includes("supplier")) {
        return DollarSign;
    }
    if (lowerTitle.includes("tax registration")) {
        return FileText;
    }
    if (lowerTitle.includes("license")) {
        return VerifiedCheck;
    }
    if (lowerTitle.includes("brand")) {
        return Star;
    }
    if (lowerTitle.includes("group")) {
        return Tag;
    }
    if (lowerTitle.includes("product")) {
        return Box;
    }
    if (lowerTitle.includes("designation")) {
        return Briefcase;
    }
    if (lowerTitle.includes("department")) {
        return Buildings;
    }
    if (lowerTitle.includes("branch")) {
        return Shop;
    }
    if (lowerTitle.includes("role")) {
        return ShieldUser;
    }
    if (lowerTitle.includes("user")) {
        return Users;
    }
    if (lowerTitle.includes("dashboard")) {
        return Widget;
    }
    if (lowerTitle.includes("analytics")) {
        return Chart2;
    }
    
    return Widget; // default common fallback
}

export default function PageHeader({title, description, action, icon}) {
    const watermarkIcon = icon || getHeaderIcon(title);

    return (
        <div className="mb-4 sm:mb-6 animate-fade-in-up">
            <div className="relative overflow-hidden rounded-2xl bg-(--color-surface) border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
                
                {/* Modern subtle dotted pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.07] dark:opacity-[0.1] pointer-events-none text-(--color-text-primary)"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)',
                        backgroundSize: '18px 18px'
                    }}
                />

                {/* Soft ambient glow from top-left */}
                <div className="absolute top-0 left-0 w-[40%] h-[150%] bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
                
                {/* Static faint watermark background icon on the right (matches sidebar icon) */}
                {watermarkIcon && (
                    <div className="absolute -right-4 -bottom-6 opacity-[0.12] dark:opacity-[0.18] pointer-events-none transform -rotate-12 scale-125 text-(--color-text-primary)">
                        {React.createElement(watermarkIcon, { className: "w-36 h-36 sm:w-40 sm:h-40" })}
                    </div>
                )}


                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-4 sm:pl-5">
                    <div className="flex flex-col gap-1.5 z-10">
                        <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-400 to-zinc-950 dark:from-white dark:to-zinc-400 pb-1">
                            {title}
                        </h1>

                        {description && (
                            <p className="text-[13px] sm:text-[14px] font-medium text-(--color-text-secondary) max-w-2xl leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {action && (
                        <div className="flex shrink-0 items-center z-10">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
