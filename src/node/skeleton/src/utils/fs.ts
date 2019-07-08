import {
  copyFile,
  copyFileSync,
  ensureFile,
  ensureFileSync,
  existsSync,
  readFile,
  readFileSync,
  Stats,
  statSync,
  writeFile,
  writeFileSync,
} from 'fs-extra';
import { CF, ICO } from '../types';
import { isFunc } from './assert';

export const read = (
  file: string,
  options?: { flag?: string; } | { encoding: string; flag?: string; },
  callback?: CF,
) => {
  options = options || { encoding: 'utf-8' };
  if (isFunc(callback)) {
    return readFile(file, options, callback);
  }
  return readFileSync(file, options);
};

export const copy = (
  src: string,
  dest: string,
  flag?: number,
  callback?: CF,
) => {
  flag = flag || 0;
  if (isFunc(callback)) {
    return copyFile(src, dest, flag, callback);
  }
  return copyFileSync(src, dest, flag);
};

export const write = (
  file: string,
  data: string,
  options?: { flag?: string; } | { encoding: string; flag?: string; },
  callback?: CF,
) => {
  options = options || { encoding: 'utf-8' };
  if (isFunc(callback)) {
    return writeFile(file, data, options, callback);
  }
  return writeFileSync(file, data, options);
};

export const ensure = (
  file: string,
  callback?: CF,
) => {
  if (isFunc(callback)) {
    return ensureFile(file, callback);
  }
  return ensureFileSync(file);
};

export const exists = (file: string, callback?: CF) => {
  if (isFunc(callback)) {
    throw new Error('`fs.exists` is already deprecated');
  }
  return existsSync(file);
};

export const state = (path: string): Stats => {
  return statSync(path);
};
