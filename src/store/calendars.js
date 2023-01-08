/**
 * Calendar schema
 * {
 *    name: string
 *    carga: string,
 *    carrera: string
 *    sections: []
 * }
 */

const state = {
  all: [],
  selected: null,
};

const getters = {
  /**
   * Used to map all levels of the sections and return an array whit
   * unique levels.
   *
   * @returns {array} Non repetitive levels
   */
  getSemesters({ selected }) {
    const { sections } = selected;
    let allSemesters = sections.map((c) => c.nivel || null);
    return [...new Set(allSemesters)].sort((a, b) => a > b);
  },

  /**
   * Gives an array whit the day shifts for the sections available
   *
   * @returns {array} day shifts
   */
  getTimes({ selected }) {
    const { sections } = selected;
    return [...new Set(sections.map((c) => c.jornada))];
  },
};

const mutations = {
  setCalendars(state, calendars) {
    state.all = calendars;
  },

  addCalendar(state, calendar) {
    state.all.push(calendar);
  },

  setSelected(state, index) {
    state.selected = state.all[index];
  },

  deleteCalendar(state, index) {
    state.all.splice(index, 1);
  },

  addSection(state, section) {
    state.selected.sections.push(section);
  },

  deleteSection({ selected }, section) {
    const index = selected.sections.findIndex(
      (s) => s.seccion === section.seccion
    );
    if (index < 0) return;
    selected.sections.splice(index, 1);
  },
};

const actions = {
  addCalendarAction({ state, commit }, calendar) {
    commit("addCalendar", calendar);
    commit("addLogEvent", `Created calendar ${calendar.nombre}`, {
      root: true,
    });
    localStorage.calendars = JSON.stringify(state.all);
    commit("addLogEvent", `Updated localStorage calendars`, {
      root: true,
    });
  },

  deleteCalendarAction({ state, commit }, index) {
    if (state.all.length < index || index < 0) {
      commit("addLogEvent", `Calendar index to delete out of range`, {
        root: true,
      });
      return;
    }

    const { name } = state.all[index];
    commit("deleteCalendar", index);
    commit("addLogEvent", `Deleted calendar ${name}`, { root: true });
    localStorage.calendars = JSON.stringify(state.all);
    commit("addLogEvent", `Updated localStorage calendars`, {
      root: true,
    });
  },

  loadCalendarsFromLocalStorage({ state, commit }) {
    const { calendars } = localStorage;
    if (calendars) {
      commit("setCalendars", JSON.parse(calendars));
      commit("addLogEvent", `Loaded ${state.all.length} saved calendars`, {
        root: true,
      });
    } else {
      commit("addLogEvent", "No calendars to load", { root: true });
    }
  },

  saveCalendarsToLocalStorage({ state }) {
    const { calendars } = state;
    const calendarsSimplified = calendars.map((calendar) => {
      let sections = calendar.sections.map((section) => section.seccion);
      return {
        ...calendar,
        sections: sections,
      };
    });
    // localStorage.calendars = calendarsSimplified;
    console.log(calendarsSimplified);
  },

  setCalendarByIndex({ state, commit }, index) {
    if (index > state.all.length) return;
    commit("setSelected", index);
    commit("addLogEvent", `Selected calendar number: ${index}`, { root: true });
    const { carrera, carga } = state.selected;
    // Change the state of firebase module in case user wants to add sections to their calendars
    commit("firebase/setCarga", carga, { root: true });
    commit("addLogEvent", `Carga set to: ${carga}`, { root: true });

    commit("firebase/setCarrera", carrera, { root: true });
    commit("addLogEvent", `Carrera set to: ${carrera}`, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
