import { PNGCollectionEncoder } from '@nouns/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { readPngImage } from './utils';

const DESTINATION = path.join(__dirname, '../src/image-data.json');

const partfolders = [
  '0-hundreds',
  '1-luminaries',
  '2-backgrounds',
  '3-bodies',
  '4-shoes',
  '5-pants',
  '6-shirts',
  '7-beards',
  '8-hairs_caps_heads',
  '9-eye_accessories',
  '10-accessories',
  '11-emblems',
];

const brotherhoodfolders = [
  'academics',
  'athletes',
  'creatives',
  'gentlemen',
  'heroes',
  'magic',
  'musicians',
  'outlaws',
  'warriors',
  'worship',
];

const encode = async () => {
  const encoder = new PNGCollectionEncoder();

  for (const folder of partfolders) {
    const folderpath = path.join(__dirname, '../images', folder);

    // The Hundreds are not in brotherhood folders
    if (folder == '0-hundreds') {
      const files = await fs.readdir(folderpath);

      for (const file of files.filter(file => file !== '.DS_Store')) {
        const image = await readPngImage(path.join(folderpath, file));

        encoder.encodeImage(
          file.replace(/\.png$/, ''),
          'None',
          image,
          folder.replace(/^\d{1,2}-/, ''),
        );
      }
    } else {
      for (const subfolder of brotherhoodfolders) {
        const subfolderpath = path.join(folderpath, subfolder);
        const files = await fs.readdir(subfolderpath);

        for (const file of files.filter(file => file !== '.DS_Store')) {
          const image = await readPngImage(path.join(subfolderpath, file));
          encoder.encodeImage(
            file.replace(/\.png$/, ''),
            subfolder,
            image,
            folder.replace(/^\d{1,2}-/, ''),
          );
        }
      }
    }
  }

  await fs.writeFile(
    DESTINATION,
    JSON.stringify(
      {
        ...encoder.data,
      },
      null,
      2,
    ),
  );
};

encode();
