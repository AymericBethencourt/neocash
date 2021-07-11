import * as Router from '@koa/router'
import { Context } from 'koa'
import axios from 'axios'

const router = new Router()

router.get(
  '/twitter/:id',
  async (ctx: Context, next: any): Promise<void> => {
    ctx.body = 'You are not supposed to be here ;)'

    const tweetId = ctx.request.url.replace('/twitter/', '')

    const resp = await axios.get(`https://api.twitter.com/2/tweets/${tweetId}`, {
      headers: {
        Authorization:
          'Bearer AAAAAAAAAAAAAAAAAAAAAMlQRgEAAAAApGGhjTQKWFq3ODAn6U2xDL%2Bx3vs%3D5Bo7049LSJlPHs1rf7ti91Vp6XlH4xXl1HoFbnmRARAfiyhkAu',
      },
    })
    
    ctx.status = 200
    ctx.body = resp.data.data.text

    await next()
  },
)

export { router }
