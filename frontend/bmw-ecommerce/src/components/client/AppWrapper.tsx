import Navbar from "./Navbar";

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="min-h-screen transition-colors duration-500 ease-in-out
      bg-white text-gray-900 dark:bg-[#121C2A] dark:text-gray-100"
    >
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
