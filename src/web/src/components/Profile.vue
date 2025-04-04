<template>
    <div class="profile">
      <h1>Profile Page</h1>
  
      <!-- Profile Header Section -->
      <div class="profile-header">
        <!-- Profile Picture -->
        <div class="profile-picture">
          <img 
            :src="imagePreview || 'https://via.placeholder.com/150'" 
            alt="Profile Picture"
          />
        </div>
        <!-- Basic Info -->
        <div class="basic-info">
          <h2>{{ name }}</h2>
          <p class="email">{{ email }}</p>
          <p class="phone">{{ phone }}</p>
          <p class="location">{{ location }}</p>
          <p class="major">{{ major }}</p>
        </div>
      </div>
  
      <!-- Profile Bio Section -->
      <div class="profile-bio">
        <h3>Bio</h3>
        <p>{{ bio }}</p>
      </div>
  
      <!-- Social Media Section -->
      <div class="profile-social">
        <h3>Connect With Me</h3>
        <ul>
          <li>
            <a :href="socialLinks.twitter" target="_blank">Twitter</a>
          </li>
          <li>
            <a :href="socialLinks.linkedin" target="_blank">LinkedIn</a>
          </li>
          <li>
            <a :href="socialLinks.github" target="_blank">GitHub</a>
          </li>
        </ul>
      </div>
  
      <!-- Friend/Unfriend Buttons -->
      <div class="friend-actions">
        <button v-if="isFriend" @click="unfriendUser">Unfriend</button>
        <button v-else @click="friendUser">Add Friend</button>
      </div>
  
      <!-- Button to toggle editing the profile -->
      <button @click="isEditingProfile = true" class="edit-profile-button">
        Edit Profile
      </button>
  
      <!-- Edit Profile Form (visible only if isEditingProfile is true) -->
      <form 
        v-if="isEditingProfile"
        class="edit-profile-form" 
        @submit.prevent="updateProfile"
      >
        <h3>Edit Profile</h3>
  
        <div class="form-group">
          <label for="profilePicture">Profile Picture:</label>
          <input 
            type="file" 
            id="profilePicture"
            accept="image/*"
            @change="onImageSelected"
          />
        </div>
  
        <div class="form-group">
          <label for="nameInput">Name:</label>
          <input type="text" id="nameInput" v-model="name" />
        </div>
  
        <div class="form-group">
          <label for="emailInput">Email:</label>
          <input type="email" id="emailInput" v-model="email" />
        </div>
  
        <div class="form-group">
          <label for="phoneInput">Phone:</label>
          <input type="text" id="phoneInput" v-model="phone" />
        </div>
  
        <div class="form-group">
          <label for="locationInput">Location:</label>
          <input type="text" id="locationInput" v-model="location" />
        </div>
  
        <div class="form-group">
          <label for="majorInput">Major:</label>
          <input type="text" id="majorInput" v-model="major" />
        </div>
  
        <div class="form-group">
          <label for="bioInput">Bio:</label>
          <textarea id="bioInput" rows="3" v-model="bio"></textarea>
        </div>
  
        <div class="form-group">
          <label for="twitterInput">Twitter:</label>
          <input 
            type="text" 
            id="twitterInput" 
            v-model="socialLinks.twitter"
            placeholder="https://twitter.com/..."
          />
        </div>
  
        <div class="form-group">
          <label for="linkedinInput">LinkedIn:</label>
          <input 
            type="text" 
            id="linkedinInput" 
            v-model="socialLinks.linkedin"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
  
        <div class="form-group">
          <label for="githubInput">GitHub:</label>
          <input 
            type="text" 
            id="githubInput" 
            v-model="socialLinks.github"
            placeholder="https://github.com/..."
          />
        </div>
  
        <!-- Buttons to save or cancel editing -->
        <button type="submit">Save Changes</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
      <div class="message-feature">
    <!-- Button to open/close message form -->
    <button @click="toggleMessageForm">
      {{ isSendingMessage ? 'Close Message Form' : 'Send Message' }}
    </button>

    <!-- Message Form (visible only if isSendingMessage is true) -->
    <form v-if="isSendingMessage" @submit.prevent="sendMessage" class="send-message-form">
      <h3>Send Message to {{ recipientName }}</h3>
      <div class="form-group">
        <label for="messageText">Message:</label>
        <textarea 
          id="messageText" 
          v-model="messageText" 
          rows="3" 
          placeholder="Write your message here..."
        ></textarea>
      </div>
      <button type="submit">Send</button>
    </form>
  </div>
  <!-- New Feature: Status Update Section -->
