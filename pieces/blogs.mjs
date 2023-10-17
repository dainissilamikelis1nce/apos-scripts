import { blogs_specific_patch_map } from "../helpers/blogs.mjs";
import { piece_names } from "../helpers/common.mjs";
import { compare_pieces_between_locales } from "../helpers/compare.mjs";
import { blog_title_map_from_excel_with_source } from "../helpers/mappers.mjs";
import { localized_piece_getter, verify_the_need_to_localize } from "./general_functions.mjs";
import { delete_piece, patch_piece, piece_localization_to_locale, publish_piece } from "./index.mjs";

const toDelete = []

const patch_blog  = (current, old) => {
    const patch = blogs_specific_patch_map(old, current);
    return patch;
}

const localize_articles_to_correct_locales = async() => {
  
    const mapper = blog_title_map_from_excel_with_source()
    for(const blog in mapper) {
        const blogLocales = mapper[blog]
        const blogSource = mapper[blog]["en-eu"];
        if (!blogSource) {
            toDelete.push(mapper[blog])
        }

        const toLocales = verify_the_need_to_localize(blogLocales);
        if (Object.keys(toLocales).length > 0) {
            for(const locale in toLocales) {
                // delete source piece to clean up the slug
                const { _id } = blogLocales[locale];
                const new_id = _id.split(":");
                new_id.pop();
                new_id.push("draft")
                blogLocales[locale]._id = new_id.join(":");
                const adjust_id = { }
                await delete_piece(blogLocales[locale], locale, piece_names.blog);
                // localizes to required locale
                const resp_loc = await piece_localization_to_locale(blogSource, locale, piece_names.blog)
                // patch newly created blog with old values
                const patch = patch_blog(resp_loc, blogLocales[locale])
                const resp = await patch_piece({
                    piece: resp_loc,
                    patch,
                }, locale, piece_names.blog)
                await publish_piece(resp, piece_names.blog);
            }


        }
    }
}


const blog_functions = async() => {
    // dump all blogs
    const resp = await localized_piece_getter(piece_names.blog, false);
    const compare = compare_pieces_between_locales(resp);
    await localize_articles_to_correct_locales()
    console.log("Blogs done")
}


export default blog_functions;