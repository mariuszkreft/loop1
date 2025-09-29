# Product Requirements Document: Give.T Core Personalization Engine (POC)

**Version:** 1.1 (Updated with Complete Task Breakdown and Estimations)  
**Date:** August 29, 2025  
**Original Author:** Gemini (Synthesized from Founder Vision & Technical Strategy)  
**Updated By:** Development Team  
**Target Audience:** Workstream 2 - Development Team

---

## 1. Introduction

### 1.1. Vision
To create a "life balancing guide" that is so insightful and effective that it makes users "addicted to their higher future self." We are not building another wellness app; we are building a deeply personal, AI-powered companion that delivers the right inspiration at the right time, fostering growth, fulfillment, and well-being.

### 1.2. The Problem We Are Solving
Our target users are overwhelmed by a fragmented wellness market and suffer from "decision fatigue." They waste precious time searching for self-care practices and products, often resulting in inaction. They need a single, trusted source that understands them deeply and provides clear, curated guidance.

**Target Demographic:** Busy working mothers who typically use the app around 10 PM.

### 1.3. Goal of this Document (The POC)
The purpose of this document is to define the technical requirements for a **Proof of Concept (POC)**. The singular goal of this POC is to **validate our core technical hypothesis**: that we can build a scalable, continuous learning loop that progressively creates a user profile (Persona Ontology) and uses it to deliver hyper-personalized content (Inspirations). This POC is not a user-facing, polished product; it is the foundational engine upon which the entire Give.T experience will be built.

---

## 2. The Core Personalization Model: Traits vs. States

Our AI's personalization logic is a two-layer model designed to mirror human needs. This is the "secret sauce" of our app.

### 2.1. States (The "What")
This is the user's immediate, temporary condition. It answers the question, **"What does the user need *right now*?"**
- **Examples:** `Current emotional state` (stressed, calm), `Cognitive load` (high, low).
- **Function:** **States act as the primary filter.** If a user's state is "overwhelmed," the system's first job is to select from a pool of inspirations specifically designed to address overwhelm.

### 2.2. Traits (The "How")
These are the user's stable, long-term personality characteristics. They answer the question, **"How does this user best receive and engage with this type of support?"**
- **Examples:** `Modality preference` (audio, visual), `Resilience` (high, low), `Regulatory focus` (promotion vs. prevention).
- **Function:** **Traits act as the modulator or secondary filter.** After selecting a pool of inspirations based on the user's State, the system will use their Traits to pick the single best one and tailor its presentation.

### 2.3. Example Scenario
Two users are in the **State** of "feeling stressed."
- **User A's Traits:** High Resilience, Prefers Action-Based tasks.
- **User B's Traits:** Low Resilience, Prefers Reflective tasks (Writing).

The AI will first select a pool of inspirations for the "stressed" State. Then, for **User A**, it will choose a challenging, action-oriented inspiration (e.g., "Try this 5-minute powerful breathing exercise"). For **User B**, it will choose a gentler, reflective inspiration (e.g., "Take 2 minutes to write down what's on your mind").

---

## 3. Functional Requirements

The following requirements define the end-to-end functionality of the core personalization loop for this POC.

### 3.1. Module: User Input & Diagnostics

#### REQ-POC-3.1.1 (Onboarding Input Service)
- **Description:** Capture the user's initial State.
- **UI:** A single screen asking, "How are you feeling right now?" with 3-5 emotion-based answer choices (e.g., "Overwhelmed," "Tired," "Okay," "Inspired").
- **Backend:** An API endpoint that accepts the User ID and their selected State.
- **User Stories:** COD-5 (UI), COD-6 (API)

#### REQ-POC-3.1.2 (LLM Reasoning Service)
- **Description:** A backend service that translates the user's raw input into structured data for the Persona Ontology.
- **Inputs:** User ID, Question Text, Selected Answer.
- **Process:** The service will construct a detailed prompt for a Large Language Model (e.g., GPT-4, Gemini).
- **Output:** A structured JSON object with states and traits.
- **User Story:** COD-7

