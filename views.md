# ThinkLog — HTML Views Breakdown

---

## 1. Login View (Auth Modal)

The authentication modal is triggered by clicking the **"Login"** button in the header. It supports email/password sign-in and sign-up, plus OAuth via Google and GitHub. A separate **Settings Modal** lets authenticated users update their display name.

```html
<!-- Auth Modal -->
<div class="modal-overlay" x-show="isAuthModalOpen" x-cloak
    x-transition:enter="transition ease-out duration-200"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="transition ease-in duration-150"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0">
    <div class="modal-content" @click.outside="isAuthModalOpen = false"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 scale-95 translate-y-2"
        x-transition:enter-end="opacity-100 scale-100 translate-y-0"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 scale-100 translate-y-0"
        x-transition:leave-end="opacity-0 scale-95 translate-y-2">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold" x-text="isSignUp ? 'Create Account' : 'Sign In'"></h2>
            <span class="text-2xl text-slate-400 cursor-pointer hover:text-slate-900"
                @click="isAuthModalOpen = false">&times;</span>
        </div>
        <div class="space-y-4">
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Email</label>
                <input type="email" x-model="email" placeholder="dev@example.com" class="input-field">
            </div>
            <div x-show="isSignUp">
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Username</label>
                <input type="text" x-model="username" placeholder="developer123" class="input-field">
            </div>
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                <input type="password" x-model="password" placeholder="••••••••" class="input-field">
            </div>
            <div class="pt-2 flex flex-col gap-3">
                <button x-show="!isSignUp" @click="login" class="btn btn-primary w-full">Sign In</button>
                <button x-show="!isSignUp" @click="isSignUp = true"
                    class="text-sm text-brand font-medium hover:underline">Need an account? Create one</button>

                <button x-show="isSignUp" @click="signup" class="btn btn-primary w-full bg-slate-800">Create Account</button>
                <button x-show="isSignUp" @click="isSignUp = false"
                    class="text-sm text-brand font-medium hover:underline">Already have an account? Sign In</button>
            </div>
        </div>

        <div class="flex items-center my-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <span class="h-px bg-slate-200 flex-1"></span>
            <span class="px-4">OR</span>
            <span class="h-px bg-slate-200 flex-1"></span>
        </div>

        <div class="flex flex-col gap-3">
            <button @click="googleLogin" class="btn btn-outline w-full gap-3">
                <!-- Google SVG icon -->
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>
            <button @click="githubLogin" class="btn btn-outline w-full gap-3">
                <!-- GitHub SVG icon -->
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Continue with GitHub
            </button>
        </div>
        <div class="text-xs text-center text-rose-500 mt-4" x-text="message"></div>
    </div>
</div>

<!-- Settings Modal -->
<div class="modal-overlay" x-show="isSettingsOpen" x-cloak
    x-transition:enter="transition ease-out duration-200"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="transition ease-in duration-150"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0">
    <div class="modal-content" @click.outside="isSettingsOpen = false"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 scale-95 translate-y-2"
        x-transition:enter-end="opacity-100 scale-100 translate-y-0"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 scale-100 translate-y-0"
        x-transition:leave-end="opacity-0 scale-95 translate-y-2">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Account Settings</h2>
            <span class="text-2xl text-slate-400 cursor-pointer hover:text-slate-900"
                @click="isSettingsOpen = false">&times;</span>
        </div>
        <div class="space-y-4">
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Display Name</label>
                <input type="text" x-model="settingsUsername" placeholder="New display name" class="input-field">
            </div>
            <button @click="saveSettings" class="btn btn-primary w-full mt-4">Save Changes</button>
            <div class="text-xs text-center text-rose-500" x-text="settingsMessage"></div>
        </div>
    </div>
</div>
```

---

## 2. Homepage / Feed View

The main feed displays a grid of article cards with feed filtering, sort toggles, reactions, comments, search, and a load-more pagination button.

