import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FiHeart,
  FiMoon,
  FiShoppingCart,
  FiSun,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useWishlist } from "../hooks/useWishlist";

const Navbar = () => {
  const auth = useAuth();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!auth) return null;
  const { user, logout } = auth;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/70 backdrop-blur-lg transition-all duration-300 dark:border-white/10 dark:bg-[#0a0a0a]/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LEFT - Logo & Desktop Links */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-[#0066b1] dark:text-white"
          >
            BMW
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/models" label="Models" />
            <NavLink to="/configure" label="Configure" />
            <NavLink to="/compare" label="Compare" />
          </nav>
        </div>

        {/* RIGHT - Icons & Desktop Auth */}
        <div className="flex items-center gap-1 md:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-800 dark:text-gray-100"
          >
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          <Link
            to="/wishlist"
            className="relative p-2 text-gray-800 dark:text-gray-100"
          >
            <FiHeart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0066b1] text-[10px] text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative p-2 text-gray-800 dark:text-gray-100"
          >
            <FiShoppingCart size={20} />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0066b1] text-[10px] text-white">
              3
            </span>
          </Link>

          {/* DESKTOP ONLY AUTH (Hidden on Mobile) */}
          <div className="hidden items-center gap-4 border-l border-gray-300 pl-4 dark:border-white/20 md:flex">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold dark:text-white">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-xs font-black uppercase text-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold dark:text-white">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-[#0066b1] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#004a82]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-2 p-2 md:hidden dark:text-white"
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU - Slide Down */}
      {menuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-white/10 bg-white/95 backdrop-blur-2xl transition-all dark:bg-[#0a0a0a]/95 md:hidden">
          <nav className="flex flex-col gap-6 p-8">
            <MobileLink to="/models" label="Models" setMenuOpen={setMenuOpen} />
            <MobileLink
              to="/configure"
              label="Configure"
              setMenuOpen={setMenuOpen}
            />
            <MobileLink
              to="/compare"
              label="Compare"
              setMenuOpen={setMenuOpen}
            />

            {/* MOBILE AUTH (Only visible here on small screens) */}
            <div className="mt-4 border-t border-gray-200 pt-8 dark:border-white/10">
              {user ? (
                <div className="flex flex-col gap-4">
                  <span className="text-xs uppercase tracking-widest text-gray-500">
                    Logged in as
                  </span>
                  <span className="text-xl font-bold dark:text-white">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="w-fit text-sm font-black uppercase text-red-500 underline underline-offset-8"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-300 font-bold dark:border-white/20 dark:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-12 items-center justify-center rounded-xl bg-[#0066b1] font-bold text-white shadow-lg shadow-blue-500/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="text-sm font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
  >
    {label}
  </Link>
);

const MobileLink = ({
  to,
  label,
  setMenuOpen,
}: {
  to: string;
  label: string;
  setMenuOpen: (v: boolean) => void;
}) => (
  <Link
    to={to}
    onClick={() => setMenuOpen(false)}
    className="text-3xl font-black uppercase tracking-tighter dark:text-white"
  >
    {label}
  </Link>
);

export default Navbar;
