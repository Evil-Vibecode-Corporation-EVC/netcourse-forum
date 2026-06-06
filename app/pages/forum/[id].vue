<template>
  <main class="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6">
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-400 font-mono text-sm mb-8 transition-all group">
        <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        $ cd ~/forum
      </NuxtLink>

      <div v-if="loading" class="flex items-center justify-center py-24">
        <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else-if="post">
        <article :class="['bg-slate-900 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden', isCoursePost ? 'border border-emerald-500/40 shadow-[0_0_18px_rgba(16,185,129,0.08)]' : 'border border-slate-700/30']">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>

          <div class="flex items-center gap-1.5 mb-6">
            <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <div class="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <span class="text-slate-500 font-mono text-xs ml-2">
              post_#{{ post.id }}.md
            </span>

            <div v-if="canEditPost" class="ml-auto flex items-center gap-2">
              <button @click="showEditModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 font-mono text-xs rounded-lg transition-all">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                edit
              </button>
              <button @click="showDeletePostModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 font-mono text-xs rounded-lg transition-all">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                delete
              </button>
            </div>
          </div>

          <div class="flex items-start gap-3 mb-5">
            <UserTooltip :user-id="post.user?.id || post.userId">
              <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden hover:border-slate-500/60 transition-all cursor-pointer">
                <img v-if="post.user?.avatarUrl" :src="post.user.avatarUrl" class="w-full h-full object-cover" />
                <span v-else class="text-slate-300 font-mono font-bold">{{ post.user?.username?.charAt(0).toUpperCase() }}</span>
              </div>
            </UserTooltip>
            <div>
              <div class="text-slate-300 font-mono text-sm font-semibold">{{ post.user?.username }}</div>
              <div class="text-slate-500 font-mono text-xs">{{ formatDate(post.createdAt) }}</div>
            </div>
            <div v-if="isCoursePost && course" class="ml-auto text-right">
              <div class="text-slate-500 font-mono text-[10px] uppercase tracking-[0.24em] mb-1">{{ $t('forum.post.courseLabel') }}</div>
              <NuxtLink :to="`/courses/${course.id}`" class="text-slate-200 text-sm font-semibold hover:text-white transition-colors block max-w-[220px] truncate">
                {{ course.title }}
              </NuxtLink>
            </div>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-5 leading-snug">{{ post.title }}</h1>

          <div class="text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-sm rounded-xl p-5 mb-5 bg-slate-800/50 border border-slate-700/50">
            {{ post.body }}
          </div>

          <!-- Вложения поста -->
          <div v-if="post.attachments?.length" class="flex flex-wrap gap-2 mb-5">
            <div
              v-for="att in post.attachments"
              :key="att.id"
              class="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg group hover:border-slate-600 transition-all"
            >
              <template v-if="att.mimeType?.startsWith('image/')">
                <a :href="att.r2Key" target="_blank" class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded overflow-hidden shrink-0">
                    <img :src="att.r2Key" :alt="att.fileName" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-slate-400 font-mono text-xs hover:text-emerald-400 truncate max-w-[150px] transition-colors">{{ att.fileName }}</span>
                </a>
              </template>
              <template v-else>
                <span class="text-slate-500 text-xs">📎</span>
                <a :href="att.r2Key" target="_blank" class="text-slate-400 font-mono text-xs hover:text-emerald-400 truncate max-w-[200px] transition-colors">{{ att.fileName }}</a>
              </template>
            </div>
          </div>

          <div
            v-if="post.courseId && course"
            class="mb-8 p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm"
          >
            <div class="flex flex-col gap-5">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <a
                    href="https://netcourse.tech/courses"
                    target="_blank"
                    class="text-xl font-semibold text-white hover:text-emerald-300 transition-colors inline-flex items-center gap-2"
                  >
                    {{ course.title }}
                    <svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                  <div class="mt-2 flex items-center gap-2 text-slate-500 font-mono text-xs">
                    <span>{{ course.category || 'General' }}</span>
                    <span>·</span>
                    <span class="flex items-center gap-0.5">
                      <svg
                        v-for="i in 5"
                        :key="i"
                        class="w-3 h-3"
                        :class="i <= Math.round(course.averageRating || 0) ? 'text-amber-400' : 'text-slate-700'"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </span>
                    <span>{{ course.averageRating?.toFixed(1) || '0.0' }}</span>
                    <span>·</span>
                    <span>{{ course.ratingsCount || 0 }} {{ $t('forum.ratings') }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-3 flex-wrap text-slate-400 text-xs">
                  <span v-if="courseCompleted" class="uppercase tracking-[0.16em]">{{ $t('forum.post.completed') }}</span>
                  <span v-else class="uppercase tracking-[0.16em]">{{ $t('forum.post.notCompleted') }}</span>
                  <span v-if="myRating !== null">{{ $t('forum.post.yourRating', { rating: myRating }) }}</span>
                  <span v-if="!isAuthenticated">{{ $t('forum.post.loginToRate') }}</span>
                </div>
              </div>

              <p v-if="course.description" class="text-slate-400 text-sm leading-relaxed line-clamp-3">
                {{ course.description }}
              </p>

              <div v-if="myRating !== null" class="flex items-center gap-2 text-slate-200 font-mono text-sm">
                <span>{{ $t('forum.post.yourRatingLabel') }}</span>
                <span class="flex items-center gap-0.5">
                  <template v-for="n in 5" :key="n">
                    <svg
                      class="w-4 h-4"
                      :class="n <= (myRating || 0) ? 'text-amber-400' : 'text-slate-600'"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </template>
                </span>
                <span class="text-slate-500 text-xs">{{ myRating }} / 5</span>
              </div>
            </div>
          </div>
          <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 mb-5">
            <NuxtLink
              v-for="tag in post.tags"
              :key="tag"
              to="/"
              class="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-xs hover:bg-emerald-500/20 transition-all"
            >
              #{{ tag }}
            </NuxtLink>
          </div>

          <div class="flex items-center gap-4 border-t border-slate-800 pt-4">
            <button
              @click="togglePostLike"
              :disabled="!isAuthenticated"
              class="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-mono text-sm"
              :class="postLiked
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400'"
              :title="isAuthenticated ? (postLiked ? $t('forum.like.remove') : $t('forum.like.add')) : $t('forum.like.loginToLike')"
            >
              <svg
                class="w-4 h-4 transition-transform hover:scale-110"
                :class="postLiked ? 'fill-emerald-400' : 'fill-none'"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{{ postLikesCount }}</span>
              <span class="text-xs text-slate-500">{{ postLiked ? 'liked' : 'like' }}</span>
            </button>

            <span class="text-slate-600 font-mono text-xs">
              <span :class="['w-1.5 h-1.5 rounded-full inline-block mr-1.5', isCoursePost ? 'bg-emerald-500/50' : 'bg-emerald-500/50']"></span>
              {{ replyMeta.total }} replies
            </span>
          </div>
        </article>

        <section>
          <div class="flex items-center gap-3 mb-6">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span class="text-slate-400 font-mono text-sm">replies</span>
            <span class="bg-slate-800 border border-slate-700 text-slate-400 font-mono text-xs px-2 py-0.5 rounded-lg">{{ replyMeta.total }}</span>
          </div>

          <div v-if="isAuthenticated" class="bg-slate-900 border border-emerald-500/20 rounded-xl p-5 mb-6">
            <div class="flex items-center gap-1.5 mb-4">
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-slate-500 font-mono text-xs ml-1">new_reply.sh</span>
            </div>
            <textarea
              v-model="replyBody"
              rows="3"
              :placeholder="$t('forum.post.replyPlaceholder')"
              class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all resize-none mb-3"
            ></textarea>

            <!-- Прикрепление файлов к ответу -->
            <div class="flex items-center gap-3 mb-3">
              <button
                type="button"
                @click="replyFileInput?.click()"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 font-mono text-xs rounded-lg transition-all"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                <span>{{ replyFiles.length ? replyFiles.map(f => f.name).join(', ') : '$ attach' }}</span>
              </button>
              <input
                ref="replyFileInput"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                class="hidden"
                @change="onReplyFilesSelected"
              />
            </div>

            <div class="flex justify-end">
              <button
                @click="submitReply"
                :disabled="!replyBody.trim() || replyLoading"
                class="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/60 text-emerald-400 font-mono text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div v-if="replyLoading" class="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span>$ reply.sh</span>
              </button>
            </div>
          </div>
          <div v-else class="bg-slate-900/50 border border-dashed border-slate-700 rounded-xl p-5 mb-6 text-center">
            <span class="text-slate-500 font-mono text-sm">
              <NuxtLink to="/login" class="text-emerald-400 hover:underline">$ login</NuxtLink>
              {{ $t('forum.post.replyToLogin') }}
            </span>
          </div>

          <div v-if="repliesLoading" class="flex justify-center py-12">
            <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="reply in replies"
              :key="reply.id"
              class="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all"
            >
              <div class="flex items-start gap-3">
                <UserTooltip :user-id="reply.user?.id || reply.userId">
                  <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 hover:border-emerald-500/40 transition-all cursor-pointer">
                    <img v-if="reply.user?.avatarUrl" :src="reply.user.avatarUrl" class="w-full h-full object-cover" />
                    <span v-else class="text-slate-400 font-mono text-xs font-bold">{{ reply.user?.username?.charAt(0).toUpperCase() }}</span>
                  </div>
                </UserTooltip>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2 flex-wrap">
                    <span class="text-emerald-400 font-mono text-sm font-semibold">{{ reply.user?.username }}</span>
                    <span class="text-slate-600 font-mono text-xs">{{ formatDate(reply.createdAt) }}</span>
                    <span v-if="reply.updatedAt !== reply.createdAt" class="text-slate-600 font-mono text-xs italic">(edited)</span>
                  </div>

                  <div v-if="editingReplyId !== reply.id">
                    <p class="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{{ reply.body }}</p>
                    <div v-if="reply.attachments?.length" class="flex flex-wrap gap-2 mt-3">
                      <div
                        v-for="att in reply.attachments"
                        :key="att.id"
                        class="flex items-center gap-2 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg"
                      >
                        <template v-if="att.mimeType?.startsWith('image/')">
                          <a :href="att.r2Key" target="_blank" class="flex items-center gap-1">
                            <div class="w-6 h-6 rounded overflow-hidden shrink-0">
                              <img :src="att.r2Key" :alt="att.fileName" class="w-full h-full object-cover" />
                            </div>
                            <span class="text-slate-500 font-mono text-xs hover:text-emerald-400 truncate max-w-[120px] transition-colors">{{ att.fileName }}</span>
                          </a>
                        </template>
                        <template v-else>
                          <span class="text-slate-500 text-xs">📎</span>
                          <a :href="att.r2Key" target="_blank" class="text-slate-500 font-mono text-xs hover:text-emerald-400 truncate max-w-[150px] transition-colors">{{ att.fileName }}</a>
                        </template>
                      </div>
                    </div>
                    <div class="mt-3">
                      <button
                        @click="toggleReplyLike(reply)"
                        :disabled="!isAuthenticated"
                        class="flex items-center gap-1.5 font-mono text-xs transition-all"
                        :class="reply.likedByMe ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'"
                        :title="isAuthenticated ? (reply.likedByMe ? $t('forum.like.remove') : $t('forum.like.add')) : $t('forum.like.loginToLike')"
                      >
                        <svg
                          class="w-3.5 h-3.5 transition-transform hover:scale-110"
                          :class="reply.likedByMe ? 'fill-emerald-400' : 'fill-none'"
                          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span>{{ reply.likesCount ?? 0 }}</span>
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <textarea
                      v-model="editReplyBody"
                      rows="3"
                      class="w-full bg-slate-800 border border-emerald-500/40 rounded-lg px-3 py-2 text-white font-mono text-sm outline-none resize-none mb-2"
                    ></textarea>
                    <div class="flex gap-2">
                      <button @click="saveEditReply(reply)" :disabled="editReplyLoading" class="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs rounded-lg hover:bg-emerald-500/20 transition-all disabled:opacity-40">
                        {{ editReplyLoading ? '...' : '$ save' }}
                      </button>
                      <button @click="editingReplyId = null" class="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 font-mono text-xs rounded-lg hover:bg-slate-700 transition-all">
                        $ cancel
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="canEditReply(reply) && editingReplyId !== reply.id" class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button @click="startEditReply(reply)" class="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button @click="openDeleteReply(reply)" class="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="!replies.length && !repliesLoading" class="text-center py-10">
              <div class="text-slate-600 font-mono text-sm">// no replies yet — be the first!</div>
            </div>
          </div>

          <div v-if="replyMeta.totalPages > 1" class="flex justify-center gap-2 mt-8">
            <button @click="loadReplies(replyMeta.page - 1)" :disabled="replyMeta.page === 1" class="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-400 font-mono text-sm rounded-xl transition-all disabled:opacity-40">← prev</button>
            <button @click="loadReplies(replyMeta.page + 1)" :disabled="replyMeta.page === replyMeta.totalPages" class="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-400 font-mono text-sm rounded-xl transition-all disabled:opacity-40">next →</button>
          </div>
        </section>
      </template>

      <div v-else class="text-center py-24">
        <div class="text-slate-400 font-mono text-lg">// post not found</div>
        <NuxtLink to="/" class="mt-4 inline-block text-emerald-400 font-mono hover:underline">$ cd ~/forum</NuxtLink>
      </div>
    </div>

    <PostModal v-model="showEditModal" :edit-post="post" @submitted="onPostUpdated" />
    <ConfirmModal v-model="showDeletePostModal" :title="$t('modal.deletePostTitle')" :message="$t('modal.deletePostMessageFull')" @confirm="confirmDeletePost" />
    <ConfirmModal v-model="showDeleteReplyModal" :title="$t('modal.deleteReplyTitle')" :message="$t('modal.deleteReplyMessage')" @confirm="confirmDeleteReply" />
    <ToastContainer :toasts="toasts" @remove="removeToast" />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const route = useRoute()
const router = useRouter()
const { isAuthenticated, user, initialize } = useAuth()
const { forumAPI, forumAttachmentAPI, apiRequest, handleApiError } = useApi()
const { toasts, success, error: showError, remove: removeToast } = useToast()
const { $t } = useNuxtApp()

const postId = computed(() => Number(route.params.id))
const post = ref(null)
const loading = ref(true)

const replies = ref([])
const repliesLoading = ref(false)
const replyMeta = ref({ page: 1, totalPages: 1, total: 0 })

const replyBody = ref('')
const replyLoading = ref(false)
const replyFiles = ref<File[]>([])
const replyFileInput = ref<HTMLInputElement | null>(null)

const editingReplyId = ref(null)
const editReplyBody = ref('')
const editReplyLoading = ref(false)

const showEditModal = ref(false)
const showDeletePostModal = ref(false)
const showDeleteReplyModal = ref(false)
const deleteReplyTarget = ref(null)

const postLiked = ref(false)
const postLikesCount = ref(0)

// состояния для курса
const course = ref(null)
const courseCompleted = ref(false)
const myRating = ref(null)

const canEditPost = computed(() => {
  if (!user.value || !post.value) return false
  return user.value.id === post.value.userId || user.value.role === 'ADMIN'
})

const isCoursePost = computed(() => !!post.value?.courseId)

const canEditReply = (reply) => {
  if (!user.value) return false
  return user.value.id === reply.userId || user.value.role === 'ADMIN'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return $t('time.justNow')
  if (diff < 3600) return $t('time.minutesAgo', { count: Math.floor(diff / 60) })
  if (diff < 86400) return $t('time.hoursAgo', { count: Math.floor(diff / 3600) })
  return d.toLocaleDateString('ru-RU')
}

const loadPost = async () => {
  loading.value = true
  try {
    const data = await forumAPI.getPost(postId.value)
    post.value = data
    postLiked.value = data.likedByMe ?? false
    postLikesCount.value = data.likesCount ?? 0
    await loadCourseInfo()
  } catch (e) {
    showError(handleApiError(e, $t('errors.loadPost')))
  } finally {
    loading.value = false
  }
}

const loadReplies = async (page = 1) => {
  repliesLoading.value = true
  try {
    const res = await forumAPI.getReplies(postId.value, page)
    replies.value = res.data || []
    replyMeta.value = res.meta || { page: 1, totalPages: 1, total: 0 }
  } catch (e) {
    showError(handleApiError(e, $t('errors.loadReplies')))
  } finally {
    repliesLoading.value = false
  }
}

const loadCourseInfo = async () => {
  if (!post.value?.courseId) {
    course.value = null
    return
  }
  try {
    // Загружаем данные курса (включая средний рейтинг)
    const courseData = await apiRequest(`/courses/${post.value.courseId}`)
    course.value = courseData

    // Если авторизован, проверяем прогресс и личную оценку
    if (isAuthenticated.value) {
      const progress = await apiRequest(`/courses/${post.value.courseId}/progress`).catch(() => null)
      courseCompleted.value = progress?.status === 'completed'
      
      const ratingData = await apiRequest(`/courses/${post.value.courseId}/ratings/me`).catch(() => null)
      myRating.value = ratingData?.rating ?? null
    }


  } catch (e) {
    console.error('Course info error:', e)
  }
}

const rateCourse = async (rating) => {
  if (!isAuthenticated.value || !courseCompleted.value || !post.value.courseId) return
  const prevRating = myRating.value
  myRating.value = rating
  try {
    const res = await apiRequest(`/courses/${post.value.courseId}/ratings`, {
      method: 'POST',
      body: { rating }
    })
    if (course.value) {
      course.value.averageRating = res.average
      course.value.ratingsCount = res.count
    }
    success($t('forum.notifications.ratingUpdated'))
  } catch (e) {
    myRating.value = prevRating
    showError(handleApiError(e, $t('errors.rateCourse')))
  }
}

const togglePostLike = async () => {
  if (!isAuthenticated.value) return
  const wasLiked = postLiked.value
  postLiked.value = !wasLiked
  postLikesCount.value += wasLiked ? -1 : 1
  try {
    if (wasLiked) {
      await apiRequest(`/forum/posts/${postId.value}/likes`, { method: 'DELETE' })
    } else {
      await apiRequest(`/forum/posts/${postId.value}/likes`, { method: 'POST' })
    }
  } catch {
    postLiked.value = wasLiked
    postLikesCount.value += wasLiked ? 1 : -1
  }
}

const toggleReplyLike = async (reply) => {
  if (!isAuthenticated.value) return
  const wasLiked = reply.likedByMe
  reply.likedByMe = !wasLiked
  reply.likesCount = (reply.likesCount ?? 0) + (wasLiked ? -1 : 1)
  try {
    if (wasLiked) {
      await apiRequest(`/forum/posts/${postId.value}/replies/${reply.id}/likes`, { method: 'DELETE' })
    } else {
      await apiRequest(`/forum/posts/${postId.value}/replies/${reply.id}/likes`, { method: 'POST' })
    }
  } catch {
    reply.likedByMe = wasLiked
    reply.likesCount += wasLiked ? 1 : -1
  }
}

const submitReply = async () => {
  if (!replyBody.value.trim()) return
  replyLoading.value = true
  try {
    const created = await forumAPI.createReply(postId.value, replyBody.value.trim())

    // Загрузка вложений к ответу
    if (replyFiles.value.length) {
      created.attachments = []
      for (const file of replyFiles.value) {
        try {
          const att = await forumAttachmentAPI.uploadReply(postId.value, created.id, file)
          created.attachments.push(att)
        } catch (e: any) {
          showError(e.message || 'Failed to upload attachment')
        }
      }
    }

    replies.value.push(created)
    replyMeta.value.total++
    replyBody.value = ''
    replyFiles.value = []
    if (replyFileInput.value) replyFileInput.value.value = ''
    success($t('forum.notifications.replyPublished'))
  } catch (e) {
    showError(handleApiError(e, $t('errors.submitReply')))
  } finally {
    replyLoading.value = false
  }
}

const onReplyFilesSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    replyFiles.value = Array.from(input.files)
  }
}

