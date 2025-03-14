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
                <input type="text" id="nameInput" v-model="name">
            </div>

            <div class="form-group">
                <label for="emailInput">Email:</label>
                <input type="email" id="emailInput" v-model="email">
            </div>

            <div class="form-group">
                <label for="phoneInput">Phone:</label>
                <input type="text" id="phoneInput" v-model="phone">
            </div>

            <div class="form-group">
                <label for="locationInput">Location:</label>
                <input type="text" id="locationInput" v-model="location">
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
                >
            </div>

            <div class="form-group">
                <label for="linkedinInput">LinkedIn:</label>
                <input 
                    type="text" 
                    id="linkedinInput" 
                    v-model="socialLinks.linkedin"
                    placeholder="https://linkedin.com/in/..."
                >
            </div>

            <div class="form-group">
                <label for="githubInput">GitHub:</label>
                <input 
                    type="text" 
                    id="githubInput" 
                    v-model="socialLinks.github"
                    placeholder="https://github.com/..."
                >
            </div>

            <!-- Buttons to save or cancel editing -->
            <button type="submit">Save Changes</button>
            <button type="button" @click="cancelEdit">Cancel</button>
        </form>
    </div>
</template>

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
            bio: 'Web developer with a passion for creating amazing applications.',
            
            // Links to social media profiles
            socialLinks: {
                twitter: 'https://twitter.com/john_doe',
                linkedin: 'https://linkedin.com/in/johndoe',
                github: 'https://github.com/johndoe'
            },

            // For handling the profile picture upload
            imagePreview: null,

            // Controls whether the edit form is displayed
            isEditingProfile: false
        };
    },
};
</script>

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
.basic-info .location {
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
</style>
