// https://blog.logrocket.com/how-to-set-up-node-typescript-express/

import { UserDocument } from "../user"

export {}

declare global {
  namespace Express {
    export interface Request {
      user?: UserDocument
      token?: string
    }
  }
}