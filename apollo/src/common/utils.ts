import * as xlsx from 'xlsx';

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

const downloadApolloData = async (data: any) => {
  const headers = ["Name", "Title", "Company", "Contact Location", "Number of employees", "Email", "Phone", "Number", "Industry", "Keywords"]
  const exelData = data.map((item: any) => {
    return ([
      item?.name,
      item?.title,
      item?.company,
      item?.contactLocation,
      item?.employees,
      item?.email,
      item?.phone,
      item?.industry,
      item?.keywords,
    ])
  })

  const sheetName = `apollo-data-${Date.now()}`
  downloadCSV(sheetName, headers, exelData)
}
export { downloadCSV, downloadApolloData };

