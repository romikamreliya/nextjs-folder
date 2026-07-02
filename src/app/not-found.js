"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import AppButton from "@/components/ui/button";
import { ArrowLeftDuotone } from "@/components/icon/icons";

// ─── CSS Keyframe Animations ───────────────────────────────────────────────────
const ANIM = `
  @keyframes nf-float-a { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
  @keyframes nf-float-b { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
  @keyframes nf-float-c { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)}  }
  @keyframes nf-scan    { 0%{transform:translateY(0px)} 100%{transform:translateY(85px)}       }
  @keyframes nf-blink-r { 0%,80%,100%{opacity:.9} 85%,90%{opacity:.1}                         }
  @keyframes nf-blink-y { 0%,70%,100%{opacity:.9} 75%,80%{opacity:.1}                         }
  @keyframes nf-fade-up { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
  
  /* Premium Motion Effects */
  @keyframes nf-text-reveal { 
    0% { transform: translateY(110%) rotate(2deg); opacity: 0; } 
    100% { transform: translateY(0) rotate(0); opacity: 1; } 
  }
  @keyframes nf-zoom-in {
    0% { transform: scale(0.95); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes nf-float-3d {
    0% { transform: perspective(1200px) rotateX(2deg) rotateY(-3deg) translateY(0); }
    100% { transform: perspective(1200px) rotateX(-2deg) rotateY(3deg) translateY(-15px); }
  }
    
  .nf-fa  { animation: nf-float-a 4s ease-in-out infinite; }
  .nf-fb  { animation: nf-float-b 3.5s ease-in-out infinite 0.6s; }
  .nf-fc  { animation: nf-float-c 4.5s ease-in-out infinite 1.3s; }
  .nf-scan{ animation: nf-scan 2.8s ease-in-out infinite alternate; }
  .nf-lr  { animation: nf-blink-r 3.5s ease-in-out infinite; }
  .nf-ly  { animation: nf-blink-y 4.0s ease-in-out infinite 1.8s; }
  .nf-in  { animation: nf-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .nf-in2 { animation: nf-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; }
  .nf-in3 { animation: nf-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
  
  /* Motion Classes */
  .nf-reveal-wrap { overflow: hidden; display: block; padding-bottom: 4px; }
  .nf-reveal-1 { display: block; animation: nf-text-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .nf-reveal-2 { display: block; opacity: 0; animation: nf-text-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; }
  .nf-zoom { opacity: 0; animation: nf-zoom-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; }
  .nf-zoom-del { opacity: 0; animation: nf-zoom-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards; }
  .nf-float-3d { animation: nf-float-3d 7s ease-in-out infinite alternate; }

  /* Premium Advanced Mesh Motion Effects */
  @keyframes nf-orb-primary {
    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.5; }
    33% { transform: translate(-10%, 15%) scale(1.1) rotate(120deg); opacity: 0.7; }
    66% { transform: translate(-20%, -5%) scale(0.9) rotate(240deg); opacity: 0.5; }
    100% { transform: translate(0, 0) scale(1) rotate(360deg); opacity: 0.5; }
  }
  @keyframes nf-orb-secondary {
    0% { transform: translate(0, 0) scale(1.1) rotate(360deg); opacity: 0.4; }
    33% { transform: translate(15%, -10%) scale(0.9) rotate(240deg); opacity: 0.5; }
    66% { transform: translate(-5%, 20%) scale(1.2) rotate(120deg); opacity: 0.3; }
    100% { transform: translate(0, 0) scale(1.1) rotate(0deg); opacity: 0.4; }
  }
  @keyframes nf-spark-up {
    0% { transform: translate(0, 40px) scale(0); opacity: 0; }
    20% { opacity: 1; transform: translate(-10px, 10px) scale(1.2); }
    80% { opacity: 1; transform: translate(10px, -50px) scale(0.9); }
    100% { transform: translate(0, -80px) scale(0); opacity: 0; }
  }

  .nf-orb-1 { animation: nf-orb-primary 20s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  .nf-orb-2 { animation: nf-orb-secondary 25s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  .nf-spark { animation: nf-spark-up 6s ease-in-out infinite; }
`;

