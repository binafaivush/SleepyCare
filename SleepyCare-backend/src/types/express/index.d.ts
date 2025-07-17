// types/express/index.d.ts

type test =string;
declare 
  namespace Express{
  interface Request {
    userId?: string;
  }
}