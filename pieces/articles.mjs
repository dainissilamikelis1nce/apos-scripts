import { articles_specific_patch_map } from "../helpers/articles.mjs";
import { piece_names } from "../helpers/common.mjs";
import { compare_pieces_between_locales } from "../helpers/compare.mjs";
import { article_title_map_from_excel_with_source } from "../helpers/mappers.mjs";
import { delete_all_pieces, find_source_piece, localized_piece_getter } from "./general_functions.mjs";
import { patch_piece, piece_localization_to_locale, publish_piece } from "./index.mjs";

const patch_article  = (current, old) => {
    const patch = articles_specific_patch_map(old, current);
    return patch;
}
const glitchy_ids = ["clbjv31zx00m801n5bgfb1gqc"]
const localize_articles_to_correct_locales = async() => {
    const locales_to_fix = ["de-de", "fr-fr", "it-it", "en-us", "en-ap", "ja-jp"]
    const localized_pieces_articles = await localized_piece_getter(piece_names.article, false);
    const euLocale = localized_pieces_articles["en-eu"];
    const mapper = article_title_map_from_excel_with_source();
    for(const article of euLocale) {
            const  { valid_locales, pieces: articles } = find_source_piece(article, mapper)
            for(const locale of valid_locales) {
                if (locales_to_fix.includes(locale)) {
                    // this localizes 
                    if (locale === "ja-jp") {
                        debugger;
                    }
                    try { 
                        const resp_loc = await piece_localization_to_locale(article, locale, piece_names.article)
                        // this updates with old data
                        const patch = patch_article(resp_loc, articles[locale]);
                        const resp = await patch_piece({
                            piece: resp_loc,
                            patch,
                        }, locale, piece_names.article)
                        // this published the piece
                        if (!resp._id) {
                            debugger;
                        }
                        await publish_piece(resp, piece_names.article);
                    } catch(err) {
                        debugger;
                    }

                }
            } 
    }

}


const articles_functions = async() => {
    const resp = await localized_piece_getter(piece_names.article, false);
    const compare = compare_pieces_between_locales(resp);

    await delete_all_pieces(piece_names.article, ["en-eu", "es-es"])
    await localize_articles_to_correct_locales();
    console.log("Articles done");
}


export default articles_functions;