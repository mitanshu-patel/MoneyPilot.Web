import { createBrowserRouter } from "react-router";
import { authMiddleware } from "./authmiddleware";
import { AccountsList } from "./features/accounts/AccountsList";
import Home from "./features/dashboard/home";
import { Login } from "./features/auth/login";
import { Register } from "./features/auth/register";

export const router = createBrowserRouter([
  {
    path: "/",
    middleware: [authMiddleware],
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/accounts",
        Component: AccountsList,
      },
    ],
  },
  { path: "/login", Component: Login },
  { path: "/sign-up", Component: Register },
]);
