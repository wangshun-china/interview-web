<template>
  <section id="projects" class="pt-8 pb-16 relative">
    <div class="w-full px-8 md:px-16 lg:px-28 mb-8">
      <div class="flex items-center gap-4 mb-3">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-border)]"></div>
        <span class="text-[var(--color-text-muted)] text-sm font-mono">02</span>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-border)]"></div>
      </div>
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-2">
        <span class="gradient-text">项目经历</span>
      </h2>
      <p class="text-center text-[var(--color-text-muted)] text-lg">Project Showcase</p>
    </div>

    <div class="w-full px-8 md:px-16 lg:px-28 space-y-8">
      <article
        v-for="project in projects"
        :key="project.name"
        class="project-card card card-elevated overflow-hidden border border-[var(--color-border)]"
        :class="{ 'project-featured border-2 border-[var(--color-accent-light)]': project.featured }"
      >
        <div class="grid xl:grid-cols-[1.08fr_0.92fr]">
          <div class="p-7 lg:p-9">
            <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center">
                  <component :is="project.icon" class="w-7 h-7" :style="{ color: project.color }" />
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-3">
                    <h3 class="text-2xl font-bold text-[var(--color-text)]">{{ project.name }}</h3>
                    <span v-if="project.featured" class="px-3 py-1 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-xs font-semibold">
                      主项目
                    </span>
                  </div>
                  <p class="text-[var(--color-text-muted)] text-sm font-mono mt-1">{{ project.subtitle }}</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <a
                  v-for="link in project.links"
                  :key="link.label"
                  :href="link.href"
                  target="_blank"
                  class="btn btn-outline inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
                >
                  <component :is="link.icon" class="w-4 h-4" />
                  <span>{{ link.label }}</span>
                  <ExternalLink class="w-3 h-3" />
                </a>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-5">
              <span v-for="tag in project.tags" :key="tag" class="tag text-sm">{{ tag }}</span>
            </div>

            <p class="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              {{ project.summary }}
            </p>

            <div class="why-box mb-6">
              <div class="mini-title">
                <Lightbulb class="w-4 h-4" />
                <span>为什么做这个项目</span>
              </div>
              <p>{{ project.why }}</p>
            </div>

            <div class="grid md:grid-cols-3 gap-3 mb-6">
              <div v-for="metric in project.metrics" :key="metric.label" class="metric-box">
                <div class="metric-value">{{ metric.value }}</div>
                <div class="metric-label">{{ metric.label }}</div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-3">
              <div v-for="item in project.highlights" :key="item.title" class="highlight-item">
                <Check class="w-4 h-4 mt-0.5 flex-shrink-0" :style="{ color: project.color }" />
                <div>
                  <div class="text-sm font-semibold text-[var(--color-text)]">{{ item.title }}</div>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{{ item.detail }}</p>
                </div>
              </div>
            </div>
          </div>

          <aside class="project-side p-7 lg:p-9 border-t xl:border-t-0 xl:border-l border-[var(--color-border-light)]">
            <div class="side-section">
              <div class="side-title">
                <Code2 class="w-4 h-4" />
                <span>技术选型与原因</span>
              </div>
            <ul class="space-y-3">
                <li v-for="choice in project.choices" :key="choice.title" class="side-line">
                  <strong>{{ choice.title }}：</strong>{{ choice.detail }}
                </li>
              </ul>
            </div>

            <div class="side-section">
              <div class="side-title">
                <Bug class="w-4 h-4" />
                <span>踩坑与解决</span>
              </div>
              <ul class="space-y-3">
                <li v-for="pitfall in project.pitfalls" :key="pitfall.title" class="side-line">
                  <strong>{{ pitfall.title }}：</strong>{{ pitfall.detail }}
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </article>

      <section class="card rounded-3xl border border-[var(--color-border)] p-7 lg:p-9">
        <div class="flex flex-wrap items-start justify-between gap-4 mb-7">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center">
              <GitBranch class="w-6 h-6 text-[var(--color-tertiary)]" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-[var(--color-text)]">CI/CD 自动化部署</h3>
              <p class="text-[var(--color-text-muted)] text-sm">Push to master 自动构建、推镜像、远程部署，完整上线约 5-8 分钟</p>
            </div>
          </div>
          <a
            href="https://github.com/xixi-box/template"
            target="_blank"
            class="btn btn-outline inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          >
            <Github class="w-4 h-4" />
            <span>部署模板</span>
            <ExternalLink class="w-3 h-3" />
          </a>
        </div>

        <div class="pipeline">
          <div v-for="step in pipeline" :key="step" class="pipeline-step">{{ step }}</div>
        </div>

        <div class="deploy-grid mt-6">
          <div class="deploy-card">
            <div class="deploy-title">为什么做这套部署</div>
            <p>
              项目从个人仓库迁移到
              <a href="https://github.com/wangshun-china" target="_blank" class="inline-link"><strong>wangshun-china</strong></a>
              Organization 后，我希望把“提交代码到线上可访问”做成稳定流程。
              所以后端、前端、Node Builder、截图服务都统一打 Docker 镜像，GitHub Actions 负责构建和发布，服务器只拉最新镜像并重启。
            </p>
          </div>
          <div class="deploy-card">
            <div class="deploy-title">阿里云生产部署</div>
            <p>
              Self-hosted Runner 直接部署在阿里云 ECS 上，适合 Lumina-RPC 和 Code Craft 这类依赖 MySQL、Redis、Nacos、Nginx 的重项目。
              优点是网络路径短、部署链路简单，缺点是低配机器压力较大。
            </p>
          </div>
          <div class="deploy-card">
            <div class="deploy-title">本地 WSL + FRP 内网穿透</div>
            <p>
              为了降低云服务器成本，我也做过本地 WSL Runner 部署方案：构建和运行放在本地机器，阿里云只通过 frp 做转发。
              这样低配 ECS 也能承接公网入口，适合测试环境和个人项目演示。
            </p>
          </div>
          <div class="deploy-card">
            <div class="deploy-title">模板沉淀</div>
            <p>
              部署过程中把 GitHub Actions、Docker Compose、Nginx、frp、Runner 安装脚本整理成模板，后续新项目可以直接复用，
              不需要每次从零配置 CI/CD。
            </p>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Rocket,
  Shield,
  Cloud,
  ExternalLink,
  Github,
  Check,
  Bug,
  Code2,
  Lightbulb,
  GitBranch,
} from 'lucide-vue-next'

