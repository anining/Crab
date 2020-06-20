import cheerio from 'cheerio-without-node-native';
let timer = null;

export async function ksCrack (url) {
    try {
        if (!timer) {
            timer = setTimeout(() => {
                timer = clearTimeout(timer);
            }, 2000);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
                }
            });
            const html = await response.text();
            console.log(html, '??');
            const $ = cheerio.load(html);
            return {
                focus: $('.ribbon .fans-follows').text()
            };
        }
    } catch (e) {
        console.log(e);
    }
}
