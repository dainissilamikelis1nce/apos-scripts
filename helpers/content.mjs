
import cheerio from "cheerio"
import { localize_and_purge_urls } from "./urls.mjs";
import { flatten_obj, create_patch_map } from "./patch.mjs";

const know_apos_fields = ["aposDocId", "modified", "lowSearchText", "searchSummary", "highSearchWords", "highSearchText", "updatedBy", "cacheInvalidatedAt", "updatedAt", "createdAt", "metaType", "aposMode", "type", "aposLocale", "titleSortified", "archived", "visibility", "scheduledPublish", "scheduledUnpublish"];
const ignore_fields_for_now = ["openGraphImageFields", "openGraphImageIds", "image"]
const fields_for_sure_with_no_cotent = ["ctaType", "linkType", "linkTarget", "icon", "url"]
const relation_ship_fields = ["teaserFields", "teaserIds", "faqFields", "faqIds", "fileFields", "fileIds", "blogFields",  "blogIds", "articleFields", "articleIds", "useCaseFields", "useCaseIds", "useCaseReferenceFields", "useCaseReferenceIds", "linkPageFields", "linkPageIds"]
const seo_fields = [ "seoRobots", "schemaOrgFaqItems", "openGraphType"]

const ignore_fields = [...know_apos_fields, ...ignore_fields_for_now, ...relation_ship_fields, ...fields_for_sure_with_no_cotent, ...seo_fields];

const extract_area_content = (content) => {
	const { items } = content;
	const extracted = {};
	items.forEach((i, index) => {	
		extracted[index] = this.extract_content(i)
	})
	return extracted;
}

const extract_button_content = (content) => {
	const fieldsThatMatter = ["type", "url"];
	const { type, url } = content;
	return `${type}: ${url}`
}

const extract_rich_text_editor_content = (content) => {
	const fieldsThatMatter = ["content"];
	const $ = cheerio.load(content.content);
	const allTextContent = $.root().text();
	return {
		raw: content.content,
		stripped: allTextContent
	}
}


const extract_string_content = (content) => {
	return content;
}

const hard_extract = (content) => {
	const extracted = {};
	if (typeof content !== 'object')  {
		return content
	}
	
	Object.keys(content).forEach((k) => {
		// this ignores relationship fields which we dont want to update for now
		if (!k.startsWith("_")) {
			// check if array
			if(Array.isArray(content[k])) {
				extracted[k] = [];
				content[k].forEach((el) => {
					extracted[k].push(hard_extract(el))
				})
			} else if (typeof content[k] === 'object') {
				extracted[k] = this.extract_content(content[k])
			} else {
				extracted[k] = content[k]
			}
		}
	})
	return extracted;
}

export const extract_content = (content) => {
	if (content === null) return null;

	let type = this.content_types.string;

	if (content.metaType) {
		type = content.metaType
	}
	// override meta types
	if (content.type) {
		type = content.type
	}


	if (type === this.content_types.string) {
		return extract_string_content(content)
	}
	else if (type === this.content_types.rte) {
		return extract_rich_text_editor_content(content)
	}
	else if (type === this.content_types.area) {
		return extract_area_content(content)
	} 
	else if (type === this.content_types.button) {
		return extract_button_content(content)
	}
	else {
		return hard_extract(content)
	}
}

export const strip_apos_fields = (content) => {
	const stripped = {};
	Object.keys(content).forEach((k) => {
		if (!ignore_fields.includes(k) && !k.startsWith("_"))  {
			stripped[k] = content[k]
		}
	})
	return stripped;
}


export const extract_href = (html) => {
	const $ = cheerio.load(html);
	// Find all <a> tags
	const aTags = $('a');
	// Iterate over the <a> tags and get the href values
	const hrefValues = aTags.map((index, element) => {
		return $(element).attr('href');
	}).get();

	return hrefValues;
}

export const change_html_url_content = (html, url_map) => {
	const $ = cheerio.load(html);
	let newText = html;
	// Find all <a> tags
	const aTags = $('a');
	// Iterate over the <a> tags and get the href values
	aTags.map((index, element) => {
		const value = $(element).attr('href');
		const newUrl = url_map[value]
		if (newUrl) {
			newText = newText.replace(value, encodeURI(newUrl))
		}
		return value;
	}).get();

	return newText;

}

export const href_extractor = (source) => {
	//const pieces = require(source);
	const href_to_find = "<a href="
	const all_hrefs = [];
	pieces.forEach((piece) => {
		const brute_check = JSON.stringify(piece).includes(href_to_find)
		if (brute_check) {
			const flat =  flatten_obj(piece)
			const href_keys = [];
			Object.keys(flat).forEach((fk) => {
				if (typeof flat[fk] === 'string' && flat[fk].includes(href_to_find)) {
					const a =  this.extract_href(flat[fk]);
					all_hrefs.push(...a)
				}
			})
		}
	})
	return [...new Set(all_hrefs)];
}

export const href_patcher = (pieces, pieceType, locale) => {
	//const url_map = require(`../_dump/${stage}/urls/${locale}/href_url_map.json`);
	const localize_urls = localize_and_purge_urls(url_map, locale);

	const href_to_find = "<a href="
	const all_patches= [];
	pieces.forEach((piece) => {
		const cloned = structuredClone(piece);
		const brute_check = JSON.stringify(cloned).includes(href_to_find)
		if (brute_check) {
			const flat = flatten_obj(cloned)
			const old = flatten_obj(piece);
			Object.keys(flat).forEach((fk) => {
				if (typeof flat[fk] === 'string' && flat[fk].includes(href_to_find)) {
					const new_value  = this.change_html_url_content(flat[fk],  localize_urls );
					const old_value = flat[fk]
					if (new_value !== old_value) {
						flat[fk] = new_value;
					} 
				}
			})

			const patched = create_patch_map(old, flat)
			if (Object.keys(patched).length > 0) {
				all_patches.push({ [pieceType]: piece, patch: patched });
			}
		}
	})
	return  all_patches;
}
