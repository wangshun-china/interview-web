<template>
  <section id="tech-stack" class="py-20 relative">
    <!-- Section header -->
    <div class="w-full px-12 md:px-20 lg:px-32 mb-16">
      <div class="flex items-center gap-4 mb-4">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent to-[#D97757]/30"></div>
        <span class="text-[#8B7355] text-sm font-mono">03</span>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent to-[#D97757]/30"></div>
      </div>
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-4">
        <span class="gradient-text">专业技能栈</span>
      </h2>
      <p class="text-center text-[#666666] text-lg">Tech Stack</p>
    </div>

    <div class="w-full px-12 md:px-20 lg:px-32">
      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Backend & Cloud Native -->
        <div class="card rounded-2xl p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-lg bg-[#D97757]/10 flex items-center justify-center">
              <Server class="w-5 h-5 text-[#D97757]" />
            </div>
            <h3 class="text-xl font-bold text-[#222222]">Backend & Cloud Native</h3>
          </div>

          <div class="flex flex-wrap gap-3">
            <span v-for="tech in backendTechs" :key="tech.name"
              class="group relative px-4 py-2 rounded-lg border border-[#D97757]/20 bg-[#D97757]/5 text-[#D97757] hover:bg-[#D97757]/15 hover:border-[#D97757]/40 transition-all cursor-default"
            >
              {{ tech.name }}
              <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#222222] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ tech.level }}
              </span>
            </span>
          </div>
        </div>

        <!-- Frontend -->
        <div class="card rounded-2xl p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-lg bg-[#8B7355]/10 flex items-center justify-center">
              <Monitor class="w-5 h-5 text-[#8B7355]" />
            </div>
            <h3 class="text-xl font-bold text-[#222222]">Frontend Development</h3>
          </div>

          <div class="flex flex-wrap gap-3">
            <span v-for="tech in frontendTechs" :key="tech.name"
              class="group relative px-4 py-2 rounded-lg border border-[#8B7355]/20 bg-[#8B7355]/5 text-[#8B7355] hover:bg-[#8B7355]/15 hover:border-[#8B7355]/40 transition-all cursor-default"
            >
              {{ tech.name }}
              <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#222222] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ tech.level }}
              </span>
            </span>
          </div>
        </div>

        <!-- AI & Agent -->
        <div class="card rounded-2xl p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-lg bg-[#7B68A6]/10 flex items-center justify-center">
              <Brain class="w-5 h-5 text-[#7B68A6]" />
            </div>
            <h3 class="text-xl font-bold text-[#222222]">AI Agent & LLM</h3>
          </div>

          <div class="flex flex-wrap gap-3">
            <span v-for="tech in aiTechs" :key="tech.name"
              class="group relative px-4 py-2 rounded-lg border border-[#7B68A6]/20 bg-[#7B68A6]/5 text-[#7B68A6] hover:bg-[#7B68A6]/15 hover:border-[#7B68A6]/40 transition-all cursor-default"
            >
              {{ tech.name }}
              <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#222222] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ tech.level }}
              </span>
            </span>
          </div>
        </div>

        <!-- AI Coding Tools & DevOps -->
        <div class="card rounded-2xl p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-lg bg-[#6B8E6B]/10 flex items-center justify-center">
              <Wrench class="w-5 h-5 text-[#6B8E6B]" />
            </div>
            <h3 class="text-xl font-bold text-[#222222]">AI Coding Tools & DevOps</h3>
          </div>

          <div class="flex flex-wrap gap-3">
            <span v-for="tech in devopsTechs" :key="tech.name"
              class="group relative px-4 py-2 rounded-lg border border-[#6B8E6B]/20 bg-[#6B8E6B]/5 text-[#6B8E6B] hover:bg-[#6B8E6B]/15 hover:border-[#6B8E6B]/40 transition-all cursor-default"
            >
              {{ tech.name }}
              <span class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#222222] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ tech.level }}
              </span>
            </span>
          </div>
        </div>
      </div>


    </div>
  </section>
</template>

<script setup lang="ts">
import { Server, Monitor, Brain, Wrench } from 'lucide-vue-next'

const backendTechs = [
  { name: 'Java 21', level: '熟悉' },
  { name: 'Spring Boot 3', level: '熟悉' },
  { name: 'Dubbo 3', level: '熟悉' },
  { name: 'Netty 4', level: '熟悉' },
  { name: 'Nacos', level: '熟悉' },
  { name: 'ByteBuddy', level: '熟悉' },
  { name: 'Python', level: '熟悉' },
  { name: 'MySQL', level: '熟悉' },
  { name: 'Redis/Redisson', level: '熟悉' },
  { name: 'Caffeine', level: '熟悉' },
]

const frontendTechs = [
  { name: 'Vue 3', level: '熟悉' },
  { name: 'TypeScript', level: '熟悉' },
  { name: 'TailwindCSS', level: '熟悉' },
  { name: 'Vite', level: '熟悉' },
  { name: 'Element Plus', level: '熟悉' },
  { name: 'SSE', level: '熟悉' },
]

const aiTechs = [
  { name: 'Spring AI Alibaba', level: '熟悉' },
  { name: 'OpenAI-compatible API', level: '熟悉' },
  { name: 'DeepSeek', level: '熟悉' },
  { name: 'Qwen', level: '熟悉' },
  { name: 'Prompt Engineering', level: '熟悉' },
  { name: 'Tool Calling', level: '熟悉' },
]

const devopsTechs = [
  { name: 'Claude Code', level: '熟练' },
  { name: 'Codex', level: '熟练' },
  { name: 'ChatGPT', level: '熟练' },
  { name: 'Gemini', level: '熟悉' },
  { name: 'Code Plan', level: '熟练' },
  { name: 'Docker', level: '熟悉' },
  { name: 'GitHub App', level: '熟悉' },
  { name: 'GitHub Actions', level: '熟悉' },
  { name: 'CI/CD', level: '熟悉' },
  { name: 'Nginx', level: '熟悉' },
  { name: 'Linux', level: '熟悉' },
  { name: 'Kubernetes', level: '了解' },
]
</script>

<style scoped>
/* 使用全局 .card 样式 */
</style>
