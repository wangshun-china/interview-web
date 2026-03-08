<template>
  <div class="app">
    <!-- Particle Background -->
    <canvas id="particles-canvas" ref="canvasRef"></canvas>

    <!-- Main Content -->
    <main class="relative z-10">
      <LogViewer v-if="currentView === 'logs'" />
      <template v-else>
        <HeroSection />
        <ProjectsSection />
        <TechStackSection />
      </template>
    </main>

    <!-- Footer -->
    <footer class="py-8 text-center text-cyber-primary/50 text-sm border-t border-cyber-primary/10">
      <p>© 2025 Wang Shun | Built with Vue 3 + Vite + TailwindCSS</p>
      <p v-if="currentView !== 'logs'" class="mt-2">
        <a href="/?view=logs" class="text-cyber-primary hover:underline">查看访问日志</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import HeroSection from './components/HeroSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import TechStackSection from './components/TechStackSection.vue'
import LogViewer from './components/LogViewer.vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number

const currentView = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return params.get('view') || ''
})

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
      ctx.fillStyle = `rgba(0, 240, 255, ${particle.alpha})`
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
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - distance / connectionDistance)})`
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
  background-color: #0a0a0f;
}
</style>
