
const boundary = '-------314159265358979323846';
const contentType = `multipart/mixed; boundary="${boundary}"`

export const getAuthToken = async () => {
    return await chrome.identity.getAuthToken({ 'interactive': true })
}


export async function uploadImage(folderId: string, imageName: string, imageUrl: string) {

    const auth = await getAuthToken()
    var metadata = {
        'name': `${imageName}.jpg`,
        'mimeType': 'image/jpeg',
        parents: [folderId]
    };

    const base64Data = await getImageBase64(imageUrl);
    const multipartRequestBody = getbody(base64Data, metadata)

    const requestOptions = {
        method: 'POST',
        params: {
            'uploadType': 'multipart'
        },
        headers: {
            "Authorization": `Bearer ${auth.token}`,
            'Content-Type': contentType,
            "Accept": "application/json"
        },
        body: multipartRequestBody,
    };
    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", requestOptions)
    const data = await response.json()
    return data
}



export async function createDriveFolder(folderName: string, foldersId: Array<string>) {
    const auth = await getAuthToken()

    var metadata = {
        'name': `${folderName}`,
        'mimeType': 'application/vnd.google-apps.folder',
        parents: foldersId
    };
    const multipartRequestBody = getFolderBody(metadata)

    const requestOptions = {
        method: 'POST',
        params: {
            'uploadType': 'multipart'
        },
        headers: {
            "Authorization": `Bearer ${auth.token}`,
            'Content-Type': contentType,
            "Accept": "application/json"
        },
        body: multipartRequestBody,
    };

    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", requestOptions)
    const data = await response.json()
    return data.id
}

export async function createSheet(sheetName: string) {
    const auth = await getAuthToken()
    const token = auth?.token

    const requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            properties: {
                title: sheetName,
            },
        }),
    };

    const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", requestOptions)
    const data = await response.json()
    return data?.spreadsheetId
}

export async function updateSheetData(spreadsheetId: string, rows: any) {
    const auth = await getAuthToken()
    const token = auth?.token
    const requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            values: rows,
        }),
    };

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:K1:append?valueInputOption=RAW`, requestOptions)

    return await response.json()
}

async function getImageBase64(url: string) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const base64String = await blobToBase64(blob);

        return base64String;
    } catch (error) {
        console.error('Error fetching image:', error);
        throw error;
    }
}

function blobToBase64(blob: any) {
    return new Promise((resolve, reject) => {
        const reader: any = new FileReader();
        reader.onloadend = () => {
            resolve(reader?.result?.split(',')?.[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

const getbody = (base64Data: any, metaData: any) => {
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;
    const contentType = metaData.mimeType || 'application/octet-stream';
    return delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metaData) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        closeDelimiter;
}

const getFolderBody = (metaData: any) => {
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;
    const contentType = metaData.mimeType || 'application/octet-stream';
    return delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metaData) +
        closeDelimiter;
}

