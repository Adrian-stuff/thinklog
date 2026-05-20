document.addEventListener('alpine:init', () => {
    Alpine.data('thinkLog', () => ({
        user: null,
        posts: [],
        feeds: [],
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        currentQuery: '',
        currentFeedId: '',
        currentSort: 'recommended',
        currentView: 'feed',
        currentArticle: null,
        isLoading: false,
        showAllFeeds: false,
        isAuthModalOpen: false,
        feedStatus: 'sys_ok',
        batchReactions: {},

        async init() {
            window.thinkLogApp = this;
            
            window.addEventListener('popstate', (e) => {
                this.handleRouting();
            });

            await this.loadFeeds();

            // Resolve auth before initial load so recommended sort
            // gets the userId for personalized ordering
            try {
                const { data: { session } } = await window.supabaseClient.auth.getSession();
                if (session) {
                    this.user = session.user;
                }
            } catch (e) {}

            await this.handleRouting();
        },

        async loadFeeds() {
            try {
                this.feeds = await window.api.getFeeds();
            } catch (e) {
                console.warn('Failed to load feeds', e);
            }
        },

        setFeed(feedId) {
            this.currentFeedId = feedId;
            this.currentQuery = '';
            this.loadPosts(true);
        },

        setSort(sortBy) {
            this.currentSort = sortBy;
            this.loadPosts(true);
        },

        async handleRouting() {
            const path = window.location.pathname;
            const urlParams = new URLSearchParams(window.location.search);
            const articleId = urlParams.get('id');

            // Path-based routing (clean URLs)
            if (path === '/about' || urlParams.get('view') === 'about') {
                this.openAbout(false);
            } else if (path === '/privacy') {
                this.openPrivacy(false);
            } else if (path === '/terms') {
                this.openTerms(false);
            } else if (path === '/article' && articleId) {
                await this.openArticle(articleId, false);
            } else if (articleId) {
                // Legacy ?id= support
                await this.openArticle(articleId, false);
            } else {
                // Default: feed (/ or /feed)
                this.currentView = 'feed';
                this.currentArticle = null;
                await this.loadPosts(true);
            }
        },

        async loadPosts(reset = false) {
            if (reset) {
                this.currentPage = 1;
                this.posts = [];
            }
            
            this.isLoading = true;
            try {
                let response;
                if (this.currentQuery) {
                    response = await window.api.searchPosts(this.currentQuery, this.currentPage);
                } else {
                    response = await window.api.getPosts(this.currentPage, 10, this.currentFeedId || null, this.currentSort, this.user?.id);
                }
                
                if (reset) {
                    this.posts = response.data;
                } else {
                    this.posts = [...this.posts, ...response.data];
                }

                this.totalPages = response.metadata.totalPages;
                this.totalPosts = response.metadata.total;
                this.feedStatus = `sys_ok (${this.totalPosts} total records)`;

                // Batch fetch reactions for the new posts
                if (response.data.length > 0) {
                    try {
                        const postIds = response.data.map(p => p.id);
                        const reactions = await window.api.getBatchReactions(postIds);
                        this.batchReactions = { ...this.batchReactions, ...reactions };
                        // Dispatch event so components know data is available
                        window.dispatchEvent(new CustomEvent('batchReactionsUpdated'));
                    } catch (reactionErr) {
                        console.warn('Failed to fetch batch reactions, falling back to individual loading', reactionErr);
                    }
                }
            } catch (error) {
                console.error('Failed to load posts', error);
                this.feedStatus = 'sys_err';
            } finally {
                this.isLoading = false;
            }
        },

        async loadMore() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                await this.loadPosts();
            }
        },

        search(query) {
            this.currentQuery = query;
            this.loadPosts(true);
        },

        async openArticle(id, pushState = true) {
            this.currentView = 'article';
            this.isLoading = true;

            if (pushState) {
                window.history.pushState({ id }, '', `/article?id=${id}`);
            }

            try {
                this.currentArticle = await window.api.getPostDetails(id);
            } catch (err) {
                console.error('Failed to load article details', err);
            } finally {
                this.isLoading = false;
            }
        },

        openAbout(pushState = true) {
            this.currentView = 'about';
            this.currentArticle = null;
            if (pushState) {
                window.history.pushState({ view: 'about' }, '', '/about');
            }
        },

        openPrivacy(pushState = true) {
            this.currentView = 'privacy';
            this.currentArticle = null;
            if (pushState) {
                window.history.pushState({ view: 'privacy' }, '', '/privacy');
            }
        },

        openTerms(pushState = true) {
            this.currentView = 'terms';
            this.currentArticle = null;
            if (pushState) {
                window.history.pushState({ view: 'terms' }, '', '/terms');
            }
        },

        goHome(pushState = true) {
            this.currentView = 'feed';
            this.currentArticle = null;
            this.currentQuery = '';
            this.currentFeedId = '';
            this.currentSort = 'recommended';
            if (pushState) {
                window.history.pushState({}, '', '/');
            }
            this.loadPosts(true);
        },

        closeArticle() {
            this.goHome();
        },

        formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString();
        },

        getDisplayName() {
            if (!this.user) return '';
            return this.user.user_metadata?.user_name || this.user.email.split('@')[0];
        },

        shareArticle(post) {
            const url = `${window.location.origin}${window.location.pathname}?id=${post.id}`;
            const text = `Check out this article: ${post.title}`;
            
            if (navigator.share) {
                navigator.share({
                    title: post.title,
                    text: text,
                    url: url
                }).catch(err => console.error('Error sharing', err));
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(`${text} ${url}`)
                    .then(() => alert('Link copied to clipboard!'))
                    .catch(err => console.error('Could not copy text: ', err));
            }
        }
    }));
});
