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
            <span>已合并 {{ mergedCount }} · 覆盖 {{ starsCoverage }} ★</span>
          </div>
        </div>
        <p class="oss-subtitle">数据库 / 监控 / MCP 生态 / AI 基础设施 · 全部已被上游合并</p>
      </div>
    </header>

    <div class="oss-body">
      <p class="oss-blurb">
        长期向上游项目回馈维护级修复：每个 PR 均包含复现路径、根因分析与回归测试，
        覆盖驱动兼容、检索正确性、连接生命周期、运行时内核与跨平台崩溃等疑难场景，
        已在 Prometheus、ClickHouse、OpenViking、Redis Go 客户端、FastMCP、Wasmtime 等上游项目合并 {{ mergedCount }} 个 PR。
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
import { computed } from 'vue'
import { GitPullRequest, Star } from 'lucide-vue-next'

const repos = [
  {
    name: 'prometheus / prometheus',
    url: 'https://github.com/prometheus/prometheus',
    stars: '67k+',
    desc: '监控与告警领域的事实标准——CNCF 最早毕业的项目之一（Go 编写），Kubernetes 生态默认监控方案。拥有数千个 Exporter、与 Grafana 深度集成的庞大指标生态，Cloudflare/DigitalOcean 等大量公司生产使用',
    prs: [
      {
        title: 'web: ui: align literal and duration keyword parsing with PromQL (#20456)',
        note: '修复 Web UI 的 PromQL 解析与真实 PromQL 语义不一致的问题——字面量与持续时间关键字解析对齐',
        url: 'https://github.com/prometheus/prometheus/pull/20456',
      },
    ],
  },
  {
    name: 'ClickHouse / ClickHouse',
    url: 'https://github.com/ClickHouse/ClickHouse',
    stars: '50k+',
    desc: 'Yandex 研发、2014 开源的 C++ 列式 OLAP 数据库——实时分析的事实标准，单节点每秒可扫描数亿行、支持 PB 级数据量；Cloudflare/eBay/Spotify 等大量头部公司生产使用',
    prs: [
      {
        title: 'fix: MySQL interface — Connector/J 9.x fails on connect (#129709)',
        note: '生产级连接故障排查：用户升级 MySQL JDBC 驱动到 Connector/J 9.x 后全量无法连接（"Buffer length is less than expected payload length"，回退 5.1.49 才恢复）。独立定位到 MySQL 接口对新驱动握手行为的兼容性缺陷并修复，恢复与 5.1.49 一致的行为，附驱动兼容性回归验证',
        url: 'https://github.com/ClickHouse/ClickHouse/pull/129709',
      },
    ],
  },
  {
    name: 'HKUDS / LightRAG',
    url: 'https://github.com/HKUDS/LightRAG',
    stars: '40k+',
    desc: 'EMNLP2025 论文 · GitHub Trending 日榜第 2 · GitHub 全球排名 #753 · PyPI 月下载 2M+——图增强 RAG 框架的开源标杆，融合知识图谱与向量检索',
    prs: [
      {
        title: 'fix(chunker): verify token-window positions before attaching provenance (#4463)',
        note: '正确性缺陷：chunker 在附加上下文溯源标记前未校验 token 窗口位置，导致 provenance 信息错挂——从解析逻辑定位根因并修复',
        url: 'https://github.com/HKUDS/LightRAG/pull/4463',
      },
    ],
  },
  {
    name: 'volcengine / OpenViking',
    url: 'https://github.com/volcengine/OpenViking',
    stars: '42k+',
    desc: '字节跳动（火山引擎）开源的 AI Agent 自进化上下文数据库——统一 Agent 记忆、知识 RAG 与技能三层抽象，内置 VLM 多模态模块与 LiteLLM 多模型接入，曾登 GitHub Trending 日榜第 1',
    prs: [
      {
        title: 'fix(vlm): inherit configured reasoning effort in LiteLLM requests (#7703)',
        note: '修复 VLM 模块经 LiteLLM 发起请求时未继承已配置 reasoning effort 的问题',
        url: 'https://github.com/volcengine/OpenViking/pull/7703',
      },
    ],
  },
  {
    name: 'qdrant / qdrant',
    url: 'https://github.com/qdrant/qdrant',
    stars: '35k+',
    desc: 'Rust 编写的高性能向量数据库 · GitHub 同类项目 Top 2——原生分布式架构、支持 HNSW/量化/稀疏混合检索，LangChain/LlamaIndex 官方集成，广泛用于企业级 RAG 与语义搜索',
    prs: [
      {
        title: 'fix: group-by silently returns empty results (#11370)',
        note: '生产 RAG 最危险的静默丢数据类缺陷：不支持的 payload 值耗尽候选预算时，group-by 不报错、直接返回空结果。从 issue 复现路径独立定位到该失败分支并修复，附边界条件回归测试',
        url: 'https://github.com/qdrant/qdrant/pull/11370',
      },
      {
        title: 'fix: RecommendBestScore applies score_threshold in the wrong direction (#11350)',
        note: '正确性缺陷：score_threshold 的比较逻辑未随距离度量方向适配——Euclid 距离（越小越优）下阈值方向用反，导致有效推荐结果被批量错误过滤；修正度量感知的判定逻辑',
        url: 'https://github.com/qdrant/qdrant/pull/11350',
      },
    ],
  },
  {
    name: 'PrefectHQ / fastmcp',
    url: 'https://github.com/PrefectHQ/fastmcp',
    stars: '28k+',
    desc: 'Python MCP 框架事实标准 · Prefect 官方维护——用装饰器将任意 Python 函数暴露为 MCP 工具/资源/提示模板，支持 stdio/HTTP/SSE 多传输方式；MCP 已被 OpenAI/Google 宣布支持',
    prs: [
      {
        title: 'fix: `session: UserSession` on a resource or resource template fails at registration (#6198)',
        note: '定位注册阶段依赖注入的报错路径：资源/资源模板声明 UserSession 会话依赖时直接抛异常。修复后，会话级鉴权与 MCP 资源声明可作为一等用法组合，打通带鉴权的工具/资源场景',
        url: 'https://github.com/PrefectHQ/fastmcp/pull/6198',
      },
    ],
  },
  {
    name: 'redis / go-redis',
    url: 'https://github.com/redis/go-redis',
    stars: '22k+',
    desc: 'Go 生态 Redis 客户端事实标准 · Redis 官方接管维护——支持 Cluster/Sentinel/流水线/Pub-Sub 全特性，Argo CD/Gitea 等知名项目直接依赖，DragonflyDB 官方兼容性验证也用它',
    prs: [
      {
        title: 'fix: proto — no nesting depth limit when reading RESP3 replies (#4296)',
        note: '安全加固：定位 RESP3 聚合回复递归解析无深度限制的 DoS 面——恶意服务端可打爆客户端 Go 栈（+383/−32，跨 5 文件）。引入嵌套深度追踪、补齐 reader_depth_test.go 回归测试，并附修复前后性能基准对比（无回退），由官方维护者合并',
        url: 'https://github.com/redis/go-redis/pull/4296',
      },
      {
        title: 'fix(pool): wait for idle reauthentication (#4313)',
        note: '并发缺陷：空闲连接在后台重认证完成前即可被取出使用，导致认证信息不完整（+481/−5）；补齐等待-认证完成的生命周期同步与回归测试',
        url: 'https://github.com/redis/go-redis/pull/4313',
      },
      {
        title: 'fix(tx): discard uncleared transaction state (#4316)',
        note: '状态机缺陷：事务异常路径下残留的 transaction state 未被清理，污染后续命令执行（+204/−1）；定位残留状态的存活路径并补齐清理与回归测试',
        url: 'https://github.com/redis/go-redis/pull/4316',
      },
      {
        title: 'fix: multidb — FD outcomes settle into the window after a reselect of the active member (#4283)',
        note: '可用性核心修复：MultiDB 重选活跃节点后，迟到的全双工结果会错误结算进新熔断窗口与故障检测期（+176/−81，涉及安全与可用性关键路径）；先在基线复现失败再验证补丁通过，由官方维护者合并',
        url: 'https://github.com/redis/go-redis/pull/4283',
      },
      {
        title: 'fix(pool): return acquired idle connections (#4322)',
        note: '连接池生命周期修复：获取到的空闲连接未正确归还连接池，长期运行下造成连接泄漏（+81/−1）；补齐归还路径与回归测试，由官方维护者合并',
        url: 'https://github.com/redis/go-redis/pull/4322',
      },
      {
        title: 'fix(retry): stop replaying failed dial sequences (#4304)',
        note: '重试缺陷：连接失败的 dial 序列被错误重放，导致重复连接与资源浪费（+927/−37）；修正重试策略的状态管理并补齐回归测试',
        url: 'https://github.com/redis/go-redis/pull/4304',
      },
    ],
  },
  {
    name: 'bytecodealliance / wasmtime',
    url: 'https://github.com/bytecodealliance/wasmtime',
    stars: '18k+',
    desc: 'Bytecode Alliance（Mozilla/Fastly/Intel 联合创立）出品的 WebAssembly 运行时——内含 Cranelift 编译器，支持 WASI 标准接口；Cloudflare Workers/Fastly 边缘计算与 Firefox 沙箱模块的底层引擎',
    prs: [
      {
        title: 'fix: Copying collector grow-vs-collect heuristic compares against the whole heap (#15207)',
        note: '运行时内核级修复：复制式 GC 的增长-回收启发式错误地按整个堆而非活动半空间比较，导致内存峰值误判——从 GC 触发条件的语义入手定位并修正',
        url: 'https://github.com/bytecodealliance/wasmtime/pull/15207',
      },
      {
        title: 'fix: Core dumps of custom-page-size memories truncate their data and declare the wrong size (#15275)',
        note: '修复自定义页大小 memory 的 core dump 截断数据且声明尺寸错误的问题',
        url: 'https://github.com/bytecodealliance/wasmtime/pull/15275',
      },
    ],
  },
  {
    name: 'opensandbox-group / OpenSandbox',
    url: 'https://github.com/opensandbox-group/OpenSandbox',
    stars: '17k+',
    desc: 'Agentic AI Foundation（AAIF）旗下 · 曾登 GitHub Trending 日榜第 1 · 通过 OpenSSF 最佳实践认证——AI Agent 的安全沙箱运行时：隔离执行不受信代码、运行工具调用、支撑多租户场景',
    prs: [
      {
        title: 'fix(python-sdk): normalize legacy SSE streams in linear time (#2845)',
        note: '修复 Python SDK 对旧版 SSE 流的解析退化为非线性处理的问题，长会话下不再随流增长而卡顿',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/2845',
      },
    ],
  },
  {
    name: 'The-PR-Agent / pr-agent',
    url: 'https://github.com/The-PR-Agent/pr-agent',
    stars: '16k+',
    desc: 'Qodo（原 CodiumAI，AI 代码完整性头部公司）发起的开源 AI 代码评审 Agent——自动执行 PR 描述生成、代码审查、变更影响分析与建议回复，支持 GitHub/GitLab/Bitbucket/Azure DevOps 四大平台',
    prs: [
      {
        title: 'fix: guard GitLab ticket context with project issue visibility (#4932)',
        note: '修复 GitLab ticket 上下文未校验项目 issue 可见性的越权读取问题',
        url: 'https://github.com/The-PR-Agent/pr-agent/pull/4932',
      },
    ],
  },
  {
    name: 'pypa / pipx',
    url: 'https://github.com/pypa/pipx',
    stars: '13k+',
    desc: 'Python 应用隔离安装与运行的事实标准工具——pipx 让 CLI 工具各享独立虚拟环境',
    prs: [
      {
        title: 'docs(environment): explain what --value prints for unset variables (#2450)',
        note: '补充 environment 模块文档：说明 --value 对未设置变量的输出行为，消除使用者歧义',
        url: 'https://github.com/pypa/pipx/pull/2450',
      },
    ],
  },
  {
    name: 'agentgateway / agentgateway',
    url: 'https://github.com/agentgateway/agentgateway',
    stars: '6k+',
    desc: 'Linux Foundation / CNCF 项目 · 面向 Agent 流量的新一代数据平面（Rust 实现）——统一代理 MCP 与 A2A 智能体协议，内置鉴权、限流与可观测性',
    prs: [
      {
        title: 'fix: Windows CLI shows version as True (#4276)',
        note: '定位 Windows 平台版本探测逻辑误将布尔值作为版本信息输出的类型处理缺陷并修正，保证多平台 CLI 行为一致',
        url: 'https://github.com/agentgateway/agentgateway/pull/4276',
      },
      {
        title: "fix: resolve the user's home directory on Windows (#4264)",
        note: '修复 Windows 平台用户主目录解析错误导致的配置定位失败，补齐跨平台路径解析验证',
        url: 'https://github.com/agentgateway/agentgateway/pull/4264',
      },
    ],
  },
  {
    name: 'ruvnet / RuVector',
    url: 'https://github.com/ruvnet/RuVector',
    stars: '4.7k+',
    desc: 'Rust 向量数据库 · HNSW 引擎，支持 WASM 浏览器运行与嵌入式部署，覆盖本地推理与边缘设备场景',
    prs: [
      {
        title: 'fix: native modules crash (SIGILL) on ARMv8.2 CPUs without LRCPC (#1384)',
        note: '跨平台编译兼容：修复 ARMv8.2 无 LRCPC 平台（Jetson AGX Xavier、树莓派 4）原生模块启动即 SIGILL 崩溃的问题，恢复边缘设备可用性',
        url: 'https://github.com/ruvnet/RuVector/pull/1384',
      },
      {
        title: 'fix: @ruvector/core 0.1.30 HNSW misses results on very small graphs (#1299)',
        note: '定位 HNSW 在极小图场景下的层遍历边界缺陷——0.1.30 版本检索结果大面积漏召回；修复并补齐小图场景的召回率验证',
        url: 'https://github.com/ruvnet/RuVector/pull/1299',
      },
    ],
  },
  {
    name: 'modelcontextprotocol / rust-sdk',
    url: 'https://github.com/modelcontextprotocol/rust-sdk',
    stars: '4.1k+',
    desc: 'MCP 协议官方 Rust SDK · Anthropic 发起的模型-工具连接标准——支持 stdio/Streamable-HTTP 双传输、服务端与客户端双端实现，类型安全且异步优先',
    prs: [
      {
        title: 'fix: stateful session workers ignore config.cancellation_token after shutdown (#1427)',
        note: '资源生命周期缺陷：streamable-http 有状态会话在 shutdown 后仍忽略 cancellation_token、worker 残留存活——定位连接关闭与任务取消的信号传递断点并修复',
        url: 'https://github.com/modelcontextprotocol/rust-sdk/pull/1427',
      },
      {
        title: 'fix: reject unadvertised capability methods by default (#1446)',
        note: '安全加固：默认拒绝未声明的能力方法调用，防止客户端绕过服务端能力协商直接调用未暴露接口',
        url: 'https://github.com/modelcontextprotocol/rust-sdk/pull/1446',
      },
    ],
  },
  {
    name: 'bytecodealliance / wasm-tools',
    url: 'https://github.com/bytecodealliance/wasm-tools',
    stars: '1.8k+',
    desc: 'Wasmtime 生态的 WebAssembly 工具链仓库（wit-bindgen、wasm-compose 等），Wasm 组件模型的标准工具集',
    prs: [
      {
        title: 'fix: Code-motion mutation retains a full syntax-tree clone at every nesting level (#2825)',
        note: '修复代码移动变换在每层嵌套都保留完整语法树克隆导致的内存爆炸问题',
        url: 'https://github.com/bytecodealliance/wasm-tools/pull/2825',
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

const mergedCount = computed(
  () => repos.reduce((sum, repo) => sum + repo.prs.length, 0)
)

const starsCoverage = computed(() => {
  const total = repos.reduce((sum, repo) => {
    const m = /([\d.]+)(k\+|\+)?/.exec(repo.stars)
    return m ? sum + parseFloat(m[1]) * (m[2] === 'k+' ? 1000 : 1) : sum
  }, 0)
  return total >= 1000 ? Math.round(total / 1000) + 'k+' : Math.round(total) + '+'
})
</script>

<style scoped>
.open-source-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-veil);
}

.oss-header {
  display: flex;
  gap: 1rem;
  padding: 1.4rem 1.5rem;
  border-bottom: 1px solid var(--color-border-light);
  background: linear-gradient(135deg, var(--color-secondary-light, #eef2f7), var(--color-surface) 60%);
}

.oss-mark {
  display: flex;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: var(--color-surface);
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
  background: var(--color-surface);
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
