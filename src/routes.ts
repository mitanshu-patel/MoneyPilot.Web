import { createBrowserRouter } from "react-router";
import Home from "./features/dashboard/home";
import { Login } from "./features/auth/login";
import { Register } from "./features/auth/register";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/login", Component: Login },
  { path: "/sign-up", Component: Register },
]);