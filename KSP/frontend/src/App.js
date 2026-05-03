import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PlaceOrder from "./pages/PlaceOrder";
import Profile from "./pages/Profile";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Auth/Login";
import AuthCallback from "./pages/Auth/AuthCallback";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Orders from "./pages/Orders";
import About from "./pages/About";
import AdminDashboard from "./pages/Admin/Dashboard";
import "./styles/globals.css";

// Layout wrapper component
const AUTH_PATHS = ["/login", "/register", "/forgot-password"];

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute =
    AUTH_PATHS.includes(location.pathname) ||
    location.pathname.startsWith("/auth");
  const isHomePage = location.pathname === "/";

  // Auth pages render with no chrome (no nav, no footer)
  if (isAuthRoute) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navigation />}
      <main className={isAdminRoute ? "" : "flex-grow"}>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer showNewsletter={isHomePage} />}
    </div>
  );
};

// Create router with future flags to suppress warnings
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "products", element: <Products /> },
        { path: "products/:id", element: <ProductDetail /> },
        { path: "cart", element: <Cart /> },
        { path: "checkout", element: <Checkout /> },
        { path: "place-order", element: <PlaceOrder /> },
        { path: "profile", element: <Profile /> },
        { path: "orders", element: <Orders /> },
        { path: "orders/:orderId", element: <OrderDetail /> },
        { path: "about", element: <About /> },
        { path: "login", element: <Login /> },
        { path: "auth/callback", element: <AuthCallback /> },
        { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "admin/*", element: <AdminDashboard /> },
        {
          path: "*",
          element: <div className="text-center py-20">Page not found</div>,
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}

export default App;
