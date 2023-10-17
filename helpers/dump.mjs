import fs from "fs";

const { dump } = process.env;

export const data_saver = (fileType, fileName, locale, data) => {
	let newFileName = fileName;
	if (fileName.includes("/")) newFileName = fileName.replace("/", "-")
	if (!fs.existsSync(`${dump}/${fileType}/${locale}`)) {
		fs.mkdirSync(`${dump}/${fileType}/${locale}`, { recursive: true })
	}
	fs.writeFileSync(`${dump}/${fileType}/${locale}/${newFileName}.json`, JSON.stringify(data));
}

export const data_tree_saver = (fileType, fileName, locale, data) => {
	if (!fs.existsSync(`${dump}/${fileType}/${locale}${fileName}`)) {
		fs.mkdirSync(`${dump}/${fileType}/${locale}${fileName}`, { recursive: true })
	}
	fs.writeFileSync(`${dump}/${fileType}/${locale}${fileName}/page.json`, JSON.stringify(data));
}