import axios from "axios";

const { username, password, host, token, apiKey } = process.env

export const axios_wrapper = async(method, route, body, mimeType) => {
	let config = {
		method,
		url: route,
		headers: { "Authorization": `Bearer ${token}` }
	}
	if (body) {
		if (!mimeType) mimeType = "application/json";
		config = { ...config, data: body, headers: {
			...config.headers,
			'content-type': mimeType
		}}
	}
	try {	
		const resp = await axios(config);
		const data = resp.data;
		return data;
	} catch(err) {
		const a = { method, route, body };
		debugger;
	}
}

export const login = async() => {
	const route = `${host}/api/v1/@apostrophecms/login/login`
	const data = JSON.stringify({
		username,
		password
	});
	const headers = {
		"content-type": "application/json",
		"Authorization": `apiKey ${apiKey}`
	}
	try {
		const resp = await axios({
			method: "post",
			url: route,
			data,
			headers,
		  });
		return resp.data.token
	} catch(err) {
		debugger;
		return;
	}
}