```html
<!-- Feed View -->
<div x-show="currentView === 'feed'" x-cloak
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0">

    <!-- Feed & Sort Filters -->
    <div class="flex flex-col gap-3 mb-6">
        <div class="flex flex-wrap items-center gap-2 text-sm">
            <button class="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                :class="currentFeedId === '' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                @click="setFeed('')">All</button>
            <template x-for="feed in feeds" :key="feed.id">
                <button class="px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                    :class="currentFeedId === feed.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                    @click="setFeed(feed.id)" x-text="feed.name"></button>
            </template>
        </div>
        <div class="flex items-center gap-1.5 text-xs font-bold">
            <span class="text-slate-400 uppercase tracking-widest mr-1">Sort</span>
            <button class="px-3 py-1.5 rounded-full transition-all"
                :class="currentSort === 'recommended' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100'"
                @click="setSort('recommended')">Recommended</button>
            <button class="px-3 py-1.5 rounded-full transition-all"
                :class="currentSort === 'latest' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'"
                @click="setSort('latest')">Latest</button>
            <button class="px-3 py-1.5 rounded-full transition-all"
                :class="currentSort === 'popular' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'"
                @click="setSort('popular')">Popular</button>
            <button class="px-3 py-1.5 rounded-full transition-all"
                :class="currentSort === 'trending' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'"
                @click="setSort('trending')">Trending</button>
            <button class="px-3 py-1.5 rounded-full transition-all"
                :class="currentSort === 'discover' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-100'"
                @click="setSort('discover')">Discover</button>
            <template x-if="currentFeedId || currentSort !== 'recommended'">
                <button class="ml-2 text-xs text-slate-400 hover:text-slate-600 underline" @click="goHome()">Clear filters</button>
            </template>
        </div>
    </div>

    <!-- Article Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <template x-for="post in posts" :key="post.id">
            <article
                x-transition:enter="transition ease-out duration-300"
                x-transition:enter-start="opacity-0 translate-y-4"
                x-transition:enter-end="opacity-100 translate-y-0"
                class="bg-white border border-slate-200 rounded-xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-300 flex flex-col group">

                <!-- Article Image -->
                <template x-if="post.image_url">
                    <a href="#" @click.prevent="openArticle(post.id)"
                        class="block -mx-6 -mt-6 mb-4 overflow-hidden bg-slate-100">
                        <img :src="post.image_url" alt=""
                            class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            @error="$el.style.display='none'">
                    </a>
                </template>

                <!-- Title & Meta -->
                <div class="mb-4">
                    <a href="#"
                        class="text-xl font-bold text-slate-900 leading-tight group-hover:text-brand transition-colors"
                        @click.prevent="openArticle(post.id)" x-text="post.title"></a>
                    <div class="flex flex-wrap gap-4 items-center mt-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        <span x-text="'by ' + (post.author || 'unknown')"></span>
                        <span x-text="formatDate(post.published_at)"></span>
                        <span class="text-slate-300">•</span>
                        <span x-text="(post.feed_name || 'unknown')"></span>
                    </div>
                </div>

                <!-- Excerpt -->
                <div class="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-3"
                    x-text="post.excerpt || 'No excerpt available.'"></div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-6" x-show="post.tags && post.tags.length">
                    <template x-for="tag in post.tags.slice(0, 3)">
                        <span class="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full uppercase tracking-widest" x-text="tag"></span>
                    </template>
                </div>

                <!-- Reactions & Comments -->
                <div class="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <div class="flex gap-2.5" x-data="reactionsComponent(post.id)">
                            <!-- Reaction buttons (heart, bookmarks, etc.) -->
                            <template x-if="isLoading && !isLoaded">
                                <div class="flex gap-2">
                                    <div class="w-12 h-7 bg-slate-100 rounded-full skeleton"></div>
                                    <div class="w-12 h-7 bg-slate-100 rounded-full skeleton"></div>
                                    <div class="w-12 h-7 bg-slate-100 rounded-full skeleton"></div>
                                </div>
                            </template>
                            <template x-if="!isLoading || isLoaded">
                                <div class="flex gap-2.5">
                                    <template x-for="(svg, type) in icons">
                                        <button
                                            class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 transition-all hover:bg-slate-50 active:scale-95"
                                            :class="{ '!bg-brand/5 !border-brand/20 !text-brand': userReactions.includes(type) }"
                                            @click="toggleReaction(type)" :title="type">
                                            <span class="w-3.5 h-3.5" x-html="svg"></span>
                                            <span x-text="counts[type] || 0"></span>
                                        </button>
                                    </template>
                                </div>
                            </template>
                        </div>
                        <!-- Share Button -->
                        <button class="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50"
                            @click="shareArticle(post)">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                            Share
                        </button>
                    </div>

                    <!-- Inline Comments Section -->
                    <div x-data="commentsComponent(post.id)">
                        <button class="text-xs font-bold text-blue-600 hover:underline"
                            @click="showComments = !showComments"
                            x-text="showComments ? 'Hide Discussion' : 'View Discussion'"></button>
                        <div class="mt-4" x-show="showComments" x-cloak
                            x-transition:enter="transition ease-out duration-250"
                            x-transition:enter-start="opacity-0 translate-y-2"
                            x-transition:enter-end="opacity-100 translate-y-0"
                            x-transition:leave="transition ease-in duration-150"
                            x-transition:leave-start="opacity-100 translate-y-0"
                            x-transition:leave-end="opacity-0 translate-y-2">
                            <div class="flex flex-col gap-3 max-h-60 overflow-y-auto mb-4 pr-2">
                                <template x-if="isLoading">
                                    <div class="space-y-3">
                                        <div class="h-16 bg-slate-100 rounded-lg skeleton"></div>
                                        <div class="h-16 bg-slate-100 rounded-lg skeleton"></div>
                                    </div>
                                </template>
                                <template x-if="!isLoading">
                                    <div class="flex flex-col gap-3">
                                        <template x-for="comment in comments" :key="comment.id">
                                            <div class="bg-slate-50 rounded-lg p-3 text-sm">
                                                <div class="flex justify-between items-center mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span x-text="comment.user_name"></span>
                                                    <span x-text="new Date(comment.created_at).toLocaleDateString()"></span>
                                                </div>
                                                <div class="text-slate-700" x-text="comment.content"></div>
                                            </div>
                                        </template>
                                        <div class="text-xs text-slate-400 italic" x-show="comments.length === 0">No comments yet. Be the first to join!</div>
                                    </div>
                                </template>
                            </div>
                            <div class="flex flex-col gap-2">
                                <textarea x-model="newComment" placeholder="Join the discussion..." class="input-field min-h-[60px] text-xs py-2"></textarea>
                                <button class="btn btn-primary py-2 text-xs" @click="submitComment()">Post Comment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </template>
    </div>

    <!-- Loading Skeletons (initial) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2" x-show="isLoading && posts.length === 0">
        <template x-for="i in 6">
            <div class="bg-white border border-slate-200 rounded-xl p-6 flex flex-col h-[320px]">
                <div class="h-6 bg-slate-100 rounded w-3/4 mb-4 skeleton"></div>
                <div class="flex gap-4 mb-6">
                    <div class="h-3 bg-slate-100 rounded w-20 skeleton"></div>
                    <div class="h-3 bg-slate-100 rounded w-20 skeleton"></div>
                </div>
                <div class="space-y-2 mb-6">
                    <div class="h-4 bg-slate-100 rounded w-full skeleton"></div>
                    <div class="h-4 bg-slate-100 rounded w-full skeleton"></div>
                    <div class="h-4 bg-slate-100 rounded w-2/3 skeleton"></div>
                </div>
                <div class="mt-auto pt-5 border-t border-slate-100 flex justify-between">
                    <div class="flex gap-2">
                        <div class="w-12 h-7 bg-slate-100 rounded-full skeleton"></div>
                        <div class="w-12 h-7 bg-slate-100 rounded-full skeleton"></div>
                    </div>
                    <div class="w-16 h-7 bg-slate-100 rounded-full skeleton"></div>
                </div>
            </div>
        </template>
    </div>

    <!-- Load More Skeletons -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" x-show="isLoading && posts.length > 0">
        <template x-for="i in 2">
            <div class="bg-white border border-slate-200 rounded-xl p-6 flex flex-col h-[320px] opacity-60">
                <div class="h-6 bg-slate-100 rounded w-3/4 mb-4 skeleton"></div>
                <div class="space-y-2 mb-6">
                    <div class="h-4 bg-slate-100 rounded w-full skeleton"></div>
                    <div class="h-4 bg-slate-100 rounded w-2/3 skeleton"></div>
                </div>
                <div class="mt-auto pt-5 border-t border-slate-100">
                    <div class="w-12 h-7 bg-slate-100 rounded-full skeleton"></div>
                </div>
            </div>
        </template>
    </div>

    <!-- Pagination / Load More -->
    <div class="text-center my-16" x-show="currentPage < totalPages">
        <button class="btn btn-secondary px-10 relative overflow-hidden" 
                @click="loadMore()" 
                :disabled="isLoading">
            <span :class="{ 'opacity-0': isLoading }">Load More Articles</span>
            <template x-if="isLoading">
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </template>
        </button>
    </div>
</div>
```

