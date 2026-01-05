export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export const logout = () => {
  localStorage.clear();
};
