"use client";

// Providers
import { AuthProvider } from "@/providers/AuthProvider";

// UI
import React, { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import Topbar from "@/components/ui/topbar";

export default function RootLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <AuthProvider>
            <div className="flex h-screen bg-bg overflow-hidden relative">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setSidebarOpen={setIsSidebarOpen}
                />
                <div className="flex flex-col flex-1 w-full overflow-hidden">
                    <Topbar setSidebarOpen={setIsSidebarOpen} />
                    <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}
