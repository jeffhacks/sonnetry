#! /usr/bin/env node

const fs = require('fs');
const yargs = require('yargs')
const { Sonnet } = require('../src/index.js');

const sonnetry = new Sonnet({
	renderPath: './render',
	cleanBeforeRender: true
});

(async () => {

	await sonnetry.auth();

	yargs
		.usage("Syntax: $0 <command> [options]")
		.command("*", "There's no harmony in that", (yargs) => {
			yargs
		}, (argv) => {
			console.log("[~] There's no harmony in that. (Unrecognized command)");
		})
		.command("apply <filename>", "Generates and applies a configuration", (yargs) => {
			return yargs.positional('filename', {
				describe: 'Jsonnet configuration file to consume'
			}).option('auto-approve', {
				alias: 'y',
				type: 'boolean',
				description: 'Skip the apply confirmation. Yolo.'
			}).option('skip-init', {
				alias: 's',
				type: 'boolean',
				description: 'Skip provider initialization.'
			});
		}, async (argv) => {

			console.log(`[+] Evaluating ${argv.filename} into ./render/`);

			await sonnetry.render(argv.filename)
			sonnetry.write();

			sonnetry.apply(argv.skipInit, argv.autoApprove);
			
		})
		.command("generate <filename>", "Generates files from a configuration", (yargs) => {
			yargs.positional('filename', {
				describe: 'Jsonnet configuration file to consume'
			})
		}, (argv) => {
			
		})
		.showHelpOnFail(false)
		.help("help")
		.argv;
})();