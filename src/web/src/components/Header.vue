<template>
  <b-navbar
    id="header"
    class="bg-white"
    style="margin-bottom: 0 !important;"
    toggleable="md"
    type="primary"
    variant="light"
  >
    <!-- Brand and Semester Dropdown -->
    <b-navbar-brand
      class="align-middle text-dark"
      :to="{ name: 'CourseScheduler' }"
    >
      YACS
    </b-navbar-brand>
    <div>
      <!-- Semester selection dropdown -->
      <b-dropdown
        variant="outline-primary"
        size="sm"
        :text="selectedSemester"
        class="m-md-2"
      >
        <b-dropdown-item
          v-for="option in semesterOptions"
          :key="option.value"
          :value="option.value"
          @click="selectSemester(option.value)"
        >
          {{ option.value }}
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <!-- Navbar toggle icon for mobile view -->
    <b-navbar-toggle
      id="header-navbar-collapse-toggle"
      target="header-navbar-collapse"
    >
      <font-awesome-icon icon="bars" />
    </b-navbar-toggle>

    <!-- Collapsible section containing all navigation items -->
    <b-collapse id="header-navbar-collapse" is-nav>
      <b-navbar-nav>
        <!-- Navigation links for different pages -->
        <b-nav-item :to="{ name: 'CourseScheduler' }" class="first">
          <font-awesome-icon icon="calendar" />
          Schedule
        </b-nav-item>
        <b-nav-item :to="{ name: 'CourseExplorer' }">
          <font-awesome-icon icon="search" />
          Explore
        </b-nav-item>
        <b-nav-item :to="{ name: 'Pathway' }">
          <font-awesome-icon icon="list" />
          Pathways
        </b-nav-item>
        <b-nav-item :to="{ name: 'Professors' }">
          <font-awesome-icon icon="address-book" />
          Professors
        </b-nav-item>
        <b-nav-item :to="{ name: 'Finals' }">
          <font-awesome-icon icon="file-alt" />
          Finals
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right side of the navbar -->
      <b-navbar-nav class="ml-auto">
        <!-- Color mode selector -->
        <b-nav-dropdown text="Color Mode" style="padding-right: 5px;">
          <b-dropdown-item
            :class="this.darkMode === false ? 'drop-down-item' : ''"
            @click="toggle_style(false)"
          >
            Light Mode
          </b-dropdown-item>
          <b-dropdown-item
            :class="this.darkMode === true ? 'drop-down-item' : ''"
            @click="toggle_style(true)"
          >
            Dark Mode
          </b-dropdown-item>
          <b-dropdown-item
            :class="this.darkMode === null ? 'drop-down-item' : ''"
            @click="toggle_device"
          >
            Follow Device Theme
          </b-dropdown-item>
        </b-nav-dropdown>

        <!--
          Notifications Dropdown:
          - Shows a bell icon.
          - Displays a badge with the number of unread notifications.
          - When the user clicks a notification, it's marked as read.
          - Only visible if the user is logged in.
        -->
        <b-nav-item-dropdown right v-if="isLoggedIn">
          <template v-slot:button-content>
            <font-awesome-icon icon="bell" />
            <!-- Display badge if there are unread notifications -->
            <span v-if="unreadNotificationsCount > 0" class="badge badge-danger">
              {{ unreadNotificationsCount }}
            </span>
          </template>
          <!-- Loop through the notifications and display each one as a dropdown item -->
          <b-dropdown-item
            v-for="(notification, index) in notifications"
            :key="index"
            @click="markNotificationRead(index)"
          >
            {{ notification.message }}
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <!-- User Profile and Logout dropdown shown if the user is logged in -->
        <b-nav-item-dropdown right v-if="isLoggedIn">
          <template v-slot:button-content>
            Hi, {{ user.name }}
          </template>
          <!-- Link to the user profile page -->
          <b-dropdown-item @click="$router.push({ name: 'UserProfile' })">
            Profile
          </b-dropdown-item>
          <!-- Log Out Button -->
          <b-dropdown-item @click="logOut">
            Sign Out
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <!-- Login button and modal when the user is not logged in -->
        <template v-else>
          <b-button
            id="login-button"
            v-b-modal.login-modal
            size="sm"
            variant="secondary"
            class="mr-md-2"
          >
            Log In
          </b-button>
          <b-modal id="login-modal" ref="login-modal" hide-footer title="Log In">
            <LoginForm @submit="onLogIn()" />
          </b-modal>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import {
  SELECT_SEMESTER,
  COOKIE_DARK_MODE,
  TOGGLE_DARK_MODE,
  SAVE_DARK_MODE,
  RESET_DARK_MODE,
} from "@/store";
import { mapState, mapActions, mapGetters } from "vuex";
import LoginComponent from "@/components/Login";
import { userTypes } from "../store/modules/user";

