import config from "../../backend.config.json";
const API_BASE_URL = `http://localhost:${config.BACKEND_PORT}`;

export async function apiCall(path, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

/*
export async function apiCall(path, method, body, token) {
  const requestOptions = {
    method: method,
    body: method === 'GET' ? undefined : JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}
*/
