<script>
import { mapState } from "vuex";
import { SelectedIndexCookie } from "@/SelectedIndexCookie";

export default {
  name: "SchedulePage",
  data() {
    return {
      selectedScheduleIndex: 0, // default before we load from cookie
    };
  },
  computed: {
    // Example: adjust based on your store shape
    ...mapState({
      currentSemester: (state) => state.semester.current, // or state.semester.selectedSemester
    }),
  },
  created() {
    this.restoreSelectedIndex();
  },
  watch: {
    // Whenever the user changes schedule, persist it
    selectedScheduleIndex(newIndex) {
      this.persistSelectedIndex(newIndex);
    },
    // If semester changes (e.g., user switches from Fall to Spring), reload index
    currentSemester() {
      this.restoreSelectedIndex();
    },
  },
  methods: {
    restoreSelectedIndex() {
      if (!this.currentSemester) return;

      const cookie = SelectedIndexCookie.load(this.$cookies).semester(
        this.currentSemester
      );
      this.selectedScheduleIndex = cookie.selectedIndex;
    },
    persistSelectedIndex(newIndex) {
      if (!this.currentSemester) return;

      SelectedIndexCookie.load(this.$cookies)
        .semester(this.currentSemester)
        .updateIndex(newIndex)
        .save();
    },
  },
};
</script>
