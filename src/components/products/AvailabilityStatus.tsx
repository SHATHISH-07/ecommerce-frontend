import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  type LucideProps,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

// 1. Define a type for the configuration of each status
type StatusDetail = {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
  text: string;
};

// 2. Define the type for the main config object using Record<string, StatusDetail>
const statusConfig: Record<string, StatusDetail> = {
  "In Stock": { Icon: CheckCircle2, color: "text-green-600", text: "In Stock" },
  "Low Stock": {
    Icon: AlertTriangle,
    color: "text-orange-500",
    text: "Low Stock",
  },
  "Out of Stock": {
    Icon: XCircle,
    color: "text-red-600",
    text: "Out of Stock",
  },
};

// 3. Define the component's props for clarity
interface AvailabilityStatusProps {
  status: string;
}

const AvailabilityStatus = ({ status }: AvailabilityStatusProps) => {
  // This line will now work without an error
  const config = statusConfig[status] || {
    Icon: AlertTriangle,
    color: "text-gray-500",
    text: status,
  };

  const { Icon, color, text } = config;

  return (
    <p className={`flex items-center gap-2 text-sm font-medium ${color}`}>
      <Icon size={16} />
      {text}
    </p>
  );
};

export default AvailabilityStatus;
