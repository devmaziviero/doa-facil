import { NextFunction, Request, RequestHandler, Response } from "express";

// Express 4 não repassa rejeições de Promise pro error handler sozinho —
// sem isso, qualquer erro assíncrono (ex: falha de conexão com o banco)
// derruba o processo inteiro em vez de responder com 500.
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
