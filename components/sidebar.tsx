"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  CandlestickChart,
  Receipt,
  Settings,
} from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/investimentos", label: "Investimentos", icon: Wallet },
  { href: "/acoes", label: "Radar de ações", icon: CandlestickChart },
  { href: "/gastos", label: "Gastos", icon: Receipt },
  { href: "/config", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl p-5 flex-col">
      <div className="mb-8">
        <div className="text-xl font-semibold tracking-tight">Financial Hub</div>
        <div className="text-sm text-zinc-400">Patrimônio, gastos e ações</div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                active
                  ? "bg-blue-500/15 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl border border-blue-400/30 bg-blue-500/10"
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}