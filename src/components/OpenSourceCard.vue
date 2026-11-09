<template>
  <article class="open-source-card card card-elevated">
    <header class="oss-header">
      <div class="oss-mark">
        <GitPullRequest class="h-7 w-7" />
      </div>
      <div class="oss-heading">
        <div class="oss-title-row">
          <div>
            <h3>开源贡献</h3>
            <a
              class="oss-handle"
              href="https://github.com/xixi-box"
              target="_blank"
              rel="noopener"
            >@xixi-box</a>
          </div>
          <div class="oss-badge">
            <Star class="h-4 w-4" />
            <span>已合并 8 · 覆盖 100k+ ★</span>
          </div>
        </div>
        <p class="oss-subtitle">数据库 / AI 基础设施 / Agent 网关 · 全部已被上游合并</p>
      </div>
    </header>

    <div class="oss-body">
      <p class="oss-blurb">
        向 ClickHouse、Qdrant、MCP 官方 Rust SDK、AgentGateway、RuVector、
        Pydantic AI Harness 等上游项目提交缺陷修复：覆盖驱动兼容性、检索正确性、
        连接生命周期与跨平台崩溃，全部通过维护者评审并合并。
      </p>

      <section v-for="repo in repos" :key="repo.url" class="oss-repo">
        <div class="oss-repo-row">
          <a class="oss-repo-name" :href="repo.url" target="_blank" rel="noopener">
            {{ repo.name }}
          </a>
          <span class="oss-stars">
            <Star class="h-3.5 w-3.5" />
            {{ repo.stars }}
          </span>
        </div>
        <a
          v-for="pr in repo.prs"
          :key="pr.url"
          class="oss-pr"
          :href="pr.url"
          target="_blank"
          rel="noopener"
        >
          <GitPullRequest class="h-4 w-4 oss-pr-icon" />
          <span class="oss-pr-text">
            <span class="oss-pr-title">{{ pr.title }}</span>
            <span class="oss-pr-note">{{ pr.note }}</span>
          </span>
        </a>
      </section>

      <p class="oss-footer">点击 PR 条目可查看完整 diff 与维护者讨论。</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { GitPullRequest, Star } from 'lucide-vue-next'

const repos = [
  {
    name: 'ClickHouse / ClickHouse',
    url: 'https://github.com/ClickHouse/ClickHouse',
    stars: '50k+',
    prs: [
      {
        title: 'fix: MySQL interface — Connector/J 9.x fails on connect (#129709)',
        note: '修复 MySQL 接口在 Connector/J 9.x 驱动下握手失败（Buffer length 断言）的问题，恢复与 5.1.49 驱动一致的行为',
        url: 'https://github.com/ClickHouse/ClickHouse/pull/129709',
      },
    ],
  },
  {
    name: 'qdrant / qdrant',
    url: 'https://github.com/qdrant/qdrant',
    stars: '35k+',
    prs: [
      {
        title: 'fix: group-by silently returns empty results (#11370)',
        note: '修复 group-by 在不支持的 payload 值耗尽候选预算时静默返回空结果的问题',
        url: 'https://github.com/qdrant/qdrant/pull/11370',
      },
      {
        title: 'fix: RecommendBestScore applies score_threshold in the wrong direction (#11350)',
        note: '修复 Euclid 距离下 RecommendBestScore 将 score_threshold 方向用反的问题',
        url: 'https://github.com/qdrant/qdrant/pull/11350',
      },
    ],
  },
  {
    name: 'modelcontextprotocol / rust-sdk',
    url: 'https://github.com/modelcontextprotocol/rust-sdk',
    stars: '4k+',
    prs: [
      {
        title: 'fix: stateful session workers ignore config.cancellation_token after shutdown (#1427)',
        note: '修复 streamable-http 有状态会话在 shutdown 后仍忽略 cancellation_token、worker 残留存活的问题',
        url: 'https://github.com/modelcontextprotocol/rust-sdk/pull/1427',
      },
    ],
  },
  {
    name: 'agentgateway / agentgateway',
    url: 'https://github.com/agentgateway/agentgateway',
    stars: '6k+',
    prs: [
      {
        title: 'fix: Windows CLI shows version as True (#4276)',
        note: '修复 Windows CLI 将版本号显示为 True 而非实际版本的问题',
        url: 'https://github.com/agentgateway/agentgateway/pull/4276',
      },
      {
        title: 'fix: resolve the user\'s home directory on Windows (#4264)',
        note: '修复 Windows 下无法正确解析用户主目录的问题',
        url: 'https://github.com/agentgateway/agentgateway/pull/4264',
      },
    ],
  },
  {
    name: 'ruvnet / RuVector',
    url: 'https://github.com/ruvnet/RuVector',
    stars: '4k+',
    prs: [
      {
        title: 'fix: native modules crash (SIGILL) on ARMv8.2 CPUs without LRCPC (#1384)',
        note: '修复 Jetson AGX Xavier、树莓派 4 等 ARMv8.2 无 LRCPC 指令平台上原生模块启动即崩溃的问题',
        url: 'https://github.com/ruvnet/RuVector/pull/1384',
      },
    ],
  },
  {
    name: 'pydantic / pydantic-ai-harness',
    url: 'https://github.com/pydantic/pydantic-ai-harness',
    stars: '900+',
    prs: [
      {
        title: 'Warn on the deprecated single-key get/add of spend stores (#747)',
        note: '为内存与 Redis SpendStore 的废弃单键 API 补充迁移告警，更新内部调用并完善单元与集成测试',
        url: 'https://github.com/pydantic/pydantic-ai-harness/pull/747',
      },
    ],
  },
]
</script>

