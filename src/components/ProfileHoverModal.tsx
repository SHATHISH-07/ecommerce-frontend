import * as Popover from "@radix-ui/react-popover";
import { useState, type ReactNode, useRef, useEffect } from "react";

interface ProfileHoverModalProps {
  trigger: ReactNode;
  children: ReactNode;
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

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        asChild
        onClick={() => isMobile && setOpen((prev) => !prev)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ProfileHoverModal;
