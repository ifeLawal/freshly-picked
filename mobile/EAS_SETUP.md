# EAS Update Setup Guide

## Prerequisites

1. **Expo account** - You mentioned you have an Expo Go account, which should work
2. **EAS CLI installed** - ✅ Already installed
3. **Project configured** - ✅ `eas.json` created

## Steps to Publish with EAS Update

### 1. Login to EAS
```bash
eas login
```
This will prompt you to authenticate with your Expo account.

### 2. Initialize EAS Project
```bash
eas init
```
This will:
- Create an EAS project linked to your Expo account
- Generate a project ID
- Update your `app.json` with the correct project ID and update URL

### 3. Configure Update Channel (Optional)
The `eas.json` already has update channels configured:
- `development` - For development updates
- `preview` - For preview/testing
- `production` - For production updates

### 4. Publish Update
```bash
eas update --branch production --message "Initial release"
```

Or for a specific channel:
```bash
eas update --channel production
```

## Accessing on Expo Go

After publishing, you can access your app in Expo Go using:

**Option 1: Direct URL**
```
exp://u.expo.dev/[your-project-id]?channel-name=production
```

**Option 2: Expo Go App**
1. Open Expo Go on your device
2. Go to "Profile" tab
3. Tap "Published projects"
4. Your app should appear there

**Option 3: Share Link**
After publishing, EAS will provide a shareable link you can use.

## Important Notes

- **Runtime Version**: The `runtimeVersion` in `app.json` ensures updates are compatible. Using `"policy": "appVersion"` means updates will match your app version (1.0.0).
- **Channels vs Branches**: 
  - Channels are for Expo Go
  - Branches are for standalone builds
- **Updates are OTA**: Changes to JavaScript/TypeScript code can be updated without rebuilding the native app.

## Alternative: Legacy Expo Publish (Simpler for Expo Go)

If you want a simpler approach just for Expo Go testing:

```bash
npx expo publish
```

This is the legacy method but still works for Expo Go. However, EAS Update is the recommended modern approach.

