import { Command } from 'commander';
import download from 'download-git-repo';
import inquirer from 'inquirer';
import fs from 'fs';
import handlebars from 'handlebars';
import ora from 'ora';
import symbols from 'log-symbols';
import chalk from 'chalk';
// import packages from './package.json'

const program = new Command();
// const version = packages.version || '1.0.0';

program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action((name) => {
    inquirer.prompt([
      { type: 'input', name: 'author', message: '请输入作者名称', default: "shuhuan" },
      { type: 'input', name: 'description', message: '请输入项目描述', default: '' }
    ]).then((answers) => {
      const spinner = ora('正在下载模板...');
      spinner.start();
      const meta = {
        name,
        description: answers.description,
        author: answers.author
      };
      download('github:luchaoet/sh-vite-vue3-project', name, function (err) {
        if (err) {
          spinner.fail();
          console.log(symbols.error, chalk.red(err));
        } else {
          spinner.succeed();
          const fileName = `${name}/package.json`;
          const content = fs.readFileSync(fileName).toString();
          const result = handlebars.compile(content)(meta);
          fs.writeFileSync(fileName, result);
          console.log(symbols.success, chalk.green('下载完成!'));
          console.log('=================');
          console.log(symbols.info, chalk.green(`1. cd ${name}`));
          console.log(symbols.info, chalk.green('2. npm install'));
          console.log(symbols.info, chalk.green('3. npm run dev'));
        }
      })
    })
  });
program.parse(process.argv);