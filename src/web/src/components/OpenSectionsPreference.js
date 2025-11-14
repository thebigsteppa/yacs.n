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
}

export { OpenSectionsPreference };
