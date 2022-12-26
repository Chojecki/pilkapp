import { FC, useMemo } from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  color?: "blue" | "red" | "green" | "yellow" | "gray";
}

const IconButton: FC<IconButtonProps> = ({ icon, onClick, color }) => {
  const style = useMemo(() => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500";
      case "red":
        return "bg-red-100 text-red-900 hover:bg-red-200 focus-visible:ring-red-500";
      case "green":
        return "bg-green-100 text-green-900 hover:bg-green-200 focus-visible:ring-green-500";
      case "yellow":
        return "bg-yellow-100 text-yellow-900 hover:bg-yellow-200 focus-visible:ring-yellow-500";
      case "gray":
        return "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500";
      default:
        return "bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500";
    }
  }, [color]);

  const styles = `inline-flex items-center justify-center rounded-md border border-transparent text-sm focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 ${style}`;

  return (
    <button type="button" onClick={onClick} className={styles}>
      {icon}
    </button>
  );
};

export default IconButton;