export default {
  name: "Header",
  components: {
    LoginForm: LoginComponent,
  },
  data() {
    return {
      // Current theme setting from Vuex store: false = light, true = dark, null = following device theme
      darkMode: this.$store.getters.darkModeState,
      // Used to display notifications for changes in device theme
      notify: false,
      // Dummy notifications list for demonstration purposes
      notifications: [
        { message: "Your schedule has been updated!", read: false },
        { message: "New course added to your favorites.", read: false },
        { message: "Reminder: Finals schedule released.", read: true },
      ],
    };
  },
  mounted() {
    // Check for dark mode cookie on load and set theme notification flag as needed
    if (this.$cookies.get(COOKIE_DARK_MODE) === null) {
      this.darkMode = null;
      this.notify = true;
    }
  },
  methods: {
    ...mapActions([SELECT_SEMESTER]),
    // Toggle between light and dark modes
    toggle_style(mode) {
      // Notify user if switching from device theme mode
      if (this.notify) {
        this.unFollowDeviceTheme();
        this.notify = false;
      }

      // Determine current device theme using media query
      const deviceTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches;

      // Toggle dark mode if necessary, based on user action versus current mode
      if (
        (mode === false && this.darkMode === true) ||
        (mode === true && this.darkMode === false) ||
        (this.darkMode == null && mode !== deviceTheme)
      ) {
        this.$store.commit(TOGGLE_DARK_MODE);
        this.$store.commit(SAVE_DARK_MODE);
      } else {
        // Save current mode if it hasn't changed
        this.$store.commit(SAVE_DARK_MODE);
      }
      // Update local dark mode state from the store
      this.darkMode = this.$store.getters.darkModeState;
    },
    // Toggle to follow the device theme
    toggle_device() {
      this.followDeviceTheme();
      this.notify = true;
      this.$store.commit(RESET_DARK_MODE);
      this.$store.commit(TOGGLE_DARK_MODE);
      this.darkMode = null;
    },
    // Handle login modal hide after successful login
    onLogIn() {
      this.$refs["login-modal"].hide();
    },
    // Handle logout process
    async logOut() {
      try {
        await this.$store.dispatch(userTypes.actions.LOGOUT);
        this.$bvToast.toast(`You are now logged out!`, {
          variant: "success",
        });
      } catch (err) {
        this.$bvToast.toast(err, {
          title: "Failed to logout",
          variant: "danger",
        });
      }
    },
    // Show toast when user unfollows the device theme (changes manually)
    unFollowDeviceTheme() {
      this.$bvToast.toast(`No Longer Following Device Theme`, {
        title: "Color Scheme Changed",
        autoHideDelay: 2000,
        noHoverPause: true,
        variant: "danger",
        toaster: "b-toaster-top-center",
      });
    },
    // Show toast when user starts following the device theme
    followDeviceTheme() {
      this.$bvToast.toast(`Now Following Device Theme`, {
        title: "Color Scheme Changed",
        autoHideDelay: 2000,
        noHoverPause: true,
        variant: "success",
        toaster: "b-toaster-top-center",
      });
    },
    // When a notification is clicked, mark it as read
    markNotificationRead(index) {
      // Change the status of the notification at the given index
      this.notifications[index].read = true;
      // Give a brief toast notification to inform the user
      this.$bvToast.toast(`Notification marked as read.`, {
        title: "Notification",
        autoHideDelay: 1500,
        variant: "info",
        toaster: "b-toaster-top-center",
      });
    },
  },
  computed: {
    // Map user status and information from Vuex getters and state
    ...mapGetters({
      isLoggedIn: userTypes.getters.IS_LOGGED_IN,
      user: userTypes.getters.CURRENT_USER_INFO,
    }),
    ...mapState({ sessionId: userTypes.state.SESSION_ID }),
    ...mapState(["semesters", "selectedSemester"]),
    // Create options for the semester dropdown
    semesterOptions() {
      return this.semesters.map(({ semester }) => ({
        text: semester,
        value: semester,
      }));
    },
    // Calculate the count of unread notifications for the badge display
    unreadNotificationsCount() {
      return this.notifications.filter((n) => !n.read).length;
    },
  },
};
</script>
<style lang="scss" scoped>
/* Styling for the notification badge */
.badge {
  margin-left: 5px;
  font-size: 0.8rem;
  vertical-align: top;
}

/* Responsive styling for small devices */
@include media-breakpoint-down(sm) {
  #login-button,
  #darkmode-toggle-form {
    margin-bottom: $spacer * 0.25;
    margin-top: $spacer * 0.25;
  }
}

/* Header component styles */
#header {
  .navbar-brand {
    font-size: 25px;
    font-weight: bold;
  }
  .nav-item {
    text-align: center;
  }
  .navbar-nav {
    font-size: 17px;
    font-weight: normal;
  }
  // Centering dark mode toggle
  .inline-form,
  .form-inline {
    justify-content: center;
  }
}

/* Highlight currently active navigation links */
.nav-item:not(.first) .router-link-active {
  border-radius: 5px;
  padding: calc(8px - 0.2em);
  border: 0.2em solid var(--dark-blue-secondary);
}
.nav-item.first .router-link-exact-active {
  border-radius: 5px;
  padding: calc(8px - 0.2em);
  border: 0.2em solid var(--dark-blue-secondary);
}
/* Ensure toggle icon is visible in dark mode */
.dark #header-navbar-collapse-toggle {
  color: var(--dark-text-primary) !important;
}

/* Custom dropdown item styling */
.drop-down-item {
  background: hsl(211, 100%, 60%) !important;
}
</style>
