// 可以自动的解析命令和参数，用于处理用户输入的命令
import { Command } from 'commander';
// 下载文件
import download from 'download-git-repo';
// 通用的命令行用户界面集合，用于和用户进行交互
import inquirer from 'inquirer';
import fs from 'fs';
// handlebars语法处理
import handlebars from 'handlebars';
import ora from 'ora';
// 图标
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
      // 下载模版 第一个参数：github:owner/repoName 第二个参数：模板放置的文件夹
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