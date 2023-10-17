import { data_saver } from "./dump.mjs";

export const compare_pieces_between_locales = (pieces) => {
    const ids_per_locale = {};
    for(const piece_locale in pieces) {
        const current = pieces[piece_locale];
        current.forEach((item) => {
            const { aposDocId, title  } = item;
            if (ids_per_locale[piece_locale]) ids_per_locale[piece_locale].push({ aposDocId, title })
            else ids_per_locale[piece_locale] = [{ aposDocId, title }];
        })
    }
    const normals_ids = {};
    for(const locale in ids_per_locale) {
        const current = ids_per_locale[locale];
        current.forEach((value) => {
            const { aposDocId, title } = value;
            if (!normals_ids[aposDocId]) {
                normals_ids[aposDocId] = [{ locale, title }];
            } else {
                normals_ids[aposDocId].push({ locale, title })
            }

        })
    }
    return { ids_per_locale, normals_ids };
}   

export const group_articles_bases_on_title = (mapper, pieces) => {
    const group = [];
    mapper.forEach((a) => {
        const grouped = [];
        for(const locale in a) {
            const title = a[locale];
            if (title !== "-") {
                const region = pieces[locale];
                const article = region.find((a) => a.title === title);
                if (article) grouped.push(article)
            }
        }
        group.push(grouped);
    })
    data_saver("article_group", "article_group", "all", group)
    return group;
}