const projects = [
  {
    name: 'Code Craft',
    subtitle: 'AI 零代码应用生成平台',
    featured: true,
    icon: Cloud,
    color: 'var(--color-tertiary)',
    tags: ['Java 21', 'Spring Boot 3', 'Dubbo 3', 'Nacos', 'LangChain4j', 'Redis', 'Vue 3', 'Docker'],
    summary:
      '面向自然语言生成前端应用的全栈平台。用户输入需求后，后端通过 LangChain4j Tool Calling 创建和修改项目文件，前端提供源码工作区、实时预览、可视化编辑和一键部署能力。',
    why:
      '最开始是想把 LangChain4j 学到能落地的程度，而不是只停留在调用一次大模型。做着做着发现，真正难的不是让 AI 生成一段代码，而是让它持续生成、能预览、能修改、能部署、出错还能回到工程流程里处理。',
    metrics: [
      { value: '5+', label: '核心微服务/构建服务' },
      { value: '6', label: 'AI 文件工具' },
      { value: 'SSE', label: '流式生成反馈' },
    ],
    highlights: [
      { title: 'AI 工具调用闭环', detail: 'FileWrite/FileRead/FileModify/FileDelete/DirRead/ExitTool 支撑多文件项目生成。' },
      { title: '多轮对话记忆', detail: 'Redis 保存用户与应用维度的上下文，并限制历史长度控制 Token 成本。' },
      { title: '源码与预览工作区', detail: '文件树、源码 Tab、iframe 预览和拖拽分屏提高调试效率。' },
      { title: '部署任务持久化', detail: '记录部署状态、日志、错误信息和版本数据，前端展示临时终端日志。' },
      { title: '并发与安全控制', detail: 'Redisson 限流/锁控制同一应用并发写入，Guardrail 过滤风险输入。' },
      { title: '截图与对象存储', detail: 'Playwright 截图服务生成应用封面，并上传到腾讯云 COS。' },
    ],
    choices: [
      {
        title: 'LangChain4j',
        detail: '相比直接封装 HTTP 调模型，LangChain4j 提供 AI Service、Tool Calling、ChatMemory 和 Guardrail，能把 AI 能力接进 Spring Boot 的 Bean 生命周期，代码结构更清楚。',
      },
      {
        title: 'Dubbo 3 + Nacos',
        detail: '项目有用户服务、应用服务、截图服务和构建服务。用 HTTP 也能做，但接口治理、服务发现和超时重试都要自己补；Dubbo + Nacos 更适合练习微服务调用链。',
      },
      {
        title: 'Redis + Caffeine',
        detail: '只用 Redis 会增加每次查询的网络开销，只用本地缓存又无法跨实例共享。这里用 Redis 保存会话、任务和限流状态，用 Caffeine 缓热点应用信息。',
      },
      {
        title: 'Redisson',
        detail: '同一个 app 不能同时让两轮 AI 写文件，否则会互相覆盖。Redisson 的锁和 RRateLimiter 比自己写 Lua/SETNX 更稳，也方便按用户、IP、接口维度限流。',
      },
      {
        title: 'Node Builder',
        detail: '生成的 Vue 项目需要 npm install/build。把构建逻辑独立成 Node 服务，比在 Java 进程里执行命令更隔离，构建失败也不会拖垮主应用。',
      },
      {
        title: 'SSE',
        detail: 'WebSocket 适合双向实时通信，但这里只需要服务端持续推送 AI 输出和工具状态。SSE 更轻，浏览器原生支持，断线重连成本也低。',
      },
      {
        title: 'Playwright 截图服务',
        detail: '相比前端 canvas 截图，服务端 Playwright 能拿到真实渲染结果，用来生成应用封面更稳定，也方便部署后自动截图。',
      },
    ],
    pitfalls: [
      {
        title: 'AI 工具调用死循环',
        detail: '模型会反复读写同一个文件。解决方式是设置最大连续工具调用次数，并提供 ExitTool，让模型有明确的任务结束出口。',
      },
      {
        title: '代码围栏污染文件',
        detail: '模型经常输出 ```vue 或 ```html，直接写入会导致项目编译失败。写文件和改文件前统一剥离外层 Markdown 代码块。',
      },
      {
        title: '对话上下文丢失',
        detail: '微服务无状态，请求打到不同实例后历史消息拿不到。改为按 userId + appId 维度把 ChatMemory 存进 Redis，并限制历史条数控制 Token。',
      },
      {
        title: '并发写文件冲突',
        detail: '用户连续发送修改请求时，两轮 AI 可能同时改同一项目目录。用 Redis 原子锁限制同一 app 同时只允许一轮生成任务。',
      },
      {
        title: '构建日志不可见',
        detail: '一键部署失败时用户只看到失败状态，排查困难。后来把构建/部署过程记录到部署任务里，前端轮询展示临时终端日志。',
      },
      {
        title: 'iframe 可视化编辑通信',
        detail: '预览页面和主页面隔离，无法直接拿组件上下文。通过 postMessage 注入选择脚本，把元素文本、路径和样式上下文带回聊天框。',
      },
    ],
    links: [
      { label: '在线体验', href: 'http://120.26.186.0:8888', icon: Rocket },
      { label: '源码', href: 'https://github.com/wangshun-china/ai-code', icon: Github },
    ],
  },
  {
    name: 'Lumina-RPC',
    subtitle: '面向可观测性的轻量 RPC 框架',
    featured: false,
    icon: Rocket,
    color: 'var(--color-accent)',
    tags: ['Java 21', 'Netty 4.1', 'Kryo', 'ByteBuddy', 'MySQL', 'Vue Flow', 'ECharts', 'Docker'],
    summary:
      '自研 RPC 框架，包含协议层、核心 SDK、控制面和可视化面板。项目重点覆盖服务注册发现、动态代理、负载均衡、容错、Mock、熔断限流和链路追踪。',
    why:
      'Code Craft 里用了 Dubbo 和 Nacos，但只会用还不够。我想把 RPC 从协议、编解码、连接管理、服务发现、负载均衡到容错保护完整写一遍，这样再看 Dubbo 或 Spring Cloud 的实现会更有底。',
    metrics: [
      { value: '17B', label: '自定义协议头' },
      { value: '5', label: '负载均衡策略' },
      { value: '6500+', label: '单机压测 QPS' },
    ],
    highlights: [
      { title: '自定义二进制协议', detail: '魔数、版本、序列化类型、消息类型、RequestId 和 Body 长度组成协议头。' },
      { title: '粘包半包处理', detail: '基于 LengthFieldBasedFrameDecoder 按 Data Length 切分完整 RPC 帧。' },
      { title: '透明远程调用', detail: 'ByteBuddy 动态生成代理类，让 Consumer 像调用本地接口一样调用远程服务。' },
      { title: '服务治理能力', detail: 'RoundRobin、Random、Weighted、LeastActive、ConsistentHash 通过 SPI 扩展。' },
      { title: '容错与保护', detail: 'Failover/Failfast/Failsafe/Forking 配合滑动窗口熔断和令牌桶限流。' },
      { title: '可观测控制面', detail: '控制面管理服务、Mock 规则、保护配置和 Trace 数据，前端展示拓扑与瀑布图。' },
    ],
    choices: [
      {
        title: 'Netty',
        detail: '直接写 BIO Socket 能跑通 Demo，但连接复用、半包处理、线程模型和背压都要自己处理。Netty 的 NIO 模型和 ChannelPipeline 更适合做框架层。',
      },
      {
        title: '自定义协议',
        detail: 'HTTP/JSON 可读性好但冗余大，也不利于练习编解码。自定义 17 字节协议头可以明确放魔数、版本、序列化类型、消息类型、RequestId 和 Body 长度。',
      },
      {
        title: 'LengthFieldBasedFrameDecoder',
        detail: '相比按分隔符拆包，长度字段对二进制 Body 更可靠。协议头里的 Data Length 直接交给 Netty 解码器处理，避免手写缓冲区状态机。',
      },
      {
        title: 'Kryo + JSON',
        detail: 'Kryo 性能更好，适合作为默认序列化；JSON 可读性更好，适合调试和控制面展示。两者通过 Serializer SPI 切换，避免写死实现。',
      },
      {
        title: 'ByteBuddy',
        detail: 'JDK 动态代理只能代理接口，CGLIB 对类增强更常见但学习价值有限。ByteBuddy API 更底层，适合理解运行期生成代理类的过程。',
      },
      {
        title: '自研控制面',
        detail: '接 Nacos/Zookeeper 会少写很多代码，但服务注册、心跳、故障剔除和规则推送就学不完整。自研控制面能把这些链路完整展示出来。',
      },
      {
        title: 'SSE 规则推送',
        detail: 'Mock 规则变化是服务端向 Consumer 单向通知，用 WebSocket 有点重；SSE 足够轻，浏览器和 Java 客户端实现成本都低。',
      },
      {
        title: 'Vue Flow + ECharts',
        detail: '服务拓扑适合用节点边表达，调用链适合瀑布图。相比纯表格，前端可视化更能体现 RPC 框架的可观测性。',
      },
    ],
    pitfalls: [
      {
        title: 'TCP 粘包/半包',
        detail: '一开始按读取事件直接解码，遇到多条消息粘在一起或一条消息拆开就失败。后来用 Data Length + LengthFieldBasedFrameDecoder 解决。',
      },
      {
        title: '异步转同步',
        detail: 'Netty 写出请求后响应异步返回，但业务调用期望同步拿结果。用 requestId 维护 CompletableFuture，响应回来后 complete 对应 Future。',
      },
      {
        title: 'Spring 启动顺序',
        detail: '在 BeanPostProcessor 里启动 Netty 会早于容器完全初始化，导致服务注册后部分 Bean 还不可用。改为监听 ContextRefreshedEvent。',
      },
      {
        title: '服务实例缓存过期',
        detail: 'Consumer 本地缓存能减少控制面压力，但缓存太久会打到已下线实例。后续结合心跳、失败剔除和重新拉取降低脏缓存影响。',
      },
      {
        title: 'LeastActive 计数回收',
        detail: '最少活跃调用策略如果异常路径没有 decrement，会导致实例永远被认为很忙。需要在成功、失败和超时路径都释放活跃计数。',
      },
      {
        title: 'Mock 篡改嵌套字段',
        detail: '控制面传来的规则可能是扁平 key，例如 contacts.[element0].shipId。需要先归一化成嵌套 JSON，再和真实响应合并。',
      },
      {
        title: 'Trace 泛型反序列化',
        detail: '控制面没有业务包，Jackson 反序列化具体返回类型会失败。展示链路时降级成 Map/JSON，不影响瀑布图渲染。',
      },
    ],
    links: [
      { label: '在线演示', href: 'http://120.26.186.0:3000', icon: Rocket },
      { label: '源码', href: 'https://github.com/xixi-box/lumina-rpc', icon: Github },
    ],
  },
  {
    name: 'AutoGuard AI',
    subtitle: 'GitHub App 智能代码审查服务',
    featured: false,
    icon: Shield,
    color: 'var(--color-secondary)',
    tags: ['Python 3.11', 'FastAPI', 'GitHub App', 'Webhook', 'httpx async', 'DeepSeek', 'JWT', 'HMAC'],
    summary:
      '基于 GitHub App 的自动化 PR 审查服务。Pull Request 创建或更新时，服务验证 Webhook 签名、拉取 PR Diff、调用 DeepSeek 生成结构化 Review，并回写到 PR 评论。',
    why:
      '前两个项目解决的是“生成代码”和“服务通信”，这个项目想补上代码进入仓库前的质量关。它不是要替代人工 Review，而是把明显的安全、逻辑和风格问题先筛一遍，减轻重复检查成本。',
    metrics: [
      { value: 'async', label: '全链路异步 HTTP' },
      { value: '10min', label: 'Installation Token' },
      { value: '4', label: '审查维度' },
    ],
    highlights: [
      { title: 'Webhook 安全验证', detail: '使用 HMAC-SHA256 和 compare_digest 校验 GitHub 请求来源。' },
      { title: 'GitHub App 鉴权', detail: 'RS256 私钥签发 JWT，再换取 Installation Access Token 调用 GitHub API。' },
      { title: '异步编排', detail: 'FastAPI + httpx async 拉取 diff、调用 API、创建评论，减少阻塞等待。' },
      { title: '结构化审查 Prompt', detail: '聚焦逻辑错误、安全漏洞、代码风格和性能问题四类检查。' },
      { title: '优雅降级', detail: 'AI 服务异常时发布可读提示，不阻塞 PR 流程。' },
      { title: '轻量部署', detail: '单服务适合 Zeabur/Railway/Heroku 等平台，通过环境变量完成配置。' },
    ],
    choices: [
      {
        title: 'GitHub App',
        detail: 'PAT 权限过大且每个仓库都要单独配置 Secret。GitHub App 可以按仓库安装、权限粒度更细，并用短期 Installation Token 调 GitHub API。',
      },
      {
        title: 'FastAPI',
        detail: '这个服务核心是接 Webhook、调 GitHub、调 AI，不需要复杂后台。FastAPI 启动快、类型提示清楚，写异步接口也自然。',
      },
      {
        title: 'httpx async',
        detail: '换 token、拉 diff、发评论都是网络 IO。requests 同步写法简单但会阻塞 worker，httpx async 更适合后续并发处理多个 PR 事件。',
      },
      {
        title: 'GitHub Diff API',
        detail: '相比 clone 仓库再本地 diff，直接拉 PR diff 更轻量，也更适合 Serverless/轻量平台部署。缺点是上下文有限，所以 Prompt 要约束输出。',
      },
      {
        title: 'DeepSeek',
        detail: '兼容 OpenAI SDK，接入成本低，价格也适合频繁 Review。相比更强模型，DeepSeek 在成本和可用性之间更适合作为个人项目默认方案。',
      },
      {
        title: 'Pydantic Settings',
        detail: 'GitHub App ID、私钥、Webhook Secret、模型 Key 都来自环境变量。用配置类集中校验，比在业务代码里到处读 process env 更清楚。',
      },
      {
        title: '优雅降级',
        detail: 'PR 流程不能因为 AI 服务挂了就中断，所以没有做强制拦截，而是失败时回写提示评论，保留人工 Review 流程。',
      },
    ],
    pitfalls: [
      {
        title: 'Webhook 签名验证',
        detail: '不能只相信请求来自 GitHub，必须用 HMAC-SHA256 校验 body，并用 compare_digest 防止时序攻击。',
      },
      {
        title: '私钥换行格式',
        detail: '部署平台环境变量经常把 PEM 换行弄坏，导致 JWT 签名失败。兼容原始多行 PEM 和 \\n 转义格式。',
      },
      {
        title: 'Installation Token 获取失败',
        detail: 'JWT 有效期、App ID、安装 ID 任一不对都会 401。把鉴权逻辑独立成 github_auth 模块，错误日志单独输出。',
      },
      {
        title: '重复事件触发',
        detail: 'PR opened 和 synchronize 都会触发审查，短时间内可能多次评论。当前先保证流程正确，后续可以加 commit sha 缓存避免重复审查。',
      },
      {
        title: 'AI 输出太散',
        detail: '模型容易输出泛泛建议。Prompt 限定逻辑错误、安全漏洞、代码风格、性能问题四类，并要求没有问题时输出 LGTM。',
      },
      {
        title: 'AI 服务异常',
        detail: 'DeepSeek 超时或返回空内容时不能让 Webhook 直接 500 结束。统一捕获异常，回写友好失败评论并记录日志。',
      },
      {
        title: '轻量平台部署',
        detail: 'Zeabur/Heroku 类平台文件系统和环境变量处理方式不同，启动时增加配置检查和健康检查端点，方便定位部署问题。',
      },
    ],
    links: [
      { label: '源码', href: 'https://github.com/xixi-box/AutoGuard-AI-Reviewer', icon: Github },
    ],
  },
]

