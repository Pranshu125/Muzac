// Downloaders and Music Services Directory (from user reference screenshot)
export const DOWNLOADER_TOOLS = [
  {
    category: 'Spotify Downloaders',
    items: [
      {
        name: 'SpotDownloader',
        url: 'https://spotdownloader.com',
        description: 'Download Spotify songs, albums & playlists to MP3 in high quality 320kbps with album covers.',
        icon: 'spotify',
        type: 'web',
        generateUrl: (spotifyUrl) => `https://spotdownloader.com/?url=${encodeURIComponent(spotifyUrl || '')}`
      },
      {
        name: 'SpotifyMate',
        url: 'https://spotifymate.com',
        description: 'Fast online Spotify music downloader without installing extra software.',
        icon: 'spotify',
        type: 'web',
        generateUrl: (spotifyUrl) => `https://spotifymate.com/?url=${encodeURIComponent(spotifyUrl || '')}`
      },
      {
        name: 'SpotMate Online',
        url: 'https://spotmate.online',
        description: 'Spotify song downloader with metadata and HD cover art tagging.',
        icon: 'spotify',
        type: 'web',
        generateUrl: (spotifyUrl) => `https://spotmate.online/?url=${encodeURIComponent(spotifyUrl || '')}`
      }
    ]
  },
  {
    category: 'YouTube & Video Downloaders',
    items: [
      {
        name: 'y2mate.nu',
        url: 'https://y2mate.nu',
        description: 'Direct YouTube to MP3 and MP4 high speed audio/video converter.',
        icon: 'youtube',
        type: 'web',
        generateUrl: (ytId) => `https://y2mate.nu/en/?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${ytId}`)}`
      },
      {
        name: 'azmp3.cc',
        url: 'https://azmp3.cc',
        description: 'Instant YouTube to MP3 converter with no ads or popups.',
        icon: 'youtube',
        type: 'web',
        generateUrl: (ytId) => `https://azmp3.cc/?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${ytId}`)}`
      },
      {
        name: 'ytmp3.cc',
        url: 'https://ytmp3.cc',
        description: 'Classic YouTube to MP3 audio converter supporting all video lengths.',
        icon: 'youtube',
        type: 'web',
        generateUrl: (ytId) => `https://ytmp3.cc/?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${ytId}`)}`
      }
    ]
  },
  {
    category: 'Multi-Source & Lossless Hub',
    items: [
      {
        name: 'cobalt.tools',
        url: 'https://cobalt.tools',
        description: 'No ads, no tracking, no bullshit. The cleanest open-source media and music saver for YouTube, SoundCloud, etc.',
        icon: 'music',
        type: 'web',
        badge: 'Recommended',
        generateUrl: (ytId) => `https://cobalt.tools/#${encodeURIComponent(`https://www.youtube.com/watch?v=${ytId}`)}`
      },
      {
        name: 'lucida.to',
        url: 'https://lucida.to',
        description: 'Lossless Hi-Res FLAC & audio ripper from Qobuz, Tidal, Deezer, Spotify and YouTube.',
        icon: 'disc',
        type: 'web',
        badge: 'Lossless FLAC',
        generateUrl: (link) => `https://lucida.to/?url=${encodeURIComponent(link || '')}`
      },
      {
        name: 'ytiz.xyz',
        url: 'https://ytiz.xyz',
        description: 'Multi-platform media grabber with audio bitrate selector.',
        icon: 'music',
        type: 'web',
        generateUrl: (ytId) => `https://ytiz.xyz/?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${ytId}`)}`
      },
      {
        name: 'Racoon',
        url: 'https://racoon.online',
        description: 'Universal media download utility for music and video streams.',
        icon: 'music',
        type: 'web',
        generateUrl: (ytId) => `https://racoon.online/?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${ytId}`)}`
      }
    ]
  },
  {
    category: 'Desktop & Open-Source Software',
    items: [
      {
        name: 'Spotube',
        url: 'https://spotube.dev',
        description: 'Open-source Spotify client that does not require Spotify Premium and uses YouTube/Piped as audio stream source.',
        icon: 'download',
        type: 'software',
        badge: 'Open Source App'
      },
      {
        name: 'Soulseek (slsknet.org)',
        url: 'https://www.slsknet.org',
        description: 'Peer-to-peer network specializing in lossless music, rare vinyl rips, underground artists, and FLAC albums.',
        icon: 'download',
        type: 'software',
        badge: 'P2P Network'
      },
      {
        name: 'Downline',
        url: 'https://github.com/downline/downline',
        description: 'Modern desktop video & audio download manager powered by yt-dlp.',
        icon: 'download',
        type: 'software',
        badge: 'Desktop App'
      }
    ]
  }
];
