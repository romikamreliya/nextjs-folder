"use client";

// default
import React, { useState, useEffect } from "react";
import { Link, Spinner } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff, LayoutTemplate, ShieldUser, VerifiedCheck, Buildings, Search, Shop } from "@/components/icon/icons";
import { useRedirect } from "@/hooks/useRedirect";
import { useTranslation } from "@/hooks/useTranslation";
import auth from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

// UI
import AppInput from "@/components/ui/input";
import AppCheckbox from "@/components/ui/checkbox";
import AppButton from "@/components/ui/button";
import AppToast from "@/components/ui/toast";

// api call (commented out for demo — using mock login)
// import { usePost } from "@/hooks/useApi";
// import { API_LIST } from "@/lib/api-const";

// json validation
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { loginSchema } from "@/schema/login.schema";

const ERP_ANIM = `
  @keyframes erp-truck {
    0%   { transform: translateX(0px);   opacity: 1; }
    8%   { transform: translateX(0px);   opacity: 1; }
    40%  { transform: translateX(225px); opacity: 1; }
    52%  { transform: translateX(225px); opacity: 1; }
    80%  { transform: translateX(450px); opacity: 1; }
    84%  { transform: translateX(450px); opacity: 0; }
    88%  { transform: translateX(0px);   opacity: 0; }
    90%  { transform: translateX(0px);   opacity: 1; }
    100% { transform: translateX(0px);   opacity: 1; }
  }
  @keyframes warehouse-door {
    0%, 12%   { transform: translateY(-40px); }
    20%, 90%  { transform: translateY(0px);   }
    95%, 100% { transform: translateY(-40px); }
  }
  @keyframes shop-door {
    0%, 68%   { transform: translateY(0px);   }
    75%, 83%  { transform: translateY(-40px); }
    90%, 100% { transform: translateY(0px);   }
  }
  @keyframes laser-scan {
    0%,38%            { opacity:0   }
    40%,44%,48%,52%   { opacity:0.8 }
    42%,46%,50%       { opacity:0.2 }
    54%,100%          { opacity:0   }
  }
  @keyframes indicator-light {
    0%,39%   { fill:#ef4444 }
    40%,53%  { fill:#10b981 }
    54%,100% { fill:#ef4444 }
  }
  @keyframes signal-pulse {
    0%   { r:3px;  opacity:1 }
    100% { r:14px; opacity:0 }
  }
  @keyframes twinkle {
    0%,100% { opacity:0.15 }
    50%     { opacity:1    }
  }
  @keyframes cloud-drift {
    0%,100% { transform:translateX(0px)  }
    50%     { transform:translateX(22px) }
  }
  @keyframes cloud-drift-reverse {
    0%,100% { transform:translateX(0px)   }
    50%     { transform:translateX(-18px) }
  }
  @keyframes deer-graze {
    0%,100% { transform:rotate(0deg)  }
    50%     { transform:rotate(12deg) }
  }
  @keyframes bunny-hop {
    0%,100% { transform:translateY(0)    }
    50%     { transform:translateY(-3px) }
  }
  @keyframes lamp-flicker {
    0%,95%,100% { opacity:1   }
    96%,98%     { opacity:0.6 }
    97%,99%     { opacity:0.9 }
  }
  @keyframes drone-hover {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-4px) rotate(1.2deg); }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-2.5deg); }
    50%      { transform: rotate(2.5deg); }
  }
  @keyframes pulse-light {
    0%, 100% { opacity: 0.35; }
    50%      { opacity: 0.7; }
  }
  .animate-sway {
    transform-origin: 140px 55px;
    animation: sway 5s ease-in-out infinite;
  }
  .animate-pulse-light {
    animation: pulse-light 3s ease-in-out infinite;
  }

  /* CRANE ANIMATIONS */
  @keyframes crane-mast-rise {
    0%   { height: 0px; y: 174px; }
    100% { height: 524px; y: -350px; }
  }
  @keyframes crane-top-rise {
    0%   { transform: translateY(524px); }
    100% { transform: translateY(0px); }
  }
  @keyframes crane-jib-extend {
    0%   { x: 570px; width: 0px; }
    100% { x: 60px; width: 510px; }
  }
  @keyframes crane-trolley-travel {
    0%   { transform: translateX(570px); }
    100% { transform: translateX(422px); }
  }
  @keyframes crane-hook-descend {
    0%   { transform: translateY(-100px); opacity: 0; }
    40%  { opacity: 1; }
    70%  { transform: translateY(6px); }    /* Physical overshoot downward */
    82%  { transform: translateY(-4px); }   /* Spring rebound upward */
    92%  { transform: translateY(1.5px); }  /* Elastic settle */
    100% { transform: translateY(0px); opacity: 1; }
  }
  @keyframes crane-logo-fade {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes crane-continuous-sway {
    0%, 100% { transform: rotate(-0.8deg); }
    50%      { transform: rotate(0.8deg); }
  }
  @keyframes beacon-flash {
    0%, 100% { opacity: 0.25; }
    50%      { opacity: 1; }
  }
  .animate-beacon {
    animation: beacon-flash 1.2s infinite ease-in-out;
  }

  /* Neon pulsing guide animation */
  @keyframes neon-glow-pulse {
    0%, 100% { opacity: 0.45; }
    50%      { opacity: 1; filter: drop-shadow(0 0 1px #00f0ff); }
  }
  .animate-neon-pulse {
    animation: neon-glow-pulse 2s infinite ease-in-out;
  }

  /* Sweeping laser scanner line animation */
  @keyframes scan-laser-sweep {
    0%, 39% { transform: translateY(0px); opacity: 0; }
    40% { transform: translateY(0px); opacity: 1; }
    46% { transform: translateY(112px); opacity: 1; }
    52% { transform: translateY(0px); opacity: 1; }
    53%, 100% { transform: translateY(0px); opacity: 0; }
  }
  .animate-laser-sweep {
    animation: scan-laser-sweep 8s infinite ease-in-out;
  }

  /* Shimmer Sweep Animation Stops */
  @keyframes shimmer-color-1 {
    0%, 70%, 100% { stop-color: #f59e0b; }
    80% { stop-color: #ffe082; }
    85% { stop-color: #ffffff; }
    90% { stop-color: #f59e0b; }
  }
  @keyframes shimmer-color-2 {
    0%, 73%, 100% { stop-color: #ffe082; }
    83% { stop-color: #ffffff; }
    88% { stop-color: #ffe082; }
    93% { stop-color: #ffe082; }
  }
  @keyframes shimmer-color-3 {
    0%, 76%, 100% { stop-color: #f59e0b; }
    86% { stop-color: #ffe082; }
    91% { stop-color: #ffffff; }
    96% { stop-color: #f59e0b; }
  }
  
  #shimmer-stop-1 {
    animation: shimmer-color-1 5s infinite ease-in-out;
  }
  #shimmer-stop-2 {
    animation: shimmer-color-2 5s infinite ease-in-out;
  }
  #shimmer-stop-3 {
    animation: shimmer-color-3 5s infinite ease-in-out;
  }

  /* Landing pulse animation */
  @keyframes land-pulse {
    0%   { r: 10px; opacity: 0; }
    5%   { r: 10px; opacity: 0.8; }
    50%  { r: 90px; opacity: 0.3; }
    100% { r: 180px; opacity: 0; }
  }
  .animate-landing-pulse {
    animation: land-pulse 3s cubic-bezier(0.16, 1, 0.3, 1) both 7.9s;
  }

  .animate-crane-mast-clip {
    animation: crane-mast-rise 3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-crane-top-rise {
    animation: crane-top-rise 3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .animate-crane-jib-clip {
    animation: crane-jib-extend 2.5s cubic-bezier(0.16, 1, 0.3, 1) both 3s;
  }
  .animate-crane-trolley {
    animation: crane-trolley-travel 2s cubic-bezier(0.16, 1, 0.3, 1) both 5s;
  }
  .animate-crane-hook {
    animation: crane-hook-descend 2s cubic-bezier(0.16, 1, 0.3, 1) both 6.5s;
  }
  .animate-crane-logo {
    transform-origin: 0px -230px;
    animation: crane-logo-fade 2s cubic-bezier(0.16, 1, 0.3, 1) both 6.5s;
  }
  .animate-crane-sway-continuous {
    transform-origin: 0px -340px;
    animation: crane-continuous-sway 6s ease-in-out infinite both 8s;
  }

  /* Motionsites.ai Background Animations & Styles */
  @keyframes float-blob-1 {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    50%      { transform: translate(45px, -30px) scale(1.15); }
  }
  @keyframes float-blob-2 {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    50%      { transform: translate(-35px, 35px) scale(0.9); }
  }
  @keyframes float-blob-3 {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    50%      { transform: translate(25px, 45px) scale(1.08); }
  }
  .bg-grid-dots {
    background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .glow-blob {
    filter: blur(120px);
    mix-blend-mode: screen;
  }
`;

