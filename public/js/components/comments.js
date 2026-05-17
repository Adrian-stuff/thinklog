document.addEventListener('alpine:init', () => {
    Alpine.data('commentsComponent', (postId) => ({
        postId: postId,
        comments: [],
        newComment: '',
        showComments: false,
        isLoading: false,

        init() {
            // Only load comments if they are already being shown (e.g. single article view)
            if (this.postId && this.showComments) {
                this.loadComments();
            }
            
            // Watch showComments to trigger load
            this.$watch('showComments', (value) => {
                if (value && this.comments.length === 0) {
                    this.loadComments();
                }
            });
        },

        async loadComments(forceFetch = false) {
            // Check if we already have comments from consolidated article data
            // Only use pre-loaded data for the initial load if not forcing a refresh
            const app = window.thinkLogApp;
            if (!forceFetch && app?.currentArticle?.id === this.postId && app.currentArticle.comments) {
                this.comments = app.currentArticle.comments;
                return;
            }

            this.isLoading = true;
            try {
                const response = await fetch(`/api/comments/${this.postId}`);
                this.comments = await response.json();
            } catch (e) {
                console.error('Error fetching comments', e);
            } finally {
                this.isLoading = false;
            }
        },

        async submitComment() {
            if (!window.thinkLogApp.user) {
                window.thinkLogApp.isAuthModalOpen = true;
                return;
            }

            if (!this.newComment.trim()) return;

            try {
                const { error } = await window.supabaseClient
                    .from('comments')
                    .insert([{
                        post_id: this.postId,
                        user_id: window.thinkLogApp.user.id,
                        user_name: window.thinkLogApp.getDisplayName(),
                        content: this.newComment.trim()
                    }]);

                if (error) throw error;

                this.newComment = '';
                // Force a fresh fetch to include the new comment and avoid stale pre-loaded data
                await this.loadComments(true);
            } catch (e) {
                console.error('Failed to submit comment', e);
                alert('Failed to submit comment');
            }
        }
    }));
});
