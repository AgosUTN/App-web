import { Rol } from './rol.type';

export interface ApiResponseLogin {
  message: string;
  data: { rol: Rol };
}
