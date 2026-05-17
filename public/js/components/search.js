document.addEventListener('alpine:init', () => {
    Alpine.data('searchComponent', () => ({
        query: '',
        suggestions: [],
        showSuggestions: false,

        init() {
            this.$watch('query', (value) => {
                this.debounceSearch(value);
            });
        },

        debounceSearch(val) {
            clearTimeout(this.timer);
            if (!val.trim()) {
                this.suggestions = [];
                this.showSuggestions = false;
                return;
            }
            this.timer = setTimeout(() => this.getSuggestions(val), 300);
        },

        async getSuggestions(val) {
            try {
                this.suggestions = await window.api.getSuggestions(val);
                this.showSuggestions = true;
            } catch (err) {
                console.error('Failed to get suggestions', err);
            }
        },

        handleEnter() {
            this.showSuggestions = false;
            window.thinkLogApp.search(this.query);
        },

        selectSuggestion(s) {
            this.query = '';
            this.showSuggestions = false;
            window.thinkLogApp.openArticle(s.id);
        },

        handleClickOutside() {
            this.showSuggestions = false;
        }
    }));
});
