import { createCookie, redirect } from "@remix-run/node";

let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
  console.warn(
    "🚨 No COOKIE_SECRET environment variable set, using default. The app is insecure in production.",
  );
  secret = "default-secret";
}

export let authCookie = createCookie("auth", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secrets: [secret],
  // 30 days
  maxAge: 30 * 24 * 60 * 60,
  secure: process.env.NODE_ENV === "production",
});

export async function createAccount(email: string, password: string) {
  return {
    id: 1
  }
}

export async function requireAuthCookie(request: Request) {
  // get cookie
  let userId = await authCookie.parse(request.headers.get("Cookie"));

  if (!userId) {
    // in js when we throw an error all execution will stops and remix will catch that error 
    throw redirect('/login', {
      headers: {
        'Set-Cookie': await authCookie.serialize("", {
          maxAge: 0
        })
      }
    })
  }

  return userId;
}