---

## 3. Article View (Detail / Reader)

Shown when a user clicks an article card. Displays the full article content with syntax-highlighted code blocks, share button, "Read Original" link, reactions, and a full comments section.

```html
<!-- Article View -->
<div x-show="currentView === 'article'" x-cloak
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 translate-y-4"
    x-transition:enter-end="opacity-100 translate-y-0"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="opacity-100 translate-y-0"
    x-transition:leave-end="opacity-0 translate-y-4">

    <!-- Back Button -->
    <button class="btn btn-outline mb-8 gap-2 group" @click="closeArticle()">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
            class="group-hover:-translate-x-1 transition-transform">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Feed
    </button>

    <div x-show="currentArticle"
        class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        <!-- Article Header -->
        <div class="p-8 md:p-12 border-b border-slate-100">
            <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6 tracking-tight"
                x-text="currentArticle?.title"></h1>
            <div class="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold"
                        x-text="(currentArticle?.author || 'U')[0]"></div>
                    <span class="text-slate-900" x-text="currentArticle?.author || 'Unknown Author'"></span>
                </div>
                <span x-text="formatDate(currentArticle?.published_at)"></span>
                <span class="px-3 py-1 bg-slate-50 rounded-full text-slate-500 text-xs uppercase font-bold tracking-widest"
                    x-text="currentArticle?.feed_name || 'Unknown Source'"></span>

                <div class="flex gap-3 ml-auto">
                    <button class="btn btn-outline py-2 px-4 gap-2 text-xs"
                        @click="shareArticle(currentArticle)">
                        <!-- Share icon -->
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"></path>
                            <polyline points="16 6 12 2 8 6"></polyline>
                            <line x1="12" y1="2" x2="12" y2="15"></line>
                        </svg>
                        Share
                    </button>
                    <a :href="currentArticle?.url" target="_blank"
                        class="btn btn-primary py-2 px-4 text-xs">Read Original ↗</a>
                </div>
            </div>
        </div>

        <!-- Article Body -->
        <div class="p-8 md:p-12 prose prose-slate max-w-none">
            <template x-if="currentArticle?.image_url">
                <img :src="currentArticle.image_url" alt="Article image"
                    class="rounded-xl shadow-lg mb-10 w-full object-cover max-h-[400px]">
            </template>
            <div class="article-content"
                x-html="currentArticle?.content || currentArticle?.excerpt || 'No content available.'"
                x-effect="currentArticle && $nextTick(() => initArticleCode($el))">
            </div>
        </div>

        <!-- Reactions & Comments Section -->
        <div class="p-8 md:p-12 bg-slate-50/50 border-t border-slate-100">
            <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5"
                    fill="none" class="text-blue-600">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Join the Conversation
            </h3>
            <div class="flex flex-col gap-10">
                <template x-if="currentArticle">
                    <div x-data="reactionsComponent(currentArticle.id)" class="flex gap-4">
                        <!-- Reaction buttons (larger variant) -->
                        <template x-if="isLoading && !isLoaded">
                            <div class="flex gap-4">
                                <div class="w-24 h-12 bg-white border border-slate-200 rounded-xl skeleton"></div>
                                <div class="w-24 h-12 bg-white border border-slate-200 rounded-xl skeleton"></div>
                                <div class="w-24 h-12 bg-white border border-slate-200 rounded-xl skeleton"></div>
                            </div>
                        </template>
                        <template x-if="!isLoading || isLoaded">
                            <div class="flex gap-4">
                                <template x-for="(svg, type) in icons">
                                    <button
                                        class="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-all hover:border-blue-600 hover:text-blue-600"
                                        :class="{ '!bg-blue-600 !text-white !border-blue-600 shadow-lg': userReactions.includes(type) }"
                                        @click="toggleReaction(type)" :title="type">
                                        <span class="w-4 h-4" x-html="svg"></span>
                                        <span x-text="counts[type] || 0"></span>
                                    </button>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>

                <template x-if="currentArticle">
                    <div x-data="commentsComponent(currentArticle.id)" class="space-y-8">
                        <div class="space-y-4">
                            <template x-if="isLoading">
                                <div class="space-y-4">
                                    <div class="h-24 bg-white border border-slate-200 rounded-xl skeleton"></div>
                                    <div class="h-24 bg-white border border-slate-200 rounded-xl skeleton"></div>
                                </div>
                            </template>
                            <template x-if="!isLoading">
                                <div class="space-y-4">
                                    <template x-for="comment in comments" :key="comment.id">
                                        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                            <div class="flex justify-between items-center mb-2">
                                                <span class="text-xs font-bold text-slate-900" x-text="comment.user_name"></span>
                                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                                                    x-text="new Date(comment.created_at).toLocaleString()"></span>
                                            </div>
                                            <div class="text-sm text-slate-700 leading-relaxed" x-text="comment.content"></div>
                                        </div>
                                    </template>
                                    <div class="py-12 text-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-xl"
                                        x-show="comments.length === 0">
                                        No comments yet. Start the discussion!
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <label class="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Post a comment</label>
                            <textarea x-model="newComment"
                                placeholder="Share your thoughts with the community..."
                                class="input-field min-h-[120px] mb-4 text-sm"></textarea>
                            <div class="flex justify-end">
                                <button class="btn btn-primary px-8" @click="submitComment()">Post Comment</button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <!-- Article View Skeleton (loading state) -->
    <div x-show="isLoading && !currentArticle"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100">
        <div class="btn btn-outline mb-8 gap-2 opacity-50 cursor-not-allowed">
            <div class="w-20 h-4 bg-slate-100 rounded skeleton"></div>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div class="p-8 md:p-12 border-b border-slate-100">
                <div class="h-12 md:h-16 bg-slate-100 rounded-lg w-3/4 mb-8 skeleton"></div>
                <div class="flex items-center gap-6">
                    <div class="w-10 h-10 rounded-full bg-slate-100 skeleton"></div>
                    <div class="w-32 h-4 bg-slate-100 rounded skeleton"></div>
                    <div class="w-24 h-4 bg-slate-100 rounded skeleton ml-auto"></div>
                </div>
            </div>
            <div class="p-8 md:p-12 space-y-8">
                <div class="w-full h-64 bg-slate-100 rounded-xl skeleton"></div>
                <div class="space-y-4">
                    <div class="h-4 bg-slate-100 rounded w-full skeleton"></div>
                    <div class="h-4 bg-slate-100 rounded w-full skeleton"></div>
                    <div class="h-4 bg-slate-100 rounded w-5/6 skeleton"></div>
                    <div class="h-4 bg-slate-100 rounded w-4/6 skeleton"></div>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

## Shared Layout (Header & Footer)

The **header** (logo, search bar, auth section) and **footer** (status indicator, links) wrap all views.

```html
<!-- Header -->
<header class="flex flex-wrap items-center justify-between py-8 mb-6 border-b border-slate-200 gap-5">
    <div class="logo cursor-pointer" @click="goHome()">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">ThinkLog</h1>
        <p class="text-sm text-slate-500">Curated reads for developers</p>
    </div>
    <nav class="flex items-center gap-6 flex-wrap">
        <!-- Search -->
        <div class="relative flex items-center" x-data="searchComponent" @click.outside="handleClickOutside">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"
                stroke-linecap="round" stroke-linejoin="round" class="absolute left-3.5 text-slate-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" x-model="query" @keydown.enter="handleEnter" placeholder="Search posts..."
                class="input-field pl-11 min-w-[280px] shadow-sm">
            <!-- Suggestions dropdown -->
            <div class="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl mt-1.5 z-50 max-h-80 overflow-y-auto"
                x-show="showSuggestions" x-cloak>
                <template x-for="s in suggestions" :key="s.id">
                    <div class="px-4 py-3 cursor-pointer text-sm border-b border-slate-50 hover:bg-slate-50 last:border-0"
                        @click="selectSuggestion(s)" x-text="s.title"></div>
                </template>
                <div class="px-4 py-3 text-sm text-slate-500" x-show="suggestions.length === 0">No results found</div>
            </div>
        </div>
        <!-- Auth (Login / User info) -->
        <div id="auth-section" class="flex items-center gap-4" x-data="authComponent">
            <span id="user-info" class="text-sm font-medium text-slate-500" x-text="getDisplayName()"></span>
            <button class="btn btn-outline p-2.5" x-show="user" @click="isSettingsOpen = true" title="Account Settings">
                <!-- Settings gear icon -->
            </button>
            <button class="btn btn-primary" x-text="user ? 'Logout' : 'Login'"
                @click="user ? logout() : isAuthModalOpen = true"></button>
        </div>
    </nav>
</header>

<!-- Footer -->
<footer class="py-12 mt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
    <p class="text-sm text-slate-500 font-medium flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 status-dot"></span>
        Connection established. <span id="feed-status" class="text-emerald-500 font-semibold" x-text="feedStatus"></span>
    </p>
    <div class="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <a href="#" @click.prevent="openAbout()" class="hover:text-slate-900 transition-colors">About</a>
        <a href="#" @click.prevent="openPrivacy()" class="hover:text-slate-900 transition-colors">Privacy</a>
        <a href="#" @click.prevent="openTerms()" class="hover:text-slate-900 transition-colors">Terms</a>
    </div>
</footer>
```
