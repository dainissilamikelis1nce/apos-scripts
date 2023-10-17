import axios  from "axios";

export const resolveURL = async(url, set404) => {
	try {
	  const response = await axios.get(url, {
		maxRedirects: 0,
		validateStatus: null,
		followRedirect: false
	  });
  

	  if (response.status >= 300 && response.status < 400) {
		const resolvedURL = response.headers.location;
		if (resolvedURL.startsWith("/")) {
			const resp = await this.resolveURL_different(url);
			return resp
		}
		return resolvedURL; 
	}
	else if (response.status > 400) {
		set404[url] = response.status;
	} else {

		const { request: { path, host } } = response;
	    return `https://${host}${path}`
	}
	} catch (error) {
	  console.error(`Error resolving URL for ${url}: ${error.message}`);
	}
}
  
export const resolveURL_different = async(url) => {
	try {
	  const response = await axios.get(url, {
		maxRedirects: 10,
		validateStatus: null,
		followRedirect: false
	  });
	  
	  if (response.status >= 300 && response.status < 400) {
		const resolvedURL = response.headers.location;
		return resolvedURL; 
	 } else {
		const { request: { path, host } } = response;
		return `https://${host}${path}`
	}
	} catch (error) {
	  console.error(`Error resolving URL for ${url}: ${error.message}`);
	}
}

export const localize_and_purge_urls = (urls, toLocale) => {
	const localized_urls = {};
	Object.keys(urls).forEach((k) => {
		const value = urls[k];
		// purge all records that are not 1nce.com e.g. to value are some redirects
		if (!value.includes("1nce.com")) return;
		const split = value.split("1nce.com");
		// check if subdomain
		if (split[0].includes(".")) {
			const check_if_www = split[0].split("//")[1].includes("www");
			if (!check_if_www) {
				return;
			}
		}
		// replace locale 
		// split by / to find [0] element which should be locale, and clean empty strings
		const locale_split = split[1].split("/").filter(s => s);
		locale_split[0] = toLocale
		const new_url = locale_split.join("/")
		localized_urls[k] = `https://1nce.com/${new_url}`
	})
	return localized_urls;
}
  
