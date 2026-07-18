type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function DisplayPanel({
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        shadow-2xl
        ${className}
      `}
    >
      {children}
    </section>
  );
}