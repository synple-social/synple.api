import { INestApplication } from "@nestjs/common"

interface Creatable<T> {
  create(params: Partial<T>): Promise<T>,
  name: string
}

type FactoryFunction<T> = {
  create: (app: INestApplication, overrides?: Partial<T>) => Promise<T>
}

type Factorizable<T> = {
  [p in keyof T]: () => Promise<T[p]>|T[p]
}

type FactoryOptions<T> = {
  afterCreate?: (app: INestApplication, self: T) => Promise<T>
}

type Overrides<T> = Partial<Factorizable<T>>

async function run<T>(model: Overrides<T>): Promise<Partial<T>> {
  const results: Partial<T> = {}
  for (const k in model) {
    if (model[k]) results[k] = await model[k]()
  }
  return results as T
}

export function createFactory<T>(model: Creatable<T>, defaults: Overrides<T>, options: FactoryOptions<T> = {}): FactoryFunction<T> {
  return {
    async create (app, overrides = {}) {
      let instance: T = await app
        .get(`${model.name}Repository`)
        .create({ ...(await run(defaults)), ...overrides })
      if (options.afterCreate) {
        instance = await options.afterCreate(app, instance)
      }
      return instance
    }
  }
}
