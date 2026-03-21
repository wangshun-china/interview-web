<template>
  <section id="projects" class="pt-8 pb-16 relative">
    <!-- Section header -->
    <div class="container mx-auto px-4 mb-8">
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

    <div class="container mx-auto px-4 space-y-10">
      <!-- ==================== Project 1: AI Coder (第一个项目) ==================== -->
      <div class="project-featured card card-elevated rounded-3xl overflow-hidden border-2 border-[var(--color-accent-light)] relative">
        <!-- Featured badge -->
        <div class="absolute top-6 right-6 z-10">
          <span class="px-4 py-1.5 bg-[var(--color-accent-light)] border border-[var(--color-accent)] text-[var(--color-accent)] text-sm rounded-full font-semibold">
            起点项目
          </span>
        </div>

        <div class="grid lg:grid-cols-2 gap-0">
          <!-- Left: Project Info -->
          <div class="p-8 lg:p-10">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center">
                <Cloud class="w-7 h-7 text-[var(--color-tertiary)]" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-[var(--color-text)]">AI Coder</h3>
                <p class="text-[var(--color-tertiary)] text-sm font-mono">AI 代码生成与预览平台</p>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag text-sm">Spring Boot 3</span>
              <span class="tag text-sm">LangChain4j</span>
              <span class="tag text-sm">Qwen 3.5</span>
              <span class="tag text-sm">Dubbo 3</span>
              <span class="tag text-sm">MyBatis-Flex</span>
              <span class="tag text-sm">Vue 3</span>
            </div>

            <!-- 项目背景 -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Lightbulb class="w-5 h-5 text-[var(--color-accent)]" />
                <span class="text-sm font-semibold text-[var(--color-accent)]">为什么做这个项目</span>
              </div>
              <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                当时在学 LangChain4j，想做一个能实际用起来的东西。输入一句话就能生成前端代码，这个想法挺有意思的。做这个项目的过程中，我开始思考：多个服务之间怎么通信？配置怎么管理？服务挂了怎么办？这些问题让我萌生了深入研究 RPC 架构的想法，也就有了后面 Lumina-RPC 这个项目。
              </p>
            </div>

            <!-- 技术选型 -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Code2 class="w-5 h-5 text-[var(--color-secondary)]" />
                <span class="text-sm font-semibold text-[var(--color-secondary)]">技术选型与原因</span>
              </div>
              <div class="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p><span class="text-[var(--color-text)] font-medium">LangChain4j：</span>Java 生态里做 AI 应用最成熟的框架，Tool Calling、对话记忆这些开箱即用。</p>
                <p><span class="text-[var(--color-text)] font-medium">Qwen 3.5 Max：</span>阿里的模型，代码生成能力不错，调用成本低。</p>
                <p><span class="text-[var(--color-text)] font-medium">Dubbo 3 + Nacos：</span>服务之间需要通信，Dubbo 性能好，Nacos 同时搞定注册和配置。</p>
                <p><span class="text-[var(--color-text)] font-medium">MyBatis-Flex：</span>比 MyBatis-Plus 更轻量，性能更好，支持多表关联查询。</p>
                <p><span class="text-[var(--color-text)] font-medium">Redis + Caffeine：</span>热点数据放本地缓存更快，其他放 Redis 共享，两层缓存提升性能。</p>
                <p><span class="text-[var(--color-text)] font-medium">Grafana + Prometheus：</span>监控 AI 模型调用情况，QPS、响应时间、Token 消耗这些指标。</p>
                <p><span class="text-[var(--color-text)] font-medium">SSE 流式输出：</span>AI 生成代码比较慢，流式输出让用户能看到进度，不用傻等。</p>
              </div>
            </div>

            <!-- Features -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <CheckCircle class="w-5 h-5 text-[var(--color-tertiary)]" />
                <span class="text-sm font-semibold text-[var(--color-tertiary)]">实现了哪些功能</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">自然语言生成代码</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">用户输入需求，AI 通过 Tool Calling 自动创建文件、写代码</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">可视化编辑</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">选中页面元素，通过对话修改，iframe 通信实现元素定位</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">一键部署</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">自动构建、部署、截图、生成分享链接，Docker + Nginx</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">多轮对话修改</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">Redis 存储对话历史，AI 能记住上下文，支持连续修改</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">安全防护</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">Guardrail 检测恶意输入，接口限流防刷，Docker 沙箱隔离执行</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">源码下载</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">生成的代码能下载完整项目源码，支持二次开发</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Links -->
            <div class="flex flex-wrap gap-3">
              <a
                href="http://120.26.186.0:8888"
                target="_blank"
                class="btn btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-sm"
              >
                <Rocket class="w-4 h-4" />
                <span>在线体验</span>
                <ExternalLink class="w-3 h-3" />
              </a>
              <a
                href="https://github.com/xixi-box/ai-code"
                target="_blank"
                class="btn btn-outline inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-sm"
              >
                <Github class="w-4 h-4" />
                <span>GitHub 源码</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </div>
          </div>

          <!-- Right: Debug Records -->
          <div class="p-8 lg:p-10 bg-[var(--color-bg-alt)] border-l border-[var(--color-border-light)]">
            <div class="flex items-center gap-2 mb-6">
              <Bug class="w-5 h-5 text-[#C4613F]" />
              <span class="text-lg font-semibold text-[var(--color-text)]">踩坑记录</span>
            </div>

            <div class="space-y-4">
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">AI 对话上下文丢失</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">问题：</span>微服务是无状态的，每次请求可能打到不同实例，AI 的对话历史就丢了。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>用 Redis 存对话历史，key 是 userId+appId，每次请求先从 Redis 加载历史消息。同时限制最多保留 20 条，避免 Token 超限。
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">生成代码的安全问题</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">问题：</span>AI 生成的代码可能有恶意操作，直接跑在服务器上太危险。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>Docker 容器隔离执行，限制了 CPU 和内存，也不让访问外网。跑出异常就抓堆栈扔回给 AI 自己修。
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">AI 工具调用死循环</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">问题：</span>有时候 AI 会反复调用同一个工具，停不下来，Token 烧完了也没生成出东西。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>加了最大步数限制，超过 50 步就强制退出。同时做了个 ExitTool，AI 觉得干完了就调这个退出。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== Project 2: Lumina-RPC ==================== -->
      <div class="project-card card card-elevated rounded-3xl overflow-hidden border border-[var(--color-border)]">
        <div class="grid lg:grid-cols-2 gap-0">
          <!-- Left: Project Info -->
          <div class="p-8 lg:p-10">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center">
                <Rocket class="w-7 h-7 text-[var(--color-accent)]" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-[var(--color-text)]">Lumina-RPC</h3>
                <p class="text-[var(--color-secondary)] text-sm font-mono">轻量级 RPC 框架</p>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag text-sm">Java 21</span>
              <span class="tag text-sm">Netty 4.1</span>
              <span class="tag text-sm">Kryo</span>
              <span class="tag text-sm">ByteBuddy</span>
              <span class="tag text-sm">MySQL 8.0</span>
              <span class="tag text-sm">Vue 3</span>
            </div>

            <!-- 项目背景 -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Lightbulb class="w-5 h-5 text-[var(--color-accent)]" />
                <span class="text-sm font-semibold text-[var(--color-accent)]">为什么做这个项目</span>
              </div>
              <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                做 AI Coder 的时候，用 Dubbo 做服务通信，但我不太理解它底层是怎么工作的。就想自己从头写一个 RPC 框架，搞清楚服务发现、负载均衡、序列化这些到底怎么实现的。写完这个之后，再回头看 Dubbo 源码就轻松多了。
              </p>
            </div>

            <!-- 技术选型 -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Code2 class="w-5 h-5 text-[var(--color-secondary)]" />
                <span class="text-sm font-semibold text-[var(--color-secondary)]">技术选型与原因</span>
              </div>
              <div class="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p><span class="text-[var(--color-text)] font-medium">Netty：</span>做网络通信最常用的框架，NIO 模型性能好，封装了各种边界情况。</p>
                <p><span class="text-[var(--color-text)] font-medium">自研注册中心：</span>Spring Boot + MySQL 实现，控制面和业务解耦，不依赖 Nacos 等第三方组件。</p>
                <p><span class="text-[var(--color-text)] font-medium">多种序列化：</span>支持 JSON、Kryo、Protostuff 三种，默认 Kryo，比 JSON 快 3-5 倍，通过 SPI 可扩展。</p>
                <p><span class="text-[var(--color-text)] font-medium">ByteBuddy：</span>动态代理比 JDK 原生的快，能在运行时生成代理类，让调用远程方法像调本地方法一样。</p>
                <p><span class="text-[var(--color-text)] font-medium">自定义协议：</span>自己设计协议头，包含魔数、版本、消息类型、数据长度，解决 TCP 粘包问题。</p>
                <p><span class="text-[var(--color-text)] font-medium">Vue 3 + Vue Flow：</span>前端需要一个拓扑图展示服务调用关系，Vue Flow 刚好能用。</p>
              </div>
            </div>

            <!-- Features -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <CheckCircle class="w-5 h-5 text-[var(--color-accent)]" />
                <span class="text-sm font-semibold text-[var(--color-accent)]">实现了哪些功能</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">服务注册发现</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">Provider 启动向控制面注册，Consumer 从控制面拉取服务列表，本地缓存提高可用性</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">负载均衡</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">轮询、随机、加权、最少活跃调用、一致性哈希，通过 SPI 可以扩展</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">熔断限流</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">滑动窗口统计错误率，超过阈值就熔断；令牌桶限流防止服务被打挂</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">Mock 引擎</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">测试的时候可以配置返回假数据，支持短路模式和篡改模式</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">链路追踪</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">每个请求生成 TraceId，Span 信息上报到控制面，前端展示瀑布图</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">集群容错</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">失败重试、快速失败、忽略失败、并行调用，按场景选择</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">优雅关闭</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">控制面下发关闭信号，Provider 停止接收新请求，等现有请求处理完再下线</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 性能测试数据 -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <BarChart3 class="w-5 h-5 text-[var(--color-accent)]" />
                <span class="text-sm font-semibold text-[var(--color-accent)]">JMeter 压测数据</span>
              </div>
              <div class="text-xs text-[var(--color-text-muted)] mb-3">
                测试环境：Windows 11 / AMD Ryzen 9 7845HX / 32GB DDR5 / JDK 21 / 本地 localhost<br/>
                测试接口：EngineService.getWarpStatus() 和 RadarService.scanEnemies()，无延迟立即返回
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-[var(--color-border)]">
                      <th class="py-2 px-2 text-left text-[var(--color-text-secondary)]">线程数</th>
                      <th class="py-2 px-2 text-left text-[var(--color-text-secondary)]">QPS</th>
                      <th class="py-2 px-2 text-left text-[var(--color-text-secondary)]">平均响应</th>
                      <th class="py-2 px-2 text-left text-[var(--color-text-secondary)]">P90</th>
                      <th class="py-2 px-2 text-left text-[var(--color-text-secondary)]">P95</th>
                      <th class="py-2 px-2 text-left text-[var(--color-text-secondary)]">P99</th>
                      <th class="py-2 px-2 text-left text-[var(--color-text-secondary)]">错误率</th>
                    </tr>
                  </thead>
                  <tbody class="text-[var(--color-text)]">
                    <tr class="border-b border-[var(--color-border-light)]">
                      <td class="py-2 px-2">500</td>
                      <td class="py-2 px-2 font-semibold text-[var(--color-tertiary)]">6863</td>
                      <td class="py-2 px-2">70ms</td>
                      <td class="py-2 px-2">55ms</td>
                      <td class="py-2 px-2">66ms</td>
                      <td class="py-2 px-2">671ms</td>
                      <td class="py-2 px-2 text-[var(--color-tertiary)]">0%</td>
                    </tr>
                    <tr class="border-b border-[var(--color-border-light)]">
                      <td class="py-2 px-2">1000</td>
                      <td class="py-2 px-2 font-semibold text-[var(--color-tertiary)]">6753</td>
                      <td class="py-2 px-2">71ms</td>
                      <td class="py-2 px-2">83ms</td>
                      <td class="py-2 px-2">169ms</td>
                      <td class="py-2 px-2">1007ms</td>
                      <td class="py-2 px-2 text-[var(--color-tertiary)]">0%</td>
                    </tr>
                    <tr class="border-b border-[var(--color-border-light)]">
                      <td class="py-2 px-2">2000</td>
                      <td class="py-2 px-2 font-semibold text-[var(--color-tertiary)]">6811</td>
                      <td class="py-2 px-2">70ms</td>
                      <td class="py-2 px-2">65ms</td>
                      <td class="py-2 px-2">75ms</td>
                      <td class="py-2 px-2">857ms</td>
                      <td class="py-2 px-2 text-[var(--color-tertiary)]">0%</td>
                    </tr>
                    <tr class="border-b border-[var(--color-border-light)]">
                      <td class="py-2 px-2">3000</td>
                      <td class="py-2 px-2 font-semibold text-[var(--color-tertiary)]">6793</td>
                      <td class="py-2 px-2">70ms</td>
                      <td class="py-2 px-2">70ms</td>
                      <td class="py-2 px-2">91ms</td>
                      <td class="py-2 px-2">836ms</td>
                      <td class="py-2 px-2 text-[var(--color-tertiary)]">0%</td>
                    </tr>
                    <tr class="border-b border-[var(--color-border-light)]">
                      <td class="py-2 px-2">5000</td>
                      <td class="py-2 px-2 font-semibold text-[var(--color-tertiary)]">7185</td>
                      <td class="py-2 px-2">66ms</td>
                      <td class="py-2 px-2">66ms</td>
                      <td class="py-2 px-2">84ms</td>
                      <td class="py-2 px-2">768ms</td>
                      <td class="py-2 px-2 text-[var(--color-tertiary)]">0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-xs text-[var(--color-text-muted)] mt-2">
                5000 线程下 QPS 约 7100，平均响应 66ms，错误率始终为 0%。测试调用的是真实 RPC 方法，无延迟立即返回模拟数据。<br/>
                <span class="text-[var(--color-text-secondary)]">注：测试中观察到 JMeter 实际活跃线程数约 500。因为响应快（~70ms），线程完成请求后立即进入下一轮，并发数不会持续达到配置的最大值。所以虽然 QPS 未达拐点，再增加线程意义不大——上述数据更准确反映的是"每秒发起的请求数"而非真实并发连接数。目前瓶颈更多的是 JMeter 客户端本身。</span>
              </p>
            </div>

            <!-- Links -->
            <div class="flex flex-wrap gap-3">
              <a
                href="http://120.26.186.0:3000"
                target="_blank"
                class="btn btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-sm"
              >
                <Rocket class="w-4 h-4" />
                <span>监控面板</span>
                <ExternalLink class="w-3 h-3" />
              </a>
              <a
                href="https://github.com/xixi-box/lumina-rpc"
                target="_blank"
                class="btn btn-outline inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-sm"
              >
                <Github class="w-4 h-4" />
                <span>GitHub 源码</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </div>
          </div>

          <!-- Right: Debug Records -->
          <div class="p-8 lg:p-10 bg-[var(--color-bg-alt)] border-l border-[var(--color-border-light)]">
            <div class="flex items-center gap-2 mb-6">
              <Bug class="w-5 h-5 text-[#C4613F]" />
              <span class="text-lg font-semibold text-[var(--color-text)]">踩坑记录</span>
            </div>

            <div class="space-y-4">
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">TCP 粘包/半包</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">问题：</span>Netty 发消息有时候两条粘一起，有时候一条消息分成两半，解码就报错。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>协议头里加了 4 字节的 Data Length，用 Netty 的 LengthFieldBasedFrameDecoder 按长度切分，保证每次读到完整的消息。
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">Spring 启动顺序问题</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">问题：</span>在 BeanPostProcessor 里启动 Netty，结果 Spring 容器还没初始化完，服务就注册上了，各种 Bean 注入失败。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>监听 ContextRefreshedEvent，等 Spring 容器完全启动后再启动网络层、注册服务。
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">异步转同步</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">问题：</span>Netty 是异步的，发送请求后不知道什么时候收到响应，业务代码怎么同步等待？
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>发请求时创建一个 CompletableFuture 存起来，收到响应后按 requestId 找到对应的 Future 调用 complete()，业务层 get() 阻塞等待。
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">泛型序列化失败</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">问题：</span>控制面没有引入业务包，Jackson 反序列化时找不到具体的 Class，直接报错。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>catch 住异常，降级成 LinkedHashMap，前端渲染 JSON 没问题，不影响大盘展示。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== Project 3: AutoGuard AI ==================== -->
      <div class="project-card card card-elevated rounded-3xl overflow-hidden border border-[var(--color-border)]">
        <div class="grid lg:grid-cols-2 gap-0">
          <!-- Left: Project Info -->
          <div class="p-8 lg:p-10">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center">
                <Shield class="w-7 h-7 text-[var(--color-secondary)]" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-[var(--color-text)]">AutoGuard AI</h3>
                <p class="text-[var(--color-secondary)] text-sm font-mono">GitHub 智能代码审查</p>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag text-sm">FastAPI</span>
              <span class="tag text-sm">Python</span>
              <span class="tag text-sm">GitHub App</span>
              <span class="tag text-sm">DeepSeek</span>
              <span class="tag text-sm">JWT</span>
              <span class="tag text-sm">AST</span>
            </div>

            <!-- 项目背景 -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Lightbulb class="w-5 h-5 text-[var(--color-secondary)]" />
                <span class="text-sm font-semibold text-[var(--color-secondary)]">为什么做这个项目</span>
              </div>
              <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                有了 AI Coder 和 Lumina-RPC，代码能自动生成了，也能自动部署了，那能不能自动审查代码？正好我想彻底从零体验一次 Vibe Coding——我和 Gemini 3.1 Pro、GPT 5.4 Thinking 讨论需求，代码几乎全部由 AI 编写。另外想嵌入到 GitHub 工作流里，就学了下 GitHub App 开发。
              </p>
            </div>

            <!-- 部署说明 -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Cloud class="w-5 h-5 text-[var(--color-tertiary)]" />
                <span class="text-sm font-semibold text-[var(--color-tertiary)]">部署说明</span>
              </div>
              <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                这个项目部署在 Zeabur 上。本来想把三个项目都放 Zeabur，但免费额度有限，另外两个项目比较重（微服务多、依赖 MySQL），就放到阿里云 ECS 了。AutoGuard 是个轻量的单服务，Zeabur 免费额度够用。
              </p>
            </div>

            <!-- 技术选型 -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Code2 class="w-5 h-5 text-[var(--color-accent)]" />
                <span class="text-sm font-semibold text-[var(--color-accent)]">技术选型与原因</span>
              </div>
              <div class="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p><span class="text-[var(--color-text)] font-medium">FastAPI：</span>Python 写 API 很快，异步性能也不错，适合这种轻量服务。</p>
                <p><span class="text-[var(--color-text)] font-medium">GitHub App：</span>比 Personal Access Token 安全，能做到"一次安装、所有仓库生效"，不用每个仓库配 Secret。</p>
                <p><span class="text-[var(--color-text)] font-medium">JWT + Installation Token：</span>GitHub App 鉴权标准流程，私钥签名换临时 Token，权限可控。</p>
                <p><span class="text-[var(--color-text)] font-medium">DeepSeek：</span>国产模型便宜，代码理解能力够用，调用成本比 GPT 低很多。</p>
              </div>
            </div>

            <!-- Features -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <CheckCircle class="w-5 h-5 text-[var(--color-secondary)]" />
                <span class="text-sm font-semibold text-[var(--color-secondary)]">实现了哪些功能</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">自动触发审查</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">PR 创建或更新时，Webhook 通知服务，自动拉取 diff 分析</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">AST 代码分析</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">提取变更的函数、类，只把相关代码喂给 AI，省 Token</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">生成审查评论</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">AI 分析后生成评论，直接发到 PR 的 Review 里</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                  <Check class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span class="text-sm font-medium text-[var(--color-text)]">安全检测</span>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">让 AI 重点检查 SQL 注入、XSS、敏感信息泄露等问题</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Links -->
            <div class="flex flex-wrap gap-3">
              <a
                href="https://github.com/xixi-box/AutoGuard-AI-Reviewer"
                target="_blank"
                class="btn btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-sm"
              >
                <Github class="w-4 h-4" />
                <span>GitHub 源码</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </div>
          </div>

          <!-- Right: Debug Records -->
          <div class="p-8 lg:p-10 bg-[var(--color-bg-alt)] border-l border-[var(--color-border-light)]">
            <div class="flex items-center gap-2 mb-6">
              <Bug class="w-5 h-5 text-[#C4613F]" />
              <span class="text-lg font-semibold text-[var(--color-text)]">踩坑记录</span>
            </div>

            <div class="space-y-4">
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">GitHub App 鉴权</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">问题：</span>一开始用 Personal Access Token，但权限太大，而且每个仓库都要配置 Secret，很麻烦。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>换成 GitHub App 模式。私钥用 RS256 算法签名生成 JWT，再用 JWT 换 Installation Token，权限粒度更细，而且一次安装所有仓库都能用。
                </p>
              </div>

              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">Token 消耗太大</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">问题：</span>直接把整个 PR 的代码丢给 AI，Token 消耗很大，而且 AI 容易说一堆废话。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>用 AST 解析代码，只提取变更的函数和相关的上下文。写 Prompt 的时候明确要求只输出关键问题，不要废话。
                </p>
              </div>
            </div>

            <!-- Vibe Coding 说明 -->
            <div class="mt-6 p-4 rounded-xl bg-gradient-to-r from-[var(--color-accent-light)]/30 to-transparent border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Zap class="w-4 h-4 text-[var(--color-accent)]" />
                <span class="text-sm font-semibold text-[var(--color-accent)]">Vibe Coding 工作流</span>
              </div>
              <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                这个项目是我和 <span class="text-[var(--color-accent)]">Gemini 3.1 Pro</span>、<span class="text-[var(--color-secondary)]">GPT 5.4 Thinking</span> 讨论需求后，代码几乎全部由 AI 编写的。我负责确定技术方案、Review 代码、调试问题，AI 负责写具体实现。整个过程体验下来，感觉 AI 写代码确实快，但架构设计、问题排查还是需要人来把关。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== CI/CD Pipeline Section ==================== -->
      <div class="card rounded-3xl border border-[var(--color-border)] p-8 lg:p-10">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center">
            <GitBranch class="w-6 h-6 text-[var(--color-tertiary)]" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-[var(--color-text)]">CI/CD 自动化部署</h3>
            <p class="text-[var(--color-text-muted)] text-sm">Push to Master 自动部署，5-8 分钟上线</p>
          </div>
        </div>

        <!-- Pipeline Flow -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div class="flex items-center gap-3 px-5 py-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
            <Github class="w-5 h-5 text-[var(--color-text-secondary)]" />
            <span class="text-[var(--color-text-secondary)] font-medium">Push to Master</span>
          </div>
          <ChevronRight class="w-5 h-5 text-[var(--color-border)] rotate-90 md:rotate-0" />
          <div class="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#EDE7DF] border border-[var(--color-border)]">
            <Zap class="w-5 h-5 text-[var(--color-secondary)]" />
            <span class="text-[var(--color-secondary)] font-medium">GitHub Actions</span>
          </div>
          <ChevronRight class="w-5 h-5 text-[var(--color-border)] rotate-90 md:rotate-0" />
          <div class="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#F5E6DC] border border-[var(--color-border)]">
            <Box class="w-5 h-5 text-[var(--color-accent)]" />
            <span class="text-[var(--color-accent)] font-medium">Docker Build</span>
          </div>
          <ChevronRight class="w-5 h-5 text-[var(--color-border)] rotate-90 md:rotate-0" />
          <div class="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#E5E0ED] border border-[var(--color-border)]">
            <CloudIcon class="w-5 h-5 text-[#7B5EA0]" />
            <span class="text-[#7B5EA0] font-medium">阿里云 ACR</span>
          </div>
          <ChevronRight class="w-5 h-5 text-[var(--color-border)] rotate-90 md:rotate-0" />
          <div class="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#E5EDE5] border border-[var(--color-border)]">
            <Server class="w-5 h-5 text-[var(--color-tertiary)]" />
            <span class="text-[var(--color-tertiary)] font-medium">阿里云 ECS</span>
          </div>
        </div>

        <!-- AI Workflow -->
        <div class="p-4 rounded-xl bg-gradient-to-r from-[var(--color-accent-light)]/30 to-[var(--color-bg-alt)] border border-[var(--color-border)]">
          <div class="flex items-center gap-2 mb-3">
            <Zap class="w-5 h-5 text-[var(--color-accent)]" />
            <span class="text-sm font-semibold text-[var(--color-accent)]">AI 辅助开发工作流</span>
          </div>
          <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
            这三个项目都是用 AI 辅助开发的。我的工作流大概是这样：
          </p>
          <div class="grid md:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-lg bg-white border border-[var(--color-border-light)]">
              <div class="font-semibold text-[var(--color-text)] mb-1">1. 需求讨论</div>
              <div class="text-[var(--color-text-muted)]">和 Gemini 3.1 Pro 或 GPT 5.4 Thinking 讨论需求，确定技术方案</div>
            </div>
            <div class="p-3 rounded-lg bg-white border border-[var(--color-border-light)]">
              <div class="font-semibold text-[var(--color-text)] mb-1">2. 代码实现</div>
              <div class="text-[var(--color-text-muted)]">我和 Claude Code / Codex 一起写代码、review 和 debug</div>
            </div>
            <div class="p-3 rounded-lg bg-white border border-[var(--color-border-light)]">
              <div class="font-semibold text-[var(--color-text)] mb-1">3. 自动化部署</div>
              <div class="text-[var(--color-text-muted)]">GitHub Actions 自动构建部署，DeepSeek 做代码审查</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Rocket, Shield, Cloud, ExternalLink, Github, Check, Zap, Code2,
  Bug, AlertTriangle, GitBranch, Box, Server, ChevronRight,
  Layers, Lightbulb, CheckCircle, BarChart3
} from 'lucide-vue-next'

const CloudIcon = Cloud
</script>

<style scoped>
.project-featured,
.project-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>