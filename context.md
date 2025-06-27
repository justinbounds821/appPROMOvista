### Project Overview

Promovista is a mobile app for independent shop-owners in Romania. It rewards stores with points (1 pt = 1 RON) for shelving niche brands that lack classic distribution and lets them reinvest those points in useful services (website, ERP add-ons, online ads). The result: extra revenue **and** a clear path to modernise operations.

---

### Platform & Stack

* **Front-end** : React Native (Expo) + TypeScript, minimalist UI, Lottie micro-animations
* **Back-end** : Supabase (`Postgres`, `Edge Functions`, RLS)
* **AI service** : ONNX model running in Google Cloud Run (serverless container)
* **Payments** : Stripe Connect for card top-up & automatic SEPA payouts
* **Storage** : Supabase Storage (signed URLs, 7-day expiry)
* **Build & Deploy** : EAS Build + OTA updates; CI/CD via GitHub Actions

### Authentication Flow

* SMS OTP via Supabase
* First login: store enters company data & IBAN
* Role auto-assignment: Shop, Agent, Auditor, Admin (read-only Producer in v1.1)
* All routes served over HTTPS

### Core Features

#### Campaign Marketplace

* Auto-filtered cards by county, store profile, shelf space
* One-tap T\&C accept → agent automatically assigned

#### Proof-of-Display

* Camera overlay with green frame to capture full shelf
* Instant ONNX validation (“Product detected” or hint to retake)
* Low-score photos routed to human auditor

#### Wallet & Points Economy

* Earn points on campaign validation (48 h pending for anti-fraud)
* Buy points with card; instant credit
* Simple conversion: 1 pt = 1 RON

#### Services Marketplace

* Spend points on third-party services (“Request” locks balance)
* Cash-out to IBAN once ≥ 100 pts (1 % fee, SEPA ≤ 3 days)

#### Admin & Reporting

* Campaign CRUD, wallet management, transaction logs
* Automated PDF/email reports for producers

### AI / AR Components

* Shelf-image classifier (ONNX) returns score **and** actionable hint
* AR guidance overlay (Expo camera) for re-framing
* Feedback loop: difficult cases reviewed by auditors, used to retrain model

### Gamification & Learning

* Badge: “First Campaign” (Lottie animation)
* Progress bar toward 500 pts bonus
* Contextual micro-learning:
  • 15-sec merchandising clip after first campaign accept
  • “Quick Tips” section (Markdown-powered) in profile

### Data & Security

* Row Level Security: each store sees only its own data
* Signed image URLs, expire after 7 days
* Stripe handles all card data; Promovista stores no sensitive tokens
* AML safeguards: volume limits + aggregated-transaction monitoring
* Audit logs retained for GDPR compliance

### Roadmap (6 mo)

* **M1** : design system, DB schema, Stripe sandbox
* **M2** : OTP auth, company profile, wallet top-up
* **M3** : campaign list & accept, agent auto-assign
* **M4** : AR camera, AI validation, “First Campaign” badge
* **M5** : full cash-out flow, push notifications, micro-learning
* **M6** : public beta, metrics monitoring, copy & animation fine-tuning

### Immediate Next Steps

* Approve colour palette, fonts & victory messages for badge/progress
* Finalise API contract (fields `hint`, `store_score`)
* Draw low-fi wireframes and validate with stakeholders

<!-- End of CONTEXT.md (≈ 2 400 chars) -->
