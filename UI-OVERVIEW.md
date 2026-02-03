# Application Screenshots & UI Overview

## Main Application Window

### Dark Theme (Default)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [🔷] Server Manager                          ☀️  🌙  🖥️                      │
│      Network Discovery & Configuration                                       │
├─────────────────────────────────┬───────────────────────────────────────────┤
│                                 │                                           │
│ 🖥️  Discovered Servers          │                                           │
│     2 servers found  [🔄 Refresh]│                                           │
│                                 │    No Server Selected                      │
│ ┌─────────────────────────────┐ │                                           │
│ │ 🟢  Production Server    ✓  │ │    Select a server from the list         │
│ │     192.168.1.100:8080      │ │    to view details and manage            │
│ │     v2.1.0  US East         │ │    its configuration                      │
│ └─────────────────────────────┘ │                                           │
│                                 │                                           │
│ ┌─────────────────────────────┐ │                                           │
│ │ 🟢  Development Server   ✓  │ │                                           │
│ │     192.168.1.101:3000      │ │                                           │
│ │     v2.0.5  Local           │ │                                           │
│ └─────────────────────────────┘ │                                           │
│                                 │                                           │
└─────────────────────────────────┴───────────────────────────────────────────┘
```

### With Server Selected
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [🔷] Server Manager                          ☀️  🌙  🖥️                      │
│      Network Discovery & Configuration                                       │
├─────────────────────────────────┬───────────────────────────────────────────┤
│                                 │                                           │
│ 🖥️  Discovered Servers          │  🟢  Production Server              [✓]  │
│     2 servers found  [🔄 Refresh]│      Server Configuration                 │
│                                 │                                           │
│ ┌─────────────────────────────┐ │  ┌────────────────────────────────────┐ │
│ │ 🟢  Production Server    ✓  │◄──│  IP Configuration     [✏️ Edit]     │ │
│ │     192.168.1.100:8080      │ │  │                                    │ │
│ │     v2.1.0  US East         │ │  │  IP Address                        │ │
│ └─────────────────────────────┘ │  │  192.168.1.100 : 8080             │ │
│                                 │  │                                    │ │
│ ┌─────────────────────────────┐ │  │  [🔄 Test Connection]              │ │
│ │ 🟢  Development Server   ✓  │ │  └────────────────────────────────────┘ │
│ │     192.168.1.101:3000      │ │                                           │
│ │     v2.0.5  Local           │ │  ┌────────────────────────────────────┐ │
│ └─────────────────────────────┘ │  │  Server Information                │ │
│                                 │  │                                    │ │
│                                 │  │  🕐 Last Seen    14:23:45          │ │
│                                 │  │  📦 Version      v2.1.0            │ │
│                                 │  │  📍 Location     US East           │ │
│                                 │  │  ⚡ Server ID    server-xxx        │ │
│                                 │  └────────────────────────────────────┘ │
└─────────────────────────────────┴───────────────────────────────────────────┘
```

### Editing IP Address
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 │  🟢  Production Server              [✓]  │
│                                 │      Server Configuration                 │
│                                 │                                           │
│                                 │  ┌────────────────────────────────────┐ │
│                                 │  │  IP Configuration                  │ │
│                                 │  │                                    │ │
│                                 │  │  IP Address                        │ │
│                                 │  │  [192.168.1.150______________]    │ │
│                                 │  │                                    │ │
│                                 │  │  [💾 Save Changes]  [❌]           │ │
│                                 │  └────────────────────────────────────┘ │
└─────────────────────────────────┴───────────────────────────────────────────┘
```

### Light Theme
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [🔷] Server Manager                          ☀️  🌙  🖥️                      │
│      Network Discovery & Configuration                                       │
├─────────────────────────────────┬───────────────────────────────────────────┤
│ (White background)              │ (White background)                        │
│ (Dark text)                     │ (Dark text)                               │
│                                 │                                           │
│ 🖥️  Discovered Servers          │  🟢  Production Server              [✓]  │
│     2 servers found  [🔄 Refresh]│      Server Configuration                 │
│                                 │                                           │
│ ... (same layout as dark theme) │  ... (same layout as dark theme)         │
│                                 │                                           │
└─────────────────────────────────┴───────────────────────────────────────────┘
```

## Color Scheme

### Dark Theme
- Background: Deep slate blue (#0f172a, #1e293b)
- Text: Light gray/white (#f1f5f9, #e2e8f0)
- Primary: Bright blue (#3b82f6)
- Success: Green (#16a34a)
- Cards: Dark slate with subtle borders
- Shadows: Deep, prominent shadows

### Light Theme
- Background: White (#ffffff)
- Text: Dark gray/black (#0f172a, #1e293b)
- Primary: Bright blue (#3b82f6)
- Success: Green (#16a34a)
- Cards: White with light borders
- Shadows: Subtle, soft shadows

## Status Indicators

### Server Status Colors
- 🟢 **Online** - Green background badge
- 🔴 **Offline** - Gray/muted badge
- 🟡 **Warning** - Yellow/amber badge
- 🔴 **Error** - Red badge

### Connection Test Results
- ✅ **Success** - Green box with latency (e.g., "Connection successful • 25ms")
- ❌ **Failed** - Red box with error message

## Interactive Elements

### Buttons
- **Primary** - Blue background, white text, shadow, hover scale effect
- **Outline** - Border only, fills on hover
- **Ghost** - Transparent, subtle background on hover
- **Success** - Green background for successful actions

### Cards
- Rounded corners (12px border-radius)
- Hover effect: scale up slightly + increased shadow
- Selected state: blue ring around card
- Smooth transitions on all interactions

### Inputs
- Rounded corners (8px)
- Focus state: blue ring
- Error state: red ring + error message below

## Typography

- **Font Family**: Inter (Google Fonts)
- **Weights Used**: 300, 400, 500, 600, 700
- **Headers**: 700 (bold)
- **Body**: 400 (regular)
- **Small Text**: 300 (light)

## Spacing & Layout

- **Window Size**: 1200x800px (minimum: 800x600px)
- **Left Panel**: 384px wide (fixed)
- **Right Panel**: Flexible, fills remaining space
- **Padding**: Generous spacing (16-24px)
- **Card Gaps**: 12px between cards
- **Border Radius**: 
  - Large: 12px (cards)
  - Medium: 8px (inputs, buttons)
  - Small: 6px (badges)

## Animations

- **Theme Transition**: Smooth color fade (300ms)
- **Button Hover**: Scale to 98% on click
- **Refresh Button**: Pulse animation when active
- **Scanning Indicator**: Pulsing glow effect
- **Card Selection**: Instant highlight with ring
- **Card Hover**: Subtle scale up (102%)

## Empty States

### No Servers Found
```
        🖥️
        
    No Servers Found
    
    Waiting for server announcements
    on the network. Make sure your
    servers are configured to broadcast
    discovery messages.
    
    ⚡ Scanning network...
```

## Icon Library

Using **Lucide React** icons:
- Server, Activity, Wifi, WifiOff
- Sun, Moon, Monitor (theme switcher)
- Edit2, Save, X (actions)
- RefreshCw, Clock, MapPin, PackageOpen
- AlertTriangle (warnings)

## Responsive Behavior

- Minimum window size: 800x600px
- Left panel: Fixed width (384px)
- Right panel: Flexible width
- Scrollable content in both panels
- Fixed header at top

## Accessibility Features

- High contrast in both themes
- Clear focus states on all interactive elements
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
