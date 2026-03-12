function doPost(e) {

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("logs") 
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet("logs")

  const data = JSON.parse(e.postData.contents)

  sheet.appendRow([
    new Date(),
    data.level || "info",
    data.message || "",
    JSON.stringify(data.payload || {})
  ])

  return ContentService
    .createTextOutput(JSON.stringify({ok:true}))
}