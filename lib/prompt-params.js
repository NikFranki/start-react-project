'use strict';

const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const config = require('./config');

module.exports = async (opts) => {

	if (opts.skipPrompts) {
		if (!opts.name) {
			throw new Error('invalid input; you must pass a project name with --skip-prompts');
		}

		return opts;
	}

	const info = await inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'Project Name',
			default: opts.name
		},
		{
			type: 'input',
			name: 'description',
			message: 'Project Description',
			default: opts.description
		},
		{
			type: 'input',
			name: 'author',
			message: 'Author',
			default: opts.author
		},
		{
			type: 'list',
			name: 'manager',
			message: 'Project Manager',
			choices: ['npm', 'yarn'],
			default: opts.manager
		},
		{
			type: 'list',
			name: 'template',
			message: 'Template',
			choices: ['default', 'typescript', 'custom'],
			default: opts.template
		},
		{
			type: 'input',
			name: 'templatePath',
			message: 'Template Path',
			default: opts.templatePath,
			when: ({ template }) => template === 'custom',
			validate: input => new Promise(resolve => {
				const fullPath = path.resolve(process.cwd(), input);
				fs.stat(fullPath, (err, stats) => {
					if (err) {
						return resolve(`Cannot resolve directory at: ${fullPath}`);
					}
					resolve(true);
				})
			})
		}
	]);

	config.set('author', info.author);
	config.set('template', info.template);

	return {
		...info
	}
}