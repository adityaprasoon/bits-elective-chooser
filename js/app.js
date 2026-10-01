(() => {
  "use strict";

  const config = window.APP_CONFIG;
  const storageKey = "bits_elective_choice_v1";
  const courses = config.buckets.flatMap((bucket) =>
    bucket.courses.map((course) => ({ ...course, bucketId: bucket.id, bucketName: bucket.name }))
  );
  const courseByCode = new Map(courses.map((course) => [course.code, course]));
  const specializationById = new Map(config.specializations.map((item) => [item.id, item]));
  const specializationCodes = new Map();

  config.specializations.forEach((specialization) => {
    const codes = specialization.mandatoryCourseCodes || [specialization.mandatoryCourseCode];
    codes.filter(Boolean).forEach((code) => {
      const linked = specializationCodes.get(code) || [];
      linked.push(specialization.name);
      specializationCodes.set(code, linked);
    });
  });

  const elements = {
    title: document.querySelector("#program-title"),
    subtitle: document.querySelector("#program-subtitle"),
    requiredCount: document.querySelector("#required-count"),
    specializationButtons: document.querySelector("#specialization-buttons"),
    courseGrid: document.querySelector("#course-grid"),
    resetButton: document.querySelector("#reset-button"),
    shareButton: document.querySelector("#share-button"),
    toast: document.querySelector("#toast"),
    unitTotal: document.querySelector("#unit-total"),
    selectionStatus: document.querySelector("#selection-status"),
    commonCourseList: document.querySelector("#common-course-list"),
    selectedCourseList: document.querySelector("#selected-course-list"),
    specializationResult: document.querySelector("#specialization-result"),
    combinationCount: document.querySelector("#combination-count"),
    specializationFilter: document.querySelector("#specialization-filter"),
    courseFilter: document.querySelector("#course-filter"),
    unitFilter: document.querySelector("#unit-filter"),
    searchFilter: document.querySelector("#search-filter"),
    combinationTable: document.querySelector("#combination-table"),
    emptyResults: document.querySelector("#empty-results")
  };

  let state = readInitialState();

  function sanitizeSelection(selection, targetSpecialization) {
    const chosen = [];
    const occupiedBuckets = new Set();
    const requiredCodes = targetSpecialization
      ? targetSpecialization.mandatoryCourseCodes || [targetSpecialization.mandatoryCourseCode]
      : [];

    for (const code of requiredCodes.filter(Boolean)) {
      const course = courseByCode.get(code);
      if (course && !occupiedBuckets.has(course.bucketId)) {
        chosen.push(code);
        occupiedBuckets.add(course.bucketId);
      }
    }

    for (const code of selection || []) {
      const course = courseByCode.get(code);
      if (
        course &&
        !chosen.includes(code) &&
        !occupiedBuckets.has(course.bucketId) &&
        chosen.length < config.program.requiredElectivesCount
      ) {
        chosen.push(code);
        occupiedBuckets.add(course.bucketId);
      }
    }

    return chosen.slice(0, config.program.requiredElectivesCount);
  }

  function readInitialState() {
    const params = new URLSearchParams(window.location.search);
    const hasUrlState = params.has("e1") || params.has("e2") || params.has("spec");
    let stored = null;

    if (hasUrlState) {
      stored = {
        selectedElectives: [params.get("e1"), params.get("e2")].filter(Boolean),
        targetSpecialization: params.get("spec")
      };
    } else {
      try {
        stored = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      } catch {
        stored = null;
      }
    }

    const target = stored && specializationById.get(stored.targetSpecialization);
    const selected = sanitizeSelection(stored && stored.selectedElectives, target);
    return {
      selectedElectives: selected,
      targetSpecialization: target ? target.id : null
    };
  }

  function persistState() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Storage may be unavailable in private browsing or restricted contexts.
    }

    const url = new URL(window.location.href);
    url.search = "";
    state.selectedElectives.forEach((code, index) => url.searchParams.set(`e${index + 1}`, code));
    if (state.targetSpecialization) {
      url.searchParams.set("spec", state.targetSpecialization);
    }
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function selectedSpecializations(selected = state.selectedElectives) {
    return config.specializations.filter((specialization) => {
      const required = specialization.mandatoryCourseCodes || [specialization.mandatoryCourseCode];
      return required.filter(Boolean).every((code) => selected.includes(code));
    });
  }

  function updateState(selectedElectives, targetSpecialization = state.targetSpecialization) {
    const target = specializationById.get(targetSpecialization);
    state = {
      selectedElectives: sanitizeSelection(selectedElectives, target),
      targetSpecialization: target ? target.id : null
    };
    persistState();
    render();
  }

  function makeCourseEntry(course) {
    const entry = document.createElement("li");
    const name = document.createElement("span");
    const units = document.createElement("span");
    name.textContent = `${course.code} — ${course.title}`;
    units.className = "units";
    units.textContent = `${course.units} units`;
    entry.append(name, document.createTextNode(" "), units);
    return entry;
  }

  function renderSpecializationButtons() {
    elements.specializationButtons.replaceChildren();
    const generalButton = document.createElement("button");
    generalButton.type = "button";
    generalButton.className = "button specialization-button";
    generalButton.textContent = "General / no specialization";
    generalButton.setAttribute("aria-pressed", String(!state.targetSpecialization));
    generalButton.addEventListener("click", () => updateState(state.selectedElectives, null));
    elements.specializationButtons.append(generalButton);

    config.specializations.forEach((specialization) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button specialization-button";
      button.textContent = specialization.name;
      button.setAttribute("aria-pressed", String(state.targetSpecialization === specialization.id));
      button.addEventListener("click", () => {
        const requiredCodes = specialization.mandatoryCourseCodes || [specialization.mandatoryCourseCode];
        updateState(state.selectedElectives, specialization.id);
        if (!requiredCodes.filter(Boolean).every((code) => state.selectedElectives.includes(code))) {
          showToast("This specialization does not fit the configured elective and bucket rules.");
        }
      });
      elements.specializationButtons.append(button);
    });
  }

  function renderCourses() {
    elements.courseGrid.replaceChildren();
    config.buckets.forEach((bucket) => {
      const section = document.createElement("section");
      section.className = "bucket";
      const heading = document.createElement("h3");
      heading.textContent = bucket.name;
      const list = document.createElement("div");
      list.className = "course-list";
      bucket.courses.forEach((courseData) => {
        const course = courseByCode.get(courseData.code);
        const selected = state.selectedElectives.includes(course.code);
        const locked = state.targetSpecialization && (specializationById.get(state.targetSpecialization).mandatoryCourseCodes ||
          [specializationById.get(state.targetSpecialization).mandatoryCourseCode]).includes(course.code);
        const bucketOccupied = state.selectedElectives.some((code) =>
          courseByCode.get(code).bucketId === bucket.id && code !== course.code
        );
        const countReached = state.selectedElectives.length >= config.program.requiredElectivesCount;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `course-card${selected ? " selected" : ""}${locked && selected ? " locked" : ""}`;
        button.disabled = !selected && (bucketOccupied || countReached);
        button.setAttribute("aria-pressed", String(selected));
        button.setAttribute("aria-label", `${course.code}, ${course.title}, ${course.units} units${locked ? ", required by selected specialization" : ""}`);

        const code = document.createElement("span");
        code.className = "course-code";
        code.textContent = course.code;
        const title = document.createElement("span");
        title.className = "course-title";
        title.textContent = course.title;
        const meta = document.createElement("span");
        meta.className = "course-meta";
        const units = document.createElement("span");
        units.textContent = `${course.units} units`;
        meta.append(units);
        const badges = specializationCodes.get(course.code);
        if (badges) {
          const badge = document.createElement("span");
          badge.className = "badge";
          badge.textContent = badges.join(" · ");
          meta.append(badge);
        } else if (locked && selected) {
          const badge = document.createElement("span");
          badge.className = "badge";
          badge.textContent = "Locked";
          meta.append(badge);
        }

        button.append(code, title, meta);
        button.addEventListener("click", () => {
          if (locked && selected) return;
          const next = selected
            ? state.selectedElectives.filter((item) => item !== course.code)
            : [...state.selectedElectives, course.code];
          updateState(next);
        });
        list.append(button);
      });
      section.append(heading, list);
      elements.courseGrid.append(section);
    });
  }

  function renderSummary() {
    elements.commonCourseList.replaceChildren(...config.mandatoryCourses.map(makeCourseEntry));
    const selectedCourses = state.selectedElectives.map((code) => courseByCode.get(code));
    elements.selectedCourseList.replaceChildren(...selectedCourses.map(makeCourseEntry));
    if (!selectedCourses.length) {
      const placeholder = document.createElement("li");
      placeholder.textContent = "No electives selected yet";
      elements.selectedCourseList.append(placeholder);
    }

    const units = config.mandatoryCourses.reduce((total, course) => total + course.units, 0) +
      selectedCourses.reduce((total, course) => total + course.units, 0);
    elements.unitTotal.textContent = `${units} ${units === 1 ? "unit" : "units"}`;

    const complete = selectedCourses.length === config.program.requiredElectivesCount;
    elements.selectionStatus.className = `selection-status${complete ? " complete" : ""}`;
    elements.selectionStatus.textContent = complete
      ? "Your elective selection is complete."
      : `Select ${config.program.requiredElectivesCount - selectedCourses.length} more elective${config.program.requiredElectivesCount - selectedCourses.length === 1 ? "" : "s"}.`;

    const matches = selectedSpecializations();
    elements.specializationResult.textContent = matches.length
      ? `${matches.length > 1 ? "Dual / multi-specialization" : "Specialization"}: ${matches.map((item) => item.name).join(" + ")}`
      : "General / no specialization";
  }

  function generateCombinations() {
    const combinations = [];
    const needed = config.program.requiredElectivesCount;
    function chooseBuckets(startIndex, chosen) {
      if (chosen.length === needed) {
        combinations.push([...chosen]);
        return;
      }
      const bucketsRemaining = config.buckets.length - startIndex;
      if (bucketsRemaining < needed - chosen.length) return;
      for (let index = startIndex; index < config.buckets.length; index += 1) {
        config.buckets[index].courses.forEach((course) => {
          chosen.push(courseByCode.get(course.code));
          chooseBuckets(index + 1, chosen);
          chosen.pop();
        });
      }
    }
    chooseBuckets(0, []);
    return combinations;
  }

  const combinations = generateCombinations().map((selected) => ({
    selected,
    specializations: selectedSpecializations(selected.map((course) => course.code)),
    units: config.mandatoryCourses.reduce((total, course) => total + course.units, 0) +
      selected.reduce((total, course) => total + course.units, 0)
  }));

  function combinationMatches(combination) {
    const specialization = elements.specializationFilter.value;
    if (specialization === "general" && combination.specializations.length) return false;
    if (specialization === "dual" && combination.specializations.length < 2) return false;
    if (
      specialization !== "all" &&
      specialization !== "general" &&
      specialization !== "dual" &&
      !combination.specializations.some((item) => item.id === specialization)
    ) return false;
    if (
      elements.courseFilter.value !== "all" &&
      !combination.selected.some((course) => course.code === elements.courseFilter.value)
    ) return false;
    if (elements.unitFilter.value !== "all" && combination.units !== Number(elements.unitFilter.value)) return false;

    const query = elements.searchFilter.value.trim().toLowerCase();
    const searchable = [
      ...combination.selected.flatMap((course) => [course.code, course.title]),
      ...combination.specializations.map((item) => item.name)
    ].join(" ").toLowerCase();
    return !query || searchable.includes(query);
  }

  function renderCombinations() {
    const visible = combinations.filter(combinationMatches);
    elements.combinationCount.textContent = `${visible.length} of ${combinations.length} combinations`;
    elements.combinationTable.replaceChildren();
    elements.emptyResults.hidden = visible.length > 0;

    visible.forEach((combination) => {
      const row = document.createElement("tr");
      combination.selected.forEach((course) => {
        const cell = document.createElement("td");
        const label = document.createElement("span");
        label.className = "combo-course";
        const code = document.createElement("strong");
        const title = document.createElement("span");
        code.textContent = course.code;
        title.textContent = course.title;
        label.append(code, title);
        cell.append(label);
        row.append(cell);
      });
      const specCell = document.createElement("td");
      specCell.textContent = combination.specializations.length
        ? combination.specializations.map((item) => item.name).join(" + ")
        : "General / none";
      const unitsCell = document.createElement("td");
      unitsCell.textContent = `${combination.units} units`;
      const actionCell = document.createElement("td");
      const apply = document.createElement("button");
      apply.type = "button";
      apply.className = "button button-primary";
      apply.textContent = "Apply this plan";
      apply.addEventListener("click", () => {
        updateState(combination.selected.map((course) => course.code), null);
        document.querySelector("#selector-heading").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      actionCell.append(apply);
      row.append(specCell, unitsCell, actionCell);
      elements.combinationTable.append(row);
    });
  }

  function showToast(message) {
    elements.toast.textContent = message;
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => {
      elements.toast.textContent = "";
    }, 3000);
  }

  function render() {
    renderSpecializationButtons();
    renderCourses();
    renderSummary();
    renderCombinations();
  }

  function initializeFilters() {
    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.code;
      option.textContent = `${course.code} — ${course.title}`;
      elements.courseFilter.append(option);
    });
    [...new Set(combinations.map((combination) => combination.units))]
      .sort((first, second) => first - second)
      .forEach((units) => {
        const option = document.createElement("option");
        option.value = String(units);
        option.textContent = `${units} units`;
        elements.unitFilter.append(option);
      });
    [elements.specializationFilter, elements.courseFilter, elements.unitFilter, elements.searchFilter]
      .forEach((control) => control.addEventListener("input", renderCombinations));
  }

  elements.title.textContent = config.program.title;
  elements.subtitle.textContent = config.program.subtitle;
  elements.requiredCount.textContent = config.program.requiredElectivesCount;
  elements.resetButton.addEventListener("click", () => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Storage may be unavailable in private browsing or restricted contexts.
    }
    updateState([], null);
  });
  elements.shareButton.addEventListener("click", async () => {
    try {
      await window.navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Clipboard access is unavailable. Copy the page URL from your address bar.");
    }
  });

  initializeFilters();
  render();
  persistState();
})();
