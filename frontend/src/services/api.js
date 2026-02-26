const API_URL = "http://127.0.0.1:5000/api";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Auth headers
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ================= AUTH =================
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const getProfile = async () => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const updateProfile = async (profileData) => {
  const isFormData = profileData instanceof FormData;
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers,
    body: isFormData ? profileData : JSON.stringify(profileData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const changePassword = async (passwordData) => {
  const response = await fetch(`${API_URL}/auth/profile/password`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(passwordData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

// ================= PRODUCTS =================
export const getProducts = async (search = "") => {
  const url = search
    ? `${API_URL}/products?search=${search}`
    : `${API_URL}/products`;
  const response = await fetch(url, { headers: authHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const getProductByBarcode = async (barcode) => {
  const response = await fetch(`${API_URL}/products/barcode/${barcode}`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const createProduct = async (productData) => {
  const isFormData = productData instanceof FormData;
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers,
    body: isFormData ? productData : JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const updateProduct = async (id, productData) => {
  const isFormData = productData instanceof FormData;
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers,
    body: isFormData ? productData : JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

// ================= SALES =================
export const createSale = async (items) => {
  const response = await fetch(`${API_URL}/sales`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ items }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const getSales = async (date = "") => {
  const url = date ? `${API_URL}/sales?date=${date}` : `${API_URL}/sales`;
  const response = await fetch(url, { headers: authHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const getTodaysSales = async () => {
  const response = await fetch(`${API_URL}/sales/today`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const getSaleById = async (id) => {
  const response = await fetch(`${API_URL}/sales/${id}`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

// ================= DASHBOARD =================
export const getAdminDashboard = async () => {
  const response = await fetch(`${API_URL}/dashboard/admin`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const getStaffDashboard = async () => {
  const response = await fetch(`${API_URL}/dashboard/staff`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};
