import { create_patch_map } from "./patch.mjs";

export const articles_specific_patch_map = (current, old) => {
    const limited_new = {};
    const limited_old = {};

    const fields = [
        "publishedAt",
        "main", 
        "image",
        "slug",
        "description",
        "openGraphDescription",
        "openGraphImageFields",
        "openGraphImageIds",
        "openGraphTitle",
        "openGraphType",
        "seoTitle",
        "seoDescription",
        "wsLink",
        "wsId",
        "title",
    ];

    Object.keys(old).forEach((k) => {
        if(fields.includes(k)) {
            limited_old[k] = old[k]
        }
    })

    Object.keys(current).forEach((k) => {
        if(fields.includes(k)) {
            limited_new[k] = current[k]
        }
    })

    const patch = create_patch_map(limited_old, limited_new)

    return patch;

}
