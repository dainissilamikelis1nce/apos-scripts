import { axios_wrapper } from "../helpers/api.mjs";
import { extract_href, href_patcher } from "../helpers/content.mjs";
import { flatten_obj } from "../helpers/patch.mjs";

const { host, stage } =  process.env

export const get_pieces = async(pieceName, locale) => {
	let newCurrentPage = 1;
	let newPages = 2;
	let pieces = [];
	
	while (newCurrentPage < newPages +1 ) {
		const route = `${host}/api/v1/${pieceName}?page=${newCurrentPage}&aposLocale=${locale}&aposMode=draft`
		const resp = await axios_wrapper("get", route);
		const { currentPage, pages, results } = resp;
		newCurrentPage = currentPage + 1;
		newPages = pages;
		pieces.push(...results)
	}
	return pieces;
}

export const piece_localization_to_locale = async(piece, locale, pieceName) => {
	const { _id } = piece;
 	// this localizes the existing piece to new region
	const route = `${host}/api/v1/${pieceName}/${_id}/localize`
	const localized_body = {
		toLocale: locale,
	}
	const resp = await axios_wrapper("post", route, localized_body);
	return resp;
}

export const patch_piece = async(pieceToPatch, locale, pieceType) => {
	const { piece, patch } = pieceToPatch;
	const { _id } = piece;
	const patch_route = `${host}/api/v1/${pieceType}/${_id}?aposLocale=${locale}`;
	const patch_body = {
		...patch
	}
	if (patch_body === {}) return;

    const resp = await axios_wrapper("patch", patch_route, patch_body)
	return resp;
}

export const piece_href_extractor = (piece, locale) => {
	//const pieces = require(`../_dump/${stage}/pieces/${locale}/${piece}.json`);
	const href_to_find = "<a href="
	const all_hrefs = [];
	pieces.forEach((piece) => {
		const brute_check = JSON.stringify(piece).includes(href_to_find)
		if (brute_check) {
			const flat =  flatten_obj(piece)
			const href_keys = [];
			Object.keys(flat).forEach((fk) => {
				if (typeof flat[fk] === 'string' && flat[fk].includes(href_to_find)) {
					const a =  extract_href(flat[fk]);
					all_hrefs.push(...a)
				}
			})
		}
	})
	return [...new Set(all_hrefs)];
}

export const piece_href_patcher = (piece, locale) => {
	// const pieces = require(`../_dump/${stage}/pieces/${locale}/${piece}.json`);
	return href_patcher(pieces, "piece", locale)
}

export const delete_piece = async(piece, locale, pieceType) => {
	const { _id } = piece;
	const route = `${host}/api/v1/${pieceType}/${_id}?aposLocale=${locale}`
	await axios_wrapper("delete", route);
}

export const archive_piece = async(piece, locale, pieceType) => {
	const { _id } = piece;
	const patch_route = `${host}/api/v1/${pieceType}/${_id}?aposLocale=${locale}&aposMode=draft`;
	const patch_body = {
		archived: true
	}
    await axios_wrapper("patch", patch_route, patch_body);
}

export const post_piece = async(piece, locale, pieceType) => {
	const post_route= `${host}/api/v1/${pieceType}?aposLocale=${locale}`;
    const resp = await axios_wrapper("post", post_route, piece)
	return resp;
}

export const publish_piece = async(piece, pieceType) => {
	const { _id } = piece;
	const route = `${host}/api/v1/${pieceType}/${_id}/publish`
    const resp = await axios_wrapper("post", route, piece)
	return resp;
}