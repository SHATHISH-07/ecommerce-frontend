import { type LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

interface PolicyInfoProps {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  text: string;
}

const PolicyInfo = ({ Icon, text }: PolicyInfoProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <Icon className="flex-shrink-0 text-gray-500" size={16} />
      <span>{text}</span>
    </div>
  );
};

export default PolicyInfo;
