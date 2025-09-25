import * as xlsx from 'xlsx'

function asyncSleep(sec: any) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000))
}

function downloadExcel(sheetName: string, sheetHeader: string[], sheetData: any) {
  // Create a workbook with a single worksheet
  const workbook = xlsx.utils.book_new()
  const worksheet = xlsx.utils.aoa_to_sheet([sheetHeader, ...sheetData])
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName)

  const wbout = xlsx.write(workbook, { type: 'binary', bookType: 'xlsx' })
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sheetName}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff
  }
  return buf
}

function downloadCSV(sheetName: string, sheetHeader: string[], sheetData: any) {
  const workbook = xlsx.utils.book_new()
  const worksheet = xlsx.utils.aoa_to_sheet([sheetHeader, ...sheetData])
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName)
  const csv = xlsx.utils.sheet_to_csv(worksheet)

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${sheetName}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export { asyncSleep, downloadExcel, downloadCSV }
