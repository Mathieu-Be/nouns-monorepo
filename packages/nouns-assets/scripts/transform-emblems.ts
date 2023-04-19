import { promises as fs } from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import { rgbToHex } from '@nouns/sdk/src/image/utils';

const EMBLEMS_IMAGES_PATH = path.join(__dirname, '../images/11-emblems/png');

const PIXEL_HEIGHTS: Map<string, number> = new Map([
  ['Athletes.png', 8],
  ['Academics.png', 6],
  ['Creatives.png', 6],
  ['Gentlemen.png', 1],
  ['Heroes.png', 1],
  ['Magic.png', 1],
  ['Musicians.png', 1],
  ['Outlaws.png', 10],
  ['Warriors.png', 10],
  ['Worship.png', 6],
]);

const OFFSETS: Map<string, number> = new Map([
  ['Athletes.png', 4],
  ['Academics.png', 0],
  ['Creatives.png', 3],
  ['Gentlemen.png', 0],
  ['Heroes.png', 0],
  ['Magic.png', 0],
  ['Musicians.png', 0],
  ['Outlaws.png', 6],
  ['Warriors.png', 6],
  ['Worship.png', 5],
]);

const transformEmblems = async () => {
  const files = await fs.readdir(EMBLEMS_IMAGES_PATH);

  for (const file of files.filter(file => file !== '.DS_Store')) {
    const buffer = await fs.readFile(path.join(EMBLEMS_IMAGES_PATH, file));
    const png = PNG.sync.read(buffer);

    const pixelHeight = PIXEL_HEIGHTS.get(file) ?? 1;
    const offset = OFFSETS.get(file) ?? 0;

    const rectangles = [];
    let currentRectangle = {
      x: 0,
      y: 0,
      width: 1,
      height: pixelHeight,
      color: '',
    };

    for (let y = offset; y < 900; y += pixelHeight) {
      for (let x = 0; x < 900; x++) {
        const { r, g, b } = colorAt(png, x, y);

        if (r !== 255) {
          const color = rgbToHex(r, g, b);

          if (currentRectangle.x === 0) {
            currentRectangle.x = x;
            currentRectangle.y = y;
            currentRectangle.width = 1;
            currentRectangle.height = pixelHeight;
            currentRectangle.color = color;
          } else if (color !== currentRectangle.color) {
            rectangles.push(currentRectangle);
            currentRectangle = {
              x,
              y,
              width: 1,
              height: pixelHeight,
              color,
            };
          } else {
            currentRectangle.width += 1;
          }
        } else {
          if (currentRectangle.x !== 0) {
            rectangles.push(currentRectangle);
            currentRectangle = {
              x: 0,
              y: 0,
              width: 1,
              height: pixelHeight,
              color: '',
            };
          }
        }
      }
    }

    console.log('\n' + file + '\n');

    rectangles.forEach(rectangle => {
      console.log(
        `<rect width="${rectangle.width}" height="${rectangle.height}" x="${rectangle.x}" y="${rectangle.y}"  fill="#${rectangle.color}" />`,
      );
    });
  }
};

transformEmblems();

// House emblems images are in black and white so we only care about the one channel
const colorAt = (png: PNG, x: number, y: number) => {
  const idx = (png.width * y + x) << 2;
  return {
    r: png.data[idx],
    g: png.data[idx + 1],
    b: png.data[idx + 2],
  };
};
