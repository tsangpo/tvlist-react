import { LinkIcon, SearchIcon, StarFillIcon, StarIcon } from '@primer/octicons-react';
import {
  ActionList,
  ActionMenu,
  BaseStyles,
  Box,
  Button,
  NavList,
  Spinner,
  SplitPageLayout,
  SubNav,
  Text,
  TextInput,
  ThemeProvider,
} from '@primer/react';
import { useState } from 'react';

import { HlsVideo } from './component/HlsVideo';
import { usePlaylist } from './hook/usePlaylist';

export const App: React.FunctionComponent = () => {
  const {
    allPlaylists,
    selectedPlaylist,
    selectePlaylist,
    playlistItems,
    selectedChannel,
    setSelectedChannel,
    isStarred,
    toggleStar,
  } = usePlaylist();
  const [filterText, setFilterText] = useState('');

  console.log('selectedChannel:', selectedChannel);

  return (
    <ThemeProvider colorMode="auto">
      <BaseStyles>
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
            {!playlistItems ? (
              <Spinner />
            ) : (
              <NavList>
                {playlistItems
                  .filter(
                    (item) =>
                      !filterText || item.inf?.name.toLowerCase().includes(filterText.toLowerCase())
                  )
                  .map((item) => (
                    <NavList.Item
                      key={item.url}
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
            {selectedChannel && (
              <Box display="flex" paddingY={3} alignItems="center" style={{ gap: 8 }}>
                <Box flexGrow={1}>
                  <Text>{selectedChannel.inf?.name}</Text>
                </Box>
                <Button
                  leadingIcon={LinkIcon}
                  onClick={() => {
                    selectedChannel.url && navigator.clipboard.writeText(selectedChannel.url);
                  }}
                >
                  Copy link
                </Button>
                {isStarred(selectedChannel) ? (
                  <Button
                    leadingIcon={StarFillIcon}
                    onClick={() => toggleStar(selectedChannel, false)}
                  >
                    Starred
                  </Button>
                ) : (
                  <Button leadingIcon={StarIcon} onClick={() => toggleStar(selectedChannel, true)}>
                    Star
                  </Button>
                )}
              </Box>
            )}
            <HlsVideo
              src={
                selectedChannel?.url ||
                'https://cnn-cnninternational-1-de.samsung.wurl.com/manifest/playlist.m3u8'
              }
            />
          </SplitPageLayout.Content>
          <SplitPageLayout.Footer>
            <Text color="neutral.emphasis">
              Only those video whose streaming source allows CORS access and supports https can play
              in the web page
            </Text>
          </SplitPageLayout.Footer>
        </SplitPageLayout>
      </BaseStyles>
    </ThemeProvider>
  );
};
