export const callApi = async <T>(path: string, init?: Omit<RequestInit, "headers">): Promise<T> => {
  const headers = { Authorization: `Bearer ${process.env.DATABRICKS_TOKEN}`, Accept: "application/json" };
  const url = `https://${process.env.DATABRICKS_HOST}/api/2.0/${path}`;
  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    throw new Error(`[Code: ${response.status}] ${response.statusText}`);
  }
  const json = await response.json();
  return json as T;
};

export const isReady = () => !!process.env.DATABRICKS_TOKEN && !!process.env.DATABRICKS_HOST;