// ─── Warehouse SVG Scene ───────────────────────────────────────────────────────
function WarehouseScene() {
    return (
        <svg
            viewBox="0 0 480 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            aria-hidden="true"
        >
            <defs>
                <clipPath id="nfr-door-clip">
                    <rect x="176" y="150" width="128" height="90" rx="3" />
                </clipPath>
            </defs>
            
            {/* Building body */}
            <rect x="72" y="88" width="336" height="152" rx="4" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />

            {/* Roof */}
            <polygon points="56,88 240,20 424,88" fill="var(--color-card-bg)" stroke="var(--color-border)" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="240" y1="20" x2="240" y2="88" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 3" />

            {/* Roof status lights */}
            <circle cx="92"  cy="87" r="5" fill="var(--color-danger)"  className="nf-lr" />
            <circle cx="388" cy="87" r="5" fill="var(--color-warning)" className="nf-ly" />

            {/* Shutter door */}
            <rect x="176" y="150" width="128" height="90" rx="3" fill="var(--color-surface-subtle)" stroke="var(--color-border)" strokeWidth="1.5" />
            {[158, 167, 176, 185, 194, 203, 212, 221, 230].map((y, i) => (
                <line key={i} x1="176" y1={y} x2="304" y2={y} stroke="var(--color-border-subtle)" strokeWidth="0.9" />
            ))}
            <rect x="228" y="192" width="24" height="5" rx="2.5" fill="var(--color-border-dark)" />

            {/* Scan beam */}
            <rect
                x="176" y="150" width="128" height="3" rx="1"
                fill="var(--color-danger)" className="nf-scan" opacity="0.5"
                clipPath="url(#nfr-door-clip)"
            />

            {/* Left window */}
            <rect x="94"  y="112" width="56" height="44" rx="3" fill="var(--color-bg-subtle)" stroke="var(--color-border)" strokeWidth="1.5" />
            <line x1="122" y1="112" x2="122" y2="156" stroke="var(--color-border)" strokeWidth="1" />
            <line x1="94"  y1="134" x2="150" y2="134" stroke="var(--color-border)" strokeWidth="1" />
            <rect x="95"  y="113" width="26"  height="20" rx="1" fill="var(--color-surface)" opacity="0.5" />

            {/* Right window */}
            <rect x="330" y="112" width="56" height="44" rx="3" fill="var(--color-bg-subtle)" stroke="var(--color-border)" strokeWidth="1.5" />
            <line x1="358" y1="112" x2="358" y2="156" stroke="var(--color-border)" strokeWidth="1" />
            <line x1="330" y1="134" x2="386" y2="134" stroke="var(--color-border)" strokeWidth="1" />
            <rect x="331" y="113" width="26"  height="20" rx="1" fill="var(--color-surface)" opacity="0.5" />

            {/* Vent strips */}
            <rect x="94"  y="174" width="56" height="5" rx="2" fill="var(--color-surface-subtle)" stroke="var(--color-border)" strokeWidth="1" />
            <rect x="94"  y="184" width="56" height="5" rx="2" fill="var(--color-surface-subtle)" stroke="var(--color-border)" strokeWidth="1" />
            <rect x="330" y="174" width="56" height="5" rx="2" fill="var(--color-surface-subtle)" stroke="var(--color-border)" strokeWidth="1" />
            <rect x="330" y="184" width="56" height="5" rx="2" fill="var(--color-surface-subtle)" stroke="var(--color-border)" strokeWidth="1" />

            {/* Question badge */}
            <circle cx="240" cy="112" r="27" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
            <circle cx="240" cy="112" r="22" fill="var(--color-accent-light)" />
            <text x="240" y="121" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="26" fontWeight="800" fontFamily="ui-sans-serif,system-ui,sans-serif">?</text>

            {/* Left box stack */}
            <g className="nf-fb">
                <rect x="80" y="204" width="40" height="30" rx="3" fill="var(--color-accent-light)" stroke="var(--color-border)" strokeWidth="1.5" />
                <line x1="80"  y1="219" x2="120" y2="219" stroke="var(--color-border)" strokeWidth="0.9" />
                <line x1="100" y1="204" x2="100" y2="234" stroke="var(--color-border)" strokeWidth="0.9" />
            </g>
            <g className="nf-fa">
                <rect x="84" y="176" width="32" height="28" rx="3" fill="var(--color-accent-light)" stroke="var(--color-border)" strokeWidth="1.5" />
                <line x1="84"  y1="190" x2="116" y2="190" stroke="var(--color-border)" strokeWidth="0.9" />
                <line x1="100" y1="176" x2="100" y2="204" stroke="var(--color-border)" strokeWidth="0.9" />
            </g>
            <g className="nf-fc">
                <rect x="88" y="156" width="24" height="20" rx="2" fill="var(--color-surface-subtle)" stroke="var(--color-border)" strokeWidth="1" />
                <line x1="100" y1="156" x2="100" y2="176" stroke="var(--color-border)" strokeWidth="0.8" />
            </g>

            {/* Right box stack */}
            <g className="nf-fa">
                <rect x="360" y="204" width="40" height="30" rx="3" fill="var(--color-accent-light)" stroke="var(--color-border)" strokeWidth="1.5" />
                <line x1="360" y1="219" x2="400" y2="219" stroke="var(--color-border)" strokeWidth="0.9" />
                <line x1="380" y1="204" x2="380" y2="234" stroke="var(--color-border)" strokeWidth="0.9" />
            </g>
            <g className="nf-fc">
                <rect x="364" y="176" width="32" height="28" rx="3" fill="var(--color-accent-light)" stroke="var(--color-border)" strokeWidth="1.5" />
                <line x1="364" y1="190" x2="396" y2="190" stroke="var(--color-border)" strokeWidth="0.9" />
                <line x1="380" y1="176" x2="380" y2="204" stroke="var(--color-border)" strokeWidth="0.9" />
            </g>

            {/* Forklift */}
            <rect x="144" y="214" width="34" height="4" rx="1.5" fill="var(--color-text-muted)" />
            <rect x="144" y="222" width="34" height="4" rx="1.5" fill="var(--color-text-muted)" />
            <rect x="170" y="198" width="7"  height="30" rx="1.5" fill="var(--color-border-dark)" />
            <rect x="170" y="212" width="38" height="22" rx="4"   fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
            <rect x="178" y="202" width="22" height="14" rx="3"   fill="var(--color-surface-subtle)" stroke="var(--color-border)" strokeWidth="1" />
            <circle cx="178" cy="236" r="7" fill="var(--color-border-dark)" />
            <circle cx="178" cy="236" r="3" fill="var(--color-surface-subtle)" />
            <circle cx="200" cy="236" r="7" fill="var(--color-border-dark)" />
            <circle cx="200" cy="236" r="3" fill="var(--color-surface-subtle)" />

            {/* Floating boxes */}
            <g className="nf-fb">
                <rect x="420" y="52" width="26" height="22" rx="3" fill="var(--color-surface)" stroke="var(--color-border-subtle)" strokeWidth="1" />
                <line x1="420" y1="63" x2="446" y2="63" stroke="var(--color-border-subtle)" strokeWidth="0.7" />
                <line x1="433" y1="52" x2="433" y2="74" stroke="var(--color-border-subtle)" strokeWidth="0.7" />
            </g>
            <g className="nf-fa">
                <rect x="14" y="56" width="26" height="22" rx="3" fill="var(--color-surface)" stroke="var(--color-border-subtle)" strokeWidth="1" />
                <line x1="14" y1="67" x2="40" y2="67" stroke="var(--color-border-subtle)" strokeWidth="0.7" />
                <line x1="27" y1="56" x2="27" y2="78" stroke="var(--color-border-subtle)" strokeWidth="0.7" />
            </g>
        </svg>
    );
}

