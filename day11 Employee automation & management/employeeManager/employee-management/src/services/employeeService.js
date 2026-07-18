const API_URL = "https://6a4b3699f5eab0bb6b625785.mockapi.io/Employees";

// GET EMPLOYEES
export const getEmployees = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch employees");
  return response.json();
};

// POST
export const addEmployee = async (employee) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
  if (!response.ok) throw new Error("Failed to add employee");
  return response.json();
};

// PUT
export const updateEmployee = async (id, employee) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
  if (!response.ok) throw new Error("Failed to update employee");
  return response.json();
};

// DELETE
export const deleteEmployee = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete employee");
  return response.json();
};