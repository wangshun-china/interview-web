<template>
  <section id="tech-stack" class="min-h-screen py-20 relative">
    <!-- Section header -->
    <div class="container mx-auto px-4 mb-16">
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

    <div class="container mx-auto px-4">
      <div class="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
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

        <!-- DevOps & Tools -->
        <div class="card rounded-2xl p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-lg bg-[#6B8E6B]/10 flex items-center justify-center">
              <Wrench class="w-5 h-5 text-[#6B8E6B]" />
            </div>
            <h3 class="text-xl font-bold text-[#222222]">DevOps & Tools</h3>
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

      <!-- Skills radar description -->
      <div class="mt-16 card rounded-2xl p-8 max-w-4xl mx-auto">
        <h3 class="text-xl font-bold text-[#222222] mb-6 text-center">能力概览</h3>
        <div class="grid md:grid-cols-3 gap-6 text-center">
          <div class="p-4">
            <div class="text-3xl font-bold text-[#D97757] mb-2">Cloud Native</div>
            <p class="text-[#666666] text-sm">微服务架构设计与实现</p>
            <p class="text-[#666666] text-sm">RPC 框架与分布式治理</p>
          </div>
          <div class="p-4 border-x border-[#E5E3DD]">
            <div class="text-3xl font-bold text-[#8B7355] mb-2">Full Stack</div>
            <p class="text-[#666666] text-sm">前后端全栈开发能力</p>
            <p class="text-[#666666] text-sm">从原型到生产的完整交付</p>
          </div>
          <div class="p-4">
            <div class="text-3xl font-bold text-[#7B68A6] mb-2">AI Agent</div>
            <p class="text-[#666666] text-sm">LangChain4j 工作流编排</p>
            <p class="text-[#666666] text-sm">LLM 驱动的自动化系统</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Server, Monitor, Brain, Wrench } from 'lucide-vue-next'

const backendTechs = [
  { name: 'Java 21', level: '精通' },
  { name: 'Spring Boot 3', level: '精通' },
  { name: 'Dubbo 3', level: '熟练' },
  { name: 'Netty 4', level: '熟练' },
  { name: 'Nacos', level: '熟练' },
  { name: 'ByteBuddy', level: '熟练' },
  { name: 'Python', level: '熟练' },
  { name: 'MySQL', level: '熟练' },
  { name: 'Redis/Redisson', level: '熟练' },
  { name: 'Caffeine', level: '熟练' },
]

const frontendTechs = [
  { name: 'Vue 3', level: '精通' },
  { name: 'TypeScript', level: '熟练' },
  { name: 'TailwindCSS', level: '熟练' },
  { name: 'Vite', level: '熟练' },
  { name: 'Element Plus', level: '熟练' },
  { name: 'SSE', level: '熟练' },
]

const aiTechs = [
  { name: 'LangChain4j', level: '熟练' },
  { name: 'LangGraph4j', level: '熟练' },
  { name: 'Claude API', level: '熟练' },
  { name: 'Gemini API', level: '熟练' },
  { name: 'AST 分析', level: '熟练' },
  { name: 'Prompt Engineering', level: '熟练' },
]

const devopsTechs = [
  { name: 'Docker', level: '精通' },
  { name: 'GitHub App', level: '熟练' },
  { name: 'GitHub Actions', level: '熟练' },
  { name: 'CI/CD', level: '熟练' },
  { name: 'Nginx', level: '熟练' },
  { name: 'Linux', level: '熟练' },
  { name: 'Kubernetes', level: '了解' },
]
</script>

<style scoped>
/* 使用全局 .card 样式 */
</style>