import { NavList } from '@primer/react';
import { useRef } from 'react';
import { ViewportList } from 'react-viewport-list';

import { Item } from '../lib/m3u-parser';

type Props = {
  playlistItems: Item[];
  setSelectedChannel: (item: Item) => void;
  selectedChannel: Item | null;
};

export const PlaylistNavList: React.FunctionComponent<Props> = (props) => {
  if (props.playlistItems.length < 200) {
    return renderSimpleList(props);
  } else {
    return renderWindowedList(props);
  }
};

const renderSimpleList = ({ playlistItems, setSelectedChannel, selectedChannel }: Props) => (
  <NavList>
    {playlistItems.map((item) => (
      <NavList.Item
        key={item.url}
        aria-current={item.url == selectedChannel?.url}
        onClick={() => setSelectedChannel(item)}
        sx={{
          span: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 216,
          },
        }}
      >
        {item.inf?.name}
      </NavList.Item>
    ))}
  </NavList>
);

const renderWindowedList = ({ playlistItems, setSelectedChannel, selectedChannel }: Props) => {
  const viewportRef = useRef<HTMLElement | null>(null);

  const navlistRef: React.Ref<HTMLElement> = (ul) => {
    viewportRef.current = ul?.parentElement!;
  };

  return (
    <NavList ref={navlistRef}>
      <ViewportList viewportRef={viewportRef} items={playlistItems}>
        {(item) => (
          <NavList.Item
            key={item.url}
            aria-current={item.url == selectedChannel?.url}
            onClick={() => setSelectedChannel(item)}
            sx={{
              span: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 216,
              },
            }}
          >
            {item.inf?.name}
          </NavList.Item>
        )}
      </ViewportList>
    </NavList>
  );
};
