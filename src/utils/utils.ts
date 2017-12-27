
export function removeTrailingSlash(path: string): string {
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  if (path.startsWith('/')) {
    path = path.substring(1);
  }

  return path;
}

export function joinPath(...path: string[]): string {
  return path.map(p => removeTrailingSlash(p))
    .filter(p => !!p)
    .join('/');
}
