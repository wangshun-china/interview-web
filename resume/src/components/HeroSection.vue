<template>
  <section id="hero" class="min-h-[65vh] flex items-center justify-center relative bg-pattern">
    <!-- Decorative elements -->
    <div class="absolute top-20 left-10 w-32 h-32 border border-[var(--color-accent)]/20 rounded-full animate-pulse-slow"></div>
    <div class="absolute bottom-20 right-10 w-48 h-48 border border-[var(--color-secondary)]/20 rounded-full animate-pulse-slow" style="animation-delay: 1s;"></div>
    <div class="absolute top-1/3 right-1/4 w-2 h-2 bg-[var(--color-accent)]/40 rounded-full animate-float"></div>
    <div class="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[var(--color-secondary)]/40 rounded-full animate-float" style="animation-delay: 2s;"></div>

    <div class="w-full px-12 md:px-20 lg:px-32 text-center relative z-10">
      <!-- Status badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[var(--color-border)] mb-6 animate-fade-in">
        <span class="w-2 h-2 bg-[var(--color-tertiary)] rounded-full animate-pulse"></span>
        <span class="text-sm text-[var(--color-text-secondary)]">Available for opportunities</span>
      </div>

      <!-- Main title with typewriter effect -->
      <h1 class="text-5xl md:text-7xl font-bold mb-3 font-[var(--font-serif)]">
        <span class="gradient-text">王顺</span>
      </h1>
      <h2 class="text-2xl md:text-4xl font-light mb-4 text-[var(--color-text-secondary)] font-[var(--font-serif)]">
        Wang Shun
      </h2>

      <!-- Typewriter subtitle -->
      <div class="h-8 mb-6">
        <p class="text-xl md:text-2xl text-[var(--color-accent)]">
          <span class="typewriter-text">{{ displayText }}</span>
          <span class="cursor"></span>
        </p>
      </div>

      <!-- Core info cards - 两端对齐布局 -->
      <div class="flex flex-col md:flex-row justify-between gap-8 mb-6">
        <!-- Education -->
        <div class="card card-elevated p-5 text-left flex-1">
          <div class="flex items-center gap-2 mb-3">
            <GraduationCap class="w-5 h-5 text-[var(--color-accent)]" />
            <span class="text-[var(--color-accent)] font-semibold">Education</span>
          </div>
          <div class="space-y-2 text-sm">
            <div>
              <p class="text-[var(--color-text)] font-medium">上海海洋大学 · 硕士</p>
              <p class="text-[var(--color-text-muted)]">计算机技术 (2025.09 - 2028.06)</p>
              <p class="text-[var(--color-secondary)] text-xs mt-1">研究方向：基于 3DGS 的无人机影像实时三维建模</p>
                <a href="https://xixi-box.github.io/grad/" target="_blank" class="inline-flex items-center gap-1 mt-2 text-xs text-[var(--color-accent)] hover:underline">
                  <span>研究进度</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
            </div>
            <div class="border-t border-[var(--color-border-light)] pt-2">
              <p class="text-[var(--color-text)] font-medium">山东理工大学 · 本科</p>
              <p class="text-[var(--color-text-muted)]">数据科学与大数据技术 (2021.09 - 2025.06)</p>
            </div>
          </div>
        </div>

        <!-- Contact -->
        <div class="card card-elevated p-5 text-left flex-1">
          <div class="flex items-center gap-2 mb-3">
            <Contact class="w-5 h-5 text-[var(--color-secondary)]" />
            <span class="text-[var(--color-secondary)] font-semibold">Contact</span>
          </div>
          <div class="space-y-3">
            <a href="mailto:2606209307@qq.com" class="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors group">
              <Mail class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span class="text-sm">2606209307@qq.com</span>
            </a>
            <a href="https://github.com/xixi-box" target="_blank" class="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors group">
              <Github class="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span class="text-sm">github.com/xixi-box</span>
            </a>
            <div class="flex items-center gap-3 text-[var(--color-text-secondary)]">
              <MapPin class="w-4 h-4" />
              <span class="text-sm">Shanghai, China</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Workflow -->
      <div class="w-full mb-6 p-4 rounded-xl bg-gradient-to-r from-[var(--color-accent-light)]/50 to-[var(--color-bg-alt)] border border-[var(--color-border)]">
        <div class="flex items-center gap-2 mb-2">
          <Zap class="w-4 h-4 text-[var(--color-accent)]" />
          <span class="text-sm font-semibold text-[var(--color-accent)]">AI Developer Workflow</span>
        </div>
        <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          长期使用 AI 辅助完成需求拆解、方案评审、代码实现、Review 和 Debug。
          关注的不只是“让模型写代码”，更重视工程边界、可观测性、部署流程和安全护栏。
          代码完成后通过 GitHub Actions、Docker 和 Nginx 自动构建发布。
        </p>
      </div>

      <!-- Role badges -->
      <div class="flex flex-wrap justify-center gap-3 mb-8">
        <span class="tag">
          Cloud Native Developer
        </span>
        <span class="tag" style="background: rgba(139, 115, 85, 0.1); color: var(--color-secondary);">
          Full Stack Engineer
        </span>
        <span class="tag" style="background: rgba(107, 142, 107, 0.1); color: var(--color-tertiary);">
          AI Agent Developer
        </span>
      </div>

      <!-- Scroll indicator -->
      <div class="mt-4 flex flex-col items-center gap-2 cursor-pointer" @click="scrollToProjects">
        <span class="text-sm text-[var(--color-text-muted)]">下滑查看项目经历</span>
        <div class="animate-bounce">
          <ChevronDown class="w-6 h-6 text-[var(--color-accent)]" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GraduationCap, Contact, Mail, Github, MapPin, ChevronDown, Zap } from 'lucide-vue-next'

const roles = [
  'Cloud Native Developer',
  'Microservices Architect',
  'AI Agent Developer',
  'Full Stack Engineer'
]

const displayText = ref('')
let roleIndex = 0
let charIndex = 0
let isDeleting = false
let typingSpeed = 100

const typeWriter = () => {
  const currentRole = roles[roleIndex]

  if (isDeleting) {
    displayText.value = currentRole.substring(0, charIndex - 1)
    charIndex--
    typingSpeed = 50
  } else {
    displayText.value = currentRole.substring(0, charIndex + 1)
    charIndex++
    typingSpeed = 100
  }

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true
    typingSpeed = 2000 // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    roleIndex = (roleIndex + 1) % roles.length
    typingSpeed = 500 // Pause before typing
  }

  setTimeout(typeWriter, typingSpeed)
}

const scrollToProjects = () => {
  const projectsSection = document.getElementById('projects')
  if (projectsSection) {
    projectsSection.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  typeWriter()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.typewriter-text {
  display: inline;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: var(--color-accent);
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}
</style>
