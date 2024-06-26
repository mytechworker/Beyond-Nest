// jwt-request.interface.ts

import { Request } from 'express';
import { UserDocument } from './databases/models/user.schema';

export interface JwtRequest extends Request {
  user?: UserDocument; // Ensure user property is correctly typed as UserDocument
}
