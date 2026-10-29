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
            <span>4 个上游项目 · 6 个 PR · 120k+ ★</span>
          </div>
        </div>
        <p class="oss-subtitle">AI Agent 框架与 Python 工具链 · 上游贡献实践</p>
      </div>
    </header>

    <div class="oss-body">
      <p class="oss-blurb">
        围绕智能体审批门控、嵌套工具摘要的流式兼容、类型检查报错质量与 linter
        规则精度等真实问题，向 OpenAI Agents SDK、Pydantic AI、Ruff 与 Mypy
        提交 6 个 PR，覆盖问题定位、跨路径实现、回归测试与评审迭代。
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
    name: 'astral-sh / ruff',
    url: 'https://github.com/astral-sh/ruff',
    stars: '50k+',
    prs: [
      {
        title: 'Ignore doctest output when detecting docstring sections',
        note: '让 docstring 章节检测忽略 doctest 的预期输出段落，避免示例输出被误判为缺失章节，并补充回归测试',
        url: 'https://github.com/astral-sh/ruff/pull/29784',
      },
    ],
  },
  {
    name: 'python / mypy',
    url: 'https://github.com/python/mypy',
    stars: '21k+',
    prs: [
      {
        title: 'Use the paired error\'s code for union operand notes',
        note: 'union 类型不兼容的逐操作数提示复用配对错误的错误码，使 disable 注释可以精确抑制对应报错',
        url: 'https://github.com/python/mypy/pull/22317',
      },
    ],
  },
  {
    name: 'pydantic / pydantic-ai',
    url: 'https://github.com/pydantic/pydantic-ai',
    stars: '21k+',
    prs: [
      {
        title: 'Add event_stream_handler to ToolOutputLimits\' Summarize action',
        note: '为嵌套工具输出摘要接入流式请求路径，让摘要复用与 #729 同源的事件流消费能力',
        url: 'https://github.com/pydantic/pydantic-ai/pull/9285',
      },
      {
        title: 'Give ToolOutputLimits summaries a stream seam (pydantic-ai-harness #729)',
        note: '为嵌套工具输出摘要增加可选事件流接口，覆盖流式传输、事件消费和端到端 Agent 回归测试',
        url: 'https://github.com/pydantic/pydantic-ai-harness/pull/729',
      },
      {
        title: 'Warn on the deprecated single-key get/add of spend stores (pydantic-ai-harness #747)',
        note: '为内存与 Redis SpendStore 的废弃单键 API 补充迁移告警，更新内部调用并完善单元与集成测试',
        url: 'https://github.com/pydantic/pydantic-ai-harness/pull/747',
      },
    ],
  },
  {
    name: 'openai / openai-agents-python',
    url: 'https://github.com/openai/openai-agents-python',
    stars: '29k+',
    prs: [
      {
        title: 'Fail closed on non-bool needs_approval predicate results (#4848)',
        note: '提交审批门控 fail-closed 语义修复提案，统一 Runner、Realtime 与 MCP 路径并补充同步/异步回归测试',
        url: 'https://github.com/openai/openai-agents-python/pull/4848',
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
