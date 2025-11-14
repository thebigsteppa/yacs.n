// src/OpenSectionsPreference.js
// Stores a global default and per-course overrides for "show only open sections"

const COOKIE_KEY = "openSectionsPref";

class OpenSectionsPreference {
  constructor($cookies, state) {
    this.$cookies = $cookies;
    this.state = state || { global: false, perCourse: {} };
  }

  static load($cookies, key = COOKIE_KEY) {
    const data = $cookies.isKey(key) ? $cookies.get(key) : { global: false, perCourse: {} };
    // guard shape
    if (typeof data.global !== "boolean" || typeof data.perCourse !== "object") {
      return new OpenSectionsPreference($cookies, { global: false, perCourse: {} });
    }
    return new OpenSectionsPreference($cookies, data);
  }

  save(key = COOKIE_KEY) {
    this.$cookies.set(key, this.state);
  }

  // GLOBAL
  getGlobal() {
    return !!this.state.global;
  }
  setGlobal(val) {
    this.state.global = !!val;
    return this;
  }
   // PER COURSE
   getForCourse(courseId) {
    const v = this.state.perCourse?.[courseId];
    return typeof v === "boolean" ? v : undefined; // undefined => fall back to global
  }
  setForCourse(courseId, val) {
    if (!this.state.perCourse) this.state.perCourse = {};
    this.state.perCourse[courseId] = !!val;
    return this;
  }

  clearPerCourse(courseId) {
    if (this.state.perCourse && courseId in this.state.perCourse) {
      delete this.state.perCourse[courseId];
    }
    return this;
  }

  clearAll() {
    this.state = { global: false, perCourse: {} };
    return this;
  }
}

export { OpenSectionsPreference };
