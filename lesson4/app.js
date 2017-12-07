var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var superagent = require('superagent');

var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl).end(function (err, res) {
    if (err) {
        return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);

    // 查找最外面的url
    $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        var href = url.resolve(cnodeUrl, $element.attr('href'));
        topicUrls.push(href);
    });

    var ep = new eventproxy();
    
    // 计数 完成所有的事件，每次完成后获取后的回调函数
    ep.after('topic_html', topicUrls.length, function (topics) {
        topics = topics.map(function (topicPair) {
            var topicUrl = topicPair[0];
            var topicHtml = topicPair[1];
            var $ = cheerio.load(topicHtml);
            return ({
                title: $('.topic_full_title').text().trim(),
                href: topicUrl,
                comment1: $('.reply_content').eq(0).text().trim(),
            });
        });
        console.log('final:\n');
        console.log(topics);
    });
    
    // 每次查找url后触发的事件
    topicUrls.forEach(function (topicUrl) {
        superagent.get(topicUrl).end(function (err, res) {
            console.log('fetch ' + topicUrl + ' successful');
            // 触发事件
            ep.emit('topic_html', [topicUrl, res.text]);
        });
    });

});