<style scoped>
.open-source-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
}

.oss-header {
  display: flex;
  gap: 1rem;
  padding: 1.4rem 1.5rem;
  border-bottom: 1px solid var(--color-border-light);
  background: linear-gradient(135deg, var(--color-secondary-light, #eef2f7), #fff 60%);
}

.oss-mark {
  display: flex;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #fff;
  color: var(--color-secondary);
  box-shadow: var(--shadow-sm);
}

.oss-heading {
  min-width: 0;
  flex: 1;
}

.oss-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.oss-title-row h3 {
  color: var(--color-text);
  font-size: 1.35rem;
  font-weight: 800;
}

.oss-handle {
  display: inline-block;
  margin-top: 0.25rem;
  color: var(--color-accent);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
}

.oss-handle:hover {
  text-decoration: underline;
}

.oss-badge {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 700;
}

.oss-subtitle {
  margin-top: 0.75rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 700;
}

.oss-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1.5rem;
}

.oss-blurb {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.75;
}

.oss-repo {
  margin-top: 1.1rem;
}

.oss-repo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.oss-repo-name {
  color: var(--color-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
}

.oss-repo-name:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.oss-stars {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-weight: 700;
}

.oss-stars svg {
  color: #eab308;
}

.oss-pr {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-top: 0.7rem;
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--color-border-light);
  border-radius: 14px;
  background: var(--color-bg-alt);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.15s ease;
}

.oss-pr:hover {
  border-color: var(--color-accent);
}

.oss-pr-icon {
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: var(--color-accent);
}

.oss-pr-text {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.oss-pr-title {
  color: var(--color-text);
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.5;
}

.oss-pr-note {
  margin-top: 0.3rem;
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  line-height: 1.6;
}

.oss-footer {
  margin-top: auto;
  padding-top: 1rem;
  color: var(--color-text-muted, var(--color-text-secondary));
  font-size: 0.78rem;
}

@media (max-width: 640px) {
  .oss-header {
    padding: 1.1rem;
  }

  .oss-mark {
    width: 3rem;
    height: 3rem;
  }

  .oss-title-row h3 {
    font-size: 1.1rem;
  }

  .oss-body {
    padding: 1.1rem;
  }
}
</style>
