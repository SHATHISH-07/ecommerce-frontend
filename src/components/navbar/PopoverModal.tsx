// src/components/PopoverModal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React, { type ReactNode, useEffect, useState } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  anchorRef: React.RefObject<HTMLElement | null>;
}

const PopoverModal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  children,
  anchorRef,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 30,
        left: rect.left + window.scrollX - 10,
      });
    }
  }, [anchorRef, open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {/* <Dialog.Overlay className="fixed inset-0 bg-transparent " /> */}
      <Dialog.Content
        className="absolute border border-white rounded-md bg-white dark:bg-black p-4 shadow-lg z-50 w-80"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        <div className="flex justify-between items-center mb-7 ">
          {title && (
            <Dialog.Title className="text-xl font-semibold">
              {title}
            </Dialog.Title>
          )}
          <Dialog.Close asChild>
            <button className="text-gray-500 dark:text-gray-100 focus:outline-none hover:text-gray-800 dark:hover:text-white cursor-pointer">
              <X size={22} />
            </button>
          </Dialog.Close>
        </div>
        <div>{children}</div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default PopoverModal;
