import { api } from '../../index.ts'
import { CreateUser, GetUser } from "../../../types/user.ts";

export const userRegisterRequest = async (userData: CreateUser): Promise<GetUser> => {
  const result = await api.post('/users/create', userData)
  return result.data
}