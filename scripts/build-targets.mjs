import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('public/manifest.json', 'utf8'));

for (const target of ['chrome', 'firefox']) {
  const out = `dist-${target}`;
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await cp('dist', out, { recursive: true });

  if (target === 'firefox') {
    const firefoxManifest = {
      ...manifest,
      background: {
        scripts: ['background.js'],
      },
      browser_specific_settings: {
        gecko: {
          id: 'my-health@ashokri.com',
          data_collection_permissions: {
            required: ['none'],
          },
        },
      },
    };

    await writeFile(
      `${out}/manifest.json`,
      `${JSON.stringify(firefoxManifest, null, 2)}\n`,
    );
  }
}
