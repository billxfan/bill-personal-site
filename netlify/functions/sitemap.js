exports.handler = async (event) => {
  const host = event.headers["x-forwarded-host"] || event.headers.host || "";
  const proto = event.headers["x-forwarded-proto"] || "https";
  const origin = host ? `${proto}://${host}` : "";

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    },
    body: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin || "/"}</loc></url>\n</urlset>\n`
  };
};
