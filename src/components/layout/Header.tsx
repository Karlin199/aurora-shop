export default function Header() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Aurora Manufacturing System
        </h2>
      </div>

      <div className="text-sm text-slate-400">
        Welcome, Karlin
      </div>
    </header>
  );
}