### 3.2. Module: Persona Ontology V1

#### REQ-POC-3.2.1 (Ontology Database Schema)
- **Description:** The database must distinguish between attribute types.
- **Proposed Table:** `UserOntologyAttributes`
- **User Story:** COD-8

#### REQ-POC-3.2.2 (Ontology Write Service)
A service that populates and updates the user's ontology in the database based on input from the LLM service.
- **User Story:** COD-9

### 3.3. Module: Inspiration Library & Matching Engine

#### REQ-POC-3.3.1 (Inspiration Library Database)
- **Description:** A database to store inspirations, pre-populated with at least 30 sample items.
- **User Story:** COD-10

#### REQ-POC-3.3.2 (Inspiration Metadata)
- **Description:** Each inspiration's metadata must contain tags for its target State and its ideal Trait profile.
- **User Story:** COD-11

#### REQ-POC-3.3.3 (Matching Service - The Core AI Logic)
- **Description:** This service will implement the two-stage "State-based selection, Trait-based modulation" logic.
- **Important Enhancement:** Must support both confirmative and opposing inspirations to challenge assumptions and accelerate learning.
- **User Story:** COD-12

### 3.4. Module: User Interaction & Feedback

#### REQ-POC-3.4.1 (Display UI)
A basic UI screen that displays the content of the selected inspiration.
- **User Story:** COD-13

#### REQ-POC-3.4.2 (Feedback UI)
Simple UI elements on the inspiration screen: `"This was for me"` (Positive) and `"Not right now"` (Negative).
- **User Story:** COD-14

#### REQ-POC-3.4.3 (Feedback Tracking Service)
An API endpoint that logs the feedback event.
- **User Story:** COD-15

### 3.5. Module: The Learning Loop

#### REQ-POC-3.5.1 (Ontology Refinement Logic)
- **Description:** A process that uses feedback to refine the user's profile.
- **Enhancement:** Must track validity metrics (convergent, discriminant, predictive).
- **User Story:** COD-16

---

## 4. Non-Functional Requirements (NFRs)

- **NFR-4.1 (Architecture):** Must be modular (e.g., microservices-oriented). **[COD-17]**
- **NFR-4.2 (Proposed Tech Stack):** Python/Node.js, PostgreSQL with pgvector, LLM APIs. **[COD-18]**
- **NFR-4.3 (Cost Management):** All external API calls must be logged and monitored. **[COD-19]**
- **NFR-4.4 (Security & Privacy):** GDPR/CCPA compliant from the start. **[COD-20]**
- **NFR-4.5 (Testability):** Comprehensive test suite required. **[COD-21]**

---

## 5. POC Success Metrics

### Primary Metric (Technical Validation - Pass/Fail)
1. A user's self-reported **State** is correctly logged in their Persona Ontology.
2. The Matching Service correctly performs the **two-stage filtering**.
3. User feedback correctly triggers a change in the `confidence_score`.

### Secondary Metric (Qualitative Validation)
- Conduct a qualitative test with 5-10 internal users.
- **Goal:** Achieve an average relevance score of 3.5 or higher.
- **User Story:** COD-22

---

## 6. Advanced Features (Added Post-Kickoff)

### 6.1. Validity and Reliability Measurement System
- Test-retest reliability scoring
- Convergent, discriminant, and predictive validity tracking
- Diagnostic decision tree for validity failures
- **User Stories:** COD-23, COD-25

### 6.2. Opposing Inspiration Strategy
- Balance between confirmative (70%) and opposing (30%) inspirations
- Challenges user assumptions to accelerate learning
- **User Story:** COD-24

### 6.3. Intervention Library System
A continuously growing intervention library powered by GenAI:
- **Foundation:** Evidence-based interventions (MBSR, CBT, ACT, etc.) **[COD-26]**
- **GenAI Expansion:** Automated generation of variations and novel syntheses **[COD-27]**
- **Validation Layer:** Expert review and A/B testing **[COD-28]**
- **Auto-Tagging:** GenAI-based metadata extraction **[COD-29]**
- **Learning Loop:** Continuous improvement based on outcomes **[COD-30]**
- **Governance:** Tiered evidence model with safety framework **[COD-31]**