const startEditReply = (reply) => {
  editingReplyId.value = reply.id
  editReplyBody.value = reply.body
}

const saveEditReply = async (reply) => {
  editReplyLoading.value = true
  try {
    const updated = await forumAPI.updateReply(postId.value, reply.id, editReplyBody.value)
    const idx = replies.value.findIndex(r => r.id === reply.id)
    if (idx !== -1) replies.value[idx] = { ...replies.value[idx], ...updated }
    editingReplyId.value = null
    success($t('forum.notifications.replyUpdated'))
  } catch (e) {
    showError(handleApiError(e, $t('errors.updateReply')))
  } finally {
    editReplyLoading.value = false
  }
}

const openDeleteReply = (reply) => {
  deleteReplyTarget.value = reply
  showDeleteReplyModal.value = true
}

const confirmDeleteReply = async () => {
  if (!deleteReplyTarget.value) return
  try {
    await forumAPI.deleteReply(postId.value, deleteReplyTarget.value.id)
    replies.value = replies.value.filter(r => r.id !== deleteReplyTarget.value.id)
    replyMeta.value.total--
    success($t('forum.notifications.replyDeleted'))
  } catch (e) {
    showError(handleApiError(e, $t('errors.deleteReply')))
  } finally {
    showDeleteReplyModal.value = false
    deleteReplyTarget.value = null
  }
}

const onPostUpdated = (updated) => {
  post.value = { ...post.value, ...updated }
  success($t('forum.notifications.postUpdatedMain'))
}

const confirmDeletePost = async () => {
  try {
    await forumAPI.deletePost(postId.value)
    success($t('forum.notifications.postDeleted'))
    router.push('/')
  } catch (e) {
    showError(handleApiError(e, $t('errors.deletePost')))
  } finally {
    showDeletePostModal.value = false
  }
}

onMounted(() => {
  initialize()
  loadPost()
  loadReplies()
})
</script>