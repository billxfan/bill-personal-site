export default function handler(req, res) {
  const origin = "https://billxfan.com";

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc></url>\n  <url><loc>${origin}/en/</loc></url>\n</urlset>\n`);
}
