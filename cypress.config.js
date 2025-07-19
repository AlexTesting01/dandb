import { defineConfig } from "cypress";
import fs from 'fs-extra';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';


export default defineConfig({
  e2e: {
    viewportWidth: 2048, 
    viewportHeight: 1152,
    supportFile: false,
    specPattern: 'e2e/**/*.js',
    setupNodeEvents(on, config) {
      on('task', {
        compareScreenshotsTask({ fileName, folderName, threshold }) {
          const expectedPath = path.join(config.projectRoot, 'e2e', 'screenshots', `${fileName}.png`);
          const actualPath = path.join(config.projectRoot, 'cypress', 'screenshots', folderName, 'actual', `${fileName}-actual.png`);
          const diffPath = path.join(config.projectRoot, 'cypress', 'screenshots', folderName, 'diff', `${fileName}-diff.png`);

          if (!fs.existsSync(expectedPath)) {
            throw new Error(`Expected screenshot not found: ${expectedPath}`);
          }
          if (!fs.existsSync(actualPath)) {
            throw new Error(`Actual screenshot not found: ${actualPath}`);
          }

          const expectedImg = PNG.sync.read(fs.readFileSync(expectedPath));
          const actualImg = PNG.sync.read(fs.readFileSync(actualPath));

          if (expectedImg.width !== actualImg.width || expectedImg.height !== actualImg.height) {
            throw new Error('Screenshot dimensions do not match');
          }

          const { width, height } = expectedImg;
          const diffImg = new PNG({ width, height });

          const diffPixels = pixelmatch(
            expectedImg.data,
            actualImg.data,
            diffImg.data,
            width,
            height,
            { threshold: threshold }
          );

          fs.ensureDirSync(path.dirname(diffPath));
          fs.writeFileSync(diffPath, PNG.sync.write(diffImg));

          return diffPixels;
        }
      });
      return config;
    },
  },
});
