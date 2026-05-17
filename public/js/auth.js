document.addEventListener('alpine:init', () => {
    Alpine.data('authComponent', () => ({
        email: '',
        password: '',
        username: '',
        message: '',
        isSignUp: false,
        isSettingsOpen: false,
        settingsUsername: '',
        settingsMessage: '',

        init() {
            // Check session on load
            window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
                this.handleSessionUpdate(session);
            });

            // Listen for auth changes
            window.supabaseClient.auth.onAuthStateChange((_event, session) => {
                this.handleSessionUpdate(session);
            });
        },

        handleSessionUpdate(session) {
            if (session) {
                window.thinkLogApp.user = session.user;
                this.settingsUsername = session.user.user_metadata?.user_name || '';
                window.thinkLogApp.isAuthModalOpen = false;
            } else {
                window.thinkLogApp.user = null;
            }

            // Notify other components (like reactions) to reload user-specific data
            document.dispatchEvent(new CustomEvent('authStateChanged'));

            // Clean up URL if we are on the OAuth consent page
            if (window.location.pathname === '/oauth/consent') {
                window.history.replaceState({}, '', '/');
            }
        },

        async login() {
            this.message = 'Authenticating...';
            const { error } = await window.supabaseClient.auth.signInWithPassword({
                email: this.email,
                password: this.password,
            });

            if (error) {
                this.message = `Error: ${error.message}`;
            } else {
                this.message = '';
            }
        },

        async signup() {
            if (!this.username.trim()) {
                this.message = 'Error: Username is required.';
                return;
            }

            this.message = 'Registering...';
            const { error } = await window.supabaseClient.auth.signUp({
                email: this.email,
                password: this.password,
                options: {
                    data: {
                        user_name: this.username.trim()
                    }
                }
            });

            if (error) {
                this.message = `Error: ${error.message}`;
            } else {
                this.message = 'Success! Check email for confirmation if required, or log in.';
            }
        },

        async logout() {
            await window.supabaseClient.auth.signOut();
        },

        async googleLogin() {
            await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/oauth/consent'
                }
            });
        },

        async githubLogin() {
            await window.supabaseClient.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: window.location.origin + '/oauth/consent'
                }
            });
        },

        async saveSettings() {
            const newName = this.settingsUsername.trim();
            if (!newName) return;

            this.settingsMessage = 'Saving...';
            const { error } = await window.supabaseClient.auth.updateUser({
                data: { user_name: newName }
            });

            if (error) {
                this.settingsMessage = `Error: ${error.message}`;
            } else {
                this.settingsMessage = 'Username updated successfully!';
                setTimeout(() => {
                    this.isSettingsOpen = false;
                    this.settingsMessage = '';
                }, 1500);
            }
        }
    }));
});
