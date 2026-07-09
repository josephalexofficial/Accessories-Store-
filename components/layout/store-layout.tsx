import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <Navbar />
      <main className="flex-1 bg-canvas">{children}</main>
      <Footer />
    </div>
  );
}
