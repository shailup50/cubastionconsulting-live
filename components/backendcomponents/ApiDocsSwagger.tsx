"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    SwaggerUIBundle: any;
  }
}

function loadStylesheet(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(src: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.SwaggerUIBundle) {
      resolve(window.SwaggerUIBundle);
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.SwaggerUIBundle));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(window.SwaggerUIBundle);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function ApiDocsSwagger() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function initSwagger() {
      loadStylesheet("/swagger-ui/swagger-ui.css");
      const SwaggerUIBundle = await loadScript("/swagger-ui/swagger-ui-bundle.js");

      if (cancelled || !containerRef.current || !SwaggerUIBundle) return;

      const token = localStorage.getItem("token");

      const specUrl = `${window.location.origin}/api/docs/openapi.json`;
      const specResponse = await fetch(specUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!specResponse.ok) {
        throw new Error(`Failed to load OpenAPI spec (${specResponse.status})`);
      }
      const spec = await specResponse.json();
      spec.servers = [
        {
          url: window.location.origin,
          description: "Current host",
        },
      ];

      SwaggerUIBundle({
        domNode: containerRef.current,
        spec,
        docExpansion: "list",
        defaultModelsExpandDepth: 1,
        persistAuthorization: true,
        tryItOutEnabled: true,
        requestInterceptor: (request: any) => {
          if (token) {
            request.headers.Authorization = `Bearer ${token}`;
          }
          return request;
        },
      });
    }

    initSwagger().catch((error) => {
      console.error("Failed to load Swagger UI:", error);
    });

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={containerRef} className="api-docs-panel" />;
}
