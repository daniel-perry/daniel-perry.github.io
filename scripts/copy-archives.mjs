import { cp, lstat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';

export const archiveRoots = [
  'blog', 'class', 'undergrad', 'presentations', 'pubs',
  'css', 'js', 'images', 'img', 'notes.html', 'presentations.html', '404.html',
];

export function includeArchive(path) {
  const normalized = path.split(sep).join('/');
  if (normalized === 'undergrad/resume' || normalized.startsWith('undergrad/resume/')) return false;
  return !normalized.split('/').some((part) =>
    part.startsWith('.') || part.endsWith('~') || /\.(swp|swo|bak)$/i.test(part));
}

for (const root of archiveRoots) {
  const destination = resolve('dist', root);
  try {
    await lstat(destination);
    throw new Error(`Archive would overwrite generated output: ${root}`);
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
  }
  await cp(resolve(root), destination, {
    recursive: true,
    errorOnExist: true,
    force: false,
    filter: (source) => includeArchive(relative(resolve('.'), source)),
  });
}
console.log('Preserved legacy archives; historical resume directory withheld for privacy review.');
