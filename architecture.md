graph TD
    subgraph "Client Layer"
        A[🌐 Web Browser]
        USER["👤 User"]
        CUSTOMER["👥 Customer"]
        USER --> A
        CUSTOMER --> A
    end

    subgraph "Presentation Layer (Frontend)"
        direction LR
        B[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="30"> React + <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="30"> TSX Pages]
        C[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg" width="30"> Vite Dev Server]
        D[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" width="30"> Tailwind CSS]
        B -- Uses --> D
        B -- Served by --> C
    end

    subgraph "Application Layer - Laravel 12 Backend"
        direction TB
        F[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/laravel/laravel-plain.svg" width="30"> Laravel 12 Core]
        G[Routes & Inertia]
        I[Middleware & Auth]
        
        subgraph "Inventory Backend"
            INV_C["📦 Inventory Controller"]
            INV_M["Product | SparePart Models"]
            INV_S["Stock Management<br/>Catalog Service"]
        end

        subgraph "POS Backend"
            POS_C["💳 POS Controller"]
            POS_M["Transaction | TransactionItem Models"]
            POS_S["Checkout | Payment<br/>Receipt Service"]
        end

        subgraph "Repair Backend"
            REP_C["🔧 Repair Controller"]
            REP_M["RepairOrder | RepairService<br/>RepairOrderPart Models"]
            REP_S["Order Management<br/>Service Scheduler"]
        end

        F --> G --> I
        G --> INV_C
        G --> POS_C
        G --> REP_C
        INV_C --> INV_M --> INV_S
        POS_C --> POS_M --> POS_S
        REP_C --> REP_M --> REP_S
    end

    subgraph "Data Layer"
        direction TB
        J[Eloquent ORM]
        K[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" width="30"> MySQL Database<br/>Products | Customers<br/>Transactions | Repairs]
        J --> K
    end

    %% Connections
    A -- HTTP Request --> F
    F -- Inertia.js Bridge --> B
    INV_S --> J
    POS_S --> J
    REP_S --> J
    
    %% Cross-feature flows
    INV_S -.Parts API.-> REP_S
    INV_S -.Stock Check.-> POS_S
    REP_S -.Service Billing.-> POS_S

    %% Style
    style A fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style B fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style F fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style K fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style INV_C fill:#c8e6c9,stroke:#2e7d32
    style POS_C fill:#ffccbc,stroke:#d84315
    style REP_C fill:#b3e5fc,stroke:#01579b