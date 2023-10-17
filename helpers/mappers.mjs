import XLSX from "xlsx"
import fs from "fs"

const find_first_used_key = (el) => {
    if (el["en-eu"] !== "-") return el["en-eu"]

    let key;
    Object.keys(el).some((k) => {
        if (el[k] !== "-") {
            key = el[k];
            return true
        }
    })

    return key;
}

export const article_title_map_from_excel = (reversed_map = false) => {
    const excel = XLSX.readFile("./input_sources/2023-09-26_mapping of titles.xlsx")
    const { SheetNames, Sheets }  = excel;
    const ws = Sheets[SheetNames[0]];
    let json = XLSX.utils.sheet_to_json(ws)
    const reversed = {};
    if (reversed_map) {
        json.forEach((el) => {
            let key = el["en-eu"];
            if (key === "-") {
                key = el["de-de"]
            }
            reversed[key] = [];
            Object.keys(el).forEach((k) => {
                const val = el[k];
                if (val !== "-") reversed[key].push(k)
            })

        })
        json =reversed;
    } 


    return json;
}


export const article_title_map_from_excel_with_source = () => {
    const excel = XLSX.readFile("./input_sources/2023-09-26_mapping of titles.xlsx")
    const { SheetNames, Sheets }  = excel;
    const ws = Sheets[SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws)
    const reversed = {};
    json.forEach((el) => {
        let key = el["en-eu"];
        if (key === "-") {
            key = el["de-de"]
        }
        reversed[key] = {};
        Object.keys(el).forEach((k) => {
            const val = el[k];
            const source = JSON.parse(fs.readFileSync(`./_dump/local/pieces/${k}/article.json`, 'utf-8'));
            const art = source.find((a) => a.title === val)
            if (!art && val !== "-") {
                console.log(val)
            }

            if (val !== "-" && art) reversed[key][k] = art;
        })

    })


    return reversed;
}

export const blog_title_map_from_excel_with_source = () => {
    const excel = XLSX.readFile("./input_sources/Blog article mapping.xlsx")
    const { SheetNames, Sheets }  = excel;
    const ws = Sheets[SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws)
    const reversed = {};
    json.forEach((el) => {
        let key = find_first_used_key(el)
        reversed[key] = {};
        Object.keys(el).forEach((k) => {
            const val = el[k];
            const source = JSON.parse(fs.readFileSync(`./_dump/local/blogs/${k}/blogs.json`, 'utf-8'));
            const art = source.find((a) => a.title === val)

            if (val !== "-" && art) reversed[key][k] = art;
        })

    })


    return reversed;
}