// ─── Root-level 404 Page (full-screen, no sidebar) ────────────────────────────
export default function NotFound() {
    const router      = useRouter();
    const pathname    = usePathname();
    const { t }       = useTranslation(["common"]);

    const displayPath = pathname || "/...";

    const handleGoBack = () => {
        if (typeof window !== "undefined") {
            router.back();
        }
    };

    const handleGoDashboard = () => {
        if (typeof window !== "undefined") {
            router.push("/dashboard");
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                document.activeElement.tagName === "INPUT" ||
                document.activeElement.tagName === "TEXTAREA" ||
                document.activeElement.isContentEditable
            ) {
                return;
            }

            if (e.key === "Escape") {
                e.preventDefault();
                handleGoBack();
            } else if (e.key === "d" || e.key === "D") {
                e.preventDefault();
                handleGoDashboard();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-(--color-bg)">
            <style dangerouslySetInnerHTML={{ __html: ANIM }} />

            {/* Premium Static Red Gradient in Top Right Corner */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Massive ambient red wash for smooth transition */}
                <div className="absolute top-[-30%] right-[-20%] w-[1200px] h-[1200px] rounded-full bg-danger/15 blur-[200px]" />
                
                {/* Mid-tier soft glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-danger/40 blur-[140px]" />
                
                {/* Intense deep red core right at the very corner */}
                <div className="absolute top-[-12%] right-[-10%] w-[400px] h-[400px] rounded-full bg-danger/90 blur-[80px]" />
            </div>

            {/* Header — matches app topbar style */}
            <header className="relative h-14 backdrop-blur-md flex items-center px-4 sm:px-6 z-30 shrink-0 nf-in">
                {/* Brand logo */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="flex items-center justify-center size-8 rounded-xl bg-danger/90 text-(--color-btn-primary-text) font-extrabold text-sm shadow-sm shrink-0 border border-white/5">
                        T
                    </div>
                    <span className="font-bold text-sm text-(--color-text-primary) tracking-tight truncate">
                        App Template
                    </span>
                </div>


            </header>

            {/* Main two-column layout */}
            <div className="relative flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left — Illustration */}
                    <div className="w-full order-2 lg:order-1">
                        <WarehouseScene />
                    </div>

                    {/* Right — Content */}
                    <div className="order-1 lg:order-2 flex flex-col gap-6 z-10">

                        {/* Error badge */}
                        <div className="self-start flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border-subtle bg-(--color-surface) nf-zoom">
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                            </span>
                            <span className="text-xs font-bold text-text-secondary tracking-widest uppercase">
                                {t("common:notFound.badge")}
                            </span>
                        </div>

                        {/* Two-tone heading */}
                        <div className="relative">
                            <h1
                                className="font-black leading-[1.1] tracking-tight"
                                style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)" }}
                            >
                                <span className="nf-reveal-wrap">
                                    <span className="nf-reveal-1 text-(--color-text-primary) block bg-clip-text text-transparent bg-gradient-to-r from-(--color-text-primary) to-(--color-text-secondary)">{t("common:notFound.titleLine1")}</span>
                                </span>
                                <span className="nf-reveal-wrap mt-1">
                                    <span className="nf-reveal-2 text-text-secondary block opacity-70">{t("common:notFound.titleLine2")}</span>
                                </span>
                            </h1>
                        </div>

                        {/* Description */}
                        <p className="text-base text-text-secondary leading-relaxed max-w-md font-medium nf-zoom">
                            {t("common:notFound.description")}
                        </p>

                        {/* Terminal request line */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-(--color-surface-subtle) border border-border-subtle font-mono text-sm overflow-hidden nf-zoom-del">
                            <span className="shrink-0 px-2 py-1 rounded-md text-[11px] font-bold bg-danger/10 text-danger border border-danger/20">
                                GET
                            </span>
                            <span className="text-text-secondary truncate flex-1 min-w-0 opacity-80">
                                {displayPath}
                            </span>
                            <span className="shrink-0 px-2 py-1 rounded-md text-[11px] font-bold bg-warning/10 text-warning border border-warning/20">
                                404
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-black/20 dark:bg-white/20 nf-zoom-del" />

                        {/* Action button */}
                        <div className="flex nf-zoom-del">
                            <AppButton
                                name="Go Back"
                                variant="primary"
                                className="px-6 h-11"
                                onClick={handleGoBack}
                                startIcon={<ArrowLeftDuotone className="text-xl" />}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom status bar */}
            <div className="relative backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted z-10">
                <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                    </span>
                    <span className="font-semibold text-text-secondary tracking-wide">{t("common:notFound.pageMissing")}</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-60 font-medium">
                    <span>{t("common:notFound.statusLabel")}</span>
                </div>
            </div>
        </div>
    );
}
