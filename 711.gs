var DEBUG_MODE = false;

var URL = UserProperties.getProperty('incoming')

var THISWEEK_CHUGOKU = 'http://www.sej.co.jp/i/products/thisweek/chugoku/?pagenum=0&page=1&sort=f&limit=100';
var ORIGIN = 'http://www.sej.co.jp/'

var SEVEN_COLOR = [
  '#f58220', // セブンオレンジ
  '#00a54f', // セブングリーン
  '#ee1c23', // セブンレッド
]

var CHANNEL = DEBUG_MODE ? 'C989JV2NN' : 'CAQK8AFLZ';
var USERNAME = 'コンビニマスター';
var ICON_URL = 'https://emoji.slack-edge.com/T84UUNQBY/711/86287812a1ababd1.png';


function main() {
    var attachments = []

    var html = UrlFetchApp.fetch(URL).getContentText()

    var items = Parser.data(html).from('<li class="item">').to('</div>\n</li>').iterate()

    for(var i = 0; i < items.length; ++i){
      var link   = ORIGIN + items[i].match(/<a href="(.+)">/)[1]
      var image  = items[i].match(/src="([^"]+)" alt="商品画像"/)[1]
      var name   = items[i].match(/<div class="itemName">.+">(.+?)<\/a><\/strong>/)[1]
      var price  = items[i].match(/<li class="price">(.+?)<\/li>/)[1]
      var launch = items[i].match(/<li class="launch">(.+?)<\/li>/)[1]
      var region = items[i].match(/<li class="region">(.+?)<\/li>/)[1].replace('<em>販売地域</em>', '')
      attachments.push(makeAttachment(link, image, name, price, launch, region, i))
    }

  sendSlack(attachments)
}


function makeAttachment(link, image, name, price, launch, region, i) {
  return {
    color: SEVEN_COLOR[i % SEVEN_COLOR.length],
    title: name,
    title_link: link,
    thumb_url: image,
    fields: [
      {
        title: '値段',
        value: price,
        short: true,
      },
      {
        title: '販売時期',
        value: launch,
        short: true,
      },
      {
        title: '販売地域',
        value: region,
        short: true,
      }
    ]
  }
}


function sendSlack(attachments) {
  var data = {
    'channel': CHANNEL,
    'username': USERNAME,
    'icon_url': ICON_URL,
    'text': '今週の新商品です',
    'attachments': attachments,
  };

  payload = JSON.stringify(data);

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': payload
  };

  UrlFetchApp.fetch(URL, options);
}
