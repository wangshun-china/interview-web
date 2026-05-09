<template>
  <section id="hero" class="hero-section flex items-center justify-center relative bg-pattern">
    <!-- Decorative elements -->
    <div class="absolute top-20 left-10 w-32 h-32 border border-[var(--color-accent)]/20 rounded-full animate-pulse-slow"></div>
    <div class="absolute bottom-20 right-10 w-48 h-48 border border-[var(--color-secondary)]/20 rounded-full animate-pulse-slow" style="animation-delay: 1s;"></div>
    <div class="absolute top-1/3 right-1/4 w-2 h-2 bg-[var(--color-accent)]/40 rounded-full animate-float"></div>
    <div class="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[var(--color-secondary)]/40 rounded-full animate-float" style="animation-delay: 2s;"></div>

    <div class="w-full px-6 md:px-12 lg:px-24 text-center relative z-10">
      <!-- Status badge -->
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[var(--color-border)] mb-2 animate-fade-in">
        <span class="w-2 h-2 bg-[var(--color-tertiary)] rounded-full animate-pulse"></span>
        <span class="text-sm text-[var(--color-text-secondary)]">Available for opportunities</span>
      </div>

      <!-- Main title with typewriter effect -->
      <h1 class="text-4xl md:text-5xl font-bold mb-1 font-[var(--font-serif)]">
        <span class="gradient-text">王顺</span>
      </h1>
      <h2 class="text-lg md:text-2xl font-light mb-2 text-[var(--color-text-secondary)] font-[var(--font-serif)]">
        Wang Shun
      </h2>

      <div class="mb-2">
        <p class="text-lg md:text-xl font-semibold text-[var(--color-text)]">
          Java 后端 / AI Agent 应用开发实习生
        </p>
        <p class="mt-1 text-sm md:text-base text-[var(--color-text-secondary)]">
          关注大模型工具调用、代码生成、AI Code Review 与工程化部署
        </p>
      </div>

      <!-- Typewriter subtitle -->
      <div class="h-6 mb-3">
        <p class="text-base md:text-xl text-[var(--color-accent)]">
          <span class="typewriter-text">{{ displayText }}</span>
          <span class="cursor"></span>
        </p>
      </div>

      <div class="hero-info-bar">
        <div class="hero-info-group education-compact">
          <div class="hero-info-title">
            <GraduationCap class="w-4 h-4 text-[var(--color-accent)]" />
            <span>Education</span>
          </div>
          <div class="hero-education-list">
            <span>上海海洋大学 · 计算机技术硕士 · 2025.09 - 2028.06</span>
            <span>山东理工大学 · 数据科学与大数据技术本科 · 2021.09 - 2025.06</span>
          </div>
        </div>

        <div class="hero-contact-row">
          <div class="hero-info-title">
            <Contact class="w-4 h-4 text-[var(--color-secondary)]" />
            <span>Contact</span>
          </div>
          <a href="mailto:2606209307@qq.com" class="hero-contact-link">
            <Mail class="w-4 h-4" />
            <span>2606209307@qq.com</span>
          </a>
          <a href="https://github.com/xixi-box" target="_blank" class="hero-contact-link">
            <Github class="w-4 h-4" />
            <span>github.com/xixi-box</span>
          </a>
          <div class="hero-contact-link">
            <MapPin class="w-4 h-4" />
            <span>Shanghai</span>
          </div>
        </div>
      </div>

      <!-- AI Workflow -->
      <div class="workflow-line">
        <div class="flex items-center gap-2 shrink-0">
          <Zap class="w-4 h-4 text-[var(--color-accent)]" />
          <span class="text-sm font-semibold text-[var(--color-accent)]">AI Developer Workflow</span>
        </div>
        <p>
          使用 Claude Code / Codex / GPT / Gemini / DeepSeek 辅助需求拆解、方案设计、代码实现、Review 和 Debug，并结合人工 Review、测试与 CI/CD 控制交付质量。
        </p>
      </div>

      <!-- Role badges -->
      <div class="flex flex-wrap justify-center gap-3 mb-2">
        <span class="tag">
          Java 后端
        </span>
        <span class="tag" style="background: rgba(139, 115, 85, 0.1); color: var(--color-secondary);">
          AI Agent
        </span>
        <span class="tag" style="background: rgba(107, 142, 107, 0.1); color: var(--color-tertiary);">
          工程化部署
        </span>
      </div>

      <!-- Scroll indicator -->
      <div class="mt-1 flex flex-col items-center gap-1 cursor-pointer" @click="scrollToProjects">
        <span class="text-xs text-[var(--color-text-muted)]">下滑查看项目经历</span>
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
  'Java Backend & AI Agent Developer',
  'AI Application Builder',
  'AI Code Review Builder',
  'Engineering Delivery'
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

.hero-section {
  min-height: 42vh;
  padding-top: 1.5rem;
  padding-bottom: 0.75rem;
}

.hero-info-bar {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.hero-info-group,
.hero-contact-row,
.workflow-line {
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: var(--shadow-sm);
}

.hero-info-group {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.65rem 0.9rem;
  text-align: left;
}

.hero-info-title {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 800;
  white-space: nowrap;
}

.hero-education-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.8rem;
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  line-height: 1.45;
}

.hero-contact-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.65rem 0.9rem;
  min-width: 0;
}

.hero-contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--transition-base);
}

.hero-contact-link:hover {
  color: var(--color-accent);
}

.workflow-line {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 0.75rem;
  padding: 0.55rem 0.85rem;
  text-align: left;
  background: linear-gradient(90deg, var(--color-accent-light), rgba(245, 244, 240, 0.9));
}

.workflow-line p {
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .hero-section {
    min-height: auto;
    padding-top: 1.5rem;
  }

  .hero-info-bar {
    grid-template-columns: 1fr;
  }

  .hero-info-group,
  .hero-contact-row,
  .workflow-line {
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
