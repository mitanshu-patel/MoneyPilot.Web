import type { SessionInfo } from "../../types/SessionInfo";

export async function authenticate(
  email: string,
  password: string,
): Promise<SessionInfo> {
  const response = await fetch("https://localhost:7184/api/Users/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if(!response.ok){
    if(response.status === 401){
      throw new Error("Invalid email or password");
    }
  }
  
  return response.json() as Promise<SessionInfo>;
}
