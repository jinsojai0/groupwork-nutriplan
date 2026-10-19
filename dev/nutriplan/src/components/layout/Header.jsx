import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import Logo from "../common/Logo";
import SearchBar from "../common/SearchBar";
import UserMenu from "../features/auth/UserMenu";
import NavBar from "./NavBar";

export default function Header() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
        <Logo />
        <NavBar />
        <div className="ml-auto hidden w-64 xl:block">
          {pathname !== "/search" && <SearchBar compact key={pathname} />}
        </div>
        <div className="ml-auto xl:ml-0">
          {loading ? (
            <div className="skeleton h-9 w-24" />
          ) : user ? (
            <UserMenu />
          ) : (
            <Button to="/login" size="sm" state={{ from: pathname }}>
              เข้าสู่ระบบ
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
