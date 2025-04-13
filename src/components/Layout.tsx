
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  backLink?: {
    to: string;
    label: string;
  };
}

const Layout = ({ children, title, action, backLink }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {backLink && (
              <a href={backLink.to} className="text-accent-blue hover:underline text-sm">
                &larr; {backLink.label}
              </a>
            )}
            <h1 className="text-xl font-semibold text-gray-900">{title || "Materia Notes Plus"}</h1>
          </div>
          <div className="absolute left-4 top-4 sm:relative sm:left-0 sm:top-0">
            {action}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
};

export default Layout;
