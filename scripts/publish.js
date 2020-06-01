import colors from 'colors';
import shell from 'shelljs';
console.log(colors.yellow('welcome') + " " + colors.cyan('publish!'));
shell.exec('yarn commit && lerna publish');
process.exit();
//# sourceMappingURL=publish.js.map