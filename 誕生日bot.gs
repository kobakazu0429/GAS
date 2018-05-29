var debug_mode  = true;

var url         = PropertiesService.getScriptProperties().getProperty('incoming');

var channel     = debug_mode ? 'C989JV2NN' : 'C83HEBCC9';
var username    = 'リス師匠';
var icon        = 'https://emoji.slack-edge.com/T84UUNQBY/squirrel/465f40c0e0.png';

var ssurl = 'https://docs.google.com/spreadsheets/d/1bExkjJfd3z1-_nqrXLGbT1g_D_KZv2FMKcB3TaB8ARI/';
var ss = SpreadsheetApp.openByUrl(ssurl);
var sheet = ss.getSheetByName('フォームの回答 1');

// -- シートの最終行、列番号を取得 -- //
// -- row = 列, col = 行 -- //
// -- A1 : row = 1, col = 1 -- //
// -- A1セルは[0][0], B1セルは[0][1] -- //
var startrow    = 2;
var startcol    = 1;
var lastrow     = sheet.getLastRow() - 1;
var lastcol     = sheet.getLastColumn();

// -- データのあるセルをすべて取得 -- //
var sheetdata   = sheet.getSheetValues(startrow, startcol, lastrow, lastcol);

var today       = new Date();


function thisMonthBirthday() {
  var thisMonthBirthdayMembers = [];
  for (var i = 0; i < lastrow; i++) {
    if (today.getMonth() + 1 == sheetdata[i][4].getMonth() + 1) {
      var obj_temp = {'name': '', 'birthday': ''};

      var name = sheetdata[i][2];
      var birthday = sheetdata[i][4];

      obj_temp.name = name;
      obj_temp.birthday = birthday;

      thisMonthBirthdayMembers.push(obj_temp);
    }
  }
  parseMessageForThisMonth(thisMonthBirthdayMembers);
}


function tommorowBirthday() {
  var tommorow = today;
  tommorow.setDate(tommorow.getDate() + 1);

  var today_members = [];

  for (var i = 0; i < lastrow; i++) {
    if (tommorow.getMonth() + 1 == sheetdata[i][4].getMonth() + 1 && tommorow.getDate() == sheetdata[i][4].getDate()) {
      name = sheetdata[i][2];
      today_members.push(name);
    }
  }
  if (today_members.length != 0) parseMessageForTomorrow(today_members);
}


function parseMessageForThisMonth(members) {
  var message = '今月は\n';
  for(var i = 0; i < members.length; i++) {
    message += members[i].name;
    message += ' : ';
    message += Moment.moment(members[i].birthday).format('MM/DD');
    message += '\n';
  }
  message += '達が誕生日だな、プレゼントは買ってやったか?';

  sendMessage(message);
}


function parseMessageForTomorrow(members) {
  var member_list = members.length > 1 ? members.join('と') : members[0];
  var message = '明日は' + member_list + 'の誕生日だな\nプレゼントは買ってやったか?';

  sendMessage(message);
}


function sendMessage(message) {
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
