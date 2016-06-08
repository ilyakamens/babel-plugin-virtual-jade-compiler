/* global process */

import fs from 'fs';
import { dirname, isAbsolute, resolve } from 'path';
import virtualJade from 'virtual-jade';

const fileExists = filename => {
  try {
    const stats = fs.statSync(filename);
    return stats.isFile(filename);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw Error(e);
    }
  }
};

const compileJadeFile = (jsFile, jadeFile) => {
  // try to resolve as file path
  const from = resolveModulePath(jsFile);
  let path = resolve(from, jadeFile);
  if (!fileExists(path)) {
    // try to resolve from node modules
    path = resolve('./node_modules', jadeFile);
  }

  if (!fileExists(path)) {
    throw Error('Cannot find jade file: ' + jadeFile);
  }

  const jadeContent = fs.readFileSync(path, 'utf8');
  return virtualJade(jadeContent);
};

const resolveModulePath = (filename) => {
  const dir = dirname(filename);
  if (isAbsolute(dir)) return dir;
  if (process.env.PWD) return resolve(process.env.PWD, dir);
  return resolve(dir);
};

export default ({types: t}) => {
  return {
    visitor: {
      ImportDeclaration: (path, state) => {
        const node = path.node;
        if (node && node.source && node.source.value && node.source.type === 'StringLiteral' && node.source.value.endsWith('.jade')) {
          const jsFile = state.file.opts.filename;
          const jadeFile = node.source.value;
          const virtualJade = compileJadeFile(jsFile, jadeFile);
          const id = node.specifiers[0].local.name;
          path.replaceWith(t.variableDeclaration('var', [t.variableDeclarator(t.identifier(id), t.stringLiteral(virtualJade))]));
        }
      },
    },
  };
};
