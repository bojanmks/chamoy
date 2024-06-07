const { default: axios } = require("axios");
const cheerio = require("cheerio");
const FormData = require('form-data');

const ezgifBaseUrl = 'https://ezgif.com';

class EzGifGifCaptionSetter {

    fallbackCaptionSetter;

    constructor(fallbackCaptionSetter) {
        this.fallbackCaptionSetter = fallbackCaptionSetter;
    }

    async setCaption(filePath, { topCaption, bottomCaption, fontSize, temporaryUrlHandler }) {
        try {
            const fileStreamResponse = await axios.get(filePath, { responseType: 'arraybuffer' });
            const fileStream = fileStreamResponse.data;
            const uploadedFileName = await uploadFile(fileStream);

            const setCaptionData = await setCaption(uploadedFileName, { topCaption, bottomCaption, fontSize });
            const captionedFilePath = await getCaptionedFilePath(uploadedFileName, setCaptionData);

            if (temporaryUrlHandler) {
                await temporaryUrlHandler(`https:${captionedFilePath}`);
            }

            const captionedFileStreamResponse = await axios.get(captionedFilePath, { responseType: 'arraybuffer' });

            return {
                file: captionedFileStreamResponse.data,
                extension: "gif"
            };
        } catch (error) {
            console.log('❌ Error adding a caption to a gif using EzGif:');
            console.error(error);

            console.log('🔃 Trying to use a different method to set the caption');
            return this.fallbackCaptionSetter.setCaption(filePath, { topCaption, bottomCaption, fontSize });
        }
    }
}

const uploadFile = async (fileStream) => {
    const formData = new FormData();
    formData.append("new-image", fileStream, {
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

const setCaption = async (fileName, { topCaption, bottomCaption, fontSize }) => {
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

const sendSetCaptionRequest = async (bodyJson, endpoint) => {
    const headers = { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' };
    const formData = createFormDataFromJson(bodyJson);

    const response = await axios.post(endpoint, formData, { headers });
    
    return response.data;
}

const getCaptionedFilePath = async (fileName, dataFromSetCaption) => {
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

    return captionedFilePath;
}

function createFormDataFromJson(jsonObject) {
    const formData = new FormData();
    
    const appendFormData = (data, rootKey) => {
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

module.exports = EzGifGifCaptionSetter;