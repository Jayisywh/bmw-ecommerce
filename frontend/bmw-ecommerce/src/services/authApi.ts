import axios from "axios";
import type { LoginPayload, SignupPayload } from "../types/auth";
import type { IAuthResponse } from "../types/auth.d";
const API_URL = "http://127.0.0.1:8000/api/auth";

export const signupUser = async (
  data: SignupPayload
): Promise<IAuthResponse> => {
  const res = await axios.post(`${API_URL}/signup`, data);
  return res.data;
};

export const loginUser = async (data: LoginPayload): Promise<IAuthResponse> => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};
