'use strict';

const path = require('path');
const mkdirp = require('make-dir');
const pEachSeries = require('p-each-series');
// ora 模块显示loading
const ora = require('ora');
const fs = require('fs');
const handlebars = require('handlebars');
const globby = require('globby');
const execa = require('execa');

const templateBlacklist = new Set([
	'public/favicon.ico'
]);

module.exports = async (info) => {
	const {
		manager,
		template,
		name,
		templatePath
	} = info;

	if (!name) {
		throw new Error('invalid input; you must pass a valid project name');
		process.exit(1);
	}

	// 处理包名作用域
	const parts = name.split('/');
	info.shortName = parts[parts.length - 1];

	const dest = path.join(process.cwd(), info.shortName);
	info.dest = dest;
	// 在当前目录下创建目录（info.shortName）
	await mkdirp(dest);

	const source = template === 'custom'
		? path.join(process.cwd(), templatePath)
		: path.join(__dirname, '..', 'template', template);
	const files = await globby(source, {
		dot: true
	});

	{
		const promise = pEachSeries(files, async (file) => {
			return module.exports.copyTemplateFile({
				file,
				source,
				dest,
				info
			})
		})
		ora.promise(promise, `Copying ${template} template to ${dest}`)
		await promise
	}

	{
		const promise = module.exports.initProjectManager({ dest, info })
		ora.promise(promise, `Running ${manager} install`)
		await promise
	}


	return dest;
}

module.exports.copyTemplateFile = async (opts) => {
	const {
		file,
		source,
		dest,
		info
	} = opts;

	const fileRelativePath = path.relative(source, file);
	const destFilePath = path.join(dest, fileRelativePath);
	const destFileDir = path.parse(destFilePath).dir;

	await mkdirp(destFileDir);
	if (fileRelativePath.includes('package.json')) {
		const content = fs.readFileSync(file, 'utf8');
		const newCon = JSON.parse(content);
		newCon.name = info.name;
		newCon.description = info.description;
		newCon.author = info.author;
		fs.writeFileSync(destFilePath, JSON.stringify(newCon));
	} else if (info.template === 'custom' || templateBlacklist.has(fileRelativePath)) {
		const content = fs.readFileSync(file);
		fs.writeFileSync(destFilePath, content);
	} else {
		const template = handlebars.compile(fs.readFileSync(file, 'utf8'));
		const content = template({
			...info,
			yarn: (info.manager === 'yarn')
		});

		fs.writeFileSync(destFilePath, content, 'utf8');
	}

	return fileRelativePath;
}

module.exports.initProjectManager = async (opts) => {
	const {
		dest,
		info
	} = opts;


	const commands = [
		{
			cmd: `${info.manager} install`,
			cwd: dest
		},
	];

	return pEachSeries(commands, async ({ cmd, cwd }) => {
		return execa.shell(cmd, { cwd })
	})
}