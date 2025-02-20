# Screeps TypeScript AI Bot

A custom AI bot for the game [Screeps](https://screeps.com/) built with TypeScript.

## Key Features

- **Kernel-based Architecture**
  - Modular core system
  - Priority-based module execution
  - Message bus for module communication

- **Colony Management**
  - Automated resource collection
  - Structure maintenance
  - Room controller upgrading
  - Energy distribution

- **Task System**
  - Basic task assignment and prioritization
  - Individual creep task management
  - Core task types:
    - Resource harvesting
    - Building structures
    - Upgrading controllers
    - Energy transfer

## Technical Implementation

The bot uses a straightforward, maintainable architecture:

```typescript
src/
  ├── kernel.ts          // Core system coordinator
  ├── modules/           // Feature modules
  │   ├── colony.ts     // Colony management
  │   └── spawner.ts    // Creep spawning logic
  ├── tasks/            // Task definitions
  └── shared/           // Common utilities
```

## Creep Roles

- **Harvesters**: Dedicated resource collectors
- **Haulers**: Transport resources between points
- **Workers**: Handle construction and repairs
- **Energy Distributors**: Manage energy distribution
- **Upgraders**: Focus on controller upgrades

## Design Patterns

- Message-based communication between modules
- Dependency injection for module management
- Role-based creep specialization
- Priority-based task assignment

## Tech Stack
- TypeScript
- Screeps Game API
- Node.js
