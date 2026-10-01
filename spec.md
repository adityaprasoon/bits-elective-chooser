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
- **Configurability**:
  - All curriculum data (program metadata, mandatory common courses, buckets, courses, units, and specializations) is completely decoupled from UI and application logic.
  - Sourced from a dedicated configuration file (`data/config.json` or `js/config.js`), allowing instant repurposing for different academic programs or semesters without modifying application code.

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

1. **Dynamic Program Load**: Configurable number of common courses (default 2) and elective choices (default 2).
2. **Generalized Bucket Constraint**: A student can take **at most 1 course from any single bucket**.
   - With $N$ electives to choose, they must come from $N$ distinct buckets $(B_{k_1}, B_{k_2}, \dots, B_{k_N})$.
   - The matrix generator dynamically computes all Cartesian combinations across eligible bucket subsets.
   - For default M.Tech AIML Sem 2 (2 electives across 4 buckets):
     - $B_1 \times B_2 = 1 \times 3 = 3$
     - $B_1 \times B_3 = 1 \times 3 = 3$
     - $B_1 \times B_4 = 1 \times 3 = 3$
     - $B_2 \times B_3 = 3 \times 3 = 9$
     - $B_2 \times B_4 = 3 \times 3 = 9$
     - $B_3 \times B_4 = 3 \times 3 = 9$
     - **Total valid elective combinations = 36**.
3. **Configurable Specializations**:
   - Each specialization definition in the configuration specifies its mandatory course code(s) (e.g., `AIMLCZG530` for NLP, `AIMLCZG525` for Audio and Vision, `AIMLCZG533` for Deep Learning).
   - The application dynamically verifies whether selected courses meet one or multiple specialization rules.
4. **Second Elective Rules**:
   - Free choice from any other bucket, subject only to the bucket constraint.
5. **Dual / Multi-Specialization**:
   - Evaluated dynamically: whenever the selected electives satisfy all mandatory requirements for multiple specializations, the app awards and displays all matching specializations.
6. **No Specialization (General)**:
   - Supported natively: if the chosen combination doesn't satisfy any specialization or if the student picks "General", it defaults to General/No Specialization.
7. **Credit Calculation**:
   - Calculated dynamically by summing units of mandatory common courses and selected electives from the config. For the default data:
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

## 8. Configuration Data Schema (`data/config.json` / `js/config.js`)

To enable seamless repurposing for other programs, semesters, or institutions, all data is declared in a single, clearly structured configuration object. 

### 8.1. Schema Specification

```json
{
  "program": {
    "title": "M.Tech AIML (Semester 2) Elective Chooser",
    "subtitle": "Select your specialization and electives for the upcoming semester",
    "requiredElectivesCount": 2
  },
  "mandatoryCourses": [
    {
      "code": "DRL",
      "title": "Deep Reinforcement Learning",
      "units": 4
    },
    {
      "code": "ACI",
      "title": "Artificial Computational Intelligence",
      "units": 4
    }
  ],
  "specializations": [
    {
      "id": "nlp",
      "name": "Natural Language Processing",
      "mandatoryCourseCode": "AIMLCZG530"
    },
    {
      "id": "audio_vision",
      "name": "Audio and Vision",
      "mandatoryCourseCode": "AIMLCZG525"
    },
    {
      "id": "deep_learning",
      "name": "Deep Learning",
      "mandatoryCourseCode": "AIMLCZG533"
    }
  ],
  "buckets": [
    {
      "id": "bucket_1",
      "name": "Bucket 1",
      "courses": [
        {
          "code": "AIMLCZG530",
          "title": "Natural Language Processing",
          "units": 4
        }
      ]
    },
    {
      "id": "bucket_2",
      "name": "Bucket 2",
      "courses": [
        {
          "code": "AIMLCZG567",
          "title": "AI and ML Techniques for Cyber Security",
          "units": 5
        },
        {
          "code": "AIMLCZG525",
          "title": "Computer Vision",
          "units": 4
        },
        {
          "code": "AIMLCZG546",
          "title": "Software Engineering for Machine Learning",
          "units": 4
        }
      ]
    },
    {
      "id": "bucket_3",
      "name": "Bucket 3",
      "courses": [
        {
          "code": "AIMLCZG533",
          "title": "Unsupervised Deep Learning",
          "units": 4
        },
        {
          "code": "AIMLCZG526",
          "title": "Probabilistic Graphical Models",
          "units": 4
        },
        {
          "code": "AIMLZG540",
          "title": "Video Analysis",
          "units": 4
        }
      ]
    },
    {
      "id": "bucket_4",
      "name": "Bucket 4",
      "courses": [
        {
          "code": "AIMLCZG537",
          "title": "Information Retrieval",
          "units": 4
        },
        {
          "code": "AIMLCZG529",
          "title": "Data Management for Machine Learning",
          "units": 4
        },
        {
          "code": "AIMLCZG515",
          "title": "Distributed Machine Learning",
          "units": 4
        }
      ]
    }
  ]
}
```

### 8.2. Dual-Loading Strategy (CORS / Local File Friendly)
To guarantee the app works both:
1. When served over GitHub Pages (`fetch('./data/config.json')`), and
2. When opened locally directly from the filesystem (`file:///path/to/index.html` where CORS blocks `fetch` requests),
the configuration will be provided via `js/config.js` (defining `window.APP_CONFIG = { ... }`), while optionally supporting a fallback or override from `data/config.json`. This ensures zero-friction local testing and foolproof static hosting.

---

## 9. Directory & File Structure

```
bits-elective-chooser/
├── index.html        # Single-page markup with both workflows
├── css/
│   └── styles.css    # Responsive styles, grid layouts, badge states
├── js/
│   ├── config.js     # Externalized program, bucket, course & specialization configuration
│   └── app.js        # Dynamic logic: selection, constraint validation, matrix generator, URL/storage sync
├── README.md         # Documentation & GitHub Pages deployment instructions
└── spec.md           # This specification document
```
