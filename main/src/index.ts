import { Hono } from 'hono'
import { streamText } from "hono/streaming";
import { upgradeWebSocket } from 'hono/cloudflare-workers'

//https://hono.dev/helpers/websocket
import puppeteer from '@cloudflare/puppeteer'
interface Env {
	MYBROWSER: Fetcher;
	BROWSER_KV_DEMO: KVNamespace;
}

type Bindings = {
    DB: D1Database;
};

console.log('Hello, world!')

// const app = new Hono()
const app = new Hono<{Bindings: Bindings}>();


//https://qiita.com/khayama/items/51074d2476ad49d7e27c

// export async function fetch(request: Request, env: Env): Promise<Response> {
//     const browser = await puppeteer.launch({ headless: false});
//     const page = await browser.newPage();

//     await page.setViewport({
//         width: 1920,
//         height: 1080,
//         deviceScaleFactor: 1,
//     });

//     await page.goto("https://www.yahoo.co.jp/", {
//         //一定時間ネットワーク通信のないことで完了を判定する
//         waitUntil: "networkidle2", //コネクション数が2個以下である状態が500ミリ秒続いたとき
//         timeout: 0 //0を指定するとタイムアウト無し
//     });

//     const screenshot = await page.screenshot() as Buffer;
//     await browser.close();

//     const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
//     const yyyymmddhhmm = jstNow.toISOString().replace(/[^0-9]/g, '').slice(0, -5); //yyyymmddhhmm
//     console.log(yyyymmddhhmm)

//     try {
//         //upload to R2
//         await env.BROWSER_BUCKET.put(`screenshot-${yyyymmddhhmm}.png`, screenshot);
//         return new Response(`Success!`);
//         /*
//         return new Response(screenshot.buffer, {
//             headers: {
//                 'content-type': 'image/png'
//             }
//         })
//         */
//     } catch (e) {
//         return new Response('', { status: 400 })
//     }
// }



app.get('/', (c) => c.text('Hello Cloudflare Worker! test'))

app.get(
    '/ws',
    upgradeWebSocket((c) => {
      return {
        onMessage(event, ws) {
          console.log(`Message from client: ${event.data}`)
          ws.send('Hello from server!')
        },
        onClose: () => {
          console.log('Connection closed')
        },
      }
    })
  )

app.get("/stream", (c) => {
    return streamText(c, async (stream) => {
        // Write a text with a new line ('\n').
        await stream.writeln("Hello");
        // Wait 1 second.
        await stream.sleep(1000);
        // Write a text without a new line.
        await stream.write(`Hono!`);
    });
});

app.get("/pup", async () => {
    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();
    await page.goto("https://example.com");
    const metrics = await page.metrics();
    await browser.close();
    return Response.json(metrics);
});


export default app