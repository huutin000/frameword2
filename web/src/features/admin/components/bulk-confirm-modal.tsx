"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  itemCount: number;
  expectedConfirmationText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BulkConfirmModal({
  isOpen,
  title,
  description,
  itemCount,
  expectedConfirmationText = "XAC NHAN",
  onConfirm,
  onCancel,
}: Props) {
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  const isMatched = inputText.trim().toUpperCase() === expectedConfirmationText.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E7E0D6] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#29241E]">{title}</h3>
            <span className="text-[10px] text-red-600 font-semibold block mt-0.5">
              Thao tác hàng loạt trên {itemCount} mục (A041 Guard)
            </span>
          </div>
        </div>

        <p className="text-[#5A4033] leading-relaxed">{description}</p>

        <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
          <label className="block text-[#29241E] font-medium">
            Để xác nhận hành động nguy hiểm này, vui lòng nhập chính xác chữ{" "}
            <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-red-600 border border-red-300">
              {expectedConfirmationText}
            </code>{" "}
            vào ô bên dưới:
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={expectedConfirmationText}
            className="w-full bg-white border border-red-300 rounded-lg px-3 py-1.5 font-mono text-center text-xs text-[#29241E] focus:outline-none focus:border-red-500 font-bold"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setInputText("");
              onCancel();
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={!isMatched}
            onClick={() => {
              setInputText("");
              onConfirm();
            }}
            className={`gap-1.5 text-xs ${
              isMatched
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Xác nhận thực thi</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

