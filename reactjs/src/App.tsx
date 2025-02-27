import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Login from "./pages/auth";
import DocsPage from "./pages/docs";
// import DocsPage from "@/pages/docs";
// import PricingPage from "@/pages/pricing";
// import BlogPage from "@/pages/blog";
// import AboutPage from "@/pages/about";

function App() {
  const admin = localStorage.getItem("token");
  console.log("Admin Token:", admin);
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      {admin ? <Route element={<DocsPage />} path="/admin" /> : (
        <Route element={<Login />} path="/admin" />
      )}
      <Route element={<IndexPage />} path="*" />

      {/* <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" /> */}
    </Routes>
  );
}

export default App;
