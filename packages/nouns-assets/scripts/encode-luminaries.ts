import { PNGCollectionEncoder } from '@nouns/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { readPngImage } from './utils';

const DESTINATION = path.join(__dirname, '../src/luminaries-data.json');

const partfolders = [
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
  const encoder = new PNGCollectionEncoder(2);

  for (const folder of partfolders) {
    const folderpath = path.join(__dirname, '../images', folder);

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

  // Get emblems SVGs
  const emblemFolder = path.join(__dirname, '../images/11-emblems/svg');
  const emblems = [];

  for (const botherhood of brotherhoodfolders) {
    const svg = await fs.readFile(path.join(emblemFolder, `${botherhood}.svg`), 'utf8');

    emblems.push({
      brotherhood: botherhood,
      data: Buffer.from(svg.replace(/\r?\n|\r/g, '')).toString('base64'),
    });
  }

  // Get glowing emblems SVGs
  const glowingEmblemFolder = path.join(__dirname, '../images/12-glowing-emblems/svg');
  const glowingEmblems = [];

  for (const botherhood of brotherhoodfolders) {
    // const svg = await fs.readFile(path.join(glowingEmblemFolder, `Worship.svg`), 'utf8');
    const svg = await fs.readFile(path.join(glowingEmblemFolder, `${botherhood}.svg`), 'utf8');

    glowingEmblems.push({
      brotherhood: botherhood,
      data: Buffer.from(svg.replace(/\r?\n|\r/g, '')).toString('base64'),
    });
  }

  // Get luminaries metadata
  const metadataFolder = path.join(__dirname, '../images/13-luminaries-metadata');
  const metadatas = [];

  for (const botherhood of brotherhoodfolders) {
    const metadataFiles = await fs.readdir(path.join(metadataFolder, botherhood));

    for (const file of metadataFiles) {
      const metadata = await fs.readFile(path.join(metadataFolder, botherhood, file), 'utf8');

      metadatas.push({
        filename: file.replace(/\.json$/, ''),
        brotherhood: botherhood,
        data: metadata,
      });
    }
  }

  console.log(`Palette has ${encoder.data.palette.length} colors`);

  await fs.writeFile(
    DESTINATION,
    JSON.stringify(
      {
        ...encoder.data,
        emblems,
        glowingEmblems,
        metadatas,
      },
      null,
      2,
    ),
  );
};

encode();
