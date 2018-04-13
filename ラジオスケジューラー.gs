// -- config -- //
var ss_id = '1zoxpLTZdZFddkxuAjDFobNgcR3wOEyuSpPwyViNVHdI';
var ss = SpreadsheetApp.openById(ss_id);
var sheet = ss.getSheetByName('data');

var current_folder_id = '1ymsqxz0BkCH4o5GrMzxDBSQjMi1Zm6Rz';


// -- function -- //
function doPost(e) {
  var json = (new Function("return " + e.postData.contents))();

  var title         = json.title ? json.title : '未定';
  var published_at  = json.published_at ? json.published_at : '未定';
  var rec           = json.rec ? true : false;
  var edit          = json.edit ? true : false;
  var censorship    = json.censorship ? true : false;
  var thumbnail     = json.thumbnail ? true : false;
  var reserve       = json.reserve ? true : false;
  var release       = json.release ? true : false;
  var comic         = json.comic ? true : false;
  var tweet         = json.tweet ? true : false;
  
  var rec_source    = json.rec_source ? true : false;
  var thumbnail_img = json.thumbnail_img ? true : false;
  var comic_img     = json.comic_img ? true : false;

  var id            = sheet.getLastRow();

  var this_folder_id = check_folder(id);

  if (rec_source)    base64tosave(json.rec_source, 'rec_source', this_folder_id);
  if (thumbnail_img) base64tosave(json.thumbnail_img, 'thumbnail_img', this_folder_id);
  if (comic_img)     base64tosave(json.comic_img, 'comic_img', this_folder_id);
  
  var array         = [id, title, published_at, rec, edit, censorship, thumbnail, reserve, release, comic, tweet, this_folder_id];

  sheet.appendRow(array);
}

function check_folder(time) {
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
    if (time == sheetdata[i][1]) {
      return sheetdata[i][11];
    }
  }
  return create_folder(time);
}

function create_folder(create_time) {
  var assets = DriveApp.getFolderById(current_folder_id);
  var new_folder = assets.createFolder('ck' + create_time);
  return new_folder.getId();
}

function base64tosave(str, filetype, folder_id) {
  var tmp = str.substr(5);
  var mimetype = tmp.slice(0,tmp.indexOf(';'));
  var text = tmp.slice(tmp.indexOf(',') + 1);
  var filename = filetype + '.' + mimetype.slice(mimetype.indexOf('/') + 1);

  var data = Utilities.base64Decode(text, Utilities.Charset.UTF_8);

  var blob = Utilities.newBlob(data, mimetype, filename);

  // ファイル保存
  folder_id.createFile(blob);
}
