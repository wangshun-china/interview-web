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
          <span class="gradient-text">实习与开源</span>
        </h2>
        <p class="text-center text-lg text-[var(--color-text-muted)]">Experience &amp; Open Source</p>
      </div>

      <div class="duo-grid">
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
                <span>2026.05 - 2026.09</span>
              </div>
            </div>
            <div class="project-name">
              <BriefcaseBusiness class="h-4 w-4" />
              <span>CAD Spatial Agent · 建筑图纸智能解析与自动化处理系统</span>
            </div>
          </div>
        </header>

        <div class="experience-body">
          <div class="experience-summary">
            <p>
              分两阶段设计并交付建筑图纸智能解析系统：第一阶段完成 DWG/DXF 到标准 GIS
              矢量数据的纯 Python 识别管线，并以桌面端 / Web / ArcGIS Pro 工具箱三种形态交付；
              第二阶段引入 LLM 受限意图编排、人在回路审核、持久化任务队列、人工修正回流与
              评测发布门禁，形成从自然语言操作到可靠执行、复核和持续迭代的数据闭环。
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

        <OpenSourceCard />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Bot, BriefcaseBusiness, Building2, CalendarDays, Gauge, Layers3, RefreshCcw } from 'lucide-vue-next'
import OpenSourceCard from './OpenSourceCard.vue'

const technologies = [
  'Python',
  'ezdxf',
  'Shapely (GEOS)',
  'PySide6',
  'OpenAI 兼容 LLM API',
  'SQLite',
  'PyInstaller',
  'GeoJSON',
]

const achievements = [
  {
    title: '空间识别与 GIS 转换',
    detail:
      '融合文本锚定、图层语义与几何拓扑，经过端点焊合、门洞封闭、精确 noding 与 polygonize 识别房间、楼梯、电梯等空间对象；固定样例中 HWYA 输出 336 个空间 / 9 个楼层，主楼输出 1146 个空间，与 QGIS 历史基线 1144 个的数量差为 2；支持 GeoJSON / Shapefile、坐标转换与属性规范化。',
    icon: Layers3,
  },
  {
    title: '批量调度与多形态交付',
    detail:
      '将处理过程拆分为 prep / worker / final 三段并支持多进程分块、失败隔离和断点续跑；内嵌 ODA 完成 DWG 静默转换，同一套核心管线复用于 PySide6 桌面端、Web 服务与 ArcGIS Pro 工具箱，并通过 PyInstaller、Docker 与 GitHub Actions / GHCR 支持离线分发和镜像交付。',
    icon: Gauge,
  },
  {
    title: '第二阶段 · LLM 意图与可靠编排',
    detail:
      '接入 OpenAI 兼容 LLM API，将自然语言指令收敛为 10 个受限意图和结构化参数，执行前展示计划并由用户确认；基于 SQLite 实现任务状态机、应用层追加式审计日志、失败诊断、取消重试与崩溃恢复，高风险步骤可挂起等待人工审核；模型不可用时自动降级到离线规则引擎。',
    icon: Bot,
  },
  {
    title: '第二阶段 · 修正回流与发布门禁',
    detail:
      '将名称、楼层、高度、几何和删除等人工修正按前后快照与规则版本结构化留存；以属性完整度、几何有效性和高度合理性计算可解释置信度，生成低置信样本复核队列；建立固定评测集、防退化门禁、规则包版本化、任务级灰度发布、一键回滚与指标看板，为后续规则和模型迭代沉淀可追溯数据。',
    icon: RefreshCcw,
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
  grid-template-columns: 1fr;
  gap: 0.85rem;
  margin-top: 1.25rem;
}

.duo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: stretch;
}

@media (min-width: 1024px) {
  .duo-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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
