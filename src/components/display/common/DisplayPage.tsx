import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DisplayPage({ children }: Props) {
  return (
    <div className="mx-auto flex h-full w-full max-w-screen-2xl flex-col gap-8">
      {children}
    </div>
  );
}