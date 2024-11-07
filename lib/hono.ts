import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";

const debugFetch: typeof fetch = async (input, init) => {
  console.log("Making fetch request:", {
    url: typeof input === "string" ? input : input.url,
    method: init?.method,
    headers: init?.headers,
  });

  const response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  console.log("Fetch response:", {
    status: response.status,
    ok: response.ok,
    statusText: response.statusText,
  });

  return response;
};

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!, {
  fetch: debugFetch,
});
console.log("Hono client initialized:", {
  hasApi: !!client.api,
  hasMotels: !!client.api?.motels,
  hasRooms: !!client.api?.rooms,
});
