import { describe, expect, it } from 'vitest';

import { parse } from './m3u-parser';

const p1 = `#EXTM3U x-tvg-url="http://example.com/epg.xml.gz"
#EXTINF:-1 tvg-id="cnn.us" tvg-name="CNN" tvg-url="http://195.154.221.171/epg/guide.xml.gz" timeshift="3" catchup="shift" catchup-days="3" catchup-source="https://m3u-server/hls-apple-s4-c494-abcdef.m3u8?utc=325234234&lutc=3123125324" tvg-logo="http://example.com/logo.png" group-title="News",CNN (US)
#EXTGRP:News
#EXTVLCOPT:http-referrer=http://example.com/
#EXTVLCOPT:http-user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5)
http://example.com/stream.m3u8`;

const p2 = `#EXTM3U
#EXTINF:-1 tvg-id="5AABTV.ca" status="error",5AAB TV (720p) [Not 24/7]
http://158.69.124.9:1935/5aabtv/5aabtv/playlist.m3u8
#EXTINF:-1 tvg-id="AmazingDiscoveriesTV.ca" status="online",Amazing Discoveries TV (720p)
https://uni01rtmp.tulix.tv/amazingdtv/amazingdtv/playlist.m3u8
#EXTINF:-1 tvg-id="AzStarTV.ca" status="online",Az Star TV (1080p)
http://live.azstartv.com/azstar/smil:azstar.smil/playlist.m3u8
`;

const p3 = `#EXTM3U
#EXTINF:-1 ,CLARITY4K
https://d3thiix3tzne5u.cloudfront.net/playlist.m3u8
#EXTINF:-1 ,ABC News Live 3
https://abcnews-streams.akamaized.net/hls/live/2023562/abcnews3/master.m3u8
#EXTINF:-1 ,CBSN Baltimore
https://cbsnews.akamaized.net/hls/live/2020607/cbsnlineup_8/master.m3u8
`;

describe('m3u-parser', () => {
  it('parse p1', () => {
    const res = parse(p1);
    expect(res).toEqual({
      header: { 'x-tvg-url': 'http://example.com/epg.xml.gz' },
      items: [
        {
          url: 'http://example.com/stream.m3u8',
          grp: 'News',
          inf: {
            name: 'CNN (US)',
            duration: -1,
            attributes: {
              'tvg-id': 'cnn.us',
              'tvg-name': 'CNN',
              'tvg-url': 'http://195.154.221.171/epg/guide.xml.gz',
              timeshift: '3',
              catchup: 'shift',
              'catchup-days': '3',
              'catchup-source':
                'https://m3u-server/hls-apple-s4-c494-abcdef.m3u8?utc=325234234&lutc=3123125324',
              'tvg-logo': 'http://example.com/logo.png',
              'group-title': 'News',
            },
          },
          vlcopt: {
            'http-referrer': 'http://example.com/',
            'http-user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5)',
          },
        },
      ],
    });
  });

  it('parse p2', () => {
    const res = parse(p2);
    expect(res).toEqual({
      header: {},
      items: [
        {
          url: 'http://158.69.124.9:1935/5aabtv/5aabtv/playlist.m3u8',
          inf: {
            name: '5AAB TV (720p) [Not 24/7]',
            duration: -1,
            attributes: {
              'tvg-id': '5AABTV.ca',
              status: 'error',
            },
          },
        },
        {
          url: 'https://uni01rtmp.tulix.tv/amazingdtv/amazingdtv/playlist.m3u8',
          inf: {
            name: 'Amazing Discoveries TV (720p)',
            duration: -1,
            attributes: {
              'tvg-id': 'AmazingDiscoveriesTV.ca',
              status: 'online',
            },
          },
        },
        {
          url: 'http://live.azstartv.com/azstar/smil:azstar.smil/playlist.m3u8',
          inf: {
            name: 'Az Star TV (1080p)',
            duration: -1,
            attributes: {
              'tvg-id': 'AzStarTV.ca',
              status: 'online',
            },
          },
        },
      ],
    });
  });

  it('parse p3', () => {
    const res = parse(p3);
    expect(res).toEqual({
      header: {},
      items: [
        {
          url: 'https://d3thiix3tzne5u.cloudfront.net/playlist.m3u8',
          inf: {
            name: 'CLARITY4K',
            duration: -1,
            attributes: {},
          },
        },
        {
          url: 'https://abcnews-streams.akamaized.net/hls/live/2023562/abcnews3/master.m3u8',
          inf: {
            name: 'ABC News Live 3',
            duration: -1,
            attributes: {},
          },
        },
        {
          url: 'https://cbsnews.akamaized.net/hls/live/2020607/cbsnlineup_8/master.m3u8',
          inf: {
            name: 'CBSN Baltimore',
            duration: -1,
            attributes: {},
          },
        },
      ],
    });
  });
});
