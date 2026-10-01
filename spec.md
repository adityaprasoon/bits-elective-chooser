# BITS Elective Chooser - Specification Document (`spec.md`)

## 1. Overview & Goals

**BITS Elective Chooser** is a client-side, zero-backend web application designed for students of the **M.Tech AIML (Semester 2)** program (and easily adaptable to other cohorts) to explore, select, and validate elective course choices under academic constraints.

The application will be deployed for free on **GitHub Pages** with zero build configuration or external server dependencies.

---

## 2. Technical Stack & Architecture

- **Stack**: Pure Vanilla HTML5, CSS3, and ES6+ JavaScript.
- **Dependencies**: None (zero external npm packages or build steps).
- **Hosting**: GitHub Pages (static deployment directly from `main` branch or `/docs`).
- **State & Persistence**:
  - `localStorage` for automatic auto-saving and recovery of student preferences.
  - URL Query Parameters (e.g., `?e1=AIMLCZG530&e2=AIMLCZG525`) for shareable configurations.
  - Native Clipboard API for copying shareable links.

---

## 3. Curriculum & Academic Data

### 3.1. Mandatory Common Courses (Fixed Load)
Every student must take these 2 compulsory subjects in Semester 2:
1. **Deep Reinforcement Learning (DRL)** — 4 Units
2. **Artificial Computational Intelligence (ACI)** — 4 Units

*Total Common Units:* 8 Units.

### 3.2. Elective Pool & Buckets
Students must choose exactly **2 electives** from a total of **10 courses** distributed across **4 Buckets**:

| Bucket | Course Code | Course Title | Units | Specialization Note |
|---|---|---|---|---|
| **Bucket 1** | `AIMLCZG530` | Natural Language Processing | 4 | **Mandatory for NLP Specialization** |
| **Bucket 2** | `AIMLCZG567` | AI and ML Techniques for Cyber Security | 5 | — |
| | `AIMLCZG525` | Computer Vision | 4 | **Mandatory for Audio and Vision Specialization** |
| | `AIMLCZG546` | Software Engineering for Machine Learning | 4 | — |
| **Bucket 3** | `AIMLCZG533` | Unsupervised Deep Learning | 4 | **Mandatory for Deep Learning Specialization** |
| | `AIMLCZG526` | Probabilistic Graphical Models | 4 | — |
| | `AIMLZG540`  | Video Analysis | 4 | — |
| **Bucket 4** | `AIMLCZG537` | Information Retrieval | 4 | — |
| | `AIMLCZG529` | Data Management for Machine Learning | 4 | — |
| | `AIMLCZG515` | Distributed Machine Learning | 4 | — |

---

## 4. Academic Rules & Mathematical Constraints

1. **Semester Load**: Exactly 4 courses (2 common mandatory + 2 electives).
2. **Bucket Constraint**: A student can take **at most 1 course from any single bucket**.
   - The 2 electives must come from two distinct buckets $(B_i, B_j)$ where $i \neq j$.
   - Mathematical combinations:
     - $B_1 \times B_2 = 1 \times 3 = 3$
     - $B_1 \times B_3 = 1 \times 3 = 3$
     - $B_1 \times B_4 = 1 \times 3 = 3$
     - $B_2 \times B_3 = 3 \times 3 = 9$
     - $B_2 \times B_4 = 3 \times 3 = 9$
     - $B_3 \times B_4 = 3 \times 3 = 9$
     - **Total valid elective combinations = 36**.
3. **Specializations**:
   - **Natural Language Processing**: Requires `AIMLCZG530` (Bucket 1).
   - **Audio and Vision**: Requires `AIMLCZG525` (Bucket 2).
   - **Deep Learning**: Requires `AIMLCZG533` (Bucket 3).
4. **Second Elective Rules**:
   - Free choice from any other bucket, subject only to the bucket constraint.
