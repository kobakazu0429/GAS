function doPost(e) {
  var verifyToken      = PropertiesService.getScriptProperties().getProperty('verifyToken');
  if(verifyToken !== e.parameter.token) throw new Error('Invalid token');   // トークンの認証

  // -- config -- //
  var formula          = '=indirect("R[-1]C", false) + 1';

  var channel_id       = e.parameter.channel_id;              // channel_idの取得
  var channel_name     = e.parameter.channel_name;            // channel_nameの取得
  var url              = e.parameter.text;                    // url

  // -- オプション -- //
  var options = {
    // -- 投稿するユーザー名 -- //
    as_user: false,
    username: '議事録くん',
    icon_emoji: ':memo:'
  };

  // -- 使うスプレッドシートの特定 --//
  var ssurl = 'https://docs.google.com/spreadsheets/d/1zek3sANg1_a9-ACAqyWKpvM7n04CpbEvRkMIjYFOMrk/edit#gid=0';
  var ss = SpreadsheetApp.openByUrl(ssurl);
  var sheet = ss.getSheetByName('URL');

  var array = [formula, channel_id, channel_name, url];

  sheet.appendRow(array)

  // -- 送信 -- //
  var text_tmp  = 'このチャンネルの( #' + channel_name + ')議事録は下のURLに保存されています。\n';
      text_tmp += 'https://docs.google.com/spreadsheets/d/1zek3sANg1_a9-ACAqyWKpvM7n04CpbEvRkMIjYFOMrk/'

  var response = {
    response_type: "in_channel",
    text: text_tmp
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
