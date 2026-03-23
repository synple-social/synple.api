import { INestApplication } from "@nestjs/common"

interface Creatable<T> {
  create(params: Partial<T>): Promise<T>,
  name: string
}

type FactoryFunction<T> = {
  create: (app: INestApplication, overrides?: Overrides<T>) => Promise<T>
}

type Factorizable<T> = {
  [p in keyof T]: () => T[p]
}

type Overrides<T> = Partial<Factorizable<T>>

function run<T>(model: Overrides<T>): Partial<T> {
  const results: Partial<T> = {}
  Object.keys(model).forEach(k => (results[k] = model[k]()))
  return results as T
}

export function createFactory<T>(model: Creatable<T>, defaults: Overrides<T>): FactoryFunction<T> {
  return {
    async create (app, overrides = {}) {
      const payload = { ...run(defaults), ...run(overrides) }
      return await app
        .get(`${model.name}Repository`)
        .create({ ...run(defaults), ...run(overrides) })
    }
  }
}
