<template>
  <b-list-group id="selected-course-list" flush data-cy="selected-courses">
    <div v-if="Object.keys(courses).length == 0" class="no-courses">
      Oops! It looks like you haven't selected anything!
      <br />
      Please select some courses from the "Course Search" tab!
    </div>
    <b-list-group-item
      class="selected"
      v-for="course of courses"
      :key="course.id"
    >
    <div class="alert mt-2" :class="creditStatusClass">
  <strong>Total Credits: {{ totalCredits }}</strong>
  <span v-if="creditStatusMessage">
    — {{ creditStatusMessage }}
      </span>
</div>
      <CourseListing :course="course" v-on="$listeners" />
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import "@/typedef";

import CourseListingComponent from "@/components/CourseListing";

export default {
  name: "SelectedCourses",
  components: {
    CourseListing: CourseListingComponent,
  },
  props: {
    courses: Object,
  },
  computed: {
    // NEW: total credits from selected courses
    totalCredits() {
      if (!this.selectedCourses) return 0;

      // Adjust field name if your course uses course.credits or course.credit_hours
      return this.selectedCourses.reduce((sum, c) => {
        const cr = Number(c.credits || c.credit_hours || 0);
        return sum + (isNaN(cr) ? 0 : cr);
      }, 0);
    },

    creditStatusMessage() {
      const c = this.totalCredits;

      if (c === 0) return "No courses selected yet.";
      if (c < 12) return "Below full-time (typically < 12 credits).";
      if (c > 18) return "Above typical load (18+ credits) — consider workload.";
      return "Within a typical full-time load.";
    },

    creditStatusClass() {
      const c = this.totalCredits;
      if (c === 0) return "alert-secondary";
      if (c < 12) return "alert-warning";
      if (c > 18) return "alert-danger";
      return "alert-success";
    },
  },
};
</script>

<style scoped lang="scss">
#selected-course-list {
  overflow-y: scroll !important;
  overflow-x: auto;
  min-height: 200px;
  flex-grow: 1;
  flex-basis: 0px; // allows flex and scroll combo
  border-bottom: 1px solid #dbdbdc;
}
.no-courses {
  margin-right: 20px;
  border-style: solid;
  border-width: 2px;
  border-color: rgb(0, 0, 0, 0.05);
  font-size: 16px;
  padding: 20px;
}
</style>
