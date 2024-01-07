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
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.aoa_to_sheet([sheetHeader, ...sheetData]);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  const csv = xlsx.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sheetName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function csvJSON(csv: any) {
  const lines = csv.split('\n')
  const result = []
  const headers = lines[0].split(',')

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue
    const obj: any = {}
    const currentline = lines[i].split(',')

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j]
    }
    result.push(obj)
  }
  return result
}
async function blobToBase64(blob: any) {
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

const getBlobFromImgUrl = async (imageUrl: string) => {
  const resp = await fetch(imageUrl, { mode: 'no-cors' }).then((response) => response.blob())
  return await blobToBase64(resp)
}

const scrollTillBottom = (ref: any) => {
  ref?.scroll({
    top: ref?.scrollHeight,
    left: 0,
    behavior: "smooth",
  });
}

const downloadListings = async (data: any) => {
  const name = "FSBO Listings"
  const headers: any = ["id", "image", "bedrooms", "baths", "price", "sq_ft", "seller_phone_number", "address", "zillow_listing_url"]
  const mappedData: any = data.map((item: any) => [item.id, item.image, item.bedrooms, item.baths, item.price, item.sq_ft, item.seller_phone_number, item.address, item.zillow_listing_url])
  const dat = mappedData.map((el: any) => el.map((el2: any) => el2.toString()))
  downloadCSV(name, headers, dat)
}

const downloadReviews = async (data: any) => {
  const name = "Zillow Reviews"
  const headers: any = ["id", "date", "reviewer_name", "total_score", "local_knowledge", "process_expertise", "responsiveness", "negotiation_skills", "headline", "body"]
  const mappedData: any = data.map((item: any) => [item.id, item.date, item.reviewer_name, item.total_score, item.local_knowledge, item.process_expertise, item.responsiveness, item.negotiation_skills, item.headline, item.body])
  console.log(mappedData);
  const dat = mappedData.map((el: any) => el.map((el2: any) => el2.toString()))
  downloadCSV(name, headers, dat)
}
export { downloadExcel, downloadCSV, asyncSleep, getBlobFromImgUrl, scrollTillBottom, downloadListings, downloadReviews }
