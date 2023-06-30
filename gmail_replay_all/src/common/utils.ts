import * as xlsx from 'xlsx'

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

function asyncSleep(sec: any) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000))
}

function downloadCSV(sheetName: string, sheetHeader: string[], sheetData: any) {
  const workbook = xlsx.read([sheetHeader, [...sheetData]], { type: 'binary' })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const csv = xlsx.utils.sheet_to_csv(worksheet)

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = sheetName
  link.click()
  URL.revokeObjectURL(url)
}

export { downloadExcel, downloadCSV, asyncSleep }
export function csvJSON(csv:any) {
  const lines = csv.split('\n')
  const result = []
  const headers = lines[0].split(',')

  for (let i = 1; i < lines.length; i++) {        
      if (!lines[i])
          continue
      const obj :any= {}
      const currentline = lines[i].split(',')

      for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j]
      }
      result.push(obj)
  }
  return result
}
 