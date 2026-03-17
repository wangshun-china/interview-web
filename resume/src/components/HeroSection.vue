<template>
  <section id="hero" class="min-h-screen flex items-center justify-center relative bg-pattern">
    <!-- Decorative elements -->
    <div class="absolute top-20 left-10 w-32 h-32 border border-[var(--color-accent)]/20 rounded-full animate-pulse-slow"></div>
    <div class="absolute bottom-20 right-10 w-48 h-48 border border-[var(--color-secondary)]/20 rounded-full animate-pulse-slow" style="animation-delay: 1s;"></div>
    <div class="absolute top-1/3 right-1/4 w-2 h-2 bg-[var(--color-accent)]/40 rounded-full animate-float"></div>
    <div class="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[var(--color-secondary)]/40 rounded-full animate-float" style="animation-delay: 2s;"></div>

    <div class="container mx-auto px-4 text-center relative z-10">
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

      <!-- Core info cards - 居中对称布局 -->
      <div class="flex flex-col md:flex-row justify-center gap-6 max-w-3xl mx-auto mb-8">
        <!-- Education -->
        <div class="card card-elevated p-5 text-left flex-1 max-w-md">
          <div class="flex items-center gap-2 mb-3">
            <GraduationCap class="w-5 h-5 text-[var(--color-accent)]" />
            <span class="text-[var(--color-accent)] font-semibold">Education</span>
          </div>
          <div class="space-y-2 text-sm">
            <div>
              <p class="text-[var(--color-text)] font-medium">上海海洋大学 · 硕士</p>
              <p class="text-[var(--color-text-muted)]">计算机技术 (2025.09 - 2028.06)</p>
              <p class="text-[var(--color-secondary)] text-xs mt-1">研究方向：基于 3DGS 的无人机影像实时三维建模</p>
            </div>
            <div class="border-t border-[var(--color-border-light)] pt-2">
              <p class="text-[var(--color-text)] font-medium">山东理工大学 · 本科</p>
              <p class="text-[var(--color-text-muted)]">数据科学与大数据技术 (2021.09 - 2025.06)</p>
            </div>
          </div>
        </div>

        <!-- Contact -->
        <div class="card card-elevated p-5 text-left flex-1 max-w-md">
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
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown class="w-6 h-6 text-[var(--color-accent)]/60" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GraduationCap, Contact, Mail, Github, MapPin, ChevronDown } from 'lucide-vue-next'

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

@keyframes pulse-slow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}
</style>