import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import Header from "./Header";

/** โครงหน้าร่วมของทุกหน้า : Header, เนื้อหาของ Route (Outlet), Footer และ BottomNav บนมือถือ */
export default function AppLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        ข้ามไปยังเนื้อหา
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 md:px-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
