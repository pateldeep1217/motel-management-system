import { z } from "zod";
import { Hono } from "hono";
import { eq, desc, asc, and } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { guests, userMotels } from "@/db/schema";

const app = new Hono().get(
  "/",
  verifyAuth(),
  zValidator(
    "query",
    z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(10),
    })
  ),
  async (c) => {
    const auth = c.get("authUser");
    const { page, limit } = c.req.valid("query");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const query = db
        .select({
          id: guests.id,
          name: guests.name,
          phone: guests.phone,
          idProof: guests.idProof,
          doNotRent: guests.doNotRent,
          createdAt: guests.createdAt,
        })
        .from(guests)
        .innerJoin(userMotels, eq(guests.motelId, userMotels.motelId))
        .where(
          and(
            eq(userMotels.userId, auth.token.id as string),
            eq(guests.motelId, userMotels.motelId)
          )
        )
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(asc(guests.doNotRent), desc(guests.createdAt));

      const data = await query;

      return c.json({
        data,
        nextPage: data.length === limit ? page + 1 : null,
      });
    } catch (error) {
      console.error("Error fetching guests:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

export default app;
