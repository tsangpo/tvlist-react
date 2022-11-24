type ItemInf = {
  name: string;
  duration: number;
  attributes: Record<string, string>;
};
export type Item = {
  url: string;
  inf?: ItemInf;
  grp?: string;
  vlcopt?: Record<string, string>;
};
export type Playlist = {
  header: Record<string, string>;
  items: Item[];
};

export function parse(content: string) {
  const lines = content.split('\n');
  const firstLine = lines.shift();
  if (!firstLine || !firstLine.startsWith('#EXTM3U')) {
    throw new Error('Playlist is not valid');
  }

  const header = parseEXTM3U(firstLine.substring('#EXTM3U'.length));
  const items = [];
  let item: Item = { url: '' };
  for (const line of lines) {
    if (line.startsWith('#')) {
      const [derective, raw] = parseDerective(line);
      switch (derective) {
        case 'EXTINF':
          item.inf = parseEXTINF(raw);
          break;
        case 'EXTGRP':
          item.grp = raw.trim();
          break;
        case 'EXTVLCOPT':
          const [key, value] = raw.split('=');
          item.vlcopt ??= {};
          item.vlcopt[key] = value;
          break;
      }
    } else if (line) {
      item.url = line.trim();
      items.push(item);
      item = { url: '' };
    }
  }

  return { header, items };
}

function parseDerective(line: string) {
  const i = line.indexOf(':');
  const derective = line.substring(1, i);
  const raw = line.substring(i + 1);
  return [derective, raw];
}

function parseEXTM3U(line: string): Record<string, string> {
  if (!line.trim()) return {};

  return Object.fromEntries(
    line
      .trim()
      .concat(' ')
      .split('" ')
      .filter((s) => s)
      .map((attr) => attr.split('="'))
  );
}

function parseEXTINF(line: string): ItemInf {
  const firstSpaceIndex = line.indexOf(' ');
  const lastCommaIndex = line.lastIndexOf(',');

  const duration = Number(line.substring(0, firstSpaceIndex));
  const name = line.substring(lastCommaIndex + 1);
  const attrRaw = line.substring(firstSpaceIndex + 1, lastCommaIndex).trim();

  const attributes = !attrRaw
    ? {}
    : Object.fromEntries(
        attrRaw
          .concat(' ')
          .split('" ')
          .filter((s) => s)
          .map((attr) => attr.split('="'))
      );

  return {
    name,
    duration,
    attributes,
  };
}
