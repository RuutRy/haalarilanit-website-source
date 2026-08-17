import { Outlet, createRootRoute } from "@tanstack/react-router";

import { Background } from "../components/Background";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Background />
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
