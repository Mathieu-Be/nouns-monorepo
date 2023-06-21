import { PNGCollectionEncoder } from '@nouns/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { readPngImage } from './utils';

const DESTINATION_1 = path.join(__dirname, '../src/hundreds-data-1.json');
const DESTINATION_2 = path.join(__dirname, '../src/hundreds-data-2.json');

const MIDDLE_INDEX = 54;

const encode = async () => {
  const folderpath = path.join(__dirname, '../images/0-hundreds');
  const files = await fs.readdir(folderpath);

  // Get the first 50 images
  const encoder_1 = new PNGCollectionEncoder(0);

  for (const file of files.filter((file, index) => file !== '.DS_Store' && index < MIDDLE_INDEX)) {
    const image = await readPngImage(path.join(folderpath, file));

    encoder_1.encodeImage(file.replace(/\.png$/, ''), 'none', image, 'hundreds');
  }

  console.log(`Palette has ${encoder_1.data.palette.length} colors`);
  console.log(`Data has ${encoder_1.data.images.hundreds.length} smol joes`);

  await fs.writeFile(
    DESTINATION_1,
    JSON.stringify(
      {
        ...encoder_1.data,
      },
      null,
      2,
    ),
  );

  // Get the remaining images
  const encoder_2 = new PNGCollectionEncoder(1);

  for (const file of files.filter((file, index) => file !== '.DS_Store' && index >= MIDDLE_INDEX)) {
    const image = await readPngImage(path.join(folderpath, file));

    encoder_2.encodeImage(file.replace(/\.png$/, ''), 'none', image, 'hundreds');
  }

  console.log(`Palette has ${encoder_2.data.palette.length} colors`);
  console.log(`Data has ${encoder_2.data.images.hundreds.length} smol joes`);

  await fs.writeFile(
    DESTINATION_2,
    JSON.stringify(
      {
        ...encoder_2.data,
      },
      null,
      2,
    ),
  );
};

encode();
