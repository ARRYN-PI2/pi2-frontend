const DEFAULT_API_BASE_URL = "/api";

const getBaseUrl = () => {
  const envBase = import.meta.env?.VITE_API_BASE_URL;
  const trimmed = typeof envBase === "string" ? envBase.trim() : "";
  return trimmed || DEFAULT_API_BASE_URL;
};

const buildUrl = (path, params) => {
  const base = getBaseUrl().replace(/\/$/, "");
  const normalizedPath = `/${path.replace(/^\//, "")}`;
  const candidate = `${base}${normalizedPath}`;

  let url;

  try {
    url = new URL(candidate);
  } catch {
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "http://localhost";
    url = new URL(candidate, origin);
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
};

const fetchJson = async (input, init) => {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: init?.credentials ?? "same-origin",
    ...init,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(
      data?.error || data?.detail || "Error en la solicitud"
    );
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

const apiClient = {
  getCategories: () =>
    fetchJson(buildUrl("/categories/")),
  getBrands: (options = {}) =>
    fetchJson(
      buildUrl("/brands/", {
        with_counts: options.withCounts ? "1" : undefined,
        fuente: options.source,
        categoria: options.category,
      })
    ),
  getOffersByCategory: (category, options = {}) =>
    fetchJson(
      buildUrl(`/offers/${encodeURIComponent(category)}/`, {
        limit: options.limit,
      })
    ),
  getRankedOffers: (options = {}) =>
    fetchJson(
      buildUrl("/ranked-offers/", {
        category: options.category,
        user_id: options.userId,
        limit: options.limit,
      })
    ),
  getOfferDetails: (id) =>
    fetchJson(buildUrl(`/archivos/${encodeURIComponent(id)}/detalles/`)),
  getUsers: () => fetchJson(buildUrl("/user/")),
  createUser: (payload) =>
    fetchJson(buildUrl("/user/create"), {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export default apiClient;
export { apiClient };
