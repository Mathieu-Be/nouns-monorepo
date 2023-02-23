import { PNGCollectionEncoder, PngImage } from '@nouns/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { readPngImage } from './utils';

const DESTINATION = path.join(__dirname, '../src/image-data.json');

const encode = async () => {
  const encoder = new PNGCollectionEncoder();

  const partfolders = [
    '1-bodies',
    '2-pants',
    '3-shoes',
    '4-shirts',
    '5-beards',
    '6-heads',
    '7-eyes',
    '8-accessories',
  ];

  for (const folder of partfolders) {
    const folderpath = path.join(__dirname, '../images', folder);
    const files = await fs.readdir(folderpath);
    for (const file of files) {
      const image = await readPngImage(path.join(folderpath, file));
      encoder.encodeImage(file.replace(/\.png$/, ''), image, folder.replace(/^\d-/, ''));
    }
  }
  await fs.writeFile(
    DESTINATION,
    JSON.stringify(
      {
        bgcolors: ['E2D8CB', '7D97AF', '92C6AE'],
        ...encoder.data,
      },
      null,
      2,
    ),
  );
};

encode();
