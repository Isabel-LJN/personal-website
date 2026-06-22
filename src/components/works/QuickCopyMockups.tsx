"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface QuickCopyMockupsProps {
  prototypes: { id: string; caption: string }[];
  label: string;
}

function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[220px] rounded-[28px] border-2 border-[var(--color-foreground)]/15 bg-[var(--color-surface)] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      <div className="mb-2 flex justify-center">
        <div className="h-1 w-10 rounded-full bg-[var(--color-foreground)]/10" />
      </div>
      <div className="overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-white">
        {children}
      </div>
    </div>
  );
}

function MainScreenMockup() {
  return (
    <div className="flex h-[320px] text-[9px] leading-tight">
      <div className="w-[72px] shrink-0 border-r border-[var(--color-border)] bg-[#f4f6fa] p-2">
        <p className="mb-2 text-[8px] font-bold text-[#1a1a1a]">QuickCopy</p>
        <div className="mb-1.5 rounded-md bg-[#1a1a1a] px-1.5 py-1 text-center text-[7px] font-semibold text-white">
          + 新增
        </div>
        {["地址", "模板", "Prompt"].map((cat, i) => (
          <div
            key={cat}
            className={cn(
              "mb-1 rounded-md px-1.5 py-1.5 font-semibold",
              i === 0
                ? "border border-[#4a7fed]/30 bg-[#eef3ff] text-[#1a1a1a]"
                : "text-[#666]"
            )}
          >
            {cat}
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1 p-2.5">
        <p className="mb-0.5 text-[11px] font-bold text-[#1a1a1a]">地址</p>
        <p className="mb-2 text-[7px] text-[#888]">单击复制 · 双击编辑</p>
        {["公司地址", "收货地址", "发票抬头"].map((title, i) => (
          <div
            key={title}
            className="mb-1.5 rounded-lg border border-[var(--color-border)] bg-white p-2 shadow-sm"
          >
            <p className="font-semibold text-[#1a1a1a]">{title}</p>
            <p className="mt-0.5 truncate text-[7px] text-[#999]">
              {i === 0
                ? "沈阳市浑南区…"
                : i === 1
                  ? "大连市中山区…"
                  : "XX科技有限公司"}
            </p>
          </div>
        ))}
        <div className="mt-2 rounded-lg border border-dashed border-[#4a7fed]/40 bg-[#f8faff] p-2">
          <p className="text-[7px] font-semibold text-[#4a7fed]">快速粘贴内容</p>
          <p className="mt-1 text-[7px] text-[#aaa]">点一下粘贴，点两下编辑</p>
        </div>
      </div>
    </div>
  );
}

function WidgetMockup() {
  return (
    <div className="relative h-[320px] bg-gradient-to-b from-[#e8e4dc] to-[#ddd8ce] p-3">
      <div className="mb-2 grid grid-cols-4 gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-white/60 shadow-sm"
          />
        ))}
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-2.5 shadow-md">
        <div className="mb-2 flex items-center gap-1">
          <Image
            src="/images/quickcopy/app-icon.png"
            alt=""
            width={16}
            height={16}
            className="rounded"
          />
          <span className="text-[8px] font-bold text-[#1a1a1a]">QuickCopy</span>
        </div>
        <div className="mb-2 flex gap-1 overflow-hidden">
          {["地址", "模板", "Prompt"].map((chip, i) => (
            <span
              key={chip}
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[7px] font-semibold",
                i === 0
                  ? "bg-[#4a7fed] text-white"
                  : "bg-[#f0f0f0] text-[#666]"
              )}
            >
              {chip}
            </span>
          ))}
        </div>
        {["公司地址", "收货地址"].map((item) => (
          <div
            key={item}
            className="mb-1 flex items-center justify-between rounded-lg bg-[#f8f9fb] px-2 py-1.5"
          >
            <span className="text-[8px] font-medium text-[#333]">{item}</span>
            <span className="text-[7px] text-[#4a7fed]">复制</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickPasteMockup() {
  return (
    <div className="flex h-[320px] flex-col p-3">
      <p className="mb-3 text-[11px] font-bold text-[#1a1a1a]">地址</p>
      <div className="flex-1 rounded-xl border border-[var(--color-border)] bg-[#fafafa] p-3">
        <p className="mb-2 text-[8px] font-bold text-[#1a1a1a]">快速粘贴内容</p>
        <div className="min-h-[80px] rounded-lg border border-[var(--color-border)] bg-white p-2 text-[8px] leading-relaxed text-[#555]">
          沈阳市浑南区创新路123号
          <br />
          邮编：110000
        </div>
        <div className="mt-3 flex justify-end gap-1.5">
          <span className="rounded-md border border-[var(--color-border)] px-2 py-1 text-[7px] text-[#666]">
            清空
          </span>
          <span className="rounded-md bg-[#4a7fed] px-2 py-1 text-[7px] font-semibold text-white">
            保存
          </span>
        </div>
      </div>
      <div className="mt-3 flex justify-center">
        <div className="rounded-full bg-gradient-to-r from-[#4a7fed] to-[#6b9cff] px-3 py-1.5 text-[8px] font-bold text-white shadow-lg">
          ✓ 已保存
        </div>
      </div>
    </div>
  );
}

const mockupMap = {
  main: MainScreenMockup,
  widget: WidgetMockup,
  quickpaste: QuickPasteMockup,
} as const;

export function QuickCopyMockups({ prototypes, label }: QuickCopyMockupsProps) {
  return (
    <div>
      <p className="aw-label mb-6">{label}</p>
      <div className="grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-8">
        {prototypes.map(({ id, caption }) => {
          const Mockup = mockupMap[id as keyof typeof mockupMap] ?? MainScreenMockup;
          return (
            <figure key={id} className="flex flex-col items-center gap-4">
              <PhoneFrame>
                <Mockup />
              </PhoneFrame>
              <figcaption className="aw-body max-w-[220px] text-center text-xs">
                {caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
