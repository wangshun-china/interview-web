<template>
  <section id="projects" class="pt-2 pb-16 relative">
    <div class="w-full px-8 md:px-16 lg:px-28 mb-5">
      <div class="flex items-center gap-4 mb-3">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-border)]"></div>
        <span class="text-[var(--color-text-muted)] text-sm font-mono">02</span>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-border)]"></div>
      </div>
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-2">
        <span class="gradient-text">项目经历</span>
      </h2>
      <p class="text-center text-[var(--color-text-muted)] text-lg">Project Showcase</p>
      <div class="availability-banner">
        <strong>访问说明：</strong>
        简历网站运行在阿里云，全天可访问；AI Coder 和 Lumina-RPC 运行在本地 WSL，通过内网穿透访问，一般工作日白天可访问。
        点击“展开详情”会出现当前模块的伪二级界面；手机上若访问有问题，请在手机浏览器中打开电脑模式。
      </div>
    </div>

    <div class="project-grid w-full px-8 md:px-16 lg:px-28">
      <article
        v-for="project in allProjects"
        :key="project.name"
        class="project-summary-card card card-elevated"
        :class="{ 'project-featured': project.featured }"
      >
        <div class="summary-card-head">
          <div class="summary-icon">
            <component :is="project.icon" class="w-6 h-6" :style="{ color: project.color }" />
          </div>
          <div>
            <div class="summary-title-row">
              <h3>{{ project.name }}</h3>
              <span v-if="project.featured" class="summary-badge">主项目</span>
            </div>
            <p>{{ project.subtitle }}</p>
          </div>
        </div>

        <p class="summary-text">{{ project.summary }}</p>
        <div v-if="project.availability" class="availability-note">
          {{ project.availability }}
        </div>

        <div class="summary-tags">
          <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="summary-points">
          <div v-for="item in project.highlights.slice(0, 4)" :key="item.title" class="summary-point">
            <Check class="w-4 h-4" :style="{ color: project.color }" />
            <span>{{ item.title }}</span>
          </div>
        </div>

        <div class="summary-actions">
          <a
            v-for="link in project.links"
            :key="link.label"
            :href="link.href"
            target="_blank"
            class="summary-link"
          >
            <component :is="link.icon" class="w-4 h-4" />
            <span>{{ link.label }}</span>
            <ExternalLink class="w-3 h-3" />
          </a>
          <button type="button" class="summary-link summary-detail-button" @click="openProject(project)">
            <span>展开详情</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </article>
    </div>

    <Teleport to="body">
      <div v-if="selectedProject" class="project-overlay" @click="closeProject">
        <article class="project-modal" @click.stop>
          <header class="modal-header">
            <div class="modal-title-block">
              <div class="modal-title-row">
                <div class="summary-icon">
                  <component :is="selectedProject.icon" class="w-6 h-6" :style="{ color: selectedProject.color }" />
                </div>
                <div>
                  <h3>{{ selectedProject.name }}</h3>
                  <p>{{ selectedProject.subtitle }}</p>
                </div>
              </div>
              <div class="modal-tags">
                <span v-for="tag in selectedProject.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="modal-header-actions">
              <div class="modal-actions">
                <a
                  v-for="link in selectedProject.links"
                  :key="link.label"
                  :href="link.href"
                  target="_blank"
                  class="summary-link"
                >
                  <component :is="link.icon" class="w-4 h-4" />
                  <span>{{ link.label }}</span>
                  <ExternalLink class="w-3 h-3" />
                </a>
              </div>
              <button type="button" class="modal-close" aria-label="关闭详情" @click="closeProject">
                <X class="w-6 h-6" />
              </button>
            </div>
          </header>

          <div class="modal-body">
            <section class="modal-section">
              <h4>项目概览</h4>
              <p>{{ selectedProject.summary }}</p>
              <p v-if="selectedProject.availability" class="modal-availability">
                {{ selectedProject.availability }}
              </p>
              <p v-if="selectedProject.why">{{ selectedProject.why }}</p>
            </section>

            <section v-if="selectedProject.metrics" class="modal-section">
              <h4>核心指标</h4>
              <div class="modal-metrics">
                <div v-for="metric in selectedProject.metrics" :key="metric.label" class="metric-box">
                  <div class="metric-value">{{ metric.value }}</div>
                  <div class="metric-label">{{ metric.label }}</div>
                </div>
              </div>
            </section>

            <section class="modal-section">
              <h4>我主要做了什么</h4>
              <div class="modal-card-grid">
                <div v-for="item in selectedProject.highlights" :key="item.title" class="highlight-item">
                  <Check class="w-4 h-4 mt-0.5 flex-shrink-0" :style="{ color: selectedProject.color }" />
                  <div>
                    <div class="text-sm font-semibold text-[var(--color-text)]">{{ item.title }}</div>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{{ item.detail }}</p>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="selectedProject.flowDesign || selectedProject.processFlow" class="modal-section">
              <h4>核心流程</h4>
              <p v-if="selectedProject.flowDesign">{{ selectedProject.flowDesign.detail }}</p>
              <div v-if="selectedProject.processFlow" class="flow-grid">
                <div v-for="step in selectedProject.processFlow.steps" :key="step.title" class="flow-item">
                  <div class="flow-step">{{ step.title }}</div>
                  <p>{{ step.detail }}</p>
                </div>
              </div>
            </section>

            <section v-if="selectedProject.strategyGroups" class="modal-section">
              <h4>策略设计</h4>
              <div class="strategy-grid">
                <div v-for="group in selectedProject.strategyGroups" :key="group.title" class="strategy-card">
                  <div class="strategy-title">{{ group.title }}</div>
                  <div class="strategy-list">
                    <div v-for="item in group.items" :key="item.name" class="strategy-item">
                      <strong>{{ item.name }}</strong>
                      <span>{{ item.detail }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="selectedProject.benchmark" class="modal-section">
              <h4>{{ selectedProject.benchmark.title }}</h4>
              <div class="benchmark-table-wrap">
                <table class="benchmark-table">
                  <thead>
                    <tr>
                      <th v-for="column in selectedProject.benchmark.columns" :key="column">{{ column }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in selectedProject.benchmark.rows" :key="row.thread">
                      <td>{{ row.thread }}</td>
                      <td>{{ row.qps }}</td>
                      <td>{{ row.avg }}</td>
                      <td>{{ row.p99 }}</td>
                      <td>{{ row.errorRate }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="detail-note">{{ selectedProject.benchmark.note }}</p>
            </section>

            <section v-if="selectedProject.choices" class="modal-section">
              <h4>技术选型</h4>
              <div class="modal-list-grid">
                <div v-for="choice in selectedProject.choices" :key="choice.title" class="modal-list-item">
                  <strong>{{ choice.title }}</strong>
                  <p>{{ choice.detail }}</p>
                </div>
              </div>
            </section>

            <section v-if="selectedProject.pitfalls" class="modal-section">
              <h4>踩坑与解决</h4>
              <div class="modal-list-grid">
                <div v-for="pitfall in selectedProject.pitfalls" :key="pitfall.title" class="modal-list-item">
                  <strong>{{ pitfall.title }}</strong>
                  <p>{{ pitfall.detail }}</p>
                </div>
              </div>
            </section>

            <section v-if="selectedProject.boundary" class="modal-section">
              <h4>{{ selectedProject.boundary.title }}</h4>
              <div class="boundary-grid">
                <div class="boundary-card">
                  <div class="boundary-title">已完成</div>
                  <ul>
                    <li v-for="item in selectedProject.boundary.done" :key="item">{{ item }}</li>
                  </ul>
                </div>
                <div class="boundary-card">
                  <div class="boundary-title">下一步</div>
                  <ul>
                    <li v-for="item in selectedProject.boundary.next" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
  ArrowRight,
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
  X,
} from 'lucide-vue-next'

const selectedProject = ref<any | null>(null)

const openProject = (project: any) => {
  selectedProject.value = project
  document.body.style.overflow = 'hidden'
}

const closeProject = () => {
  selectedProject.value = null
  document.body.style.overflow = ''
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectedProject.value) {
    closeProject()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

const projects = [
  {
    name: 'AI Coder',
    subtitle: 'AI 代码生成与预览平台',
    featured: true,
    icon: Cloud,
    color: 'var(--color-tertiary)',
    tags: ['Java 21', 'Spring Boot 3', 'Spring AI Alibaba Graph', 'Dubbo 3', 'Nacos', 'Redis/Redisson', 'Vue 3', 'Docker'],
    summary:
      '面向自然语言生成前端应用的全栈平台。后端基于 Spring AI Alibaba Graph/ReactAgent 编排规划、脚手架、UI、审查和修复流程，通过工具调用读写项目文件，前端提供源码工作区、实时预览、可视化编辑和一键部署能力。',
    availability: '在线体验运行在本地 WSL，通过 FRP 内网穿透访问；一般工作日白天可访问。',
    why:
      '现在的 springaialibaba 分支重点是把 Spring AI Alibaba 的 ChatClient、Tool Calling、Graph Agent 和 Redis 记忆落到可运行产品，而不是只做一次模型调用。项目核心放在工程闭环：让 AI 能持续规划、生成、审查、构建、修复、预览和部署。',
    flowDesign: {
      title: 'AI 开发闭环设计',
      detail:
        '正式生成前先产出应用方案，生成阶段由 StateGraph 串起 scaffold_coder、ui_coder、reviewer、fix_coder；工具调用和阶段消息通过 SSE 推给前端，Node Builder 构建失败后把日志回传给修复 Agent，最后进入预览、截图、部署和版本记录。',
    },
    metrics: [
      { value: '多模块', label: '用户/应用/构建/截图/部署服务' },
      { value: '4 Agent', label: '脚手架/UI/审查/修复编排' },
      { value: 'SSE', label: '阶段与工具调用反馈' },
    ],
    processFlow: {
      title: '生成链路',
      mode: 'arrow',
      steps: [
        { title: '方案确认', detail: '先生成页面结构、视觉风格、关键交互和数据流，用户确认后再进入正式编码。' },
        { title: 'Agent 编排', detail: 'StateGraph 依次调度脚手架 Agent、UI Agent、只读审查 Agent 和修复 Agent。' },
        { title: '文件操作', detail: 'AI 通过 readDir/readFile/writeFile/modifyFile/deleteFile/exit 逐步落地项目文件。' },
        { title: '流式反馈', detail: 'SSE 实时返回阶段消息、AI 文本、工具请求和工具执行结果，避免长时间无响应。' },
        { title: '构建修复', detail: 'Node Builder 编译 Vue 项目，失败后把构建日志交给修复 Agent 做最小修改。' },
        { title: '预览部署', detail: '前端 iframe 预览并支持可视化编辑，部署后记录任务日志、版本和截图封面。' },
      ],
    },
    highlights: [
      { title: 'Agent Graph 编排', detail: 'Spring AI Alibaba StateGraph 串联 scaffold_coder、ui_coder、reviewer、fix_coder，并设置最大迭代次数避免无限循环。' },
      { title: 'AI 工具调用闭环', detail: 'writeFile/readFile/modifyFile/deleteFile/readDir/exit 支撑 Vue 多文件项目生成、审查和修复。' },
      { title: 'Redis 记忆与检查点', detail: 'RedissonRedisChatMemoryRepository 保存对话记忆，RedisSaver 保存 Graph checkpoint，MessageWindow 控制上下文长度。' },
      { title: '源码与预览工作区', detail: '文件树、源码 Tab、iframe 预览和拖拽分屏提高调试效率。' },
      { title: '部署任务持久化', detail: '记录部署状态、日志、错误信息和版本数据，前端展示临时终端日志。' },
      { title: '并发与限流控制', detail: 'Redisson RBucket token 锁限制同一应用并发生成，RRateLimiter 按接口、用户和 IP 做限流。' },
      { title: '模型配置与监控', detail: '支持用户级 OpenAI-compatible 模型凭据，统一记录请求、错误、Token 和响应耗时。' },
      { title: '截图与对象存储', detail: 'Playwright 截图服务生成应用封面，并上传到腾讯云 COS。' },
    ],
    choices: [
      {
        title: 'Spring AI Alibaba Graph',
        detail: '使用 OpenAI-compatible ChatClient 接入 DashScope/Qwen，并用 StateGraph + ReactAgent 编排脚手架生成、UI 生成、代码审查和修复流程。',
      },
      {
        title: 'Dubbo 3 + Nacos',
        detail: '项目有用户服务、应用服务、截图服务和构建服务。用 HTTP 也能做，但接口治理、服务发现和超时重试都要自己补；Dubbo + Nacos 更适合练习微服务调用链。',
      },
      {
        title: 'Redis + Caffeine',
        detail: 'Redis 承担 ChatMemory、Graph checkpoint、生成锁和限流状态，Caffeine 缓存 AI 服务实例，减少重复构建 ChatClient 和 Agent 流水线。',
      },
      {
        title: 'Redisson',
        detail: '同一个 app 不能同时让两轮 AI 写文件，否则会互相覆盖。这里用 Redisson RBucket token 锁做互斥，用 RRateLimiter 做接口级限流。',
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
      {
        title: '本地模板 RAG',
        detail: '对常见生成场景维护轻量模板库，按用户需求检索实现要点、文件建议和质量检查项，作为生成上下文补充。',
      },
    ],
    pitfalls: [
      {
        title: 'Agent 循环调用工具',
        detail: '模型会反复读写同一个文件。解决方式是设置 Graph 最大迭代次数、审查通过/失败出口，并提供 exit 工具让任务有明确结束点。',
      },
      {
        title: '代码围栏污染文件',
        detail: '模型经常输出 ```vue 或 ```html，直接写入会导致项目编译失败。写文件和改文件前统一剥离外层 Markdown 代码块。',
      },
      {
        title: '对话上下文丢失',
        detail: '微服务无状态，请求打到不同实例后历史消息拿不到。改为用 Redis 保存 ChatMemory 和 Graph checkpoint，并用 MessageWindow/SummarizationHook 控制上下文长度。',
      },
      {
        title: '并发写文件冲突',
        detail: '用户连续发送修改请求时，两轮 AI 可能同时改同一项目目录。用 Redisson token 锁限制同一 app 同时只允许一轮生成任务。',
      },
      {
        title: '构建日志不可见',
        detail: '一键部署失败时用户只看到失败状态，排查困难。后来把构建/部署过程记录到部署任务里，前端轮询展示临时终端日志。',
      },
      {
        title: '一次生成太多文件',
        detail: '一次性输出整个项目容易造成前后文件冲突。后来拆成 scaffold_coder、ui_coder、reviewer、fix_coder，让生成、审查、修复各自负责一段。',
      },
      {
        title: '修 bug 时引入新 bug',
        detail: '只把一句报错丢回给模型，修改往往很盲。现在把 Node Builder 的构建日志截断后回传，并要求先读目录和相关文件，再做最小修改。',
      },
      {
        title: 'iframe 可视化编辑通信',
        detail: '预览页面和主页面隔离，无法直接拿组件上下文。通过 postMessage 注入选择脚本，把元素文本、路径和样式上下文带回聊天框。',
      },
    ],
    links: [
      { label: '在线体验', href: 'http://ai-coder.wangshun.work', icon: Rocket },
      { label: '源码', href: 'https://github.com/xixi-box/ai-code/tree/springaialibaba', icon: Github },
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
    availability: '在线演示运行在本地 WSL，通过 FRP 内网穿透访问；一般工作日白天可访问。',
    why:
      'AI Coder 里用了 Dubbo 和 Nacos，但只会用还不够。我想把 RPC 从协议、编解码、连接管理、服务发现、负载均衡到容错保护完整写一遍，这样再看 Dubbo 或 Spring Cloud 的实现会更有底。',
    metrics: [
      { value: '17B', label: '自定义协议头' },
      { value: '5 + 4', label: 'LB / 容错策略' },
      { value: '7185', label: '峰值 QPS' },
    ],
    strategyGroups: [
      {
        title: '负载均衡',
        items: [
          { name: 'RoundRobin', detail: '轮询分发，请求均匀、实现简单。' },
          { name: 'Random', detail: '随机选择，适合基础分流场景。' },
          { name: 'WeightedRoundRobin', detail: '按权重轮询，让高配实例承接更多流量。' },
          { name: 'LeastActive', detail: '优先选当前活跃请求最少的实例，适合长连接和耗时不均场景。' },
          { name: 'ConsistentHash', detail: '同一 key 尽量命中同一实例，适合会话保持和缓存命中。' },
        ],
      },
      {
        title: '集群容错',
        items: [
          { name: 'Failover', detail: '失败后重试其他实例，适合读操作和幂等调用。' },
          { name: 'Failfast', detail: '快速失败，适合非幂等写操作。' },
          { name: 'Failsafe', detail: '失败安全，忽略异常并返回空值，适合非关键链路。' },
          { name: 'Forking', detail: '并行请求多个实例，任一成功即返回，适合对时延敏感的场景。' },
        ],
      },
    ],
    benchmark: {
      title: '单机压测结果',
      columns: ['线程数', 'QPS', '平均响应', 'P99', '错误率'],
      rows: [
        { thread: '500', qps: '6863', avg: '70ms', p99: '671ms', errorRate: '0%' },
        { thread: '1000', qps: '6753', avg: '71ms', p99: '1007ms', errorRate: '0%' },
        { thread: '2000', qps: '6811', avg: '70ms', p99: '857ms', errorRate: '0%' },
        { thread: '5000', qps: '7185', avg: '66ms', p99: '768ms', errorRate: '0%' },
      ],
      note: '单机环境下稳定支撑 6500-7000 QPS，平均响应约 70ms，全程 0% 错误率；随着并发提升，吞吐保持稳定，后续可通过水平扩容 Provider 继续提升整体上限。',
    },
    highlights: [
      { title: '自定义二进制协议', detail: '魔数、版本、序列化类型、消息类型、RequestId 和 Body 长度组成协议头。' },
      { title: '粘包半包处理', detail: '基于 LengthFieldBasedFrameDecoder 按 Data Length 切分完整 RPC 帧。' },
      { title: '透明远程调用', detail: 'ByteBuddy 动态生成代理类，让 Consumer 像调用本地接口一样调用远程服务。' },
      { title: '服务治理能力', detail: 'RoundRobin、Random、Weighted、LeastActive、ConsistentHash 通过 SPI 扩展。' },
      { title: '容错与保护', detail: 'Failover/Failfast/Failsafe/Forking 配合滑动窗口熔断和令牌桶限流。' },
      { title: '服务预热', detail: '新实例逐步放量，避免冷启动时瞬间承接全部流量导致响应抖动。' },
      { title: '优雅停机与实例管理', detail: '实例下线时先从注册中心摘除，再等待请求处理完成，避免服务重启时直接打断流量。' },
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
        title: '优雅停机',
        detail: '直接 kill 进程最简单，但会让正在处理的请求失败。这里通过先摘除实例、停止接收新流量、等待存量请求结束，再关闭 Netty/EventLoop，减少重启抖动。',
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
        title: '优雅停机时的流量切换',
        detail: '如果实例还在注册列表里就直接停机，Consumer 仍可能选中它。处理方式是先把实例标记为下线并从发现列表剔除，再等一小段时间释放在途请求。',
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
      { label: '在线演示', href: 'http://rpc.wangshun.work', icon: Rocket },
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
      '基于 GitHub App 的自动化 PR 审查服务，也是一次完整的 vibe coding 实践。项目先和 Claude Code / Codex 讨论需求、模块边界和错误处理流程，再按收敛后的方案分段落地、持续迭代和修复。',
    why:
      '前两个项目解决的是“生成代码”和“服务通信”，这个项目想补上代码进入仓库前的质量关。同时也作为一次 vibe coding 实践：先和 Claude Code、Codex 来回讨论几版方案，明确 webhook、鉴权、GitHub API、AI Review、错误回写这几个模块，再按模块逐段实现。',
    metrics: [
      { value: 'async', label: '全链路异步 HTTP' },
      { value: '10min', label: 'Installation Token' },
      { value: '4', label: '审查维度' },
    ],
    processFlow: {
      title: '审查链路',
      steps: [
        { title: 'Webhook 触发', detail: '只处理 pull_request 的 opened / synchronize 事件。' },
        { title: '验签与鉴权', detail: '先做 HMAC 验签，再用 GitHub App JWT 换 Installation Token。' },
        { title: '拉取 Diff', detail: '通过 GitHub API 获取 PR diff，而不是 clone 整个仓库。' },
        { title: 'AI 审查', detail: '把 diff 和结构化 Prompt 送给 DeepSeek，聚焦四类问题。' },
        { title: '结果回写', detail: '成功时发布审查评论，失败时降级为友好提示，不阻塞流程。' },
      ],
    },
    boundary: {
      title: '当前能力边界',
      done: [
        'PR opened / synchronize 自动触发',
        'Webhook 验签 + GitHub App 鉴权',
        'PR 总评评论输出',
        'AI 异常时优雅降级',
      ],
      next: [
        'Inline comments 行级评论',
        'Checks API 更丰富的展示形式',
        '按 commit sha 缓存避免重复审查',
        '可配置的审查规则文件',
      ],
    },
    highlights: [
      { title: 'Webhook 安全验证', detail: '使用 HMAC-SHA256 和 compare_digest 校验 GitHub 请求来源。' },
      { title: 'GitHub App 鉴权', detail: 'RS256 私钥签发 JWT，再换取 Installation Access Token 调用 GitHub API。' },
      { title: '异步编排', detail: 'FastAPI + httpx async 拉取 diff、调用 API、创建评论，减少阻塞等待。' },
      { title: '结构化审查 Prompt', detail: '聚焦逻辑错误、安全漏洞、代码风格和性能问题四类检查。' },
      { title: 'Vibe Coding 工作流', detail: '先讨论需求和方案，再把改动拆成 webhook、auth、github api、reviewer、router 五段，让 Claude Code / Codex 按步骤实现。' },
      { title: '优雅降级', detail: 'AI 服务异常时发布可读提示，不阻塞 PR 流程。' },
      { title: '轻量部署', detail: '单服务适合 Zeabur/Railway/Heroku 等平台，通过环境变量完成配置。' },
    ],
    choices: [
      {
        title: 'GitHub App',
        detail: 'PAT 权限过大且每个仓库都要单独配置 Secret。GitHub App 可以按仓库安装、权限粒度更细，并用短期 Installation Token 调 GitHub API。',
      },
      {
        title: '先出方案再写代码',
        detail: '这次刻意没有一上来就让模型生成项目骨架，而是先把需求整理成 PRD，再讨论模块划分、接口输入输出、失败路径和部署方式。这样后面的生成更像按图施工，不容易越写越散。',
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
        title: '分段让 AI 落地',
        detail: '如果一次让模型同时写 webhook、鉴权、业务编排和评论模板，代码很容易耦合。这里按模块分段推进，每次只让它处理当前文件和当前职责，Review 成本更低。',
      },
      {
        title: '优雅降级',
        detail: 'PR 流程不能因为 AI 服务挂了就中断，所以没有做强制拦截，而是失败时回写提示评论，保留人工 Review 流程。',
      },
      {
        title: 'Claude Code / Codex 协作',
        detail: '先讨论几版方案，再让 Claude Code / Codex 按方案迭代实现。Claude Code 更适合整理步骤和收敛结构，Codex 更适合按明确任务补实现、改代码和跑验证。',
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
        title: '模块边界被 AI 写乱',
        detail: '一开始如果让模型自由发挥，它会把验签、业务解析、调用 GitHub API 和评论格式化混在一起。后来明确拆成 webhook_handler、github_auth、github_api、ai_reviewer、router 五个模块。',
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
        title: 'Vibe Coding 失控',
        detail: '如果不先定方案，AI 很容易边写边改，最后模块职责混乱。后来先让它输出方案、再让我确认，然后按 webhook -> auth -> github api -> ai reviewer -> router 五段逐步落地。',
      },
      {
        title: 'AI 改着改着偏题',
        detail: '让模型在已有代码上连续修改时，它有时会顺手改掉无关逻辑。后面我会明确限定“只改当前模块、不要动其他文件”，并在每一轮结束后人工 Review diff。',
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

const ciCdProject = {
  name: 'CI/CD 自动化部署',
  subtitle: 'GitHub Actions + Docker + 阿里云部署闭环',
  featured: false,
  icon: GitBranch,
  color: 'var(--color-tertiary)',
  tags: ['GitHub Actions', 'Docker', '阿里云 ACR', 'ECS', 'Self-hosted Runner', 'Nginx', 'FRP'],
  summary:
    'Push to master 后自动构建镜像、推送阿里云 ACR，并通过 Self-hosted Runner 部署到 ECS；同时保留 WSL + FRP 的低成本个人项目部署方案。',
  why:
    '项目从个人仓库迁移到 wangshun-china Organization 后，我希望把“提交代码到线上可访问”做成稳定流程，所以将构建、镜像发布、部署重启和模板沉淀统一纳入 CI/CD。',
  metrics: [
    { value: '5-8min', label: '完整上线耗时' },
    { value: '双链路', label: '阿里云直部署 / WSL + FRP' },
    { value: '模板化', label: 'Runner / FRP / Compose 脚本' },
  ],
  processFlow: {
    title: '部署链路',
    steps: pipeline.map((step) => ({ title: step, detail: '自动化部署链路中的关键节点。' })),
  },
  highlights: [
    { title: 'GitHub Actions 自动化', detail: 'Push to master 后自动安装依赖、构建前端、构建 Docker 镜像并推送到阿里云 ACR。' },
    { title: 'Self-hosted Runner', detail: 'Runner 部署在目标环境，负责拉取最新镜像并通过 Docker Compose 重启服务。' },
    { title: '阿里云直部署', detail: '适合简历站这类轻量前端和生产环境服务，链路短、访问稳定。' },
    { title: 'WSL + FRP 方案', detail: '重服务可运行在本地 WSL，阿里云只做公网入口和端口转发，降低低配服务器压力。' },
    { title: '模板沉淀', detail: '整理 Runner、FRP、Docker Compose、Nginx 和部署脚本模板，后续新项目可复用。' },
  ],
  choices: [
    {
      title: 'GitHub Actions',
      detail: '相比手动 SSH 上服务器执行命令，Actions 能把构建、推镜像、部署步骤固化成可追踪流程，减少人为漏操作。',
    },
    {
      title: '阿里云 ACR',
      detail: '镜像仓库和 ECS 同地域时拉取速度稳定，也能避免每次部署都在服务器上重新构建。',
    },
    {
      title: 'Self-hosted Runner',
      detail: '部署动作在目标环境内执行，不需要暴露服务器 SSH 到外部工作流，也便于复用本机 Docker 环境。',
    },
    {
      title: 'Docker Compose',
      detail: '个人项目服务数量有限，Compose 比 Kubernetes 更轻，适合快速描述端口、镜像、重启策略和网络。',
    },
    {
      title: 'FRP',
      detail: '本地 WSL 承载重服务，阿里云只保留公网入口，适合低成本演示和个人项目测试。',
    },
  ],
  pitfalls: [
    {
      title: '端口归属冲突',
      detail: 'FRP 远程端口和阿里云本机 Docker 服务不能同时占用 80，需要明确哪些服务直部署、哪些服务走穿透。',
    },
    {
      title: '服务器残留 Compose',
      detail: '旧部署文件中可能仍保留已删除服务，需要 docker compose up -d --remove-orphans 清理孤儿容器。',
    },
    {
      title: '低配 ECS 压力',
      detail: '重服务全部放阿里云会占用内存和 CPU，所以将轻量简历站放 ECS，重服务按需走 WSL + FRP。',
    },
    {
      title: '模板复用成本',
      detail: '不同项目端口、镜像名和环境变量不同，模板中保留变量入口，避免每个项目从零写部署文件。',
    },
  ],
  links: [
    { label: '部署模板', href: 'https://github.com/xixi-box/template', icon: Github },
  ],
}

const allProjects: any[] = [...projects, ciCdProject]
</script>

<style scoped>
.project-card {
  border-radius: 24px;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.project-featured {
  box-shadow: var(--shadow-md);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.project-summary-card {
  display: flex;
  min-height: 390px;
  flex-direction: column;
  padding: 1.25rem;
  border-radius: 18px;
  border: 1px solid var(--color-border);
}

.project-summary-card.project-featured {
  border: 2px solid rgba(217, 119, 87, 0.28);
  background: linear-gradient(135deg, #fff, rgba(217, 119, 87, 0.05));
}

.summary-card-head,
.modal-title-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.summary-icon {
  display: flex;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--color-accent-light);
}

.summary-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.summary-title-row h3 {
  color: var(--color-text);
  font-size: 1.45rem;
  font-weight: 800;
}

.summary-card-head p,
.modal-title-row p {
  margin-top: 0.15rem;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 0.86rem;
}

.summary-badge {
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 800;
}

.summary-text {
  margin-top: 0.85rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.65;
}

.availability-banner {
  max-width: 920px;
  margin: 1rem auto 0;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(217, 119, 87, 0.28);
  border-radius: 12px;
  background: linear-gradient(90deg, var(--color-accent-light), #fff);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.65;
  text-align: center;
}

.availability-banner strong {
  color: var(--color-accent);
}

.availability-note,
.modal-availability {
  margin-top: 0.7rem;
  padding: 0.6rem 0.75rem;
  border: 1px dashed rgba(217, 119, 87, 0.35);
  border-radius: 10px;
  background: rgba(217, 119, 87, 0.06);
  color: var(--color-accent);
  font-size: 0.82rem;
  line-height: 1.55;
}

.summary-tags,
.modal-tags,
.summary-actions,
.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.summary-tags {
  margin-top: 0.85rem;
}

.summary-points {
  display: grid;
  gap: 0.55rem;
  margin-top: 0.85rem;
}

.summary-point {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  line-height: 1.45;
}

.summary-point svg {
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.summary-actions {
  margin-top: auto;
  padding-top: 0.9rem;
}

.summary-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 38px;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: #fff;
  color: var(--color-text);
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  transition: border-color var(--transition-base), color var(--transition-base), background var(--transition-base);
}

.summary-link:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
  color: var(--color-accent);
}

.summary-detail-button {
  cursor: pointer;
}

.project-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(34, 34, 34, 0.52);
  backdrop-filter: blur(8px);
}

.project-modal {
  position: relative;
  width: min(85vw, 1180px);
  height: 88vh;
  overflow: hidden;
  border-radius: 20px;
  background: #fff;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  border-bottom: 1px solid var(--color-border-light);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
}

.modal-title-block {
  min-width: 0;
}

.modal-title-row h3 {
  color: var(--color-text);
  font-size: 1.35rem;
  font-weight: 800;
}

.modal-tags {
  margin-top: 0.45rem;
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-shrink: 0;
}

.modal-actions {
  display: flex;
  align-items: center;
  margin-top: 0;
}

.modal-close {
  display: flex;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: #fff;
  color: var(--color-text);
  cursor: pointer;
  transition: transform var(--transition-base), background var(--transition-base), color var(--transition-base);
}

.modal-close:hover {
  transform: scale(1.05);
  background: var(--color-accent);
  color: #fff;
}

.modal-body {
  height: calc(88vh - 94px);
  overflow-y: auto;
  padding: 1.25rem 1.6rem 1.8rem;
}

.modal-section {
  padding: 1.1rem;
  border: 1px solid var(--color-border-light);
  border-radius: 14px;
  background: #fff;
}

.modal-section + .modal-section {
  margin-top: 1rem;
}

.modal-section h4 {
  margin-bottom: 0.7rem;
  color: var(--color-accent);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0;
}

.modal-section p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.8;
}

.modal-section p + p {
  margin-top: 0.65rem;
}

.modal-metrics,
.modal-card-grid,
.modal-list-grid {
  display: grid;
  gap: 0.8rem;
}

.modal-metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.modal-card-grid,
.modal-list-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.modal-list-item {
  padding: 0.9rem;
  border-radius: 12px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-light);
}

.modal-list-item strong {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--color-text);
  font-size: 0.86rem;
  font-weight: 800;
}

.modal-list-item p {
  font-size: 0.82rem;
  line-height: 1.65;
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

.detail-box {
  padding: 1rem;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--color-border-light);
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

.flow-grid,
.strategy-grid,
.boundary-grid {
  display: grid;
  gap: 0.85rem;
}

.arrow-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 0.75rem;
}

.arrow-card {
  flex: 1 1 220px;
  min-width: 200px;
  padding: 0.9rem;
  border-radius: 12px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-light);
}

.arrow-step {
  margin-bottom: 0.45rem;
  color: var(--color-text);
  font-size: 0.88rem;
  font-weight: 800;
}

.arrow-card p,
.arrow-loop-note {
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  line-height: 1.65;
}

.arrow-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  flex: 0 0 20px;
}

.arrow-loop-note {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-accent-light), #fff);
  border: 1px dashed rgba(217, 119, 87, 0.35);
}

.flow-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.strategy-grid,
.boundary-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.flow-item,
.strategy-card,
.boundary-card {
  padding: 0.9rem;
  border-radius: 12px;
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border-light);
}

.flow-step,
.strategy-title,
.boundary-title {
  margin-bottom: 0.45rem;
  color: var(--color-text);
  font-size: 0.88rem;
  font-weight: 800;
}

.flow-item p,
.strategy-item span,
.detail-note,
.boundary-card li {
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  line-height: 1.65;
}

.strategy-list {
  display: grid;
  gap: 0.7rem;
}

.strategy-item {
  display: grid;
  gap: 0.2rem;
}

.strategy-item strong {
  color: var(--color-text);
  font-size: 0.82rem;
  font-weight: 800;
}

.benchmark-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
}

.benchmark-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 480px;
}

.benchmark-table th,
.benchmark-table td {
  padding: 0.7rem 0.8rem;
  text-align: left;
  font-size: 0.82rem;
  border-bottom: 1px solid var(--color-border-light);
}

.benchmark-table th {
  background: var(--color-bg-alt);
  color: var(--color-text);
  font-weight: 800;
}

.benchmark-table td {
  color: var(--color-text-secondary);
}

.detail-note {
  margin-top: 0.75rem;
}

.boundary-card ul {
  padding-left: 1rem;
}

.boundary-card li + li {
  margin-top: 0.4rem;
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

.summary-highlight-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.detail-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.25rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: #fff;
  color: var(--color-accent);
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: border-color var(--transition-base), background var(--transition-base);
}

.detail-toggle:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.detail-toggle svg {
  transition: transform var(--transition-base);
}

.project-detail-panel {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--color-border);
}

.rotate-90 {
  transform: rotate(90deg);
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

.side-more {
  margin-top: 0.9rem;
}

.side-more summary {
  cursor: pointer;
  color: var(--color-accent);
  font-size: 0.84rem;
  font-weight: 800;
  list-style: none;
}

.side-more summary::-webkit-details-marker {
  display: none;
}

.side-more summary::after {
  content: '+';
  margin-left: 0.4rem;
}

.side-more[open] summary::after {
  content: '-';
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

.deploy-summary {
  display: grid;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.86rem;
  line-height: 1.7;
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
  .project-grid {
    grid-template-columns: 1fr;
    padding-right: 1.25rem;
    padding-left: 1.25rem;
  }

  .project-summary-card {
    min-height: auto;
  }

  .project-overlay {
    align-items: stretch;
    padding: 0;
  }

  .project-modal {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }

  .modal-header {
    align-items: flex-start;
    padding: 0.85rem 1rem;
  }

  .modal-header-actions {
    align-items: flex-start;
  }

  .modal-title-row h3 {
    font-size: 1.25rem;
  }

  .modal-close {
    width: 42px;
    height: 42px;
  }

  .modal-body {
    height: calc(100vh - 106px);
    padding: 1rem;
  }

  .modal-metrics,
  .modal-card-grid,
  .modal-list-grid,
  .flow-grid,
  .strategy-grid,
  .boundary-grid {
    grid-template-columns: 1fr;
  }

  .pipeline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .deploy-grid {
    grid-template-columns: 1fr;
  }
}
</style>
