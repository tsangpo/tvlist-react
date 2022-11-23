import { SearchIcon } from '@primer/octicons-react';
import {
  ActionList,
  ActionMenu,
  NavList,
  Spinner,
  SplitPageLayout,
  SubNav,
  TextInput,
  ThemeProvider,
} from '@primer/react';
import { useState } from 'react';

import { HlsVideo } from './component/HlsVideo';
import { usePlaylist } from './hook/usePlaylist';
import { Item } from './lib/m3u-parser';

export const App: React.FunctionComponent = () => {
  const { allPlaylists, selectedPlaylist, selectePlaylist, data } = usePlaylist();
  const [selectedChannel, setSelectedChannel] = useState<Item | null>(null);
  const [filterText, setFilterText] = useState('');

  return (
    <ThemeProvider colorMode="auto">
      <SplitPageLayout>
        <SplitPageLayout.Header>
          <SubNav aria-label="Main">
            <ActionMenu>
              <ActionMenu.Button aria-label="Select field type">
                {selectedPlaylist.inf?.name}
              </ActionMenu.Button>
              <ActionMenu.Overlay width="medium">
                <ActionList selectionVariant="single">
                  {allPlaylists.map((playlist) => (
                    <ActionList.Item
                      key={playlist.url}
                      selected={playlist.url === selectedPlaylist.url}
                      onSelect={() => selectePlaylist(playlist)}
                    >
                      {playlist.inf?.name}
                    </ActionList.Item>
                  ))}
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>

            {/* <SubNav.Links>
              <SubNav.Link href="#home" selected>
                Playlist
              </SubNav.Link>
              <SubNav.Link href="#documentation">Favorate</SubNav.Link>
            </SubNav.Links> */}

            <TextInput
              type="search"
              leadingVisual={SearchIcon}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </SubNav>
        </SplitPageLayout.Header>
        <SplitPageLayout.Pane position="start" aria-label="Secondary navigation">
          {!data ? (
            <Spinner />
          ) : (
            <NavList>
              {data.items
                .filter(
                  (item) =>
                    !filterText || item.inf?.name.toLowerCase().includes(filterText.toLowerCase())
                )
                .map((item) => (
                  <NavList.Item
                    aria-current={item.url == selectedChannel?.url}
                    onClick={() => setSelectedChannel(item)}
                  >
                    {item.inf?.name}
                  </NavList.Item>
                ))}
            </NavList>
          )}
        </SplitPageLayout.Pane>
        <SplitPageLayout.Content>
          <HlsVideo
            src={
              selectedChannel?.url ||
              'https://cnn-cnninternational-1-de.samsung.wurl.com/manifest/playlist.m3u8'
            }
          />
        </SplitPageLayout.Content>
        <SplitPageLayout.Footer>footer</SplitPageLayout.Footer>
      </SplitPageLayout>
    </ThemeProvider>
  );
};
