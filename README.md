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

The bot uses a modular, message-based architecture:

```typescript
src/
  ├── Kernel/                    // Core system management
  │   ├── ModuleBase.ts         // Base class for all modules
  │   ├── ModuleLoader.ts       // Handles module initialization
  │   ├── IModule.ts            // Module interface definition
  │   └── kernel.ts             // Main system coordinator
  ├── Modules/                  // Feature modules
  │   ├── CreepSpawnModule/     // Creep spawn monitoring
  │   ├── SpawnManagerModule/   // Spawn queue management
  │   ├── TaskCreatorModule/    // Task generation
  │   └── TaskExecuterModule/   // Task execution
  ├── Tasks/                    // Task management system
  │   ├── Core/                 // Base task infrastructure
  │   ├── Construction/         // Building and upgrading tasks
  │   ├── Logistics/           // Resource movement tasks
  │   └── Resource/            // Resource gathering tasks
  ├── Messaging/               // Message bus system
  │   ├── Core/                // Messaging infrastructure
  │   │   ├── IHandle.ts       // Message handler interface
  │   │   ├── IMessage.ts      // Message interface
  │   │   └── MessageBus.ts    // Central message dispatcher
  │   └── Messages/            // Concrete message types
  ├── utils/                   // Utility functions
  ├── types/                   // TypeScript declarations
  ├── Colony.ts                // Colony management
  └── EmpireRepository.ts      // Global state management
```

Each module is designed to be independent and communicates through the message bus system. The architecture emphasizes:
- Message-driven design
- Modular components
- Clear separation of concerns
- Standardized interfaces

## Creep Roles

- **Harvesters**: Dedicated resource collectors
- **Haulers**: Transport resources between points
- **Workers**: Handle construction and repairs
- **Energy Distributors**: Manage energy distribution
- **Upgraders**: Focus on controller upgrades

## Tech Stack
- TypeScript
- Screeps Game API
- Node.js
