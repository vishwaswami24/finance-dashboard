const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, { method = "GET", token = "", body } = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || `Request failed with status ${response.status}`
    );
    error.details = data.details;
    throw error;
  }

  return data;
}

