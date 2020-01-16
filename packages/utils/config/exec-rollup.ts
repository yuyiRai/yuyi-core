import gulp from 'gulp';
import cached from 'gulp-cached'
import { castArray } from 'lodash';
import { watch, InputOptions, OutputOptions, rollup, RollupBuild, RollupCache } from 'rollup';
import Config, { Cache } from './rollup.config';

const runner = async (config: typeof Config, init = true) => {
  const resList: ({
    res: Promise<RollupBuild>,
    config: InputOptions & {
      output: OutputOptions | OutputOptions[];
    };
    complieCache: Cache<RollupCache>;
  })[] = [];
  for (const { complieCache, ...option } of config) {
    resList.push({
      res: rollup(option),
      config: option,
      complieCache
    });
  }
  for (const { res, config, complieCache } of resList) {
    const generater = castArray(config.output).map(async output => {
      const build = (await res);
      Object.assign(complieCache.cache, build.cache);
      return build.write({
        ...output,
        banner: '/* @yuyi919/utils */'
      })
    });
    for await (const r of generater) {
    }
  }
  config.nameCache.write();
  // console.log('write', nameCache)
  if (init && process.argv.includes('-w')) {
    watch([]).addListener("end", (d) => {
      console.log('end', d);
    })
    console.log(`Watching for file changes`);
    gulp.watch('lib/**/*', { delay: 1000 }, async () => {
      gulp.src("lib/**").pipe(
        cached("lib", { optimizeMemory: true })
      ).on("end", async (r) => {
        console.log(r)
      });
      console.log(`File change detected. Starting incremental compilation`);
      await runner(config, false);
      console.log(`Watching for file changes`);
    });
  }
};

runner(Config, true);
