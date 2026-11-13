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
            <span>已合并 13 · 覆盖 165k+ ★</span>
          </div>
        </div>
        <p class="oss-subtitle">数据库 / MCP 生态 / AI 基础设施 · 全部已被上游合并</p>
      </div>
    </header>

    <div class="oss-body">
      <p class="oss-blurb">
        长期向上游项目回馈维护级修复：每个 PR 均包含复现路径、根因分析与回归测试，
        覆盖驱动兼容、检索正确性、连接生命周期、跨平台崩溃等疑难场景，
        已在 ClickHouse、Qdrant、Redis Go 客户端、FastMCP、Wasmtime 等上游项目合并 12 个 PR。
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
        <p class="oss-repo-desc">{{ repo.desc }}</p>
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
    desc: 'Yandex 研发、2014 开源的 C++ 列式 OLAP 数据库——实时分析领域的事实标准，Cloudflare/eBay/Spotify 等大量头部公司生产使用，单节点每秒可扫描数亿行',
    prs: [
      {
        title: 'fix: MySQL interface — Connector/J 9.x fails on connect (#129709)',
        note: '生产级连接故障排查：用户升级 MySQL JDBC 驱动到 Connector/J 9.x 后全量无法连接（"Buffer length is less than expected payload length"，回退 5.1.49 才恢复）。独立定位到 MySQL 接口对新驱动握手行为的兼容性缺陷并修复，恢复与 5.1.49 一致的行为，附驱动兼容性回归验证',
        url: 'https://github.com/ClickHouse/ClickHouse/pull/129709',
      },
    ],
  },
  {
    name: 'qdrant / qdrant',
    url: 'https://github.com/qdrant/qdrant',
    stars: '35k+',
    desc: 'Rust 编写的高性能向量数据库 · GitHub 同类项目 Top 2，LangChain/LlamaIndex 官方集成，支撑亿级向量的 RAG 与语义检索场景',
    prs: [
      {
        title: 'fix: group-by silently returns empty results (#11370)',
        note: '生产 RAG 最危险的静默丢数据类缺陷：不支持的 payload 值耗尽候选预算时，group-by 不报错、直接返回空结果。从 issue 复现路径独立定位到该失败分支并修复，附边界条件回归测试',
        url: 'https://github.com/qdrant/qdrant/pull/11370',
      },
      {
        title: 'fix: RecommendBestScore applies score_threshold in the wrong direction (#11350)',
        note: '正确性缺陷：推荐接口在 Euclid 距离下 score_threshold 方向用反，导致有效结果被批量错误过滤',
        url: 'https://github.com/qdrant/qdrant/pull/11350',
      },
    ],
  },
  {
    name: 'redis / go-redis',
    url: 'https://github.com/redis/go-redis',
    stars: '22k+',
    desc: 'Go 后端访问 Redis 的事实标准客户端，由 Redis 官方组织接管维护——几乎所有 Go 技术栈公司的核心依赖',
    prs: [
      {
        title: 'fix: proto — no nesting depth limit when reading RESP3 replies (#4296)',
        note: '安全加固：定位 RESP3 聚合回复递归解析无深度限制的 DoS 面——恶意服务端可打爆客户端 Go 栈（+383/−32，跨 5 文件）。引入嵌套深度追踪、补齐 reader_depth_test.go 回归测试，并附修复前后性能基准对比（无回退），由官方维护者合并',
        url: 'https://github.com/redis/go-redis/pull/4296',
      },
      {
        title: 'fix: multidb — FD outcomes settle into the window after a reselect of the active member (#4283)',
        note: '可用性核心修复：MultiDB 重选活跃节点后，迟到的全双工结果会错误结算进新熔断窗口与故障检测期（+176/−81，涉及安全与可用性关键路径）；先在基线复现失败再验证补丁通过，由官方维护者合并',
        url: 'https://github.com/redis/go-redis/pull/4283',
      },
    ],
  },
  {
    name: 'PrefectHQ / fastmcp',
    url: 'https://github.com/PrefectHQ/fastmcp',
    stars: '28k+',
    desc: 'Python MCP 框架事实标准，由 Prefect 官方维护 · 曾登 GitHub Trending 日榜第 1——MCP 已成业界模型连接工具的协议标准，OpenAI/Google 均宣布支持',
    prs: [
      {
        title: 'fix: `session: UserSession` on a resource or resource template fails at registration (#6198)',
        note: '修复资源/资源模板声明 UserSession 依赖时注册阶段直接报错的缺陷，打通会话级鉴权与 MCP 资源的组合用法',
        url: 'https://github.com/PrefectHQ/fastmcp/pull/6198',
      },
    ],
  },
  {
    name: 'bytecodealliance / wasmtime',
    url: 'https://github.com/bytecodealliance/wasmtime',
    stars: '18k+',
    desc: 'Bytecode Alliance（Mozilla/Fastly/Intel 联合创立）出品的 Wasm 运行时——Cloudflare Workers 全球边缘计算与 Fastly 生产工作负载的底层引擎',
    prs: [
      {
        title: 'fix: Copying collector grow-vs-collect heuristic compares against the whole heap (#15207)',
        note: '运行时内核级修复：复制式 GC 的增长-回收启发式错误地按整个堆而非活动半空间比较，导致内存峰值误判——从 GC 触发条件的语义入手定位并修正',
        url: 'https://github.com/bytecodealliance/wasmtime/pull/15207',
      },
    ],
  },
  {
    name: 'agentgateway / agentgateway',
    url: 'https://github.com/agentgateway/agentgateway',
    stars: '6k+',
    desc: 'CNCF 项目 · 面向 Agent 流量的新一代数据平面（Rust 实现），为 MCP/A2A 智能体协议提供统一的代理、鉴权与可观测性',
    prs: [
      {
        title: 'fix: Windows CLI shows version as True (#4276)',
        note: '修复 Windows CLI 将版本号显示为 True 的缺陷',
        url: 'https://github.com/agentgateway/agentgateway/pull/4276',
      },
      {
        title: "fix: resolve the user's home directory on Windows (#4264)",
        note: '修复 Windows 下用户主目录解析错误的问题',
        url: 'https://github.com/agentgateway/agentgateway/pull/4264',
      },
    ],
  },
  {
    name: 'modelcontextprotocol / rust-sdk',
    url: 'https://github.com/modelcontextprotocol/rust-sdk',
    stars: '4k+',
    desc: 'MCP 协议官方 Rust SDK · Anthropic 发起、业界公认的模型-工具连接标准，覆盖服务端/客户端双端实现',
    prs: [
      {
        title: 'fix: stateful session workers ignore config.cancellation_token after shutdown (#1427)',
        note: '资源生命周期缺陷：streamable-http 有状态会话在 shutdown 后仍忽略 cancellation_token、worker 残留存活——定位连接关闭与任务取消的信号传递断点并修复',
        url: 'https://github.com/modelcontextprotocol/rust-sdk/pull/1427',
      },
    ],
  },
  {
    name: 'ruvnet / RuVector',
    url: 'https://github.com/ruvnet/RuVector',
    stars: '4k+',
    desc: 'Rust 向量数据库 · HNSW 引擎，支持 WASM 浏览器运行与嵌入式部署，覆盖本地推理与边缘设备场景',
    prs: [
      {
        title: 'fix: native modules crash (SIGILL) on ARMv8.2 CPUs without LRCPC (#1384)',
        note: '跨平台编译兼容：修复 ARMv8.2 无 LRCPC 指令平台（Jetson AGX Xavier、树莓派 4）原生模块启动即 SIGILL 崩溃的问题，恢复边缘设备可用性',
        url: 'https://github.com/ruvnet/RuVector/pull/1384',
      },
      {
        title: 'fix: @ruvector/core 0.1.30 HNSW misses results on very small graphs (#1299)',
        note: '修复 @ruvector/core 0.1.30 在极小图上 HNSW 检索漏召回的问题',
        url: 'https://github.com/ruvnet/RuVector/pull/1299',
      },
    ],
  },
  {
    name: 'pydantic / pydantic-ai-harness',
    url: 'https://github.com/pydantic/pydantic-ai-harness',
    stars: '900+',
    desc: 'Pydantic（下载量亿级的校验库）官方 Agent Harness 子项目 · 承载工具输出摘要、限额与事件流的演进',
    prs: [
      {
        title: 'Warn on the deprecated single-key get/add of spend stores (#747)',
        note: 'API 演进期维护：为废弃的单键 get/add 补充迁移告警，同步更新全部内部调用点并完善单元与集成测试',
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

.oss-repo-desc {
  margin-top: 0.3rem;
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  line-height: 1.5;
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
