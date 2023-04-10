#!npx ts-node
import { kebabCase } from 'lodash';
import path from 'path';
import { error__, info__ } from './utils/message';
import pascalCase from './utils/pascal-case';
import writeContentToFile from './utils/write-content-to-file';

const SRC_DIR = path.resolve(__dirname, '../src');
const LAYOUT_DIR = path.resolve(SRC_DIR, 'components/layouts');

async function main() {
  // extract name from args
  const name = process.argv[2];

  if (!name) error__('Usage: \n\t make-layout <name>');

  // sanitize name for component and path
  const resolvedName = name.toLowerCase().endsWith('layout')
    ? name
    : `${name}-layout`;
  const componentName = pascalCase(resolvedName);
  const fileName = kebabCase(componentName);
  const filePath = path.resolve(LAYOUT_DIR, `${fileName}/index.tsx`);

  // write layout template to file
  await writeContentToFile(
    filePath,
    `
import React from 'react';
import Page from '~/components/shared/page';

type ${componentName}Props = React.PropsWithChildren<unknown>;

function ${componentName}({ children }: ${componentName}Props) {
  return <Page>{children}</Page>;
}

export default ${componentName};`.trimStart()
  );

  info__(`${resolvedName} generated`);
}

void main();
