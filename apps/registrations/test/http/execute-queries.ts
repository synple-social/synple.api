import { INestApplication } from "@nestjs/common";
import supertest from "supertest";

enum HttpMethod { GET = 'get', POST = 'post' }

export type QueryDefinition = {
  verb: HttpMethod
  url: string
  params: Record<string, string>
}

export type QueryOptions = {
  parallel?: boolean
}

export async function executeQueries(app: INestApplication, queries: QueryDefinition[], queryOptions: QueryOptions = {}): Promise<supertest.Response[]> {
  if (queryOptions.parallel) return Promise.all(queries.map(query => executeQuery(app, query)))
  const responses: supertest.Response[] = []
  for (const query of queries) {
    responses.push(await executeQuery(app, query))
  }
  return responses
}

export async function executeQuery(app: INestApplication, { url, verb, params }: QueryDefinition): Promise<supertest.Response> {
  return await supertest(app.getHttpServer())[verb](url).send(params)
}