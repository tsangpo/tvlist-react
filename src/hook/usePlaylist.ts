import { useEffect, useState } from 'react';

import { Item, parse } from '../lib/m3u-parser';

const builtinPlaylists = parse(`#EXTM3U
#EXTINF:-1 ,国内电视台直播源
https://raw.githubusercontent.com/imDazui/Tvlist-awesome-m3u-m3u8/master/m3u/%E5%9B%BD%E5%86%85%E7%94%B5%E8%A7%86%E5%8F%B02022-7.m3u
#EXTINF:-1 ,国外电视台直播源
https://raw.githubusercontent.com/imDazui/Tvlist-awesome-m3u-m3u8/master/m3u/%E5%9B%BD%E5%A4%96%E7%94%B5%E8%A7%86%E5%8F%B02022-7.m3u
#EXTINF:-1 ,iptv-org 频道
https://iptv-org.github.io/iptv/index.m3u
`).items;

const starPlaylist: Item = {
  url: '',
  inf: { name: 'Starred channels', duration: -1, attributes: {} },
};

export function usePlaylist() {
  const { channels, isStarred, toggleStar } = useLocalPlaylist();
  const [selectedPlaylist, selectePlaylist] = useState(() =>
    channels.length > 0 ? starPlaylist : builtinPlaylists[0]
  );
  const [playlistItems, setPlaylistItems] = useState<Item[] | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Item | null>(() =>
    channels.length > 0 ? channels[0] : null
  );

  useEffect(() => {
    if (!selectedPlaylist.url) {
      // starred channels
      setPlaylistItems(channels);
    } else {
      setPlaylistItems(null);
      loadPlaylist(selectedPlaylist.url).then(setPlaylistItems);
    }
  }, [selectedPlaylist.url]);

  return {
    allPlaylists: [starPlaylist, ...builtinPlaylists],
    selectedPlaylist,
    selectePlaylist,
    playlistItems,
    selectedChannel,
    setSelectedChannel,
    isStarred,
    toggleStar,
  };
}

async function loadPlaylist(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  let items = parse(text).items;
  if (document.location.protocol === 'https') {
    items = items.filter((item) => item.url.startsWith('https://'));
  }
  return items;
}

const KEY_STAR_CHANNELS = 'star-channels';

function useLocalPlaylist() {
  const [channels, setChannels] = useState<Item[]>(() =>
    JSON.parse(localStorage.getItem(KEY_STAR_CHANNELS) || '[]')
  );

  const isStarred = (item: Item) => {
    return channels.findIndex((c) => c.url === item.url) > -1;
  };

  const toggleStar = (item: Item, star: boolean) => {
    const updatedItems = channels.filter((c) => c.url != item.url);
    if (star) {
      updatedItems.unshift(item);
    }
    setChannels(updatedItems);
    localStorage.setItem(KEY_STAR_CHANNELS, JSON.stringify(updatedItems));
  };

  return { channels, isStarred, toggleStar };
}
