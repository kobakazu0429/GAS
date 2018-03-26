function doPost(e) {
  // -- config -- //
  var verifyToken      = PropertiesService.getScriptProperties().getProperty('verifyToken');
  var slackAccessToken = PropertiesService.getScriptProperties().getProperty('slackAccessToken');

  if (verifyToken == e.parameter.token) {                   // トークンの認証
    var channel_id   = e.parameter.channel_id;              // channel_idの取得
    var channel_name = e.parameter.channel_name;            // channel_nameの取得
    var user_id      = e.parameter.user_id;                 // user_id名の取得

    var slackApp   = SlackApp.create(slackAccessToken);     // slackAppの作成

    var url        = findURL(channel_id);

    // -- 返信メッセージ -- //
    var mention = '<@' + user_id + '>\n';                   // メンションの作成
    var channel = '#' + channel_name;                       // 現在のチャンネル

    if (url == 'nothing') {
      var message = mention + 'このチャンネル(' + channel + ')には議事録はありませんでした。';
    } else {
      var message = mention + 'このチャンネル(' + channel + ')の議事録はこれです！\n' + url;
    }

    // -- オプション -- //
    var options = {
      // -- 投稿するユーザー名 -- //
      as_user: false,
      username: '議事録くん',
      icon_emoji: ':memo:'
    };

    // -- 送信 -- //
    slackApp.postMessage(channel, message, options);
  }
}

function findURL(channel_id) {
  // -- 使うスプレッドシートの特定 --//
  var ssurl = 'https://docs.google.com/spreadsheets/d/1zek3sANg1_a9-ACAqyWKpvM7n04CpbEvRkMIjYFOMrk/edit#gid=0';
  var ss = SpreadsheetApp.openByUrl(ssurl);
  var sheet = ss.getSheetByName('URL');

  // -- シートの最終行、列番号を取得 -- //
  // -- row = 列, col = 行 -- //
  // -- A1 : row = 1, col = 1 -- //
  var startrow = 2;
  var startcol = 1;
  var lastrow = sheet.getLastRow() - 1;
  var lastcol = sheet.getLastColumn();

  // -- データのあるセルをすべて取得 -- //
  var sheetdata = sheet.getSheetValues(startrow, startcol, lastrow, lastcol);

  // -- A1セルは[0][0], B1セルは[0][1] -- //
  for (var i = 0; i < lastrow; i++) {
    if (channel_id == sheetdata[i][1]) {
      return sheetdata[i][3];
    }
  }
  return 'nothing';
}