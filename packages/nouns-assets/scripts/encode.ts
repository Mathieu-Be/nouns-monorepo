import { PNGCollectionEncoder, PngImage } from '@nouns/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { readPngImage } from './utils';

const DESTINATION = path.join(__dirname, '../src/image-data.json');

const encode = async () => {
  const encoder = new PNGCollectionEncoder();

  const partfolders = [
    '0-background',
    '1-body',
    '2-shoes',
    '3-pants',
    '4-shirt',
    '5-beard',
    '6-hair_cap_head',
    '7-eye_accessory',
    '8-accessories',
    '9-specials',
    '10-uniques',
  ];

  const brotherhoodfolders = [
    'Academics',
    'Athletes',
    'Creatives',
    'Gentlemans',
    'Magical Beings',
    'Military',
    'Musicians',
    'Outlaws',
    'Religious',
    'Superheros',
  ];

  for (const folder of partfolders) {
    const folderpath = path.join(__dirname, '../images', folder);

    if (folder == '9-specials') {
      for (const subfolder of brotherhoodfolders) {
        const subfolderpath = path.join(folderpath, subfolder);
        const files = await fs.readdir(subfolderpath);

        for (const file of files.filter(file => file !== '.DS_Store')) {
          const image = await readPngImage(path.join(subfolderpath, file));
          encoder.encodeImage(
            file.replace(/\.png$/, ''),
            subfolder,
            image,
            folder.replace(/^\d-/, ''),
          );
        }
      }
    } else {
      const files = await fs.readdir(folderpath);

      for (const file of files.filter(file => file !== '.DS_Store')) {
        const image = await readPngImage(path.join(folderpath, file));

        encoder.encodeImage(file.replace(/\.png$/, ''), 'None', image, folder.replace(/^\d-/, ''));
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
