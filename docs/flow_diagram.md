# Comprehensive User, Owner & Admin Flow Diagram

This diagram illustrates the complete workflow, including standard users, business owners, and the platform-wide Super Admin.

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#1E293B,stroke:#3B82F6,stroke-width:2px,color:#F8FAFC
    classDef backend fill:#064E3B,stroke:#10B981,stroke-width:2px,color:#F8FAFC
    classDef database fill:#701A75,stroke:#D946EF,stroke-width:2px,color:#F8FAFC
    classDef superadmin fill:#991B1B,stroke:#EF4444,stroke-width:2px,color:#ffffff

    %% User Frontend Flows
    A[🏠 Home Page<br/>Search Bar & Categories]:::frontend
    B(🔍 Search Results Page):::frontend
    D(Business Detail Page):::frontend
    
    %% Authentication Layer
    U_Auth[👤 Login/Register Gateway]:::frontend
    U_API{Auth API / JWT<br/>Role verification}:::backend
    DB[(PostgreSQL DB)]:::database
    
    %% Standard User Flow
    A -->|Clicks Login| U_Auth
    U_Auth -->|Submits Credentials| U_API
    U_API -->|Validates User| DB
    DB -->|Returns Status| U_API
    U_API -->|Role: Standard User| A

    %% Core Search Flow
    A -->|Enters Query| API_Search{Search API<br/>Elasticsearch/Redis}:::backend
    API_Search -->|Fetches Data| DB
    API_Search -->|Returns Results| B
    B -->|Clicks Listing| API_Details{Business Details API}:::backend
    API_Details --> D

    %% Business Owner Flow
    Owner_Dash[📊 Owner Dashboard<br/>Manage Own Listings & Reviews]:::frontend
    U_API -->|Role: Business Owner| Owner_Dash
    Owner_Dash -->|Add/Edit Listing| API_Update{Database Update API}:::backend
    API_Update --> DB

    %% Super Admin Flow
    SA_Dash[👑 Super Admin Dashboard<br/>Manage Platform, Users, Owners]:::superadmin
    U_API -->|Role: Super Admin| SA_Dash
    
    SA_Dash -->|Approve/Suspend Owners| API_Update
    SA_Dash -->|Manage Categories/Global Settings| API_Update
```

> [!NOTE]
> - **Frontend (Blue):** Public facing UI for users and business owners.
> - **Backend/APIs (Green):** The server-side logic and authentication mechanisms.
> - **Database (Purple):** PostgreSQL persistent storage.
> - **Super Admin (Red):** Top-level control over the entire platform, including moderating business owners.
