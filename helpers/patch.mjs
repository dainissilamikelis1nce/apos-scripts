export const flatten_obj = (obj, prefix = '') => {
	let flattened = {};
	for (let key in obj) {
	  if (obj.hasOwnProperty(key)) {
		let value = obj[key];
		let prefixedKey = prefix ? `${prefix}.${key}` : key;
  
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		  let nested =  flatten_obj(value, prefixedKey);
  
		  for (let nestedKey in nested) {
			if (nested.hasOwnProperty(nestedKey)) {
			  flattened[nestedKey] = nested[nestedKey];
			}
		  }
		} else if (Array.isArray(value)) {
		  if (value.length === 0) {
			flattened[prefixedKey] = [];
		  } else {
			for (let i = 0; i < value.length; i++) {
			  let arrayKey = `${prefixedKey}.${i}`;
			  let arrayValue = value[i];
  
			  if (typeof arrayValue === 'object' && arrayValue !== null) {
				let nestedArray = flatten_obj(arrayValue, arrayKey);
  
				for (let nestedKey in nestedArray) {
				  if (nestedArray.hasOwnProperty(nestedKey)) {
					flattened[nestedKey] = nestedArray[nestedKey];
				  }
				}
			  } else {
				flattened[arrayKey] = arrayValue;
			  }
			}
		  }
		} else {
		  flattened[prefixedKey] = value;
		}
	  }
	}
	return flattened;
  }

export const create_patch_map = (oldpiece, newpiece, force_keys = []) => {
	let change_map = {};
	const flat_old = flatten_obj(oldpiece);
	const flat_new = flatten_obj(newpiece);
	const force = force_keys.length > 0;

	Object.keys(flat_old).forEach((k) => {
		const val1 = flat_old[k];
		const val2 = flat_new[k];

		if (val1 !== val2) {
			change_map[k] = flat_new[k]
		}
	})

	if (force) {
		const force_map = {};
		force_keys.forEach((k) => {
			force_map[k] = `${change_map[k]}`
		})
		change_map = force_map;
	}

	return change_map;

}