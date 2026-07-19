type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "success" | "danger";
};

export default function DisplayButton({
  children,
  onClick,
  variant = "primary",
}: Props) {
  const colors = {
    primary:
      "bg-blue-600 hover:bg-blue-700",

    success:
      "bg-green-600 hover:bg-green-700",

    danger:
      "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`
       rounded-2xl
       px-12
       py-6
       text-3xl
       font-bold
       transition
       ${colors[variant]}
      `}
    >
      {children}
    </button>
  );
}