import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";

const router = Router();

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const openApiPath = path.resolve(currentDir, "../../openapi.yaml");

function renderDocsPage(specUrl) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Finance Dashboard API Docs</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
    <style>
      html {
        box-sizing: border-box;
        overflow-y: scroll;
      }

      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        background: #f4f7fb;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.addEventListener("load", function loadSwaggerUi() {
        SwaggerUIBundle({
          url: "${specUrl}",
          dom_id: "#swagger-ui",
          deepLinking: true,
          displayRequestDuration: true,
          tryItOutEnabled: true
        });
      });
    </script>
  </body>
</html>`;
}

router.get("/openapi.yaml", (_req, res) => {
  res.type("application/yaml");
  res.sendFile(openApiPath);
});

router.get("/", (req, res) => {
  const specUrl = `${req.baseUrl}/openapi.yaml`;
  res.type("html").send(renderDocsPage(specUrl));
});

export default router;
