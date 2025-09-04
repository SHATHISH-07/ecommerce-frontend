import * as Popover from "@radix-ui/react-popover";
import { useState, type ReactNode, useRef, useEffect } from "react";

interface ProfileHoverModalProps {
  trigger: ReactNode;
  children: ReactNode | ((onClose: () => void) => ReactNode);
}

const ProfileHoverModal: React.FC<ProfileHoverModalProps> = ({
  trigger,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- Desktop Hover Handlers ---
  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  // --- Close on outside click (mobile only) ---
  useEffect(() => {
    if (!isMobile || !open) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-profile-popover]")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isMobile, open]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        asChild
        onClick={() => isMobile && setOpen((prev) => !prev)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-profile-popover
      >
        {trigger}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-72 rounded-lg border border-gray-200 bg-white dark:bg-black shadow-lg p-3"
          side={isMobile ? "top" : "bottom"}
          align="end"
          sideOffset={10}
          alignOffset={-15}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          data-profile-popover
        >
          {typeof children === "function"
            ? children(() => setOpen(false))
            : children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ProfileHoverModal;