<div class="status-update">
  <h3>What's on your mind?</h3>
  <textarea 
    v-model="newStatus" 
    rows="2" 
    placeholder="Share a status update..."
  ></textarea>
  <button @click="postStatus">Post Status</button>
</div>

<!-- New Feature: Recent Activity Feed -->
<div class="activity-feed">
  <h3>Recent Activity</h3>
  <ul>
    <li v-for="(status, index) in statusUpdates" :key="index">
      <strong>{{ name }}:</strong> {{ status }}
    </li>
  </ul>
</div>

<!-- New Feature: Notifications -->
<div class="notifications">
  <h3>Notifications</h3>
  <ul>
    <li v-for="(notification, index) in notifications" :key="index">
      {{ notification }}
    </li>
  </ul>
</div>

<!-- New Feature: Friend List -->
<div class="friend-list">
  <h3>Friends</h3>
  <ul>
    <li v-for="(friend, index) in friendList" :key="index">
      {{ friend }}
    </li>
  </ul>
</div>

  <div class="message-feature">
    <!-- BLOCK/UNBLOCK FEATURE -->
    <div class="block-user-action">
      <!-- If user is not blocked, show "Block User" button -->
      <button v-if="!isBlocked" @click="toggleBlock">
        Block {{ recipientName }}
      </button>
      <!-- If user is blocked, show "Unblock User" button -->
      <button v-else @click="toggleBlock">
        Unblock {{ recipientName }}
      </button>
    </div>

    <!-- SEND MESSAGE FEATURE -->
    <div class="message-action">
      <!-- Button to open/close message form -->
      <button @click="toggleMessageForm">
        {{ isSendingMessage ? 'Close Message Form' : 'Send Message' }}
      </button>

      <!-- Message Form (visible only if isSendingMessage is true) -->
      <form 
        v-if="isSendingMessage" 
        @submit.prevent="sendMessage" 
        class="send-message-form"
      >
        <h3>Send Message to {{ recipientName }}</h3>
        <div class="form-group">
          <label for="messageText">Message:</label>
          <textarea 
            id="messageText" 
            v-model="messageText" 
            rows="3" 
            placeholder="Write your message here..."
          ></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
  </template>
  <script>
  export default {
    name: 'MessageFeature',
    data() {
      return {
        recipientName: 'John Doe',
        isSendingMessage: false,
        messageText: ''
      };
    },
    methods: {
      toggleMessageForm() {
        this.isSendingMessage = !this.isSendingMessage;
        // If we're closing the form, reset the message text
        if (!this.isSendingMessage) {
          this.messageText = '';
        }
      },
      sendMessage() {
        // Here you'd handle the message (API call, Vuex, etc.)
        console.log('Message sent to ' + this.recipientName + ':', this.messageText);
        alert('Message sent: ' + this.messageText);
  
        // Clear and close the form
        this.messageText = '';
        this.isSendingMessage = false;
      }
    }
  };
  </script>
  <script>
  export default {
    name: 'MessageFeature',
    data() {
      return {
        // Name of the user you’re interacting with
        recipientName: 'John Doe',
  
        // BLOCK/UNBLOCK FEATURE
        isBlocked: false,
  
        // SEND MESSAGE FEATURE
        isSendingMessage: false,
        messageText: ''
      };
    },
    methods: {
      // Toggle blocking/unblocking the user
      toggleBlock() {
        this.isBlocked = !this.isBlocked;
        if (this.isBlocked) {
          console.log(`You have blocked ${this.recipientName}.`);
          alert(`You have blocked ${this.recipientName}.`);
        } else {
          console.log(`You have unblocked ${this.recipientName}.`);
          alert(`You have unblocked ${this.recipientName}.`);
        }
      },
  
      // Toggle the message form open/closed
      toggleMessageForm() {
        // If the user is blocked, you can decide whether to allow messaging
        // For example, if blocked, do not show the form and alert:
        if (this.isBlocked) {
          alert(`Cannot send a message to ${this.recipientName} because they are blocked.`);
          return;
        }
  
        this.isSendingMessage = !this.isSendingMessage;
        // If closing the form, reset the message text:
        if (!this.isSendingMessage) {
          this.messageText = '';
        }
      },
  
      // Send the message
      sendMessage() {
        console.log(`Message sent to ${this.recipientName}: ${this.messageText}`);
        alert(`Message sent to ${this.recipientName}: ${this.messageText}`);
  
        // Clear and close the form
        this.messageText = '';
        this.isSendingMessage = false;
      }
    }
  };
  </script>
  <script>
  export default {
    name: 'Profile',
    data() {
      return {
        // Basic profile data
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-555-5555',
        location: 'New York, USA',
        major: 'Computer Science',
        bio: 'Web developer with a passion for creating amazing applications.',
        
        // Social media links
        socialLinks: {
          twitter: 'https://twitter.com/john_doe',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe'
        },
  
        // Track whether this user is currently a "friend"
        isFriend: false,
  
        // For handling profile picture preview
        imagePreview: null,
  
        // Toggles whether the edit form is displayed
        isEditingProfile: false
      };
    },
    methods: {
      // Simulates saving/updating the profile
      updateProfile() {
        console.log('Profile updated with the following info:');
        console.log('Name:', this.name);
        console.log('Email:', this.email);
        console.log('Phone:', this.phone);
        console.log('Location:', this.location);
        console.log('Major:', this.major);
        console.log('Bio:', this.bio);
        console.log('Social Links:', this.socialLinks);
  
        alert('Profile updated!');
        // Hide the form after saving
        this.isEditingProfile = false;
      },
  
      // Reads and previews the selected image
      onImageSelected(event) {
        const file = event.target.files[0];
        if (!file) return;
  
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      },
  
      // Cancels editing (no changes saved)
      cancelEdit() {
        this.isEditingProfile = false;
      },
  
      // Add Friend action
      friendUser() {
        this.isFriend = true;
        console.log('You just friended this user.');
      },
  
      // Unfriend action
      unfriendUser() {
        this.isFriend = false;
        console.log('You just unfriended this user.');
      }
    },
  };
  
  </script>
  <style scoped>
  .message-feature {
    max-width: 400px;
    margin: 0 auto;
    font-family: sans-serif;
  }
  
  /* Button styling */
  button {
    margin-bottom: 10px;
    padding: 8px 16px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
  }
  
  /* Form styling */
  .send-message-form {
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .send-message-form .form-group {
    margin-bottom: 15px;
  }
  
  .send-message-form textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
  }
  </style><style scoped>
