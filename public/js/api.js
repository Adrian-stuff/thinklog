const API_BASE_URL = '/api';

window.api = {
    async getPosts(page = 1, limit = 10, feedId = null, sortBy = 'recommended', userId = null) {
        let url = `${API_BASE_URL}/posts?page=${page}&limit=${limit}&sortBy=${sortBy}`;
        if (feedId) url += `&feedId=${feedId}`;
        if (userId) url += `&userId=${userId}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    },
    
    async searchPosts(query, page = 1, limit = 10) {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to search posts');
        return response.json();
    },

    async getSuggestions(query) {
        const response = await fetch(`${API_BASE_URL}/search/suggestions?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to get suggestions');
        return response.json();
    },

    async getFeeds() {
        const response = await fetch(`${API_BASE_URL}/feeds`);
        if (!response.ok) throw new Error('Failed to fetch feeds');
        return response.json();
    },

    async getPostById(id) {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        return response.json();
    },

    async getPostDetails(id) {
        const response = await fetch(`${API_BASE_URL}/posts/${id}/details`);
        if (!response.ok) throw new Error('Failed to fetch post details');
        return response.json();
    },

    async getBatchReactions(postIds) {
        if (!postIds.length) return {};
        const response = await fetch(`${API_BASE_URL}/reactions/batch?ids=${postIds.join(',')}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to fetch batch reactions: ${response.status} ${errorData.error || ''}`);
        }
        return response.json();
    }
};
