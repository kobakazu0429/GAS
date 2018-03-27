var debug_mode = false;

var url = UserProperties.getProperty('incoming')

var channel = debug_mode ? 'C989JV2NN' : 'C83HEBCC9';
var username = 'リス師匠';
var icon = 'https://emoji.slack-edge.com/T84UUNQBY/squirrel/465f40c0e0.png';

var name;
var today_members = [];

function sendMessage(members) {
  var member_list = members.length > 1 ? members.join('と') : members[0];

  var message = '明日は' + member_list + 'の誕生日だな\nプレゼントは買ってやったか?';

  var data = {
    'channel': channel,
    'username': username,
    'icon_url': icon,
    'text': message
  };

  var payload = JSON.stringify(data);

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': payload
  };

  UrlFetchApp.fetch(url, options);
}

function getBirthday() {
  var spreadsheet  = SpreadsheetApp.getActiveSpreadsheet();
  var sheet        = spreadsheet.getActiveSheet();

  var tommorow     = new Date();
  tommorow.setDate(tommorow.getDate() + 1);

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
    if (tommorow.getMonth() + 1 == sheetdata[i][4].getMonth() + 1 && tommorow.getDate() == sheetdata[i][4].getDate()) {
      name = sheetdata[i][2];
      today_members.push(name);
    }
  }
  if (today_members.length != 0) sendMessage(today_members);
}