.message-feature {
  max-width: 400px;
  margin: 0 auto;
  font-family: sans-serif;
}

/* Block/Unblock Section */
.block-user-action {
  margin-bottom: 15px;
}

/* Button styling */
button {
  margin-bottom: 10px;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

/* Send Message Feature */
.message-action {
  margin-bottom: 15px;
}

.send-message-form {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 4px;
}

.send-message-form .form-group {
  margin-bottom: 10px;
}

.send-message-form textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
}
</style>
  <style scoped>
  .profile {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: sans-serif;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  h1, h2, h3 {
    margin: 0;
    padding: 0;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .profile-picture img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #ccc;
    margin-right: 20px;
  }
  
  .basic-info h2 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
  
  .basic-info .email,
  .basic-info .phone,
  .basic-info .location,
  .basic-info .major {
    color: #666;
    margin: 2px 0;
  }
  
  .profile-bio,
  .profile-social {
    margin: 20px 0;
  }
  
  .profile-bio p {
    line-height: 1.4;
  }
  
  .profile-social ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .profile-social li {
    display: inline-block;
    margin-right: 15px;
  }
  
  .profile-social a {
    text-decoration: none;
    color: #007BFF;
    word-break: break-word;
  }
  
  .friend-actions {
    margin-top: 20px;
  }
  
  /* Edit Profile Button */
  .edit-profile-button {
    margin-top: 20px;
    padding: 8px 16px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .edit-profile-button:hover {
    background-color: #0056b3;
  }
  
  /* Edit Profile Form */
  .edit-profile-form {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
  
  .edit-profile-form h3 {
    margin-bottom: 16px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: inline-block;
    margin-bottom: 4px;
    font-weight: 600;
  }
  
  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
  }
  
  button[type="submit"] {
    padding: 10px 16px;
    border: none;
    background: #007BFF;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
  }
  
  button[type="submit"]:hover {
    background: #0056b3;
  }
  
  /* Cancel button for edit form */
  button[type="button"] {
    margin-left: 10px;
    padding: 10px 16px;
    background: #ccc;
    color: #333;
    border: none;
    border-radius: 4px;
  }
  
  button[type="button"]:hover {
    background: #b3b3b3;
  }
  </style>
  