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
              设计并交付建筑图纸智能解析系统：将 DWG/DXF 图纸端到端转换为标准 GIS 矢量数据，
              纯 Python 核心管线、无 QGIS/ArcGIS 运行时依赖，同一套管线支撑桌面端 / Web /
              ArcGIS Pro 工具箱三种交付形态；在此基础上引入 LLM 构建自动化处理智能体，
              实现自然语言指令驱动、人在回路审核与人工修正回流，识别准确率随使用持续提升。
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
      '融合文本锚定、图层规则与几何拓扑，实现房间、楼梯、电梯等空间对象识别；主楼 1146 个空间对象对齐人工基线 1144、匹配率 >99%；输出 OGC GeoJSON（RFC 7946）/ Shapefile，WGS84 坐标系，必填属性字段完整率 100%。',
    icon: Layers3,
  },
  {
    title: '并行调度与可靠性',
    detail:
      '自适应并行调度"分析→识别→校验"闭环，单栋主楼图纸 224s 完成；支持 GB 级图纸与 50+ 文件批量，失败隔离、断点续跑；PyInstaller 自包含交付（构建优化 6.3GB→163MB），内嵌 ODA 静默转换 DWG，免安装离线可用。',
    icon: Gauge,
  },
  {
    title: 'LLM 意图驱动与任务编排',
    detail:
      '接入 OpenAI 兼容 LLM API，自然语言指令收敛为 10 个受限意图（JSON 约束，含槽位与置信度），生成可预览执行序列；落 SQLite 任务队列（状态机 + append-only 审计日志 + 重启恢复），高风险步骤挂起人工审核后继续；断网自动降级规则引擎，无外网的部署环境同样 100% 可用。',
    icon: Bot,
  },
  {
    title: '数据飞轮与持续改善',
    detail:
      '桌面端人工修正结构化回流样本库，固定评测集 + 防退化门禁保证版本指标不回退；置信度模型驱动低置信高价值样本优先标注；规则包版本化、快照回滚与指标看板，识别准确率随样本积累可量化上升。',
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