5. **Dual Specialization**:
   - A student selecting two mandatory courses from different specializations qualifies for a **Dual Specialization**:
     - NLP + Audio and Vision (`AIMLCZG530` + `AIMLCZG525`)
     - NLP + Deep Learning (`AIMLCZG530` + `AIMLCZG533`)
     - Audio and Vision + Deep Learning (`AIMLCZG525` + `AIMLCZG533`)
6. **No Specialization (General)**:
   - A student can opt not to specialize and pick any 2 bucket-compatible courses.
7. **Credit Range**:
   - If `AIMLCZG567` (5 units) is selected: Total = $8 + 5 + 4 = 17\text{ Units}$.
   - Otherwise: Total = $8 + 4 + 4 = 16\text{ Units}$.

---

## 5. User Interface & Key Workflows

### 5.1. Workflow 1: Interactive Selector
- **Specialization Quick-Select Bar**:
  - Buttons for: *No Specialization (General)*, *NLP*, *Audio & Vision*, *Deep Learning*.
  - Selecting a specialization auto-selects and locks the corresponding mandatory elective.
  - Automatically disables other courses in the same bucket to prevent invalid selections.
- **Bucket-Wise Course Grid**:
  - Clear visual grouping by Bucket (1 to 4).
  - Course cards showing Course Code, Course Title, Units, and Specialization badges.
  - Real-time card states:
    - *Selected* (highlighted/active).
    - *Locked* (mandatory for chosen specialization).
    - *Disabled / Conflict* (another course in the same bucket is already chosen).
    - *Available* (can be selected as 2nd elective).
- **Semester Summary & Status Card**:
  - Displays complete 4-course schedule (2 fixed common + 2 electives).
  - Total Semester Units indicator (16 or 17 Units).
  - Specialization Badge (e.g., "Specialization: NLP", "Dual Specialization: NLP + Audio & Vision", or "General / No Specialization").
- **Action Controls**:
  - **Reset Button**: Resets all choices to fresh state and clears localStorage.
  - **Share Button**: Copies URL containing query parameters to clipboard with a toast notification ("Link copied to clipboard!").

### 5.2. Workflow 2: All Valid Combinations Explorer
- Interactive table/matrix displaying all 36 valid elective combinations.
- Real-time search and filter controls:
  - Filter by Specialization (All, NLP, Audio & Vision, Deep Learning, Dual, General).
  - Filter by specific preferred course (dropdown/search).
  - Filter by total units (16 vs 17).
- Quick Action: Clicking "Apply this Plan" loads the combination directly into the Interactive Selector and updates local storage and URL query params.

---

## 6. Persistence & State Management

- **Storage Key**: `bits_elective_choice_v1`.
- **Saved State Schema**:
  ```json
  {
    "selectedElectives": ["AIMLCZG530", "AIMLCZG525"],
    "targetSpecialization": "nlp"
  }
  ```
- **URL Synchronization**:
  - State serializes into URL search params: `?e1=AIMLCZG530&e2=AIMLCZG525&spec=nlp`.
  - When opening a link with query parameters, the app parses and restores the exact elective selection.
- **Auto-Save**: Updates on every user interaction without requiring an explicit "Save" action.

---

## 7. Accessibility, Responsiveness & Design System

- Clean, academic-themed responsive design (navy/slate blue accent, clean card layouts).
- Mobile-friendly grid (collapses from 4-column desktop layout to 2 or 1 column on mobile screens).
- Semantic HTML5 elements and ARIA attributes for screen readers and keyboard navigation.

---

## 8. Directory & File Structure

```
bits-elective-chooser/
├── index.html        # Single-page markup with both workflows
├── css/
│   └── styles.css    # Responsive styles, grid layouts, badge states
├── js/
│   ├── data.js       # Courses, buckets, and specialization definitions
│   └── app.js        # Logic for selection, validation, matrix generator, URL/storage sync
├── README.md         # Documentation & GitHub Pages deployment instructions
└── spec.md           # This specification document
```
