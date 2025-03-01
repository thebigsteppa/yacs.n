<template>
    <div class="profile">
        <h1>Profile Page</h1>
        <div class="profile-details">
            <p>Name: {{ name }}</p>
            <p>Email: {{ email }}</p>
            <!-- Add more profile details here -->
        </div>
        <form @submit.prevent="updateProfile">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="name">
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email">
            </div>
            <button type="submit">Update Profile</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Profile',
    data() {
        return {
            name: 'John Doe',
            email: 'john.doe@example.com',
            // Add more profile data here
        };
    },
    methods: {
        updateProfile() {
            // Handle profile update logic here
            console.log('Profile updated:', this.name, this.email);
        },
    },
};
</script>

<style scoped>
.profile {
    padding: 20px;
}

.profile-details {
    margin-top: 20px;
}

form {
    margin-top: 20px;
}

form div {
    margin-bottom: 10px;
}
</style>