import {
  Link,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { authCookie } from "./auth";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  // after redirect to / refetching cookie from server
  // this was used to render login and logout button on top right based on user status
  let cookieString = request.headers.get("Cookie");
  let userId = await authCookie.parse(cookieString);
  // if(userId) throw redirect('/home')  // cannot redirect because root route always renders
  return { userId }
}

export function Layout({ children }: { children: React.ReactNode }) {
  let { userId } = useLoaderData<typeof loader>()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="w-1/3 flex justify-end">
          {userId ? (
            <form method="post" action="/logout">
              <button className="block text-center">
                logout
                <br />
                <span className="text-slate-500 text-xs uppercase font-bold">
                  Log out
                </span>
              </button>
            </form>
          ) : (
            <Link to="/login" className="block text-center">
              login
              <br />
              <span className="text-slate-500 text-xs uppercase font-bold">
                Log in
              </span>
            </Link>
          )}
        </div>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
