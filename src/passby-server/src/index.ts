import * as cors from '@koa/cors'
import * as dotenv from 'dotenv'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as helmet from 'koa-helmet'

// import { error } from './constants'
import { error } from './error'
import { logger } from './logger'
import { router } from './router'

import 'reflect-metadata'

const start = async (): Promise<void> => {
  try {
    dotenv.config()
    
    const app = new Koa()

    app.use(logger())
    app.use(error())
    app.use(helmet())
    app.use(cors())
    app.use(bodyParser({ enableTypes: ['json'] }))

    app.use(router.routes())
    app.use(router.allowedMethods())

    app.listen(process.env.PORT, () => {
      console.info(`Server running on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}

/* eslint-disable @typescript-eslint/no-floating-promises */
start()
/* eslint-enable @typescript-eslint/no-floating-promises */