const pipeline = ['Push to master', 'GitHub Actions', 'Docker Build', '阿里云 ACR', 'Self-hosted Runner', 'Nginx / Docker Compose']
</script>

<style scoped>
.project-card {
  border-radius: 24px;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.project-featured {
  box-shadow: var(--shadow-md);
}

.project-side {
  background: linear-gradient(180deg, var(--color-bg-alt), #ffffff);
}

.why-box {
  padding: 1rem;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--color-accent-light), #fff);
  border: 1px solid var(--color-border-light);
}

.why-box p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.75;
}

.mini-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-accent);
  font-size: 0.86rem;
  font-weight: 800;
}

.metric-box {
  min-height: 86px;
  padding: 1rem;
  border-radius: 12px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-light);
}

.metric-value {
  color: var(--color-accent);
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.1;
}

.metric-label {
  margin-top: 0.4rem;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.highlight-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.85rem;
  border-radius: 12px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-light);
}

.side-section + .side-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border-light);
}

.side-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
  color: var(--color-accent);
  font-size: 0.9rem;
  font-weight: 700;
}

.side-line {
  color: var(--color-text-secondary);
  font-size: 0.86rem;
  line-height: 1.65;
}

.side-line strong {
  color: var(--color-text);
  font-weight: 800;
}

.side-line::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 0.55rem;
  border-radius: 999px;
  background: var(--color-accent);
  vertical-align: 0.08rem;
}

.pipeline {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.75rem;
}

.pipeline-step {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.86rem;
  font-weight: 600;
  text-align: center;
}

.deploy-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.deploy-card {
  padding: 1rem;
  border-radius: 14px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-light);
}

.deploy-title {
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-size: 0.92rem;
  font-weight: 800;
}

.deploy-card p {
  color: var(--color-text-secondary);
  font-size: 0.86rem;
  line-height: 1.75;
}

.inline-link {
  color: var(--color-accent);
  text-decoration: none;
}

.inline-link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .pipeline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .deploy-grid {
    grid-template-columns: 1fr;
  }
}
</style>