function ERPWorkflowScene({ badgeText, headingText, subtitleText }) {
    const starData = [[30,12,3],[80,8,1],[160,5,0],[220,15,2],[310,6,4],[370,10,1],[430,4,0],[500,14,3],[550,9,2],[70,22,1],[190,18,0],[290,25,3],[420,20,2],[530,17,4]];
    const shutterYW = [124,130,136,142,148,154,160,166,172];
    const shutterYS = [134,140,146,152,158,164,170];
    const parcelPos = [[45,146],[56,146],[67,146],[50,137],[61,137]];
    return (
        <svg viewBox="0 -370 590 555" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full overflow-visible" aria-hidden="true">
            <defs>
                <clipPath id="mastClip">
                    <rect x="560" y="174" width="20" height="0" className="animate-crane-mast-clip" />
                </clipPath>
                <clipPath id="jibClip">
                    <rect x="570" y="-375" width="0" height="45" className="animate-crane-jib-clip" />
                </clipPath>
                <radialGradient id="spotlightGlow" cx="50%" cy="0%" r="80%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </radialGradient>
                <pattern id="cautionStrip" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="4" height="8" fill="#71717a" />
                    <rect x="4" width="4" height="8" fill="#18181b" />
                </pattern>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#09090b" />
                    <stop offset="55%"  stopColor="#18181b" />
                    <stop offset="100%" stopColor="#27272a" />
                </linearGradient>
                <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#27272a" />
                    <stop offset="100%" stopColor="#09090b" />
                </linearGradient>
                <linearGradient id="buildingGradLit" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="#3f3f46" />
                    <stop offset="100%" stopColor="#09090b" />
                </linearGradient>
                <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#52525b" />
                    <stop offset="100%" stopColor="#18181b" />
                </linearGradient>
                <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#3f3f46" />
                    <stop offset="50%"  stopColor="#71717a" />
                    <stop offset="100%" stopColor="#3f3f46" />
                </linearGradient>
                <linearGradient id="laserGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
                </linearGradient>
                <linearGradient id="containerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#ffffff" />
                    <stop offset="70%"  stopColor="#f4f4f5" />
                    <stop offset="100%" stopColor="#d4d4d8" />
                </linearGradient>
                <linearGradient id="cabGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="#cbd5e1" />
                    <stop offset="50%"  stopColor="#64748b" />
                    <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <linearGradient id="windowGlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                <linearGradient id="windowGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.7" />
                    <stop offset="35%"  stopColor="#e2e8f0" stopOpacity="0.45" />
                    <stop offset="70%"  stopColor="#cbd5e1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="headlightGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#fffde0" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#fffde0" stopOpacity="0"   />
                </linearGradient>
                <linearGradient id="trailGrad" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0"   />
                </linearGradient>
                <linearGradient id="mountainGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#27272a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#09090b" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="mountainGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#3f3f46" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#09090b" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#27272a" />
                    <stop offset="100%" stopColor="#18181b" />
                </linearGradient>
                <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#fde68a" stopOpacity="0"    />
                </linearGradient>
                <linearGradient id="puddleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#fde68a" stopOpacity="0"    />
                </linearGradient>
                <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#000000" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0"   />
                </radialGradient>
                <radialGradient id="lampHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#fde68a" stopOpacity="0"   />
                </radialGradient>
                <radialGradient id="winSpill" cx="50%" cy="0%" r="80%">
                    <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
                </radialGradient>
                <linearGradient id="warehouseGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="60%" stopColor="#1e1b4b" />
                    <stop offset="100%" stopColor="#c2410c" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c2410c" />
                    <stop offset="30%" stopColor="#ea580c" />
                    <stop offset="70%" stopColor="#9a3412" />
                    <stop offset="100%" stopColor="#7c2d12" />
                </linearGradient>
                <linearGradient id="shopWindowGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                    <stop offset="40%" stopColor="#fde047" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.95" />
                </linearGradient>
                <pattern id="cautionYellowBlack" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="6" height="12" fill="#eab308" />
                    <rect x="6" width="6" height="12" fill="#18181b" />
                </pattern>
                <linearGradient id="scanGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <clipPath id="warehouseDoorClip">
                    <rect x="44" y="118" width="82" height="58" />
                </clipPath>
                <clipPath id="shopDoorClip">
                    <rect x="507" y="128" width="36" height="48" />
                </clipPath>
                
                {/* Premium Metallic & Glowing Redesign Defs */}
                <linearGradient id="craneSteelGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="40%" stopColor="#475569" />
                    <stop offset="70%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="craneNeonGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0891b2" />
                    <stop offset="50%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
                <linearGradient id="goldTextGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="35%" stopColor="#f59e0b" id="shimmer-stop-1" />
                    <stop offset="50%" stopColor="#ffe082" id="shimmer-stop-2" />
                    <stop offset="65%" stopColor="#f59e0b" id="shimmer-stop-3" />
                    <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="goldBorderGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffe082" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#ff8f00" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ffd54f" stopOpacity="0.9" />
                </linearGradient>
                <filter id="goldTextGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.45" />
                </filter>

                {/* Premium Scanner Redesign Defs */}
                <linearGradient id="scannerSteel" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="35%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#64748b" />
                    <stop offset="65%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="scannerGold" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="scannerNeonGreen" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="50%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="laserBeamGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                    <stop offset="25%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
                <filter id="emeraldGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Realistic night sky */}
            <rect x="0" y="-370" width="590" height="600" fill="transparent" />

            {/* Stars */}
            {starData.map(([x,y,d],i)=>(
                <circle key={i} cx={x} cy={y - 80} r={i%3===0?1.2:0.7} fill="#e0f0ff"
                    opacity={0.4+((i*0.13)%0.5)}
                    style={{animation:`twinkle ${2.5+d*0.7}s ${i*0.3}s infinite ease-in-out`}} />
            ))}

            {/* Atmospheric fog over lower mountains */}
            <path d="M 10,174 A 130,39 0 0,1 270,174 Z" fill="#18181b" opacity="0.55" />
            <path d="M 180,174 A 160,51 0 0,1 500,174 Z" fill="#09090b" opacity="0.45" />

            {/* Mountains with snow caps and ridge highlights */}
            <polygon points="40,174 140,58 240,174"  fill="url(#mountainGrad1)" stroke="#27272a" strokeWidth="0.6" />
            <polygon points="127,73 140,58 153,73"   fill="#e8f4ff" opacity="0.82" />
            <line x1="140" y1="58" x2="135" y2="70" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.5" />
            <polygon points="245,174 340,46 435,174"  fill="url(#mountainGrad2)" stroke="#27272a" strokeWidth="0.6" />
            <polygon points="327,66 340,46 353,66"   fill="#e8f4ff" opacity="0.82" />
            <line x1="340" y1="46" x2="334" y2="62" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.5" />

            {/* Cloud network nodes */}
            <line x1="75"  y1="20" x2="287" y2="15" stroke="#334155" strokeWidth="0.7" strokeDasharray="3 4" opacity="0.35" />
            <line x1="287" y1="15" x2="505" y2="20" stroke="#334155" strokeWidth="0.7" strokeDasharray="3 4" opacity="0.35" />
            {[[75,20,'#cbd5e1',3],[287,15,'#ffffff',4],[505,20,'#94a3b8',3.5]].map(([cx,cy,c,d],i)=>(
                <g key={i}>
                    <circle cx={cx} cy={cy} r="5" fill={c} opacity="0.12" style={{animation:`twinkle ${d}s infinite ease-in-out`}} />
                    <circle cx={cx} cy={cy} r="1.5" fill={c} />
                </g>
            ))}

            {/* Clouds */}
            <g style={{animation:"cloud-drift 24s infinite ease-in-out"}}>
                <path d="M120,50 C120,42 127,35 135,35 C137,35 139,36 141,37 C144,30 151,25 159,25 C168,25 175,32 176,41 C178,40 180,40 182,40 C189,40 195,46 195,53 C195,60 189,66 182,66 L135,66 C127,66 120,59 120,50Z" fill="#ffffff" fillOpacity="0.07" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.12" />
            </g>
            <g style={{animation:"cloud-drift-reverse 30s infinite ease-in-out"}}>
                <path d="M360,58 C360,51 366,45 373,45 C375,45 377,46 379,47 C382,41 388,37 395,37 C403,37 409,43 410,50 C412,49 414,49 415,49 C421,49 426,54 426,60 C426,66 421,72 415,72 L373,72 C366,72 360,65 360,58Z" fill="#ffffff" fillOpacity="0.07" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.12" />
            </g>

            {/* Realistic Construction Crane Scene */}
            <g>
                {/* 1. Vertical mast with lattice structure */}
                <g clipPath="url(#mastClip)">
                    {/* Left and Right vertical struts (Premium Titanium/Steel chords) */}
                    <line x1="565" y1="174" x2="565" y2="-350" stroke="url(#craneSteelGrad)" strokeWidth="2.5" />
                    <line x1="575" y1="174" x2="575" y2="-350" stroke="url(#craneSteelGrad)" strokeWidth="2.5" />
                    
                    {/* Metallic Highlights */}
                    <line x1="565.5" y1="174" x2="565.5" y2="-350" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
                    <line x1="574.5" y1="174" x2="574.5" y2="-350" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
                    
                    {/* Integrated vertical Neon Guide Light */}
                    <line x1="570" y1="174" x2="570" y2="-350" stroke="url(#craneNeonGrad)" strokeWidth="1.2" className="animate-neon-pulse" />

                    {/* Diagonal X-bracing */}
                    <path
                        d="M565,174 L575,154 L565,134 L575,114 L565,94 L575,74 L565,54 L575,34 L565,14 L575,-6 L565,-26 L575,-46 L565,-66 L575,-86 L565,-106 L575,-126 L565,-146 L575,-166 L565,-186 L575,-206 L565,-226 L575,-246 L565,-266 L575,-286 L565,-306 L575,-326 L565,-346"
                        stroke="#cbd5e1" strokeWidth="0.6" strokeOpacity="0.4" fill="none"
                    />
                    <path
                        d="M575,174 L565,154 L575,134 L565,114 L575,94 L565,74 L575,54 L565,34 L575,14 L565,-6 L575,-26 L565,-46 L575,-66 L565,-86 L575,-106 L565,-126 L575,-146 L565,-166 L575,-186 L565,-206 L575,-226 L565,-246 L575,-266 L565,-286 L575,-306 L565,-326 L575,-346"
                        stroke="#cbd5e1" strokeWidth="0.6" strokeOpacity="0.4" fill="none"
                    />
                    
                    {/* Horizontal Struts */}
                    <path
                        d="M565,154 H575 M565,134 H575 M565,114 H575 M565,94 H575 M565,74 H575 M565,54 H575 M565,34 H575 M565,14 H575 M565,-6 H575 M565,-26 H575 M565,-46 H575 M565,-66 H575 M565,-86 H575 M565,-106 H575 M565,-126 H575 M565,-146 H575 M565,-166 H575 M565,-186 H575 M565,-206 H575 M565,-226 H575 M565,-246 H575 M565,-266 H575 M565,-286 H575 M565,-306 H575 M565,-326 H575 M565,-346 H575"
                        stroke="#cbd5e1" strokeWidth="0.6" strokeOpacity="0.3" fill="none"
                    />
                </g>

                {/* 2. Rising Top Assembly (Cabin, Jib, Counterweight) */}
                <g className="animate-crane-top-rise">
                    {/* Apex tower frame */}
                    <polygon points="565,-350 570,-370 575,-350" fill="none" stroke="url(#craneSteelGrad)" strokeWidth="0.8" />
                    <circle cx="570" cy="-370" r="3.2" fill="#ef4444" opacity="0.18" className="animate-beacon" />
                    <circle cx="570" cy="-370" r="1.5" fill="#ef4444" className="animate-beacon" />
                    
                    {/* Cabin on the left of the mast */}
                    <rect x="551" y="-352" width="14" height="12" rx="2" fill="#1e293b" stroke="url(#craneSteelGrad)" strokeWidth="0.8" />
                    <rect x="553" y="-350" width="6" height="5" fill="#00f0ff" opacity="0.95" style={{ animation: "twinkle 2s infinite", filter: "drop-shadow(0 0 2px #00f0ff)" }} />
                    <rect x="551" y="-355" width="14" height="3" fill="#0f172a" stroke="url(#craneSteelGrad)" strokeWidth="0.6" />
                    
                    {/* Stays from apex to counterweight */}
                    <line x1="570" y1="-370" x2="578" y2="-350" stroke="#94a3b8" strokeWidth="0.6" strokeOpacity="0.6" />

                    {/* Counterweight arm & weights */}
                    <rect x="570" y="-352" width="10" height="4" fill="#334155" stroke="url(#craneSteelGrad)" strokeWidth="0.6" />
                    <rect x="573" y="-355" width="5" height="8" fill="#475569" stroke="url(#craneSteelGrad)" strokeWidth="0.5" rx="1" />

                    {/* Horizontal Jib with lattice structure */}
                    <g clipPath="url(#jibClip)">
                        {/* Jib Stay line (moves inside clip path so it extends with the jib) */}
                        <line x1="570" y1="-370" x2="60" y2="-350" stroke="#cbd5e1" strokeWidth="0.6" strokeOpacity="0.6" />
                        
                        {/* Top and bottom chords */}
                        <line x1="570" y1="-352" x2="60" y2="-352" stroke="url(#craneSteelGrad)" strokeWidth="2.0" />
                        <line x1="570" y1="-344" x2="60" y2="-344" stroke="url(#craneSteelGrad)" strokeWidth="2.0" />
                        {/* Metallic highlights */}
                        <line x1="570" y1="-352" x2="60" y2="-352" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
                        <line x1="570" y1="-344" x2="60" y2="-344" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.4" />
                        
                        {/* Integrated Horizontal Neon Guide Light */}
                        <line x1="570" y1="-348" x2="60" y2="-348" stroke="url(#craneNeonGrad)" strokeWidth="1" className="animate-neon-pulse" />

                        {/* Diagonals */}
                        <path
                            d="M570,-344 L555,-352 L540,-344 L525,-352 L510,-344 L495,-352 L480,-344 L465,-352 L450,-344 L435,-352 L420,-344 L405,-352 L390,-344 L375,-352 L360,-344 L345,-352 L330,-344 L315,-352 L300,-344 L285,-352 L270,-344 L255,-352 L240,-344 L225,-352 L210,-344 L195,-352 L180,-344 L165,-352 L150,-344 L135,-352 L120,-344 L105,-352 L90,-344 L75,-352 L60,-344"
                            stroke="#cbd5e1" strokeWidth="0.5" strokeOpacity="0.4" fill="none"
                        />
                        {/* Jib Nose closure cap */}
                        <line x1="60" y1="-352" x2="60" y2="-344" stroke="url(#craneSteelGrad)" strokeWidth="1.8" />
                        <circle cx="60" cy="-348" r="3.2" fill="#ef4444" opacity="0.18" className="animate-beacon" />
                        <circle cx="60" cy="-348" r="1.5" fill="#ef4444" className="animate-beacon" />
                    </g>

                    {/* 3. Trolley (Slides horizontally along bottom of Jib) */}
                    <g className="animate-crane-trolley">
                        <rect x="-8" y="-344" width="16" height="4" fill="url(#craneSteelGrad)" stroke="#475569" strokeWidth="0.5" rx="0.5" />
                        
                        {/* 4. Hook, Cables, and Swaying Load Assembly */}
                        <g className="animate-crane-hook">
                            <g className="animate-crane-sway-continuous">
                                {/* Hanging main steel cables */}
                                <line x1="-2" y1="-340" x2="-2" y2="-308" stroke="#94a3b8" strokeWidth="0.8" />
                                <line x1="2" y1="-340" x2="2" y2="-308" stroke="#94a3b8" strokeWidth="0.8" />
                                
                                {/* Pulley Block / Hook Assembly */}
                                <circle cx="0" cy="-306" r="5" fill="url(#metalGrad)" stroke="#64748b" strokeWidth="1" />
                                <circle cx="0" cy="-306" r="1.5" fill="#18181b" />
                                <path d="M-2.5,-304 Q0,-297 2.5,-304 Q3.5,-308 0,-305" fill="none" stroke="url(#metalGrad)" strokeWidth="1.8" strokeLinecap="round" />
                                
                                {/* Direct diagonal steel cables from hook directly to clamps */}
                                <line x1="0" y1="-302" x2="-35" y2="-265" stroke="#cbd5e1" strokeWidth="1.2" />
                                <line x1="0" y1="-302" x2="35" y2="-255" stroke="#cbd5e1" strokeWidth="1.2" />
                                
                                <g className="animate-crane-logo overflow-visible">
                                    {/* Left Claw/Grip Clamping the E */}
                                    <g transform="translate(-35, -265)">
                                        <rect x="-4" y="-3" width="8" height="5" fill="url(#metalGrad)" stroke="#3f3f46" strokeWidth="0.6" rx="1" />
                                        {/* Clamping claws wrapping around top of letter E */}
                                        <path d="M -3 2 L -3 7 L -1 7" fill="none" stroke="url(#metalGrad)" strokeWidth="1" strokeLinecap="round" />
                                        <path d="M 3 2 L 3 7 L 1 7" fill="none" stroke="url(#metalGrad)" strokeWidth="1" strokeLinecap="round" />
                                        <circle cx="0" cy="-0.5" r="0.8" fill="#f59e0b" />
                                    </g>
                                    
                                    {/* Right Claw/Grip Clamping the e */}
                                    <g transform="translate(35, -255)">
                                        <rect x="-4" y="-3" width="8" height="5" fill="url(#metalGrad)" stroke="#3f3f46" strokeWidth="0.6" rx="1" />
                                        {/* Clamping claws wrapping around top of letter e */}
                                        <path d="M -3 2 L -3 7 L -1 7" fill="none" stroke="url(#metalGrad)" strokeWidth="1" strokeLinecap="round" />
                                        <path d="M 3 2 L 3 7 L 1 7" fill="none" stroke="url(#metalGrad)" strokeWidth="1" strokeLinecap="round" />
                                        <circle cx="0" cy="-0.5" r="0.8" fill="#f59e0b" />
                                    </g>
 
                                    {/* Real text - Single layer for maximum sharpness and zero blur */}
                                    <text x="0" y="-230" textAnchor="middle" fill="#ffffff" textRendering="geometricPrecision" className="font-extrabold text-5xl tracking-tight select-none font-sans">App</text>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>


            {/* Left trees */}
            <g opacity="0.9">
                <rect x="145" y="128" width="2.5" height="46" fill="#3f3f46" />
                <polygon points="137,140 146,110 155,140" fill="#0f4f45" />
                <polygon points="139,124 146,100 153,124" fill="#0d6b5e" />
                <polygon points="141,111 146,92 151,111"  fill="#0a8070" />
                <rect x="157" y="136" width="2" height="38" fill="#3f3f46" />
                <polygon points="150,146 158,120 166,146" fill="#0c4540" />
                <polygon points="152,132 158,112 164,132" fill="#0f6058" />
            </g>
            {/* Right trees */}
            <g opacity="0.9">
                <rect x="402" y="128" width="2.5" height="46" fill="#3f3f46" />
                <polygon points="394,140 402,110 410,140" fill="#0f4f45" />
                <polygon points="396,124 402,100 408,124" fill="#0d6b5e" />
                <polygon points="398,111 402,92 406,111"  fill="#0a8070" />
            </g>

            {/* Deer */}
            <ellipse cx="162" cy="162" rx="4.5" ry="2.8" fill="#b45309" />
            {[159,161,163,165].map((x,i)=>(<line key={i} x1={x} y1="164" x2={x} y2="173" stroke="#b45309" strokeWidth="0.9" />))}
            <g style={{transformOrigin:"165px 162px",animation:"deer-graze 5s infinite ease-in-out"}}>
                <line x1="165" y1="162" x2="167" y2="155" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="168" cy="154" r="2" fill="#b45309" />
                <line x1="168" y1="153" x2="170" y2="149" stroke="#b45309" strokeWidth="0.9" />
            </g>

            {/* Bunny */}
            <g style={{animation:"bunny-hop 1.8s infinite ease-in-out"}}>
                <circle cx="388" cy="168" r="2.8" fill="#d1d5db" />
                <circle cx="391" cy="166" r="2"   fill="#d1d5db" />
                <line x1="390" y1="165" x2="389" y2="161" stroke="#d1d5db" strokeWidth="0.7" />
                <circle cx="384" cy="169" r="0.9"  fill="#d1d5db" />
            </g>

            {/* Ground shadows */}
            <ellipse cx="75"  cy="178" rx="54" ry="5"   fill="url(#shadowGrad)" />
            <ellipse cx="505" cy="178" rx="54" ry="5"   fill="url(#shadowGrad)" />
            <ellipse cx="287" cy="176" rx="30" ry="3.5" fill="url(#shadowGrad)" opacity="0.7" />

            {/* Road */}
            <rect x="10" y="174" width="570" height="8" rx="3" fill="url(#roadGrad)" stroke="#3f3f46" strokeWidth="1" />
            <line x1="15" y1="178" x2="575" y2="178" stroke="#52525b" strokeWidth="2" strokeDasharray="8 7" />
            {/* Bridge */}
            <path d="M326,174 Q350,163 374,174" stroke="#52525b" strokeWidth="2.5" fill="none" />
            <path d="M326,171 Q350,160 374,171" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.7" />

            {/* Street Light 1 (left) */}
            <g style={{animation:"lamp-flicker 8s 2s infinite"}}>
                <polygon points="191,93 199,93 238,174 152,174" fill="url(#lampCone)" />
                <ellipse cx="195" cy="177" rx="28" ry="3" fill="url(#puddleGrad)" opacity="0.6" />
                <ellipse cx="195" cy="91" rx="9" ry="6" fill="url(#lampHalo)" opacity="0.75" />
                <circle cx="195" cy="91" r="1.8" fill="#fef9c3" />
            </g>
            <rect x="179.5" y="100" width="1.5" height="74" fill="#52525b" />
            <path d="M180,100 Q180,88 196,88" stroke="#52525b" strokeWidth="1.8" fill="none" />
            <rect x="190" y="88" width="10" height="4" rx="1" fill="#3f3f46" />
            <rect x="178" y="170" width="5" height="4" rx="1" fill="#3f3f46" />

            {/* Street Light 2 (right) */}
            <g style={{animation:"lamp-flicker 8s 0s infinite"}}>
                <polygon points="436,93 444,93 483,174 397,174" fill="url(#lampCone)" />
                <ellipse cx="440" cy="177" rx="28" ry="3" fill="url(#puddleGrad)" opacity="0.6" />
                <ellipse cx="440" cy="91" rx="9" ry="6" fill="url(#lampHalo)" opacity="0.75" />
                <circle cx="440" cy="91" r="1.8" fill="#fef9c3" />
            </g>
            <rect x="424.5" y="100" width="1.5" height="74" fill="#52525b" />
            <path d="M425,100 Q425,88 441,88" stroke="#52525b" strokeWidth="1.8" fill="none" />
            <rect x="435" y="88" width="10" height="4" rx="1" fill="#3f3f46" />
            <rect x="423" y="170" width="5" height="4" rx="1" fill="#3f3f46" />

            {/* DUBAI-STYLE SMART LOGISTICS WAREHOUSE */}
            {/* Aerodynamic curved structural building profile */}
            <path d="M 25,174 L 25,90 Q 25,60 65,60 L 145,60 L 145,174 Z" fill="url(#buildingGrad)" stroke="#3f3f46" strokeWidth="1.2" />
            
            {/* Sweeping Silver Canopy Wing (Dubai Architectural Accent) */}
            <path d="M 20,95 Q 20,54 65,54 L 150,54 L 145,60 L 65,60 Q 25,60 25,95 Z" fill="url(#metalGrad)" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.4" />
            
            {/* Glowing neon white accent strip following the wing curve */}
            <path d="M 21,92 Q 21,56 65,56 L 146,56" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.7" />

            {/* Smart grid communication antenna */}
            <line x1="85" y1="54" x2="85" y2="34" stroke="#52525b" strokeWidth="1.8" />
            <circle cx="85" cy="34" r="2.5" fill="#ffffff" />
            <circle cx="85" cy="34" r="2.5" fill="none" stroke="#ffffff" strokeWidth="0.8" style={{animation:"signal-pulse 2.2s infinite"}} />

            {/* Modern glass curtain wall */}
            <rect x="32" y="76" width="36" height="24" rx="1.5" fill="url(#windowGlow)" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.25" />
            <path d="M 32,76 L 68,100 M 68,76 L 32,100 M 32,88 L 68,88 M 50,76 L 50,100" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.08" />
            
            <ellipse cx="35" cy="176" rx="16" ry="2.5" fill="url(#winSpill)" opacity="0.35" />
            
            {/* Warehouse Label */}
            <text x="105" y="91" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.8">WAREHOUSE</text>
            
            {/* Sleek carbon-fiber caution strip above docking shutter */}
            <rect x="40" y="112" width="90" height="4" fill="url(#cautionStrip)" />
            
            {/* Shutter door structure */}
            <rect x="40" y="116" width="90" height="60" fill="#09090b" stroke="#3f3f46" strokeWidth="1.2" />
            
            {/* Warehouse Interior (Sunset Glow & Boxes) */}
            <rect x="42" y="118" width="86" height="56" fill="url(#warehouseGlow)" />
            
            {/* Cardboard Boxes Stacks */}
            {/* Stack 1: Right (3 boxes) */}
            <g>
                <rect x="104" y="159" width="14" height="15" fill="url(#boxGrad)" stroke="#451a03" strokeWidth="0.8" rx="0.5" />
                <line x1="104" y1="160" x2="118" y2="160" stroke="#fdba74" strokeWidth="0.8" strokeOpacity="0.5" />
                <rect x="110" y="159" width="2" height="15" fill="#451a03" opacity="0.3" />
                <rect x="106" y="163" width="4" height="3" fill="#ffffff" opacity="0.75" />
                
                <rect x="104" y="144" width="14" height="15" fill="url(#boxGrad)" stroke="#451a03" strokeWidth="0.8" rx="0.5" />
                <line x1="104" y1="145" x2="118" y2="145" stroke="#fdba74" strokeWidth="0.8" strokeOpacity="0.5" />
                <rect x="110" y="144" width="2" height="15" fill="#451a03" opacity="0.3" />
                <rect x="111" y="148" width="4" height="3" fill="#ffffff" opacity="0.75" />
                
                <rect x="104" y="129" width="14" height="15" fill="url(#boxGrad)" stroke="#451a03" strokeWidth="0.8" rx="0.5" />
                <line x1="104" y1="130" x2="118" y2="130" stroke="#fdba74" strokeWidth="0.8" strokeOpacity="0.5" />
                <rect x="110" y="129" width="2" height="15" fill="#451a03" opacity="0.3" />
                <rect x="106" y="133" width="4" height="3" fill="#ffffff" opacity="0.75" />
            </g>
            {/* Stack 2: Middle (2 boxes) */}
            <g>
                <rect x="88" y="159" width="14" height="15" fill="url(#boxGrad)" stroke="#451a03" strokeWidth="0.8" rx="0.5" />
                <line x1="88" y1="160" x2="102" y2="160" stroke="#fdba74" strokeWidth="0.8" strokeOpacity="0.5" />
                <rect x="94" y="159" width="2" height="15" fill="#451a03" opacity="0.3" />
                <rect x="90" y="163" width="4" height="3" fill="#ffffff" opacity="0.75" />
                
                <rect x="88" y="144" width="14" height="15" fill="url(#boxGrad)" stroke="#451a03" strokeWidth="0.8" rx="0.5" />
                <line x1="88" y1="145" x2="102" y2="145" stroke="#fdba74" strokeWidth="0.8" strokeOpacity="0.5" />
                <rect x="94" y="144" width="2" height="15" fill="#451a03" opacity="0.3" />
                <rect x="90" y="148" width="4" height="3" fill="#ffffff" opacity="0.75" />
            </g>
            {/* Stack 3: Left (1 box) */}
            <g>
                <rect x="72" y="159" width="14" height="15" fill="url(#boxGrad)" stroke="#451a03" strokeWidth="0.8" rx="0.5" />
                <line x1="72" y1="160" x2="86" y2="160" stroke="#fdba74" strokeWidth="0.8" strokeOpacity="0.5" />
                <rect x="78" y="159" width="2" height="15" fill="#451a03" opacity="0.3" />
                <rect x="74" y="163" width="4" height="3" fill="#ffffff" opacity="0.75" />
            </g>
            
            {/* TRUCK */}
            <g style={{animation:"erp-truck 8s cubic-bezier(0.4,0,0.2,1) infinite"}}>
                <ellipse cx="69" cy="173" rx="30" ry="4" fill="url(#shadowGrad)" opacity="0.65" />
                <path d="M42,153 L22,153" stroke="url(#trailGrad)" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M42,160 L26,160" stroke="url(#trailGrad)" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="43" y="161" width="49" height="3" fill="#18181b" />
                <rect x="39" y="157" width="3" height="5" fill="#52525b" />
                <rect x="41" y="128" width="42" height="33" fill="url(#containerGrad)" stroke="#71717a" strokeWidth="1" />
                <line x1="52" y1="129" x2="52" y2="160" stroke="#d4d4d8" strokeWidth="0.8" />
                <line x1="63" y1="129" x2="63" y2="160" stroke="#d4d4d8" strokeWidth="0.8" />
                <line x1="74" y1="129" x2="74" y2="160" stroke="#d4d4d8" strokeWidth="0.8" />
                <rect x="41" y="158" width="42" height="3" fill="#52525b" />
                
                {/* Aerodynamic Electric Tesla-style Cab */}
                <path d="M83,161 L98,161 Q100,161 100,158 L98,148 Q96,136 84,136 L83,136 Z" fill="url(#cabGrad)" stroke="#18181b" strokeWidth="1" />
                <path d="M86,138 L93,138 Q96,144 95,148 L86,148 Z" fill="url(#windowGlowGrad)" stroke="#18181b" strokeWidth="0.8" />
                <line x1="86" y1="139" x2="89" y2="147" stroke="#ffffff" strokeWidth="1.3" opacity="0.55" strokeLinecap="round" />
                <rect x="94" y="157" width="4" height="4" fill="#3f3f46" />
                
                {/* Horizontal LED Light strip headlight */}
                <rect x="96" y="154" width="4" height="1.8" rx="0.5" fill="#ffffff" />
                <polygon points="98,154 138,146 138,172 98,163" fill="url(#headlightGlow)" opacity="0.35" />
                
                {[[54,166],[87,166]].map(([cx,cy],i)=>(
                    <g key={i}>
                        <circle cx={cx} cy={cy} r="7.5" fill="#09090b" stroke="#27272a" strokeWidth="0.8" />
                        <circle cx={cx} cy={cy} r="4.5" fill="#71717a" />
                        <circle cx={cx} cy={cy} r="2"   fill="#e4e4e7" />
                    </g>
                ))}
                <g style={{animation:"laser-scan 8s infinite"}}>
                    {parcelPos.map(([x,y],i)=>(
                        <g key={i}>
                            {/* Box base */}
                            <rect x={x} y={y} width="9" height="9" fill="url(#boxGrad)" stroke="#451a03" strokeWidth="0.6" rx="0.3" />
                            <line x1={x} y1={y+0.5} x2={x+9} y2={y+0.5} stroke="#fdba74" strokeWidth="0.5" strokeOpacity="0.5" />
                            {/* Tape */}
                            <rect x={x + 3.5} y={y} width="1.5" height="9" fill="#451a03" opacity="0.3" />
                            {/* Label */}
                            <rect x={x + 1.5} y={y + 2.5} width="2.5" height="2" fill="#ffffff" opacity="0.75" />
                        </g>
                    ))}
                </g>
                <rect x="41" y="128" width="42" height="33" fill="none" stroke="#ffffff" strokeWidth="2" style={{animation:"laser-scan 8s infinite"}} />
            </g>

            {/* Shutter door structure (animated) */}
            <g clipPath="url(#warehouseDoorClip)" style={{animation:"warehouse-door 8s ease-in-out infinite"}}>
                <rect x="44" y="118" width="82" height="58" fill="#18181b" />
                {shutterYW.map((y,i)=>(<line key={i} x1="45" y1={y} x2="125" y2={y} stroke="#09090b" strokeWidth="1.8" />))}
            </g>

            {/* SCAN PORTAL - PREMIUM REDESIGN */}
            <g>
                {/* 1. Gantry Platform Base */}
                <rect x="238" y="172" width="104" height="4" fill="url(#scannerSteel)" rx="1" />
                <rect x="242" y="173" width="96" height="1" fill="#ffe082" opacity="0.4" />
                
                {/* Foundations */}
                <rect x="244" y="168" width="12" height="4" fill="#334155" rx="0.5" />
                <circle cx="247" cy="170" r="0.6" fill="#1e293b" />
                <circle cx="253" cy="170" r="0.6" fill="#1e293b" />
                
                <rect x="324" y="168" width="12" height="4" fill="#334155" rx="0.5" />
                <circle cx="327" cy="170" r="0.6" fill="#1e293b" />
                <circle cx="333" cy="170" r="0.6" fill="#1e293b" />

                {/* 2. Left Column */}
                <g>
                    <rect x="248" y="60" width="4" height="110" fill="#1e293b" rx="0.5" />
                    <rect x="249.5" y="62" width="1" height="106" fill="url(#scannerNeonGreen)" filter="url(#emeraldGlow)" />
                    {/* Metallic Brackets */}
                    <rect x="247" y="60" width="6" height="5" fill="url(#scannerSteel)" rx="0.5" />
                    <rect x="247" y="110" width="6" height="3" fill="url(#scannerSteel)" rx="0.5" />
                    <rect x="247" y="163" width="6" height="5" fill="url(#scannerSteel)" rx="0.5" />
                </g>

                {/* 3. Right Column */}
                <g>
                    <rect x="328" y="60" width="4" height="110" fill="#1e293b" rx="0.5" />
                    <rect x="329.5" y="62" width="1" height="106" fill="url(#scannerNeonGreen)" filter="url(#emeraldGlow)" />
                    {/* Metallic Brackets */}
                    <rect x="327" y="60" width="6" height="5" fill="url(#scannerSteel)" rx="0.5" />
                    <rect x="327" y="110" width="6" height="3" fill="url(#scannerSteel)" rx="0.5" />
                    <rect x="327" y="163" width="6" height="5" fill="url(#scannerSteel)" rx="0.5" />
                </g>

                {/* 4. Top Crossbar */}
                <rect x="242" y="54" width="96" height="6" fill="url(#scannerSteel)" rx="1" />
                <rect x="246" y="52" width="88" height="2" fill="#475569" rx="0.5" />
                <line x1="250" y1="53" x2="330" y2="53" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="3 1.5" opacity="0.6" />
                
                {/* 5. Center Emitter Head Pod */}
                <g>
                    <path d="M 280,56 L 300,56 L 297,63 L 283,63 Z" fill="#0f172a" stroke="#475569" strokeWidth="0.8" />
                    <line x1="284" y1="61" x2="296" y2="61" stroke="#fbbf24" strokeWidth="0.5" opacity="0.8" />
                    {/* Center lens */}
                    <circle cx="290" cy="60" r="2.5" fill="#111827" stroke="url(#scannerGold)" strokeWidth="0.8" />
                    <circle cx="290" cy="60" r="1.2" fill="#ef4444" style={{animation:"indicator-light 8s infinite"}} />
                    {/* Lens active indicator ring */}
                    <circle cx="290" cy="60" r="4.5" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.3" style={{animation:"signal-pulse 2s infinite"}} />
                </g>

                {/* Crossbar indicator LEDs */}
                <circle cx="258" cy="57" r="0.8" fill="#ef4444" style={{animation:"indicator-light 8s infinite"}} />
                <circle cx="322" cy="57" r="0.8" fill="#ef4444" style={{animation:"indicator-light 8s infinite"}} />

                {/* 6. Sci-Fi HUD Telemetry Decals */}
                <g opacity="0.4">

                    {/* Right HUD brackets */}
                    <path d="M 342,61 L 348,61 L 348,67" fill="none" stroke="#10b981" strokeWidth="0.5" />
                    <line x1="342" y1="64" x2="346" y2="64" stroke="#10b981" strokeWidth="0.5" />
                    <line x1="342" y1="67" x2="345" y2="67" stroke="#10b981" strokeWidth="0.5" />
                </g>

                {/* 7. Volumetric Laser Scan Curtain */}
                {/* Layer 1: Base glow gradient */}
                <polygon points="250,60 330,60 332,172 248,172" fill="url(#laserBeamGrad)" opacity="0" style={{animation:"laser-scan 8s infinite", mixBlendMode: "screen"}} />
                {/* Layer 2: Holographic Scanning Grid lines */}
                <g style={{animation:"laser-scan 8s infinite", opacity: 0.6}}>
                    <line x1="262" y1="60" x2="260" y2="172" stroke="#10b981" strokeWidth="0.4" opacity="0.4" />
                    <line x1="276" y1="60" x2="275" y2="172" stroke="#10b981" strokeWidth="0.4" opacity="0.4" />
                    <line x1="290" y1="60" x2="290" y2="172" stroke="#10b981" strokeWidth="0.6" opacity="0.8" strokeDasharray="4 2" />
                    <line x1="304" y1="60" x2="305" y2="172" stroke="#10b981" strokeWidth="0.4" opacity="0.4" />
                    <line x1="318" y1="60" x2="320" y2="172" stroke="#10b981" strokeWidth="0.4" opacity="0.4" />
                </g>

                {/* 8. Sweeping Laser Beam Line */}
                <g className="animate-laser-sweep">
                    {/* Thick soft bloom line */}
                    <line x1="249" y1="60" x2="331" y2="60" stroke="#10b981" strokeWidth="4" opacity="0.4" filter="url(#emeraldGlow)" />
                    {/* Sharp glowing core line */}
                    <line x1="250" y1="60" x2="330" y2="60" stroke="#a7f3d0" strokeWidth="1.2" />
                    {/* Laser center focus point */}
                    <circle cx="290" cy="60" r="1.5" fill="#ffffff" filter="url(#emeraldGlow)" />
                </g>
            </g>

            {/* SMART SHOP */}
            <rect x="455" y="70" width="100" height="106" fill="url(#buildingGradLit)" stroke="#3f3f46" strokeWidth="1.5" />
            
            {/* Modern Slated Roof for Shop */}
            <polygon points="445,70 565,58 565,70" fill="url(#roofGrad)" stroke="#52525b" strokeWidth="1" strokeLinejoin="round" />
            <line x1="445" y1="70" x2="565" y2="58" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
            
            {/* Storefront Awning Canopy */}
            <rect x="450" y="96" width="110" height="4" rx="1.5" fill="#27272a" stroke="#52525b" strokeWidth="0.8" />
            <line x1="450" y1="100" x2="560" y2="100" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.25" />

            <line x1="505" y1="30" x2="560" y2="70" stroke="#71717a" strokeWidth="0.6" opacity="0.4" />
            <line x1="505" y1="30" x2="505" y2="19" stroke="#52525b" strokeWidth="2" />
            <circle cx="505" cy="19" r="3" fill="#ffffff" />
            <circle cx="505" cy="19" r="3" fill="none" stroke="#ffffff" strokeWidth="1" style={{animation:"signal-pulse 3s 1s infinite"}} />
            
            {/* Display Window */}
            <rect x="466" y="112" width="32" height="32" rx="1.5" fill="url(#shopWindowGlow)" stroke="#3f3f46" strokeWidth="1.2" />
            <rect x="468" y="114" width="28" height="28" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.3" />
            
            {/* Hanging Documents inside Display Window */}
            {/* Hanging strings */}
            <line x1="472" y1="114" x2="472" y2="119" stroke="#78350f" strokeWidth="0.6" />
            <line x1="482" y1="114" x2="482" y2="123" stroke="#78350f" strokeWidth="0.6" />
            <line x1="492" y1="114" x2="492" y2="117" stroke="#78350f" strokeWidth="0.6" />
            
            {/* Sheets */}
            <g>
                {/* Sheet 1 */}
                <rect x="469" y="119" width="6" height="8" fill="#ffffff" stroke="#ca8a04" strokeWidth="0.4" rx="0.3" />
                <line x1="471" y1="122" x2="473" y2="122" stroke="#eab308" strokeWidth="0.5" />
                <line x1="471" y1="124" x2="473" y2="124" stroke="#eab308" strokeWidth="0.5" />
                
                {/* Sheet 2 */}
                <rect x="479" y="123" width="6" height="8" fill="#f8fafc" stroke="#ca8a04" strokeWidth="0.4" rx="0.3" />
                <line x1="481" y1="126" x2="483" y2="126" stroke="#eab308" strokeWidth="0.5" />
                <line x1="481" y1="128" x2="483" y2="128" stroke="#eab308" strokeWidth="0.5" />
                
                {/* Sheet 3 */}
                <rect x="489" y="117" width="6" height="8" fill="#ffffff" stroke="#ca8a04" strokeWidth="0.4" rx="0.3" />
                <line x1="491" y1="120" x2="493" y2="120" stroke="#eab308" strokeWidth="0.5" />
                <line x1="491" y1="122" x2="493" y2="122" stroke="#eab308" strokeWidth="0.5" />
            </g>
            
            {/* Diagonal Reflection Line */}
            <line x1="466" y1="144" x2="498" y2="112" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.45" />
            
            <ellipse cx="482" cy="176" rx="20" ry="3" fill="url(#winSpill)" opacity="0.4" />
            
            {/* Label Plaque direct on building */}
            <text x="508" y="88" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.8">SMART SHOP</text>
            
            {/* Modern Double Glass Entrance */}
            <rect x="508" y="114" width="38" height="60" fill="#09090b" stroke="#3f3f46" strokeWidth="1.2" />
            
            {/* Left and Right Door Panels */}
            <rect x="509" y="115" width="18" height="58" fill="#18181b" stroke="#27272a" strokeWidth="0.8" />
            <rect x="527" y="115" width="18" height="58" fill="#18181b" stroke="#27272a" strokeWidth="0.8" />
            
            {/* Vertical Silver Door Handles */}
            <rect x="523.5" y="134" width="1.5" height="18" rx="0.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
            <line x1="522.5" y1="137" x2="523.5" y2="137" stroke="#cbd5e1" strokeWidth="0.8" />
            <line x1="522.5" y1="149" x2="523.5" y2="149" stroke="#cbd5e1" strokeWidth="0.8" />
            
            <rect x="529" y="134" width="1.5" height="18" rx="0.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
            <line x1="530.5" y1="137" x2="531.5" y2="137" stroke="#cbd5e1" strokeWidth="0.8" />
            <line x1="530.5" y1="149" x2="531.5" y2="149" stroke="#cbd5e1" strokeWidth="0.8" />





            {/* Heading text (Welcome Back) aligned with animated Elite text */}
            <text x="360" y="-230" textAnchor="end" fill="#ffffff" textRendering="geometricPrecision" className="font-extrabold text-5xl tracking-tight select-none font-sans">{headingText}</text>

            {/* HTML Text Overlay */}
            <foreignObject x="40" y="-340" width="500" height="300" className="overflow-visible">
                <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex flex-col justify-start items-start select-none">
                    {/* Glassmorphic Badge with Pulsing Light */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-1.5 mt-4 mb-4 shadow-inner backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                        <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                            Powered by <span className="font-bold text-white tracking-widest">{badgeText}</span>
                        </p>
                    </div>

                    {/* Heading spacer to maintain layout height for subtitle */}
                    <div className="h-[76px] w-full" />
                    
                    {/* Subtitle */}
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md" dangerouslySetInnerHTML={{ __html: subtitleText }} />
                </div>
            </foreignObject>
        </svg>
    );
}

export default function LoginPage() {

    const { t } = useTranslation(["auth", "validation"]);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const { replaceTo } = useRedirect();
    const { isAuthenticated } = useAuthStore();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const loginForm = useForm({ resolver: yupResolver(loginSchema) });

    useEffect(() => {
        let isMounted = true;
        const checkAuth = async () => {
            try {
                if (isAuthenticated) {
                    replaceTo("/dashboard");
                    return;
                }

                // Check if session can be silently restored from cookie
                const session = await auth.initAuth();
                if (session && isMounted) {
                    replaceTo("/dashboard");
                    return;
                }
            } catch {
                if (isMounted) {
                    AppToast.danger(t("auth:login.error"));
                }
            } finally {
                if (isMounted) {
                    setIsCheckingAuth(false);
                }
            }
        };

        checkAuth();
        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, replaceTo, t]);

    // ── API: Real login call (commented out for demo) ──────────────────────
    // const { mutate: login, isPending } = usePost(API_LIST.login, {
    //     onSuccess: (data) => {
    //         if (data?.data && Object.keys(data.data).length > 0) {
    //             AppToast.success(data.message || t("auth:login.success"));
    //             auth.login(data.data);
    //             replaceTo('/dashboard');
    //         }
    //     },
    //     onError: (error) => {
    //         AppToast.danger(error?.message || t("auth:login.error"));
    //     },
    // });

    // ── Mock: Simulate login with fixed data for demo ─────────────────────
    const [isPending, setIsPending] = useState(false);

    const onSubmit = async (data) => {
        setIsPending(true);
        try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            const mockResponse = {
                token: "mock-access-token-xyz",
                refreshToken: "mock-refresh-token-xyz",
                user: {
                    id: "1",
                    email: data.email,
                    name: "Demo User",
                },
            };

            AppToast.success(t("auth:login.success"));
            auth.login(mockResponse);
            replaceTo('/dashboard');
        } catch (error) {
            AppToast.danger(error?.message || t("auth:login.error"));
        } finally {
            setIsPending(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-linear-to-br from-(--color-bg) to-(--color-accent-light)">
                <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                    <Spinner size="lg" color="default" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full">
            {/* Left Side - Form */}
            <div className="flex w-full flex-col justify-center items-center lg:w-1/2 p-8 sm:p-12 md:p-24 bg-linear-to-br from-(--color-bg) to-(--color-bg-subtle) lg:border-r lg:border-white/8">
                <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 text-(--color-text)">
                    <LayoutTemplate className="w-8 h-8" />
                </div>

                <h1 className="text-3xl font-bold mb-8 text-(--color-text)">{t("auth:login.title")}</h1>

                <form method="POST" className="flex flex-col gap-6.5" onSubmit={loginForm.handleSubmit(onSubmit)}>

                    <AppInput
                        name="email"
                        label={t("auth:login.email.label")}
                        type="email"
                        placeholder={t("auth:login.email.placeholder")}
                        register={loginForm.register}
                        errors={loginForm.formState.errors}
                        startIcon={<Mail className="w-5 h-5" />}
                    />

                    <AppInput
                        name="password"
                        label={t("auth:login.password.label")}
                        type={isVisible ? "text" : "password"}
                        placeholder={t("auth:login.password.placeholder")}
                        register={loginForm.register}
                        errors={loginForm.formState.errors}
                        startIcon={<Lock className="w-5 h-5" />}
                        endIcon={isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        endIconAction={toggleVisibility}
                    />

                    <div className="flex items-center justify-between mt-2">
                        <AppCheckbox
                            name="rememberMe"
                            label={t("auth:login.rememberMe")}
                        />
                        <Link href="#" size="sm" className="font-semibold text-(--color-text) underline">
                            {t("auth:login.forgotPassword")}
                        </Link>
                    </div>
                    <AppButton
                        name={t("auth:login.submit")}
                        type="submit"
                        className="w-full bg-(--color-btn-primary) text-(--color-btn-primary-text) font-medium mt-4 shadow-(--shadow-md)"
                        size="lg"
                        loading={isPending}
                    />
                </form>
                </div>
            </div>

            {/* Right Side - Hero */}
            <div className="hidden lg:flex w-1/2 bg-[#09090b] flex-col px-8 py-10 justify-center items-center relative overflow-hidden">
                <style dangerouslySetInnerHTML={{ __html: ERP_ANIM }} />
                
                {/* Premium Technical Grid Background (motionsites.ai style) */}
                <div className="absolute inset-0 z-0 bg-grid-dots opacity-80 pointer-events-none" />

                {/* Dynamic Glowing Mesh Gradient Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {/* Blob 1: Cyan/Indigo tech glow */}
                    <div 
                        className="absolute top-[5%] left-[5%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 glow-blob"
                        style={{ animation: "float-blob-1 14s ease-in-out infinite" }}
                    />
                    {/* Blob 2: Deep Slate/Blue corporate glow */}
                    <div 
                        className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full bg-slate-500/10 glow-blob"
                        style={{ animation: "float-blob-2 18s ease-in-out infinite" }}
                    />
                    {/* Blob 3: Amber/Orange sunset contrast glow to match warehouse/crane */}
                    <div 
                        className="absolute top-[35%] right-[15%] w-[350px] h-[350px] rounded-full bg-amber-500/6 glow-blob"
                        style={{ animation: "float-blob-3 12s ease-in-out infinite" }}
                    />
                </div>

                <div className="w-full max-w-2xl xl:max-w-3xl z-10">
                    {/* ERP Warehouse Scene Graphic with integrated Crane & text overlay */}
                    <div className="w-full animate-fade-in-up mb-6">
                        <ERPWorkflowScene
                            badgeText={t("auth:hero.badge")}
                            headingText={t("auth:hero.heading")}
                            subtitleText={t("auth:hero.subtitle")}
                        />
                    </div>

                    {/* Simple Glassmorphic Insights Card */}
                    <div className="border border-white/10 bg-white/4 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 shadow-inner">
                                <VerifiedCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-white tracking-tight">{t("auth:hero.card.title")}</h3>
                                    <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">Active</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {t("auth:hero.card.description")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
