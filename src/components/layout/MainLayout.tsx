import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto bg-slate-950 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}