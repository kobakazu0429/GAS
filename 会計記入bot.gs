// -- config -- //
var sheetId     = '1HcylSzjbZoi_-U5usDCghzhjwG95iRCFHtUBsNO3fPY';
var verifyToken = PropertiesService.getScriptProperties().getProperty('verifyToken');
var formula     = '=indirect("R[-1]C[0]", false) + indirect("R[0]C[-1]", false)';

// -- function -- //
function doPost(e) {
  if(verifyToken !== e.parameter.token) throw new Error('Invalid token');

  var text = e.parameter.text.split('/');

  var date = Moment.moment(text[0], 'YYYYMMDD').format('YYYY/MM/DD');
  var uses = text[1];
  var cost = parseInt(text[2]);

  var sheets = SpreadsheetApp.openById(sheetId);
  var sheet  = sheets.getSheetByName('シート1');

  var array = [date, uses, cost, formula];

  sheet.appendRow(array);

  var lastColumn = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var remainder = sheet.getRange(lastRow, lastColumn).getValue();

  var text_tmp = '';
  text_tmp += date + ', ' + uses + ', ' + cost + 'で、登録されました。\n';
  text_tmp += '残高は' + remainder + '円です。\n';
  text_tmp += '問題がある場合は(https://docs.google.com/spreadsheets/d/1HcylSzjbZoi_-U5usDCghzhjwG95iRCFHtUBsNO3fPY)より修正してください。';

  var response = {
    text: text_tmp
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
