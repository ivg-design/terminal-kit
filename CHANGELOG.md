# Changelog

All notable changes to T-Kit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-21

### Added
- Initial public release with 37 web components
- Pure Lit 3.x architecture with Shadow DOM encapsulation
- Dynamic accent color system with CSS variable support
- `accent-init.js` utility for FOUC prevention
- Components: TButton, TBadge, TChip, TAccordion, TPanel, TCard, TModal, TTooltip
- Form components: TInput, TTextarea, TDropdown, TSlider, TToggle, TColorPicker, TCalendar, TDynamicControls
- Display components: TAvatar, TTimeline, TChart, TSkeleton, TLogEntry, TLogList
- Status components: TLoader (55+ spinner types), TProgress, TToast, TStatusBar, TStatusField
- Navigation: TBreadcrumbs, TMenu, TTabs, TUserMenu
- Layout: TSplitter, TList, TTree, TKanban, TGrid
- Composite: TChatPanel with markdown, streaming, attachments
- Interactive demos for all components
- Dashboard demo with GridStack integration
- Comprehensive documentation

### Fixed
- Accent color now propagates to all component variants (sliders, loaders, charts)
- Kanban drag-drop visual feedback shows correct insertion position
- Styled scrollbars follow accent color across all demos
- FOUC eliminated on navigation between demo pages
