import { Response } from "express";

export enum ENUM_JWT_EXPIRE {
  ACCESS = "1h",
  REFRESH = "30d",
}

// export interface ResponseWithUser extends Response {
//   locals: {
//     uid: number | null | undefined;
//   };
// }
