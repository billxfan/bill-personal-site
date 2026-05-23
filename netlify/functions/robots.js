exports.handler = async (event) => {
  const host = event.headers["x-forwarded-host"] || event.headers.host || "";
  const proto = event.headers["x-forwarded-proto"] || "https";
  const origin = host ? `${proto}://${host}` : "";

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    },
    body: `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ""}`
  };
};
