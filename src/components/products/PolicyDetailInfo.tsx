import { type LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

interface PolicyInfoProps {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  text: string;
}

const PolicyDetailInfo = ({ Icon, text }: PolicyInfoProps) => {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl 
      bg-gray-50 dark:bg-black 
      shadow-sm hover:shadow-md 
      dark:shadow-[0_2px_6px_rgba(255,255,255,0.12)] 
      dark:hover:shadow-[0_4px_12px_rgba(255,255,255,0.18)] 
      transition"
    >
      <div
        className="p-2 rounded-lg 
        bg-white dark:bg-gray-900 
        shadow-sm dark:shadow-[0px_2px_4px_rgba(255,255,255,0.15)]"
      >
        <Icon className="text-gray-700 dark:text-gray-300" size={20} />
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
};

export default PolicyDetailInfo;
