import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="bg-gradient-to-br dark:bg-gradient-to-t from-amber-100 to-rose-300 dark:to-amber-500 dark:from-rose-700  relative flex flex-col h-screen pb-8 overflow-y-auto">
    <div className="relative flex flex-col h-screen">
          <Navbar />
        <div className="w-full bg-white dark:bg-[#fc0017]  text-white  relative flex flex-col h-screen overflow-y-auto">
          <main className="w-full bg-white  dark:bg-[#fc0017] min-w-full max-w-7xl px-6 flex-grow pt-6">
            {children}
          </main>
          <footer className="w-full flex items-center justify-center py-3">
            {/* <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com"
          title="heroui.com homepage"
          >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
          </Link> */}
          </footer>
        </div>
      </div>
      );
}
