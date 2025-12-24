import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!auth) return null;
  const { user, logout } = auth;

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-xl font-bold tracking-wide text-[#003366]"
          >
            BMW
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/models" label="Models" />
            <NavLink to="/configure" label="Configure" />
            <NavLink to="/compare" label="Compare" />
          </nav>
        </div>

        {/* RIGHT - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative text-gray-800 hover:text-[#003366]"
          >
            <FiHeart size={20} />
            <span className="absolute -top-2 -right-2 rounded-full bg-[#003366] px-1.5 text-xs text-white">
              2
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-gray-800 hover:text-[#003366]"
          >
            <FiShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 rounded-full bg-[#003366] px-1.5 text-xs text-white">
              3
            </span>
          </Link>

          {/* Auth */}
          {user ? (
            <>
              <span className="text-sm font-medium text-gray-800">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm font-medium text-[#003366] hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-800 hover:text-[#003366]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-[#003366] px-4 py-2 text-sm font-medium text-white"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE ICONS + MENU */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative text-gray-800 hover:text-[#003366]"
          >
            <FiHeart size={22} />
            <span className="absolute -top-2 -right-2 rounded-full bg-[#003366] px-1.5 text-xs text-white">
              2
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-gray-800 hover:text-[#003366]"
          >
            <FiShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 rounded-full bg-[#003366] px-1.5 text-xs text-white">
              3
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col gap-4 px-6 py-4">
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
            <div className="mt-4 border-t pt-4">
              {user ? (
                <>
                  <p className="mb-2 text-sm font-medium text-gray-800">
                    {user.name}
                  </p>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="text-sm font-medium text-[#003366]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="w-full rounded-md bg-[#003366] px-4 py-3 text-center text-sm font-medium text-white"
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

export default Navbar;

const NavLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="text-sm font-medium text-gray-900 hover:text-[#003366]"
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
    className="text-sm font-medium text-gray-900"
  >
    {label}
  </Link>
);
