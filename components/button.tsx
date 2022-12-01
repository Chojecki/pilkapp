interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "button" | "reset" | undefined;
}

const Button = (props: ButtonProps) => {
  const { onClick, children, disabled, type = "submit" } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className="px-6 py-2 disabled:opacity-50 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
    >
      {children}
    </button>
  );
};

export default Button;
