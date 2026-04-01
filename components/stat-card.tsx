"use client";

import { motion } from "framer-motion";

export function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur"
    >
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {subtitle ? <div className="mt-2 text-sm text-zinc-500">{subtitle}</div> : null}
    </motion.div>
  );
}