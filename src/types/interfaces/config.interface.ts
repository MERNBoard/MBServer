export interface IConfig {
  PORT: number,
  NODE_ENV: string,
  JWT_ACCESS_SECRET: string,
  BCRYPT_SALT_ROUNDS: number,
  MONGO_CONNECTION_STRING: string
}