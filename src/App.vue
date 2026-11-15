<template>
  <div class="app">
    <!-- Theme Toggle: system / light / dark -->
    <button class="theme-toggle" :title="themeTitle" @click="cycleTheme">
      <component :is="themeIcon" class="h-5 w-5" />
    </button>

    <!-- Particle Background -->
    <canvas id="particles-canvas" ref="canvasRef"></canvas>

    <!-- Main Content -->
    <main class="relative z-10">
      <HeroSection />
      <ExperienceSection />
      <ProjectsSection />
      <TechStackSection />
    </main>

    <!-- Footer -->
    <footer class="py-8 text-center text-[var(--color-text-muted)] text-sm border-t border-[var(--color-border)]">
      <p class="flex items-center justify-center gap-1">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">鲁ICP备2026026854号</a>
        <span class="mx-1">|</span>
        <img src="/备案图标.png" class="inline-block w-4 h-4" alt="备案图标" />
        <a href="https://beian.mps.gov.cn/#/query/webSearch?code=37172702371806" rel="noreferrer" target="_blank">鲁公网安备37172702371806号</a>
        <span class="mx-1">|</span>
        <a :href="opsUrl" rel="nofollow">管理</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import HeroSection from './components/HeroSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import TechStackSection from './components/TechStackSection.vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const opsUrl = ['wangshun.work', 'www.wangshun.work'].includes(window.location.hostname)
  ? 'https://ops.wangshun.work'
  : '/ops'

// ---- Theme: defaults to system, cycles system -> light -> dark ----
type ThemeMode = 'system' | 'light' | 'dark'
const THEME_KEY = 'wangshun-theme'
const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
const themeMode = ref<ThemeMode>(
  (localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? 'system'
)
const isDark = computed(
  () => themeMode.value === 'dark' || (themeMode.value === 'system' && systemDark.matches)
)
const themeIcon = computed(() =>
  themeMode.value === 'system' ? Monitor : isDark.value ? Moon : Sun
)
const themeTitle = computed(() => ({
  system: '当前：跟随系统（点击切换为亮色）',
  light: '当前：亮色（点击切换为暗色）',
  dark: '当前：暗色（点击恢复跟随系统）'
}[themeMode.value]))
function applyTheme() {
  document.documentElement.classList.toggle('dark', isDark.value)
}
function cycleTheme() {
  themeMode.value = themeMode.value === 'system'
    ? 'light'
    : themeMode.value === 'light' ? 'dark' : 'system'
  localStorage.setItem(THEME_KEY, themeMode.value)
  applyTheme()
}
watchEffect(applyTheme)
systemDark.addEventListener('change', () => {
  if (themeMode.value === 'system') applyTheme()
})
let animationId: number

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // Particle system
  interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    alpha: number
  }

  const particles: Particle[] = []
  const particleCount = 50
  const connectionDistance = 150

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2
    })
  }

  // Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

      // Draw particle
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(217, 119, 87, ${particle.alpha})`
      ctx.fill()

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[j].x - particle.x
        const dy = particles[j].y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(217, 119, 87, ${0.1 * (1 - distance / connectionDistance)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()

  onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas)
    cancelAnimationFrame(animationId)
  })
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: var(--color-bg);
}

.theme-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-veil);
  backdrop-filter: blur(10px);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color var(--transition-base), border-color var(--transition-base), transform var(--transition-base);
}

.theme-toggle:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  transform: translateY(-1px);
}
</style>
