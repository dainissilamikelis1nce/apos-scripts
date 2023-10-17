import axios from "axios"
import fs from "fs"

const phrase_wrapper = async (config) => {
    const headers = {
        'Authorization': `Bearer ${process.env.phraseToken}`,
      };
      
    const axios_config = {
        ...config,
        headers: {
            ...config.headers,
            ...headers
        }
    }

    try {
        const resp = await axios(axios_config);
        return resp;
    } catch (err) {
        return "ERROR";
    }
}


export const get_supported_languages = async () => {
   const resp = await phrase_wrapper({
    method: "GET",
    url: "https://cloud.memsource.com/web/api2/v1/languages"
   })
}

export const upload_file = async() => {
    const fileContent = fs.readFileSync("./article.json", "utf8");
    const formData = new FormData();
    formData.append('file', fileContent, {
        filename: "article.json",
        contentType: "application/json"
    })
    const resp = await phrase_wrapper({
        method: "POST",
        url: "https://cloud.memsource.com/web/api2/v1/files",

    })
}