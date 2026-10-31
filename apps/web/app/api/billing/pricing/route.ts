import { publicPricing } from "@/lib/public-pricing";
export async function GET() {
  try {
    return Response.json(await publicPricing(), {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  } catch {
    return Response.json(
      { available: false, mode: "test" },
      { headers: { "Cache-Control": "no-store" }, status: 503 },
    );
  }
}
