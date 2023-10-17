
import { fileTypes, locales } from "../helpers/common.mjs";
import { data_saver } from "../helpers/dump.mjs";
import { get_pieces, delete_piece, piece_localization_to_locale, publish_piece } from "./index.mjs";


export const find_source_piece= (blog, mapper, ver = false) => {
    const { title } = blog;
    const val = mapper[title];
    let valid_locales = [];
    let blogs = val;
    if (val) {
        valid_locales = Object.keys(val)
    }else {
        console.log(title);
    }

    if(!blogs) {
        return {
            valid_locales,
            blogs,
        }
    }
    if (ver === false ) {
        return {
            valid_locales,
            pieces: blogs,
        };
    }

    const verify = verify_the_need_to_localize(blogs)
    return {
        valid_locales: verify,
        pieces: blogs,
    };
}

export const verify_the_need_to_localize = (piece) => {
    let setAposDocId = null;
    let localesNotMatching = {}
    Object.keys(piece).forEach((key) => {
        const { aposDocId } = piece[key];
        if (!setAposDocId) setAposDocId = aposDocId;
        else if (aposDocId !== setAposDocId) {
            localesNotMatching[key] = piece[key]
        }
    })
    
    return localesNotMatching;
}

export const localized_piece_getter = async(pieceName, dump = false) => {
    const localized = {};
    for(const locale of locales) {
        const resp = await get_pieces(pieceName, locale)
        localized[locale] = resp;
        if (dump) {
            data_saver(fileTypes.pieces, pieceName, locale, resp)
        }
    }
    return localized;

}

const article_titles_to_ignore_in_deletion = [
    "Änderungen bei 1NCE: Chief Sales Officer Roman Tietze scheidet aus dem Unternehmen",
    "1NCE geht neue Partnerschaft ein, um sein Wissen rund um IoT und Innovationen mit Interessenten in Italien zu teilen",
    "SoftBank Corp. espande la propria attività IoT globale in APAC con 1NCE",
]
export const piece_deleter = async(localized_pieces, pieceName, skip = []) => {
    for(const locale in localized_pieces) {
        if (!skip.includes(locale) ) {
            for(const piece of localized_pieces[locale]) {
                const { title } = piece;
                if (!article_titles_to_ignore_in_deletion.includes(title)) {
                    await delete_piece(piece, locale, pieceName)
                }

                // await delete_piece(piece, locale, pieceName)
            }
        }
    }
}


export const delete_all_pieces = async(pieceName, localesToIgnore = []) => {
    const localized_pieces = await localized_piece_getter(pieceName, false);
    await piece_deleter(localized_pieces, pieceName, localesToIgnore);
}

export const localize_and_publish_piece = async(pieceName, ) => {
    const localized_pieces = await localized_piece_getter(pieceName, false);
    const fromLocale = localized_pieces["en-eu"];
    for(const category of fromLocale) {
        for(const locale of locales) {
            if (locale !== "en-eu") {
                const resp = await piece_localization_to_locale(category, locale, pieceName)
                await publish_piece(resp, pieceName);
            }
        }
    }
}