<template>
  <div class="d-flex flex-column flex-grow-1">
    <!-- LOOP Through the majors list -->
    <div v-for="(major, index) in majors" :key="major" role="tablist">
      <template>
        <div class="mt-1 mb-1 w-100">
          <!-- Subject button -->
          <b-button
            squared
            v-b-toggle="id + 'accordion-' + index"
            variant="light"
            class="major-button m-0 ml-1"
            :to="{
              name: 'SubjectExplorer',
              params: { subject: major },
            }"
          >
            <b class="majorShort">{{ major }}</b>
            - {{ getLongName(major) }}
          </b-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import "@/typedef";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { getLongName } from "@/utils";

export default {
  name: "DepartmentList",
  components: {},
  data() {
    return {
      faInfoCircle,
    };
  },
  props: {
    majors: Set,
    deptClassDict: Object,
    id: Number,
  },

  /**
   * courseInfoModalToggle
   * Display the course object information onn console
   */
  methods: {
    getLongName,
    courseInfoModalToggle(course) {
      console.log(course);
    },
  },
};
</script>

<style scoped lang="scss">
.major-button {
  display: inline-block;
  background: white;
  border-style: none;
  text-align: justify;
  width: 95%;
}

.major-button:hover {
  //important because when you click the color changes and thats annoying
  background: rgba(108, 90, 90, 0.15) !important;
}

.majorShort {
  color: #3395ff;
}
</style>
<template>
  <div class="course-search">
    <b-form-group label="Search" label-for="search">
      <b-form-input
        id="search"
        v-model="textSearch"
        :debounce="debounceTime"
        placeholder="Intro to College - COLG 1030"
        list="list-id"
      ></b-form-input>
    </b-form-group>
    <b-row>
      <b-col v-if="subsemesterOptions.length > 2">
        <b-form-group label="Filter Sub-Semester" for="sub-semester">
          <b-form-select v-model="selectedSubsemester" :options="subsemesterOptions"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Filter Department" for="department">
          <b-form-select v-model="selectedDepartment" :options="departmentOptions"></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ["textSearch", "selectedSubsemester", "selectedDepartment", "subsemesterOptions", "departmentOptions"],
  data() {
    return {
      debounceTime: 300,
    };
  },
  export default {
  props: {
    departments: {
      type: Array,
      required: true,
    },
    courses: {
      type: Array,
      required: true, // NEW: full course list
    },
  },
  computed: {
    departmentsWithOpenCounts() {
      // Map: deptCode -> count of sections with seats_open > 0
      const counts = {};

      this.courses.forEach((course) => {
        const dept = course.department;
        if (!course.sections) return;

        const openSectionCount = course.sections.reduce((count, s) => {
          const open = Number(s.seats_open || 0);
          return count + (open > 0 ? 1 : 0);
        }, 0);

        if (!counts[dept]) counts[dept] = 0;
        counts[dept] += openSectionCount;
      });

      return this.departments.map((dept) => {
        return {
          code: dept.code || dept, // adjust to your structure
          name: dept.name || dept,
          openCount: counts[dept.code || dept] || 0,
        };
      });
    },
  },
};

};
</script>
