"use client";

import { motion } from "framer-motion";
import { Home, PlusCircle, MessageSquare, Compass, User, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: PlusCircle, label: "Create", href: "/create" },
    { icon: MessageSquare, label: "Chats", href: "/chat" }, // Placeholder for chat list
    { icon: Compass, label: "Discover", href: "/discover" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(true);

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? "80px" : "240px" }}
            className="fixed left-0 top-0 h-screen bg-black/40 backdrop-blur-2xl border-r border-white/5 z-[60] flex flex-col items-center py-8 transition-all duration-500 ease-out group"
            onMouseEnter={() => setCollapsed(false)}
            onMouseLeave={() => setCollapsed(true)}
        >
            {/* Logo */}
            <div className="mb-12 relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-colors" />
                <span className="text-3xl font-black italic tracking-tighter text-white z-10">O</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 w-full px-3 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={`
                relative flex items-center h-14 rounded-2xl transition-all duration-300 group/item
                ${isActive ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}
                ${collapsed ? 'justify-center' : 'px-4 gap-4'}
              `}>
                                <item.icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover/item:scale-110'}`} />
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-bold text-sm tracking-widest uppercase"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Profile / Bottom */}
            <div className="w-full px-3">
                <div className={`
          relative flex items-center h-14 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all
          ${collapsed ? 'justify-center' : 'px-4 gap-4'}
        `}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary p-px">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-black">AI</div>
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-[10px] tracking-widest uppercase"
                        >
                            Profile
                        </motion.span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
