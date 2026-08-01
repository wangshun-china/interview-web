<template>
  <section id="experience" class="experience-section relative py-16">
    <div class="w-full px-8 md:px-16 lg:px-28">
      <div class="mb-8">
        <div class="mb-3 flex items-center gap-4">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-border)]"></div>
          <span class="font-mono text-sm text-[var(--color-text-muted)]">02</span>
          <div class="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-border)]"></div>
        </div>
        <h2 class="mb-2 text-center text-4xl font-bold md:text-5xl">
          <span class="gradient-text">实习经历</span>
        </h2>
        <p class="text-center text-lg text-[var(--color-text-muted)]">Internship Experience</p>
      </div>

      <article class="experience-card card card-elevated">
        <header class="experience-header">
          <div class="company-mark">
            <Building2 class="h-7 w-7" />
          </div>
          <div class="experience-heading">
            <div class="experience-title-row">
              <div>
                <h3>北京大学上海临港国际科技创新中心</h3>
                <p class="role">助理工程师</p>
              </div>
              <div class="period">
                <CalendarDays class="h-4 w-4" />
                <span>2026.05 - 2026.07</span>
              </div>
            </div>
            <div class="project-name">
              <BriefcaseBusiness class="h-4 w-4" />
              <span>CAD Spatial Agent · 建筑图纸智能空间解析系统</span>
            </div>
          </div>
        </header>

        <div class="experience-body">
          <div class="experience-summary">
            <p>
              设计 Agentic CAD 解析流程，自动完成图层分析、工具调度、空间识别、结果校验与异常重试，
              并完成 Windows 桌面端开发和工程化交付。
            </p>
            <div class="tech-tags">
              <span v-for="tech in technologies" :key="tech" class="tag">{{ tech }}</span>
            </div>
          </div>

          <div class="achievement-grid">
            <div v-for="item in achievements" :key="item.title" class="achievement-item">
              <component :is="item.icon" class="h-5 w-5" />
              <div>
                <h4>{{ item.title }}</h4>
                <p>{{ item.detail }}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BriefcaseBusiness, Building2, CalendarDays, Gauge, Layers3, MonitorCog } from 'lucide-vue-next'

const technologies = ['Python', 'Rust', 'Tauri', 'Shapely', 'GeoJSON']

const achievements = [
  {
    title: '空间对象识别与 GIS 转换',
    detail:
      '融合文字语义、图层规则和几何拓扑，实现房间、楼梯、电梯等空间对象识别及 DWG/DXF 到 GIS 数据转换。',
    icon: Layers3,
  },
  {
    title: '几何算法优化',
    detail: '设计局部聚类与轮廓聚合算法，解决楼梯网格碎片化、边界断裂和设施误识别问题。',
    icon: MonitorCog,
  },
  {
    title: '处理性能提升',
    detail: '引入 STRtree 空间索引，将大型图纸处理耗时由约 25 秒降至约 14 秒，单张图纸稳定生成 450+ 个有效空间对象。',
    icon: Gauge,
  },
]
</script>

<style scoped>
.experience-section {
  background: linear-gradient(180deg, transparent, rgba(245, 244, 240, 0.72), transparent);
}

.experience-card {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
}

.experience-header {
  display: flex;
  gap: 1rem;
  padding: 1.4rem 1.5rem;
  border-bottom: 1px solid var(--color-border-light);
  background: linear-gradient(135deg, var(--color-accent-light), #fff 60%);
}

.company-mark {
  display: flex;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #fff;
  color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.experience-heading {
  min-width: 0;
  flex: 1;
}

.experience-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.experience-title-row h3 {
  color: var(--color-text);
  font-size: 1.35rem;
  font-weight: 800;
}

.role {
  margin-top: 0.25rem;
  color: var(--color-accent);
  font-size: 0.92rem;
  font-weight: 700;
}

.period,
.project-name {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.period {
  flex-shrink: 0;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  font-weight: 700;
}

.project-name {
  margin-top: 0.75rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 700;
}

.project-name svg {
  color: var(--color-secondary);
}

.experience-body {
  padding: 1.5rem;
}

.experience-summary p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.75;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.9rem;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
  margin-top: 1.25rem;
}

.achievement-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--color-border-light);
  border-radius: 14px;
  background: var(--color-bg-alt);
}

.achievement-item > svg {
  flex-shrink: 0;
  margin-top: 0.1rem;
  color: var(--color-accent);
}

.achievement-item h4 {
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 800;
}

.achievement-item p {
  margin-top: 0.35rem;
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  line-height: 1.65;
}

@media (max-width: 900px) {
  .experience-title-row {
    flex-direction: column;
  }

  .achievement-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .experience-section {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  .experience-header {
    padding: 1.1rem;
  }

  .company-mark {
    width: 3rem;
    height: 3rem;
  }

  .experience-title-row h3 {
    font-size: 1.1rem;
  }

  .experience-body {
    padding: 1.1rem;
  }
}
</style>
