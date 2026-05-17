document.addEventListener('alpine:init', () => {
    Alpine.data('reactionsComponent', (postId) => ({
        postId: postId,
        counts: {
            like: 0,
            love: 0,
            insightful: 0
        },
        userReactions: [],
        isLoading: false,
        isLoaded: false,
        icons: {
            like: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8.866 1.58c-.53-.53-1.387-.53-1.917 0l-4.134 4.133a.75.75 0 00-.215.53v6.507c0 .414.336.75.75.75h6.507a.75.75 0 00.53-.215l4.133-4.134c.53-.53.53-1.387 0-1.917L8.866 1.58zM7.5 3.08a.25.25 0 01.354 0l3.75 3.75a.25.25 0 010 .354l-3.75 3.75a.25.25 0 01-.354 0l-3.75-3.75a.25.25 0 010-.354l3.75-3.75z"></path></svg>`,
            love: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M7.653 2.141A4.75 4.75 0 001.25 6.25c0 1.294.553 2.662 1.63 4.024 1.053 1.332 2.453 2.622 3.868 3.725l.235.183a.75.75 0 00.934 0l.235-.183c1.415-1.103 2.815-2.393 3.868-3.725 1.077-1.362 1.63-2.73 1.63-4.024a4.75 4.75 0 00-6.403-4.109l-.497.161-.497-.161z"></path></svg>`,
            insightful: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M7.47 1.03a.75.75 0 011.06 0l1.25 1.25a.75.75 0 010 1.06l-1.25 1.25a.75.75 0 01-1.06 0l-1.25-1.25a.75.75 0 010-1.06l1.25-1.25zM11.5 5.5a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zM3.75 4.75a.75.75 0 000 1.5h1a.75.75 0 000-1.5h-1zM11.5 10.5a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zM3.75 9.75a.75.75 0 000 1.5h1a.75.75 0 000-1.5h-1zM8 11a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1A.75.75 0 018 11zM7.47 13.97a.75.75 0 011.06 0l1.25 1.25a.75.75 0 01-1.06 1.06l-1.25-1.25a.75.75 0 010-1.06l1.25-1.25z"></path></svg>`
        },

        init() {
            this.loadCounts();
            // Reload counts when user changes to update highlight
            document.addEventListener('authStateChanged', () => this.loadCounts());
            // Update if batch data becomes available
            window.addEventListener('batchReactionsUpdated', () => {
                if (!this.isLoaded) this.loadCounts();
            });
        },

        async loadCounts(forceFetch = false) {
            if (!this.postId) return;
            
            const app = window.thinkLogApp;

            // Check if we already have batch data or consolidated article data
            // Only use this for the initial load if not forcing a refresh
            if (!this.isLoaded && !forceFetch) {
                if (app?.batchReactions?.[this.postId]) {
                    this.counts = { ...this.counts, ...app.batchReactions[this.postId] };
                    this.isLoaded = true;
                } else if (app?.currentArticle?.id === this.postId && app.currentArticle.reaction_counts) {
                    this.counts = { ...this.counts, ...app.currentArticle.reaction_counts };
                    this.isLoaded = true;
                }
            }

            // Still need to fetch user's specific reactions if logged in
            if (window.thinkLogApp.user) {
                try {
                    const { data } = await window.supabaseClient
                        .from('reactions')
                        .select('reaction_type')
                        .eq('post_id', this.postId)
                        .eq('user_id', window.thinkLogApp.user.id);
                    this.userReactions = data ? data.map(r => r.reaction_type) : [];
                } catch (e) {
                    console.error('Error fetching user reactions', e);
                }
            } else {
                this.userReactions = [];
            }

            // If we don't have counts yet or are forcing a refresh, fetch them from the API
            if (!this.isLoaded || forceFetch) {
                this.isLoading = true;
                try {
                    const response = await fetch(`/api/reactions/${this.postId}`);
                    this.counts = { ...this.counts, ...(await response.json()) };
                    this.isLoaded = true;
                } catch (e) {
                    console.error('Error fetching reactions', e);
                } finally {
                    this.isLoading = false;
                }
            }
        },

        async toggleReaction(type) {
            if (!window.thinkLogApp.user) {
                window.thinkLogApp.isAuthModalOpen = true;
                return;
            }

            // Optimistic Update
            const wasReacted = this.userReactions.includes(type);
            if (wasReacted) {
                this.userReactions = this.userReactions.filter(r => r !== type);
                this.counts[type] = Math.max(0, (this.counts[type] || 0) - 1);
            } else {
                this.userReactions.push(type);
                this.counts[type] = (this.counts[type] || 0) + 1;
            }

            try {
                const { data: existing, error: fetchErr } = await window.supabaseClient
                    .from('reactions')
                    .select('*')
                    .eq('post_id', this.postId)
                    .eq('user_id', window.thinkLogApp.user.id)
                    .eq('reaction_type', type)
                    .maybeSingle();

                if (fetchErr) throw fetchErr;

                if (existing) {
                    await window.supabaseClient.from('reactions').delete().eq('id', existing.id);
                } else {
                    await window.supabaseClient.from('reactions').insert([{
                        post_id: this.postId,
                        user_id: window.thinkLogApp.user.id,
                        reaction_type: type
                    }]);
                }
                
                // Final sync with server - force a fresh fetch to avoid using stale pre-loaded data
                await this.loadCounts(true);
            } catch (e) {
                console.error('Failed to toggle reaction', e);
                // Revert optimistic update on error
                await this.loadCounts(true);
            }
        }
    }));
});
