import 'dotenv/config'

export default {
  expo: {
    name: 'Breeze Checkin',
    slug: 'breeze-checkin-39',
    platforms: ['ios'],
    version: '1.0.2',
    description: '',
    orientation: 'landscape',
    icon: './src/assets/icon.png',
    splash: {
      image: './src/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    extra: {
      SENTRY_DSN: process.env.SENTRY_DSN,
      API_KEY: process.env.API_KEY,
    },
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'ben-brown',
            project: 'breeze-checkin',
            authToken: process.env.SENTRY_AUTH_TOKEN,
          },
        },
      ],
    },
  },
}
