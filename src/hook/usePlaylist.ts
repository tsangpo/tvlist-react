import { useEffect, useState } from 'react';

import { parse, Playlist } from '../lib/m3u-parser';

const allPlaylists = parse(`#EXTM3U
#EXTINF:-1 ,iptv-org 除成人内容以外的已知频道
https://iptv-org.github.io/iptv/index.m3u
#EXTINF:-1 ,国内电视台直播源
https://raw.githubusercontent.com/imDazui/Tvlist-awesome-m3u-m3u8/master/m3u/%E5%9B%BD%E5%86%85%E7%94%B5%E8%A7%86%E5%8F%B02022-7.m3u
#EXTINF:-1 ,国外电视台直播源
https://raw.githubusercontent.com/imDazui/Tvlist-awesome-m3u-m3u8/master/m3u/%E5%9B%BD%E5%A4%96%E7%94%B5%E8%A7%86%E5%8F%B02022-7.m3u
`).items;

export function usePlaylist() {
  const [selectedPlaylist, selectePlaylist] = useState(allPlaylists[0]);
  const [data, setData] = useState<Playlist | null>(null);

  useEffect(() => {
    setData(null);
    loadPlaylist(selectedPlaylist.url).then(setData);
  }, [selectedPlaylist.url]);

  return {
    allPlaylists,
    selectedPlaylist,
    selectePlaylist,
    data,
  };
}

async function loadPlaylist(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  return parse(text);
}
