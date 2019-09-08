#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');
const { version } = require('../package.json');

const getDefaultParams = require('./default-params');
const createProject = require('./create-project');
const promptParams = require('./prompt-params');

module.exports = async () => {
	const defaults = await getDefaultParams();

	// 命令行设置传入参数
	program
		.name('react-cli')
		.version(version)
		.usage('[options] [project-name]')
		.option('-d, --desc <string>', 'project description')
		.option('-a, --author <string>', 'author', defaults.author)
		.option('-m, --manager <npm|yarn>', 'project manager to use', /^(npm|yarn)$/, defaults.manager)
		.option('-t, --template <default|typescript>', 'project template to use', /^(default|typescript|custom)$/, defaults.template)
		.option('-s, --skip-prompts', 'skip all prompts (must provide project name via cli)')
		.parse(process.argv)

	const opts = {
		description: program.desc,
		author: program.author,
		manager: program.manager,
		template: program.template,
		skipPrompts: program.skipPrompts,
	};

	Object.keys(opts).forEach((key) => {
		if (!opts[key] && defaults[key]) {
			opts[key] = defaults[key];
		}
	})

	if (program.args.length === 1) {
		opts.name = program.args[0];
	} else if (program.args.length > 1) {
		console.error('invalid arguments');
		program.help();
		process.exit(1);
	}

	// 提示参数
	const params = await promptParams(opts);
	// 目标路径
	const dest = await createProject(params);

	console.log(`
		Your module has been created at ${dest}.

		To get started, in one tab, run:

		$ ${chalk.cyan(`cd ${params.shortName} && ${params.manager} start`)}
	`);

	return dest;
}


module.exports().catch(err => {
	console.error(err);
	process.exit(1);
})