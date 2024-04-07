import { Hono } from 'hono'
console.log('Hello, world!')
const app = new Hono()

app.get('/', (c) => c.text('Hello Cloudflare Worker! test'))

export default app