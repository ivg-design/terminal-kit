# DataManager API Documentation

## Overview

The DataManager provides centralized data management for the Rive Animation Platform, supporting workspace separation, relational data, and future Supabase integration.

## Quick Start

```javascript
import { DataManager } from './js/data/DataManager.js';

// Create instance
const dm = new DataManager({
    workspace: 'personal',  // or 'work'
    backend: 'localStorage' // will support 'supabase' in production
});

// Create an animation
const animation = await dm.create('animations', {
    name: 'My Animation',
    duration: 2000
});

// Query animations in current workspace
const animations = await dm.query('animations');
```

## Core API

### Constructor

```javascript
new DataManager(options)
```

**Options:**
- `workspace` (string): Initial workspace ('personal' or 'work'), default: 'personal'
- `backend` (string): Storage backend ('localStorage' or 'supabase'), default: 'localStorage'
- `userId` (string): User identifier, default: 'local-user'

### CRUD Operations

#### create(entityType, data)
Creates a new entity in the current workspace.

```javascript
const animation = await dm.create('animations', {
    name: 'Hero Animation',
    duration: 3000
});
```

#### get(entityType, id)
Retrieves a single entity by ID.

```javascript
const animation = await dm.get('animations', 'animations-123456-abc');
```

#### update(entityType, id, updates)
Updates an existing entity.

```javascript
const updated = await dm.update('animations', animationId, {
    name: 'Updated Name',
    duration: 5000
});
```

#### delete(entityType, id)
Deletes an entity.

```javascript
const success = await dm.delete('animations', animationId);
```

### Batch Operations

#### createBatch(entityType, items)
Creates multiple entities at once.

```javascript
const animations = await dm.createBatch('animations', [
    { name: 'Animation 1' },
    { name: 'Animation 2' },
    { name: 'Animation 3' }
]);
```

#### deleteBatch(entityType, ids)
Deletes multiple entities.

```javascript
await dm.deleteBatch('animations', [id1, id2, id3]);
```

### Query System

#### query(entityType, options)
Queries entities with filtering, sorting, and pagination.

```javascript
const results = await dm.query('animations', {
    filter: { tags: 'featured' },
    sort: { field: 'createdAt', order: 'desc' },
    limit: 10,
    offset: 0
});
```

**Query Options:**
- `filter` (object): Field-value pairs to filter by
- `sort` (object): { field: string, order: 'asc' | 'desc' }
- `limit` (number): Maximum results to return
- `offset` (number): Number of results to skip

### Workspace Management

#### switchWorkspace(workspace)
Switches the active workspace.

```javascript
await dm.switchWorkspace('work'); // Switch to work workspace
await dm.switchWorkspace('personal'); // Switch back to personal
```

#### subscribeWorkspace(callback)
Subscribes to workspace changes.

```javascript
const unsubscribe = dm.subscribeWorkspace((newWorkspace, oldWorkspace) => {
    console.log(`Switched from ${oldWorkspace} to ${newWorkspace}`);
});

// Later: unsubscribe();
```

### Relationship Management

#### getChildren(entityType, parentId)
Gets all children of a parent entity (for folders).

```javascript
const subfolders = await dm.getChildren('folders', parentFolderId);
```

#### addRelation(entityId, relationType, relatedIds)
Adds relationships between entities.

```javascript
await dm.addRelation(animationId, 'tags', [tagId1, tagId2]);
```

#### getRelated(entityId, relationType)
Gets related entities.

```javascript
const tags = await dm.getRelated(animationId, 'tags');
```

### Swatch Management

#### addSwatch(animationId, color)
Adds a color swatch to an animation.

```javascript
await dm.addSwatch(animationId, '#FF0000');
```

#### removeSwatch(animationId, color)
Removes a color swatch.

```javascript
await dm.removeSwatch(animationId, '#FF0000');
```

#### getSwatches(animationId)
Gets all swatches for an animation.

```javascript
const swatches = await dm.getSwatches(animationId);
// Returns: ['#FF0000', '#00FF00', '#0000FF']
```

#### getWorkspaceSwatches()
Gets all unique swatches in the current workspace.

