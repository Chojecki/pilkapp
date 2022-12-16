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
      className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
};

export default Button;
