import { ReactNode } from 'react';

export default function MarginWidthWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div class_name="flex flex-col md:ml-60 sm:border-r sm:border-zinc-700 min-h-screen">
      {children}
    </div>
  );
}