export default function handler(req, res) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const proto = req.headers["x-forwarded-proto"] || "https";
  const origin = host ? `${proto}://${host}` : "";

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(`User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ""}`);
}
