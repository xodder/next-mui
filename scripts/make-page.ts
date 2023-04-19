#!npx ts-node
import { exec } from 'child_process';
import { kebabCase, startCase } from 'lodash';
import path from 'path';
import fileExists from './utils/file-exists';
import { error__, info__ } from './utils/message';
import pascalCase from './utils/pascal-case';
import writeContentToFile from './utils/write-content-to-file';

const SRC_DIR = path.resolve(__dirname, '../src');
const PAGES_DIR = path.resolve(SRC_DIR, 'pages');
const IMPLS_DIR = path.resolve(SRC_DIR, 'components/impls');
const PATH_SEP = /[\\\\/]/g;
const IMPORT_PREFIX = '~/';

const shouldOpenInEditor = false;

async function main() {
  const page = getPageData(parsePageArgs());

  // handle page generation
  if (await fileExists(page.defFilePath)) {
    info__('Seems page already exists');
  } else {
    await writeContentToFile(
      page.defFilePath,
      `
import ${page.componentName}PageImpl from '${IMPORT_PREFIX}components/impls/${page.implPath}';

function ${page.componentName}Page() {
  return <${page.componentName}PageImpl />;
}

export default ${page.componentName}Page;
`.trimStart()
    );

    info__('Page generated');
  }

  // handle page impl generation
  if (await fileExists(page.implFilePath)) {
    info__('Seems page impl already exists');
  } else {
    await writeContentToFile(
      page.implFilePath,
      `
import React from 'react';
import PageSEO from '${IMPORT_PREFIX}components/shared/page-seo';

function ${page.componentName}PageImpl() {
  return (
    <React.Fragment>
      <PageSEO title="${page.title}" />
    </React.Fragment>
  );
}

export default ${page.componentName}PageImpl;
`.trimStart()
    );

    info__('Page Impl generated');

    if (shouldOpenInEditor) {
      info__('Opening Page Impl in vscode');

      openInCodeIfPossible(page.implFilePath);
    }
  }
}

type PageArgs = { name: string; path: string };

// make-page path [-n <name>]
function parsePageArgs(): PageArgs {
  if (process.argv.length < 3) {
    const prog = path.parse(process.argv[1]);
    error__(`Usage: \n\t${prog.name} path [-n <name>]`);
  }

  const args: PageArgs = { path: '', name: '' };
  const params = process.argv.slice(2);

  let cursor = 0;

  while (cursor < params.length) {
    const param = params[cursor];

    if (param === '-n') {
      if (cursor + 1 >= params.length) {
        error__('expected -n <name>, got nothing');
      }

      args.name = params[++cursor];
    } else if (!args.path) {
      args.path = param;
    }

    cursor++;
  }

  if (!args.name) {
    const parts = args.path.split(PATH_SEP);

    let name = parts.pop();

    while (!!name && isPageParam(name)) {
      name = parts.pop();
    }

    if (!name) error__('the provided path could not be parsed');

    args.name = name!;
  }

  return args;
}

type PageData = {
  title: string;
  componentName: string;
  defFilePath: string;
  implPath: string;
  implFilePath: string;
};

function getPageData(args: PageArgs): PageData {
  const isRoot = !args.path;
  const resolvedName = kebabCase(args.name);

  let defFilePath = '';
  let implPath = '';
  let implFilePath = '';

  if (isRoot) {
    defFilePath = path.resolve(PAGES_DIR, 'index.tsx');
    implPath = resolvedName;
    implFilePath = path.resolve(IMPLS_DIR, `${implPath}/index.tsx`);
  } else {
    const pathParts = args.path
      .split(PATH_SEP)
      .map((x) => (isPageParam(x) ? x : kebabCase(x)));

    const pagePath = pathParts.join('/');

    defFilePath = path.resolve(PAGES_DIR, `${pagePath}/index.tsx`);

    const lastPathPart = pathParts[pathParts.length - 1];

    if (isPageParam(lastPathPart))
      pathParts[pathParts.length - 1] = resolvedName;

    implPath = pathParts.join('/');
    implFilePath = path.resolve(IMPLS_DIR, `${implPath}/index.tsx`);
  }

  return {
    title: startCase(resolvedName.replace('-', ' ')),
    componentName: pascalCase(resolvedName),
    defFilePath,
    implPath,
    implFilePath,
  };
}

function isPageParam(value: string) {
  return value.startsWith('[');
}

function openInCodeIfPossible(filePath: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const command = `code ${filePath}`;

  exec(command, (error: any) => {
    if (error) {
      error__('Seems vscode is not installed');
    } else {
      info__('Opened');
    }

    process.exit(0);
  });
}

void main();
