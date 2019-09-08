'use strict';

const config = require('./config');

module.exports = async () => {
	const defaults = {
		name: '',
		description: '',
		author: config.get('author'),
		manager: config.get('manager', 'npm'),
		template: config.get('template', 'default')
	};

	return defaults;
}