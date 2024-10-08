import authors from "./authors";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app.route("/authors", authors);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
