//IMPORTS DE LIBS
import { createHash, randomBytes } from "crypto";

//FUNÇÃO PARA GERAR O ID PUBLICO
export function generatePublicId(internalId: string): string {
  const hash = createHash("sha256")
    .update(internalId + process.env.JWT_SECRET)
    .digest("hex");

  return hash.substring(0, 12);
}

//GERA UM TOKEN PARA SER USADO COMO SESSÃO DO USUARIO
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

//VERIFICA SE O ID PUBLICO É VALIDO COM BASE NO ID INTERNO
export function verifyPublicId(publicId: string, internalId: string): boolean {
  return generatePublicId(internalId) === publicId;
}

//GERA UMA HASH COM BASE NA SENHA DO USUARIO E NO JWT_SECRET ARMAZENADO NO .ENV.LOCAL
export function generateHashPassword(password: string): string {
  return createHash("sha256")
    .update(password + process.env.JWT_SECRET)
    .digest("hex");
}
