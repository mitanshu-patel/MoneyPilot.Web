import { redirect } from "react-router";

export async function authMiddleware() {
  const session = checkUserSession();
  if (!session) {
    throw redirect("/login");
  }
}

function checkUserSession() 
{
  var session = localStorage.getItem("userSession");
    if (session) {
        return JSON.parse(session);
    }
    return null;
}