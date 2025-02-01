import FormData from 'form-data';
import { default as axios } from "axios";

const cheerio = require("cheerio");

const ezgifBaseUrl = 'https://ezgif.com';

class EzGifGifCaptionSetter {
    async setCaption(filePath: any, {
        topCaption,
        bottomCaption,
        fontSize,
        temporaryUrlHandler
    }: any) {
        try {
            const fileBufferResponse = await axios.get(filePath, { responseType: 'arraybuffer' });
            const fileBuffer = fileBufferResponse.data;
            const uploadedFileName = await uploadFile(fileBuffer);

            const setCaptionData = await setCaption(uploadedFileName, { topCaption, bottomCaption, fontSize });
            const captionedFilePath = `https:${await getCaptionedFilePath(uploadedFileName, setCaptionData)}`;

            if (temporaryUrlHandler) {
                await temporaryUrlHandler(captionedFilePath);
            }

            const captionedFileBufferResponse = await axios.get(captionedFilePath, { responseType: 'arraybuffer' });

            return {
                file: captionedFileBufferResponse.data,
                extension: "gif"
            };
        } catch (error) {
            console.log('❌ Error adding a caption to a gif using EzGif:');
            console.error(error);

            throw error;
        }
    }
}

const uploadFile = async (fileBuffer: any) => {
    const formData = new FormData();
    formData.append("new-image", fileBuffer, {
        filename: 'yourfile.gif',
        contentType: 'image/gif'
    });

    const headers = { 'Content-Type' : 'multipart/form-data' };
    const response = await axios.post(`${ezgifBaseUrl}/add-text`, formData, { headers });
    const responseHtml = response.data;

    const $ = cheerio.load(responseHtml);
    const fileName = $('input[name="file"]').val();

    return fileName;
}

const setCaption = async (fileName: any, {
    topCaption,
    bottomCaption,
    fontSize
}: any) => {
    const setCaptionEndpoint = `${ezgifBaseUrl}/add-text/${fileName}`;

    const bodyJson = {
        "fnum": 1,
        "text": `${topCaption}\n${bottomCaption}`,
        "size": fontSize,
        "font": "Impact",
        "align": "center",
        "color": "White",
        "border": 4, // max value
        "op": 100,
        "left": 0,
        "top": 0,
        "dragged": 0,
        "file": fileName
    };

    const responseWithNoGapData = await sendSetCaptionRequest(bodyJson, setCaptionEndpoint);

    const freeSpace = responseWithNoGapData.top;
    const numberOfEmptyRowsToAdd = Math.ceil(freeSpace / fontSize);
    const textGap = Array(numberOfEmptyRowsToAdd).fill('\n').join('');
    bodyJson.text = `${topCaption}${textGap}${bottomCaption}`;
    
    const responseWithGapData = await sendSetCaptionRequest(bodyJson, setCaptionEndpoint);

    return {
        file: responseWithGapData.file,
        left: responseWithGapData.left,
        top: 0,
        border: bodyJson.border,
        text: bodyJson.text,
        size: fontSize
    }
}

const sendSetCaptionRequest = async (bodyJson: any, endpoint: any) => {
    const headers = { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' };
    const formData = createFormDataFromJson(bodyJson);

    const response = await axios.post(endpoint, formData, { headers });
    
    return response.data;
}

const getCaptionedFilePath = async (fileName: any, dataFromSetCaption: any): Promise<string> => {
    const bodyJson = {
        "file": fileName,
        "f1": {
          "frame": 1,
          "left": dataFromSetCaption.left,
          "top": dataFromSetCaption.top,
          "dragged": 0,
          "file": dataFromSetCaption.file,
          "text": dataFromSetCaption.text,
          "size": dataFromSetCaption.size,
          "from": 1,
          "to": "end",
          "font": "Impact",
          "align": "center",
          "border": dataFromSetCaption.border,
          "color": "White",
          "op": 100
        }
    };

    const formData = createFormDataFromJson(bodyJson);
    const headers = { 'Content-Type' : 'multipart/form-data' };

    const response = await axios.post(`${ezgifBaseUrl}/add-text/${fileName}?ajax=true`, formData, { headers });
    const repsonseHtml = response.data;

    const $ = cheerio.load(repsonseHtml);
    const captionedFilePath = $('p.outfile img').attr('src');

    return captionedFilePath || '';
}

function createFormDataFromJson(jsonObject: any) {
    const formData = new FormData();
    
    const appendFormData = (data: any, rootKey: any) => {
      if (typeof data === 'object' && data !== null) {
        for (const key in data) {
          appendFormData(data[key], rootKey ? `${rootKey}[${key}]` : key);
        }
      } else {
        formData.append(rootKey, data);
      }
    }
  
    appendFormData(jsonObject, '');
  
    return formData;
}

export default EzGifGifCaptionSetter;