---

## 7. Out of Scope for this POC

To ensure focus, the following items are explicitly **out of scope** for this initial Proof of Concept:

- Full User Account Management (Login, Registration, Profile)
- Polished, production-ready UI/UX design
- The Marketplace and any e-commerce functionality
- Community features (sharing, following)
- The "Collage" or any other reward system
- Push notifications
- Passive data collection and learning from behavioral signals

---

## 8. Effort Estimation (UPDATED)

### 8.1. Total Effort Summary

**Total Story Points:** 107  
**Total Estimated Effort:** 67-107 developer days  
**Number of User Stories:** 31

### 8.2. Breakdown by Module

| Module | Story Points | Effort Range |
|--------|-------------|--------------|
| User Input & Diagnostics | 5 | 3.5-6 days |
| Persona Ontology | 4 | 3-3 days |
| Inspiration Library & Matching | 9 | 6-9 days |
| User Interaction & Feedback | 5 | 2.5-3.5 days |
| Learning Loop | 3 | 2-3 days |
| Infrastructure & NFRs | 32 | 19-31 days |
| Validity & Measurement | 13 | 10-13 days |
| Intervention Library System | 29 | 21-30 days |
| Testing & Validation | 13 | 8-11 days |

### 8.3. Team Size Recommendations

- **1 Developer:** 13-21 weeks
- **2 Developers:** 7-11 weeks
- **3 Developers:** 5-7 weeks (recommended for POC timeline)

### 8.4. Critical Path

The following items form the critical path and should be prioritized:

1. **Week 1-2:** COD-18 (Tech Stack) + COD-17 (Architecture)
2. **Week 2-3:** COD-8 (Database) + Core Input/Output modules
3. **Week 3-5:** COD-12 (Matching Service) - Core AI Logic
4. **Week 5-6:** Learning Loop + Feedback System
5. **Week 6-8:** Advanced Features + Testing
6. **Week 8-9:** Integration Testing + POC Validation

---

## 9. Risk Assessment

### High-Risk Items
- **COD-17:** Architecture foundation - delays impact everything
- **COD-12:** Core matching algorithm - central to POC success
- **COD-20:** Security compliance - regulatory requirements
- **COD-27:** GenAI pipeline - quality and safety concerns

### Mitigation Strategies
1. Start with foundation tasks immediately
2. Allocate senior developers to high-risk items
3. Plan for iterative refinement of AI components
4. Build in buffer time for compliance reviews

---

## 10. Success Criteria Verification

The POC will be considered successful when:

1. **Technical Success:** All three primary metrics pass
2. **User Validation:** Average relevance score ≥3.5/5
3. **Performance:** Matching service response time <500ms
4. **Reliability:** System maintains >95% uptime during testing
5. **Learning:** Measurable improvement in recommendation accuracy over time

---

## Appendix A: Complete User Story List

For the complete list of all 31 user stories with detailed acceptance criteria, see the accompanying document: `user-stories.md`

---

## Appendix B: Technical Architecture Decisions

### Database Choice: PostgreSQL with pgvector
- Enables efficient similarity search for trait/state matching
- Scalable for future vector embeddings
- Supports JSONB for flexible metadata storage

### LLM Integration Strategy
- Start with API-based integration (OpenAI/Google)
- Plan for future self-hosted models
- Implement prompt versioning and A/B testing

### Microservices Communication
- REST for synchronous operations
- Event-driven architecture for learning loop
- Consider GraphQL for future client flexibility

---

## Version History

- **v1.0** (Aug 28, 2025): Initial PRD created by Gemini
- **v1.1** (Aug 29, 2025): Added complete task breakdown, estimations, and insights from tech kickoff meeting