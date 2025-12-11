 ```
╔════════════════════════════════════════════════════════════════════════════════╗
║                    REPAIR MANAGEMENT SYSTEM - DATABASE SCHEMA                  ║
╚════════════════════════════════════════════════════════════════════════════════╝


┌──────────────────────────────────────────────────────────────────────────────┐
│                              TABLE: users                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id                    BIGINT                                             │
│     name                  VARCHAR(255)                                       │
│     email                 VARCHAR(255) UNIQUE                                │
│     phone                 VARCHAR(20)                                        │
│     password              VARCHAR(255)                                       │
│     created_at            TIMESTAMP                                          │
│     updated_at            TIMESTAMP                                          │
│                                                                              │
│ (Existing table - used for customers and staff)                              │
└──────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                           TABLE: products                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ PK  id                    BIGINT                                             │
│     name                  VARCHAR(255)                                       │
│     sku                   VARCHAR(100) UNIQUE                                │
│     price                 DECIMAL(10,2)                                      │
│     stock                 INT                                                │
│     image                 VARCHAR(255)                                       │
│     created_at            TIMESTAMP                                          │
│     updated_at            TIMESTAMP                                          │
│                                                                              │
│ (Existing table - parts/products used in repairs)                            │
└──────────────────────────────────────────────────────────────────────────────┘


╔════════════════════════════════════════════════════════════════════════════════╗
║                         NEW REPAIR MANAGEMENT TABLES                           ║
╚════════════════════════════════════════════════════════════════════════════════╝


┌──────────────────────────────────────────────────────────────────────────────┐
│                       TABLE: repair_services                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ PK  id                    BIGINT AUTO_INCREMENT                              │
│     name                  VARCHAR(255) UNIQUE                                │
│     description           TEXT (nullable)                                    │
│     base_price            DECIMAL(10,2)                                      │
│     created_at            TIMESTAMP                                          │
│     updated_at            TIMESTAMP                                          │
│                                                                              │
│ INDEXES:                                                                     │
│   - PRIMARY KEY (id)                                                         │
│   - UNIQUE (name)                                                            │
│                                                                              │
│ SAMPLE DATA:                                                                 │
│   1. Screen Replacement      | ₱1,500                                        │
│   2. Battery Replacement     | ₱800                                          │
│   3. Charging Port Repair    | ₱600                                          │
│   4. Software Repair         | ₱500                                          │
│   5. Water Damage Repair     | ₱2,000                                        │
│   6. Button Repair           | ₱400                                          │
│   7. Motherboard Repair      | ₱3,000                                        │
│   8. Device Cleaning         | ₱300                                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    △
                                    │
                          1 (one-to-many)
                                    │


┌──────────────────────────────────────────────────────────────────────────────┐
│                     TABLE: repair_transactions                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ PK  id                    BIGINT AUTO_INCREMENT                              │
│ FK  customer_id           BIGINT → users(id)                                 │
│     total_price           DECIMAL(10,2)                                      │
│     status                ENUM:                                              │
│                           - pending (initial state)                          │
│                           - in_progress (technician working)                 │
│                           - quality_check (QA testing)                       │
│                           - completed (ready for pickup)                     │
│                           - claimed (customer picked up)                     │
│                           - cancelled (refund processed)                     │
│     notes                 TEXT (nullable)                                    │
│     cancelled_at          TIMESTAMP (nullable)                               │
│     cancellation_reason   VARCHAR(255) (nullable)                            │
│     refund_status         ENUM: none | pending | completed | failed          │
│     pickup_date           TIMESTAMP (nullable)                               │
│     created_at            TIMESTAMP                                          │
│     updated_at            TIMESTAMP                                          │
│                                                                              │
│ INDEXES:                                                                     │
│   - PRIMARY KEY (id)                                                         │
│   - FOREIGN KEY (customer_id)                                                │
│   - INDEX (status)                                                           │
│   - INDEX (customer_id)                                                      │
│   - INDEX (created_at)                                                       │
│                                                                              │
│ RELATIONSHIPS:                                                               │
│   - belongs_to: users (customer_id)                                          │
│   - has_many: repair_transaction_services                                    │
│   - has_many: repair_used_parts                                              │
│   - has_many: repair_payments                                                │
│   - has_one: refund_payments                                                 │
│   - has_many: repair_status_history                                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
          △                          △                          △
          │                          │                          │
    belongs_to                 1(one-to-many)            1(one-to-many)
          │                          │                          │


┌──────────────────────────────────────────────────────────────────────────────┐
│                 TABLE: repair_transaction_services                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ PK  id                         BIGINT AUTO_INCREMENT                         │
│ FK  repair_transaction_id      BIGINT → repair_transactions(id)              │
│ FK  repair_service_id          BIGINT → repair_services(id)                  │
│     price                      DECIMAL(10,2)                                 │
│     notes                      TEXT (nullable)                               │
│     status                     ENUM: pending | in_progress | completed       │
│     created_at                 TIMESTAMP                                     │
│     updated_at                 TIMESTAMP                                     │
│                                                                              │
│ INDEXES:                                                                     │
│   - PRIMARY KEY (id)                                                         │
│   - FOREIGN KEY (repair_transaction_id)                                      │
│   - FOREIGN KEY (repair_service_id)                                          │
│   - INDEX (repair_transaction_id)                                            │
│   - INDEX (repair_service_id)                                                │
│                                                                              │
│ PURPOSE:                                                                     │
│   - Junction table linking repairs to services                               │
│   - Each repair can have multiple services                                   │
│   - Tracks price per service (may differ from base_price)                    │
│                                                                              │
│ EXAMPLE:                                                                     │
│   Repair #1:                                                                 │
│     - Screen Replacement (₱1,500)                                            │
│     - Software Fix (₱500)                                                    │
│     Total: ₱2,000                                                            │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
          △                          △
          │                          │
    belongs_to              belongs_to
          │                          │


┌──────────────────────────────────────────────────────────────────────────────┐
│                      TABLE: repair_used_parts                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ PK  id                         BIGINT AUTO_INCREMENT                         │
│ FK  repair_transaction_id      BIGINT → repair_transactions(id)              │
│ FK  product_id                 BIGINT → products(id)                         │
│     quantity                   INT                                           │
│     cost                       DECIMAL(10,2)                                 │
│     is_reversible              BOOLEAN (default: true)                       │
│     reversal_status            ENUM: not_reversed | reversed | waste         │
│     created_at                 TIMESTAMP                                     │
│     updated_at                 TIMESTAMP                                     │
│                                                                              │
│ INDEXES:                                                                     │
│   - PRIMARY KEY (id)                                                         │
│   - FOREIGN KEY (repair_transaction_id)                                      │
│   - FOREIGN KEY (product_id)                                                 │
│   - INDEX (repair_transaction_id)                                            │
│   - INDEX (product_id)                                                       │
│                                                                              │
│ PURPOSE:                                                                     │
│   - Tracks parts/products used in each repair                                │
│   - Deducts inventory on creation                                            │
│   - Reverses inventory on refund                                             │
│   - Distinguishes between reusable parts and waste                           │
│                                                                              │
│ EXAMPLE:                                                                     │
│   Repair #1 uses:                                                            │
│     - Screen (Product ID 5): qty=1, cost=₱2,000, reversible=false           │
│     - Screws (Product ID 12): qty=10, cost=₱50, reversible=true             │
│                                                                              │
│ REVERSAL SCENARIOS:                                                          │
│   - Screen (broken): waste (not added back)                                  │
│   - Screws (unused): reversed (added back to inventory)                      │
│   - Other parts: depends on condition                                        │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
          △                    △
          │                    │
    belongs_to            belongs_to
          │                    │


┌──────────────────────────────────────────────────────────────────────────────┐
│                      TABLE: repair_payments                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ PK  id                         BIGINT AUTO_INCREMENT                         │
│ FK  repair_transaction_id      BIGINT → repair_transactions(id)              │
│     amount                     DECIMAL(10,2)                                 │
│     method                     ENUM: cash | card | gcash                     │
│     status                     ENUM: pending | completed | failed            │
│     payment_reference          VARCHAR(255) (nullable) - for card/gcash      │
│     paid_at                    TIMESTAMP (nullable)                          │
│     created_at                 TIMESTAMP                                     │
│     updated_at                 TIMESTAMP                                     │
│                                                                              │
│ INDEXES:                                                                     │
│   - PRIMARY KEY (id)                                                         │
│   - FOREIGN KEY (repair_transaction_id)                                      │
│   - INDEX (repair_transaction_id)                                            │
│   - INDEX (status)                                                           │
│                                                                              │
│ PURPOSE:                                                                     │
│   - Records payment for repair transaction                                   │
│   - Tracks payment method and status                                         │
│   - Links to original transaction for refund reference                       │
│                                                                              │
│ PAYMENT FLOW:                                                                │
│   1. Created when checkout started (status: pending)                         │
│   2. Updated to completed when payment processed                             │
│   3. Failed if payment declined                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    △
                                    │
                              belongs_to


┌──────────────────────────────────────────────────────────────────────────────┐
│                      TABLE: refund_payments                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ PK  id                         BIGINT AUTO_INCREMENT                         │
│ FK  repair_transaction_id      BIGINT → repair_transactions(id)              │
│ FK  original_payment_id        BIGINT → repair_payments(id) (nullable)       │
│     refund_amount              DECIMAL(10,2)                                 │
│     refund_reason              VARCHAR(255) (nullable)                       │
│     refund_method              ENUM: cash | card | gcash                     │
│     status                     ENUM: pending | completed | failed            │
│ FK  processed_by               BIGINT → users(id) (nullable)                 │
│     processed_at               TIMESTAMP (nullable)                          │
│     created_at                 TIMESTAMP                                     │
│     updated_at                 TIMESTAMP                                     │
│                                                                              │
│ INDEXES:                                                                     │
│   - PRIMARY KEY (id)                                                         │
│   - FOREIGN KEY (repair_transaction_id)                                      │
│   - FOREIGN KEY (original_payment_id)                                        │
│   - INDEX (repair_transaction_id)                                            │
│   - INDEX (status)                                                           │
│                                                                              │
│ PURPOSE:                                                                     │
│   - Records refund requests and processing                                   │
│   - Links to original payment for reference                                  │
│   - Tracks who approved/processed refund                                     │
│                                                                              │
│ REFUND CALCULATION:                                                          │
│   refund_amount = payment.amount - costs_incurred                            │
│                                                                              │
│   Example:                                                                   │
│     Original payment: ₱5,000                                                 │
│     Parts used: ₱2,000 (cannot refund)                                       │
│     Labor: ₱1,500 (cannot refund)                                            │
│     Refund amount: ₱5,000 - ₱3,500 = ₱1,500                                  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
          △                                △
          │                                │
    belongs_to                      belongs_to
          │                                │


┌──────────────────────────────────────────────────────────────────────────────┐
│                   TABLE: repair_status_history                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ PK  id                         BIGINT AUTO_INCREMENT                         │
│ FK  repair_transaction_id      BIGINT → repair_transactions(id)              │
│     old_status                 VARCHAR(255) (nullable)                       │
│     new_status                 VARCHAR(255)                                  │
│ FK  changed_by                 BIGINT → users(id) (nullable)                 │
│     notes                      TEXT (nullable)                               │
│     created_at                 TIMESTAMP                                     │
│     updated_at                 TIMESTAMP                                     │
│                                                                              │
│ INDEXES:                                                                     │
│   - PRIMARY KEY (id)                                                         │
│   - FOREIGN KEY (repair_transaction_id)                                      │
│   - INDEX (repair_transaction_id)                                            │
│   - INDEX (created_at)                                                       │
│                                                                              │
│ PURPOSE:                                                                     │
│   - Audit trail of all status changes                                        │
│   - Tracks who made changes and when                                         │
│   - Provides history for reporting and debugging                             │
│                                                                              │
│ STATUS TRANSITIONS:                                                          │
│   pending → in_progress → quality_check → completed → claimed                │
│                                ↓                                             │
│                            failed QC → in_progress (retry)                   │
│                                                                              │
│   Any status → cancelled (if refund requested)                               │
│                                                                              │
│ EXAMPLE AUDIT LOG:                                                           │
│   Repair #123:                                                               │
│   1. null → pending          (System, 10:00 AM)                              │
│   2. pending → in_progress   (John, 10:30 AM)                                │
│   3. in_progress → quality_check (Mary, 2:00 PM)                             │
│   4. quality_check → completed (Mary, 2:15 PM)                               │
│   5. completed → claimed     (System, 4:00 PM)                               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
          △
          │
    belongs_to


╔════════════════════════════════════════════════════════════════════════════════╗
║                           RELATIONSHIP DIAGRAM                                 ║
╚════════════════════════════════════════════════════════════════════════════════╝


                              users
                                △
                                │
                    ┌───────────┴───────────┐
                    │                       │
              customer_id            processed_by
                    │                       │
                    │                       │
        ┌───────────▼──────────┐   ┌──────────────────┐
        │                      │   │                  │
    repair_transactions        │   │  refund_payments │
    (main transaction)         │   │                  │
        │                      │   └──────────────────┘
        │                      │
        ├─ services ────────────▶ repair_transaction_services ──▶ repair_services
        │                                 (junction)
        │
        ├─ used_parts ─────────▶ repair_used_parts ──────────────▶ products
        │
        ├─ payments ───────────▶ repair_payments
        │                            │
        │                            └──▶ original_payment_id
        │                                     │
        ├─ refund_payment ─────▶ refund_payments ◀──────────────┘
        │
        └─ status_history ─────▶ repair_status_history


╔════════════════════════════════════════════════════════════════════════════════╗
║                         DATA FLOW & TRANSACTIONS                               ║
╚════════════════════════════════════════════════════════════════════════════════╝


REPAIR CREATION FLOW:
═══════════════════

1. repair_transactions
   ├─ Create record (status: pending)
   └─ Create status_history entry (null → pending)

2. repair_transaction_services
   ├─ Create 1+ records (one per selected service)
   └─ Each with service_id and price

3. repair_used_parts
   ├─ Create 1+ records (one per part used)
   ├─ Deduct from products.stock
   └─ Mark reversal_status: not_reversed

4. repair_payments
   └─ Create record (status: pending) - waiting for payment


REPAIR PROCESSING FLOW:
══════════════════════

Status Transitions:
  pending → in_progress
    └─ Create status_history entry
    └─ Notify customer

  in_progress → quality_check
    └─ Create status_history entry

  quality_check → completed (if passed)
    └─ Create status_history entry
    └─ Notify customer ready for pickup

  quality_check → in_progress (if failed)
    └─ Create status_history entry
    └─ Reassign to technician

  completed → claimed (when customer picks up)
    └─ Create status_history entry
    └─ Final receipt/confirmation


REFUND FLOW:
════════════

1. Check cancellation eligibility
   └─ Calculate refund_amount based on costs

2. reverse_inventory()
   ├─ For each repair_used_parts (is_reversible=true, reversal_status=not_reversed)
   ├─ Add quantity back to products.stock
   └─ Update reversal_status: reversed/waste

3. refund_payments
   ├─ Create record (status: pending)
   └─ Store refund_amount and reason

4. repair_transactions
   ├─ Update status: cancelled
   ├─ Update refund_status: pending
   ├─ Set cancelled_at timestamp
   └─ Create status_history entry

5. repair_payments
   └─ Process refund (cash/card/gcash)

6. refund_payments
   ├─ Update status: completed
   └─ Set processed_at timestamp


╔════════════════════════════════════════════════════════════════════════════════╗
║                            KEY STATISTICS                                      ║
╚════════════════════════════════════════════════════════════════════════════════╝

Tables: 7 new + 2 existing = 9 total
Relations: 16 foreign keys
Indexes: 20+ strategic indexes
Decimal fields: 6 (for money calculations)
Enum fields: 8 (for status tracking)
Timestamps: 14 (created_at, updated_at)


╔════════════════════════════════════════════════════════════════════════════════╗
║                         QUERIES OPTIMIZATION                                   ║
╚════════════════════════════════════════════════════════════════════════════════╝

COMMON QUERIES:

1. Get all repairs for a customer:
   SELECT * FROM repair_transactions 
   WHERE customer_id = ? AND status != 'cancelled'
   ORDER BY created_at DESC

2. Get repair details with all relationships:
   SELECT rt.*, rts.*, rs.*, rup.*, p.*, rp.*, rsh.*
   FROM repair_transactions rt
   LEFT JOIN repair_transaction_services rts ON rt.id = rts.repair_transaction_id
   LEFT JOIN repair_services rs ON rts.repair_service_id = rs.id
   LEFT JOIN repair_used_parts rup ON rt.id = rup.repair_transaction_id
   LEFT JOIN products p ON rup.product_id = p.id
   LEFT JOIN repair_payments rp ON rt.id = rp.repair_transaction_id
   LEFT JOIN repair_status_history rsh ON rt.id = rsh.repair_transaction_id
   WHERE rt.id = ?

3. Pending refunds:
   SELECT * FROM refund_payments
   WHERE status = 'pending'
   ORDER BY created_at ASC

4. Monthly revenue by service:
   SELECT rs.name, SUM(rts.price) as total
   FROM repair_transaction_services rts
   JOIN repair_services rs ON rts.repair_service_id = rs.id
   JOIN repair_transactions rt ON rts.repair_transaction_id = rt.id
   WHERE MONTH(rt.created_at) = ? AND YEAR(rt.created_at) = ?
   GROUP BY rs.id

5. Repair history audit:
   SELECT * FROM repair_status_history
   WHERE repair_transaction_id = ?
   ORDER BY created_at ASC
```

This is your complete database schema! Would you like me to:
1. Create an SQL file with all CREATE TABLE statements?
2. Add more detailed documentation?
3. Move to Phase 2 (Controllers & Services)?
