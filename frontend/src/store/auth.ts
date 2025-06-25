import {create} from "zustand";

type User = {id: string, name: string, email: string, role: string};
type AuthState = {
  token: string | null,
  user: User | null,
  setAuth: (token: string, user: User) => void,
  logout: () => void
};

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({token, user});
  },
  logout: () => {
    localStorage.clear();
    set({token: null, user: null});
  }
}));
export default useAuthStore;
