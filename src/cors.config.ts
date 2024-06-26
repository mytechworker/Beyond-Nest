import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions: CorsOptions = {
  origin: 'http://localhost:3001', // Replace with your frontend origin
  credentials: true, // Set this to true if you're using cookies or authorization headers
};