```javascript
const allSwatches = await dm.getWorkspaceSwatches();
```

### Subscription System

#### subscribe(entityType, callback)
Subscribes to entity changes.

```javascript
const unsubscribe = dm.subscribe('animations', (action, entity) => {
    console.log(`${action} animation:`, entity);
});

// Actions: 'create', 'update', 'delete'
```

## Entity Types

### Animations
```javascript
{
    id: 'animations-123456-abc',
    name: 'Hero Animation',
    duration: 3000,
    tags: ['featured', 'hero'],
    workspace: 'personal',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z'
}
```

### Folders
```javascript
{
    id: 'folders-123456-def',
    name: 'Components',
    parentId: null, // or parent folder ID
    workspace: 'personal',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z'
}
```

### Tags
```javascript
{
    id: 'tags-123456-ghi',
    name: 'featured',
    color: '#00ff00',
    workspace: 'personal',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z'
}
```

## Component Integration Examples

### TerminalColorPicker Integration
```javascript
class TerminalColorPicker extends TerminalComponent {
    async connectedCallback() {
        super.connectedCallback();

        // Set data manager
        this.dataManager = window.dataManager || new DataManager();

        // Load swatches for current animation
        if (this.animationId) {
            const swatches = await this.dataManager.getSwatches(this.animationId);
            this.setCustomSwatches(swatches);
        }
    }

    async saveColor(color) {
        if (this.animationId) {
            await this.dataManager.addSwatch(this.animationId, color);
        }
    }
}
```

### TerminalTreeView Integration
```javascript
class TerminalTreeView extends TerminalComponent {
    async loadFolders() {
        const folders = await this.dataManager.query('folders', {
            sort: { field: 'name', order: 'asc' }
        });

        this.renderTree(folders);
    }

    subscribeToChanges() {
        this.dataManager.subscribe('folders', (action, folder) => {
            this.loadFolders(); // Reload on changes
        });
    }
}
```

### TerminalUserMenu Integration
```javascript
class TerminalUserMenu extends TerminalComponent {
    async switchWorkspace(workspace) {
        await this.dataManager.switchWorkspace(workspace);

        // Update UI to show current workspace
        this.updateWorkspaceIndicator(workspace);

        // Other components will auto-refresh via subscriptions
    }
}
```

## Testing

Run tests with:

```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:ui     # UI mode
```

## Future Supabase Integration

The DataManager is designed to seamlessly integrate with Supabase:

```javascript
// Future implementation
const dm = new DataManager({
    backend: 'supabase',
    supabaseClient: supabase,
    userId: user.id
});

// All the same API methods work with cloud storage
await dm.create('animations', { name: 'Cloud Animation' });
```

## Storage

### localStorage Structure
- `dataManager_[userId]_animations`: Animation entities
- `dataManager_[userId]_folders`: Folder entities
- `dataManager_[userId]_tags`: Tag entities
- `dataManager_[userId]_swatches`: Swatch data
- `dataManager_[userId]_settings`: User settings
- `dataManager_[userId]_indexes`: Relationship indexes

### Supabase Tables (Future)
```sql
-- Will be implemented in production
CREATE TABLE animations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    workspace TEXT NOT NULL,
    name TEXT NOT NULL,
    duration INTEGER,
    tags TEXT[],
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- Row Level Security will ensure workspace isolation
```

## Error Handling

The DataManager throws errors for:
- Invalid entity types
- Missing required fields (name for animations, folders, tags)
- Entity not found on update
- Invalid workspace

Always wrap operations in try-catch for production:

```javascript
try {
    const animation = await dm.create('animations', { name: 'Test' });
} catch (error) {
    console.error('Failed to create animation:', error);
}
```

## Performance Notes

- Queries are performed in-memory for localStorage backend
- Indexes are maintained for efficient relationship queries
- Workspace filtering happens at query time
- Future Supabase integration will use database indexes

## Best Practices

1. **Always specify workspace context** when creating components
2. **Subscribe to changes** for reactive UI updates
3. **Use batch operations** for multiple creates/deletes
4. **Unsubscribe** when components unmount to prevent memory leaks
5. **Use query options** for efficient data fetching
6. **Handle errors** gracefully in production