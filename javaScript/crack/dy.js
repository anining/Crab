import cheerio from 'cheerio-without-node-native';
export async function dyCrack (url) {
    const response = await fetch(url);
    const html = await response.text();
    console.log(html);
    const $ = cheerio.load(formatHtml(html));
    return {
        focus: $('.follow-info .focus .num .iconfont').text().replace(/\s*/g, ''),
        follower: $('.follow-info .follower .num .iconfont').text().replace(/\s*/g, ''),
        liked: $('.follow-info .liked-num .num .iconfont').text().replace(/\s*/g, ''),
        userTab: $('.video-tab .tab-wrap .user-tab .iconfont').text().replace(/\s*/g, ''),
        likeTab: $('.video-tab .tab-wrap .like-tab .iconfont').text().replace(/\s*/g, ''),
    };
}

function formatHtml (html) {
    try {
        let strHtml = html.toString();
        for (const key in numberMap) {
            const re = new RegExp(`&#xe${key};`, 'g');
            strHtml = strHtml.replace(re, numberMap[key]);
        }
        return strHtml;
    } catch (e) {
        return '';
    }
}

const numberMap = {
    603: 0,
    '60d': 0,
    616: 0,
    602: 1,
    '60e': 1,
    618: 1,
    605: 2,
    610: 2,
    617: 2,
    604: 3,
    611: 3,
    '61a': 3,
    606: 4,
    '60c': 4,
    619: 4,
    607: 5,
    '60f': 5,
    '61b': 5,
    608: 6,
    612: 6,
    '61f': 6,
    '60a': 7,
    613: 7,
    '61c': 7,
    '60b': 8,
    614: 8,
    '61d': 8,
    609: 9,
    615: 9,
    '61e': 9,
};
