import { useMemo } from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "button" | "reset" | undefined;
  color?: "blue" | "red" | "green" | "yellow" | "gray" | "fuchsia";
  full?: boolean;
  bold?: boolean;
  padding?: string;
}

const Button = (props: ButtonProps) => {
  const {
    onClick,
    children,
    disabled,
    color,
    type = "submit",
    full = false,
    bold = false,
    padding = "px-4 py-2",
  } = props;

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
      case "fuchsia":
        return "bg-fuchsia-100 text-fuchsia-900 hover:bg-fuchsia-200 focus-visible:ring-fuchsia-500";
      default:
        return "bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500";
    }
  }, [color]);

  const styles = `${full ? "w-full" : ""} ${
    bold ? "font-extrabold" : "font-medium"
  } ${padding} inline-flex items-center justify-center rounded-md border border-transparent text-sm focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 ${style} disabled:bg-gray-200 disabled:cursor-not-allowed`;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={styles}
    >
      {children}
    </button>
  );
};

export default Button;
