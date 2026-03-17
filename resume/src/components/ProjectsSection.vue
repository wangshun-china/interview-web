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
        <span class="gradient-text">核心项目展厅</span>
      </h2>
      <p class="text-center text-[var(--color-text-muted)] text-lg">Project Showcase</p>
    </div>

    <div class="container mx-auto px-4 space-y-10">
      <!-- ==================== Project 1: Lumina-RPC (C位项目) ==================== -->
      <div class="project-featured card card-elevated rounded-3xl overflow-hidden border-2 border-[var(--color-accent-light)] relative">
        <!-- Featured badge -->
        <div class="absolute top-6 right-6 z-10">
          <span class="px-4 py-1.5 bg-[var(--color-accent-light)] border border-[var(--color-accent)] text-[var(--color-accent)] text-sm rounded-full font-semibold">
            C位项目
          </span>
        </div>

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
                <p class="text-[var(--color-secondary)] text-sm font-mono">面向可观测性的轻量 RPC 框架</p>
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="tag text-sm">Java 21</span>
              <span class="tag text-sm">Spring Boot 3.3</span>
              <span class="tag text-sm">Netty 4.1</span>
              <span class="tag text-sm">ByteBuddy</span>
              <span class="tag text-sm">Vue 3</span>
              <span class="tag text-sm">MySQL 8.0</span>
            </div>

            <!-- Description -->
            <p class="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              一个包含「核心通信 SDK」、「控制面」与「监控面板」的轻量 RPC 框架。从零实现了完整的 RPC 通信层，包括自定义协议、负载均衡、Mock 引擎、熔断限流等特性。采用控制面/数据面分离架构，已部署到阿里云 ECS 运行。
            </p>

            <!-- Architecture -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Layers class="w-5 h-5 text-[var(--color-accent)]" />
                <span class="text-sm font-semibold text-[var(--color-accent)]">控制面/数据面分离架构</span>
              </div>
              <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                数据面负责 RPC 通信、负载均衡、Mock 拦截、熔断限流；控制面管理服务元数据、Mock 规则、保护配置、链路数据。符合云原生设计理念，控制逻辑与数据转发解耦，便于独立扩展和运维。
              </p>
            </div>

            <!-- Features -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">自定义 RPC 协议</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">17字节协议头设计，解决 TCP 粘包/半包问题</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">多策略负载均衡</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">5种策略（轮询、随机、加权、最少活跃、一致性哈希）</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">Mock 引擎</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">SHORT_CIRCUIT 短路 + TAMPER 篡改双模式</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">熔断限流保护</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">滑动窗口熔断器 + 令牌桶限流器，动态配置</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">分布式链路追踪</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">Span 收集与瀑布图可视化，支持 Trace ID 传递</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">集群容错策略</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">Failover/Failfast/Failsafe/Forking 4种策略</p>
                </div>
              </div>
            </div>

            <!-- Performance -->
            <div class="grid grid-cols-4 gap-3 mb-6">
              <div class="text-center p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
                <div class="text-xl font-bold text-[var(--color-accent)]">&lt;10ms</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1">RPC 调用</div>
              </div>
              <div class="text-center p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
                <div class="text-xl font-bold text-[var(--color-accent)]">30s</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1">心跳间隔</div>
              </div>
              <div class="text-center p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
                <div class="text-xl font-bold text-[var(--color-accent)]">90s</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1">服务过期</div>
              </div>
              <div class="text-center p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
                <div class="text-xl font-bold text-[var(--color-accent)]">ms级</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1">Mock 生效</div>
              </div>
            </div>

            <!-- Action -->
            <a
              href="http://120.26.186.0:3000"
              target="_blank"
              class="btn btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium"
            >
              <Rocket class="w-5 h-5" />
              <span>进入监控面板</span>
              <ExternalLink class="w-4 h-4" />
            </a>
          </div>

          <!-- Right: Debug Records -->
          <div class="p-8 lg:p-10 bg-[var(--color-bg-alt)] border-l border-[var(--color-border-light)]">
            <div class="flex items-center gap-2 mb-6">
              <Bug class="w-5 h-5 text-[#C4613F]" />
              <span class="text-lg font-semibold text-[var(--color-text)]">Debug 记录</span>
              <span class="text-xs text-[var(--color-text-muted)] ml-2">踩坑与解决方案</span>
            </div>

            <div class="space-y-4">
              <!-- Debug 1 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">跨进程泛型擦除 (Type Erasure) 灾难</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>控制面发起泛化调用时，由于未引入业务包，Jackson 遇到 @class 标签抛出 InvalidTypeIdException，导致整个调用链路崩溃。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>重写 Jackson 序列化器，引入"容错降级机制"——在缺失 Class 定义的进程中，自动捕获异常并将复杂对象安全降级为 LinkedHashMap，完美支撑前端大盘的 JSON 渲染，实现了跨进程的泛型兼容。
                </p>
              </div>

              <!-- Debug 2 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">Spring 生命周期循环死锁</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>在 BeanPostProcessor 中强行启动 Netty 并注册服务，导致 Spring 提前初始化引发上下文崩溃，整个应用无法启动。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>引入延迟暴露机制，在 Bean 实例化阶段仅做内存缓存，监听 ContextRefreshedEvent 事件在容器完全就绪后拉起网络层，实现了与 Spring Boot 的完美无损整合。
                </p>
              </div>

              <!-- Debug 3 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">TCP 粘包/半包问题</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>Netty 传输中多条消息粘在一起或消息不完整，导致解码失败、调用异常。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>自定义 17 字节协议头，包含 4 字节 Data Length 字段。使用 Netty 的 LengthFieldBasedFrameDecoder 自动截取完整帧，彻底解决粘包/半包问题。
                </p>
              </div>

              <!-- Debug 4 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">异步转同步的 Future 管理</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>Netty 是异步框架，但业务代码需要同步返回结果，如何优雅地等待响应？
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>使用 CompletableFuture 实现异步转同步。发送请求时注册 pendingRequest，收到响应时通过 requestId 找到对应 Future 并 complete，业务层通过 future.get() 阻塞等待结果。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== Project 2: AutoGuard AI ==================== -->
      <div class="project-card card card-elevated rounded-3xl overflow-hidden border border-[var(--color-border)]">
        <div class="grid lg:grid-cols-2 gap-0">
          <!-- Left: Debug Records (面试官关注问题解决能力) -->
          <div class="p-8 lg:p-10 bg-[var(--color-bg-alt)] order-2 lg:order-1">
            <div class="flex items-center gap-2 mb-6">
              <Bug class="w-5 h-5 text-[#C4613F]" />
              <span class="text-lg font-semibold text-[var(--color-text)]">Debug 记录</span>
              <span class="text-xs text-[var(--color-text-muted)] ml-2">核心难点攻坚</span>
            </div>

            <div class="space-y-4">
              <!-- Debug 1 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">GitHub App 鉴权与全局效能阻碍</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>传统的单仓库 GitHub Actions 脚本难以实现组织级复用，且存在 Token 易过期、权限过大问题。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>采用最高阶的 GitHub App 模式架构。实现基于 RS256 算法的 JWT 动态签名与 Installation Token 实时交换机制，做到了极简的"一次安装、全局仓库生效"的 SaaS 化底座体验。
                </p>
              </div>

              <!-- Debug 2 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">大模型幻觉与 Token 成本失控</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>直接将巨量源码丢给 LLM 会导致 Token 打爆并产生大量无用废话（信噪比极低），审查质量无法保证。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>在丢给 AI 之前建立清洗层。利用 AST（抽象语法树）精准提取 git diff 变更内容及关联函数签名作为 Context，编写结构化 Prompt 强制模型仅输出高危缺陷与伪代码修复方案，极大提升了审查的有效性。
                </p>
              </div>
            </div>

            <!-- Architecture Diagram -->
            <div class="mt-6 p-4 rounded-xl bg-white border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <GitBranch class="w-4 h-4 text-[var(--color-secondary)]" />
                <span class="text-sm font-semibold text-[var(--color-secondary)]">Webhook 事件驱动架构</span>
              </div>
              <div class="flex flex-col gap-2 text-xs text-[var(--color-text-muted)]">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 rounded bg-[var(--color-bg-alt)]">PR Create/Update</span>
                  <ChevronRight class="w-3 h-3" />
                  <span class="px-2 py-1 rounded bg-[var(--color-bg-alt)]">Webhook</span>
                  <ChevronRight class="w-3 h-3" />
                  <span class="px-2 py-1 rounded bg-[var(--color-bg-alt)]">FastAPI</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 rounded bg-[var(--color-bg-alt)]">AST 提取</span>
                  <ChevronRight class="w-3 h-3" />
                  <span class="px-2 py-1 rounded bg-[var(--color-bg-alt)]">DeepSeek</span>
                  <ChevronRight class="w-3 h-3" />
                  <span class="px-2 py-1 rounded bg-[var(--color-bg-alt)]">PR Review</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Project Info -->
          <div class="p-8 lg:p-10 order-1 lg:order-2">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center">
                <Shield class="w-7 h-7 text-[var(--color-secondary)]" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-[var(--color-text)]">AutoGuard AI</h3>
                <p class="text-[var(--color-secondary)] text-sm font-mono">基于 DeepSeek 的 GitHub 智能代码审查</p>
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

            <!-- Description -->
            <p class="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              这个项目是 Vibe Coding 的副产物，本质上是在验证一套 AI 驱动的工作流：Gemini 3.1 Pro 充当架构师产出 PRD，Claude Code 负责核心代码实现，GitHub Actions 完成自动化部署，文档经 Claude 总结后同步至飞书。在此基础上构建的 GitHub App，通过 Webhook 监听 PR 事件，结合 AST 代码分析自动输出审查建议，已开源可用。
            </p>

            <!-- Architecture -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Zap class="w-5 h-5 text-[var(--color-secondary)]" />
                <span class="text-sm font-semibold text-[var(--color-secondary)]">技术实现</span>
              </div>
              <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                FastAPI + Uvicorn 做异步服务端，JWT + GitHub Installation Token 做双重鉴权，DeepSeek API 驱动代码分析，支持 Zeabur/Vercel/自有服务器部署。
              </p>
            </div>

            <!-- Features -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">自动审查</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">PR 创建/更新时自动触发代码审查</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">AI 驱动</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">DeepSeek 大模型智能分析代码</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">安全检测</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">检测潜在安全漏洞和逻辑错误</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">LGTM 支持</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">代码质量良好时显示 "Looks Good To Me ✅"</p>
                </div>
              </div>
            </div>

            <!-- Metrics -->
            <div class="grid grid-cols-3 gap-3 mb-6">
              <div class="text-center p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
                <div class="text-xl font-bold text-[var(--color-secondary)]">RS256</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1">JWT 算法</div>
              </div>
              <div class="text-center p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
                <div class="text-xl font-bold text-[var(--color-secondary)]">AST</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1">代码分析</div>
              </div>
              <div class="text-center p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
                <div class="text-xl font-bold text-[var(--color-secondary)]">Webhook</div>
                <div class="text-xs text-[var(--color-text-muted)] mt-1">事件驱动</div>
              </div>
            </div>

            <!-- Action -->
            <a
              href="https://github.com/xixi-box/AutoGuard-AI-Reviewer"
              target="_blank"
              class="btn btn-outline inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium"
            >
              <Github class="w-5 h-5" />
              <span>访问 GitHub 源码</span>
              <ExternalLink class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <!-- ==================== Project 3: AI Code Mother (README3) ==================== -->
      <div class="project-card card card-elevated rounded-3xl overflow-hidden border border-[var(--color-border)]">
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
              <span class="tag text-sm">Dubbo 3</span>
              <span class="tag text-sm">Nacos</span>
              <span class="tag text-sm">Vue 3</span>
              <span class="tag text-sm">Docker</span>
            </div>

            <!-- Description -->
            <p class="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              一个用自然语言描述就能生成前端代码的平台。输入需求后 AI 自动写代码，支持实时流式输出、在线编辑和一键部署到沙箱预览。采用微服务架构，用 LangChain4j 构建 AI 工作流，解决了上下文保持、代码安全执行等实际问题。
            </p>

            <!-- Architecture -->
            <div class="mb-6 p-4 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)]">
              <div class="flex items-center gap-2 mb-3">
                <Layers class="w-5 h-5 text-[var(--color-tertiary)]" />
                <span class="text-sm font-semibold text-[var(--color-tertiary)]">微服务 + AI Agent 架构</span>
              </div>
              <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                基于 Spring Cloud Alibaba + Dubbo 3 做服务通信，LangChain4j 实现 AI 工具调用和多轮对话，Nacos 做注册配置中心，Redis + Caffeine 两级缓存提升性能。
              </p>
            </div>

            <!-- Features -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">自然语言生成代码</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">LangChain4j Tool Calling 自动读写文件</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">流式 SSE 输出</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">Reactor Flux 实现，用户感知延迟降低 80%</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">两级缓存</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">Caffeine 本地 + Redis 分布式，命中率 95%+</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">分布式限流</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">Redisson Token Bucket，支持 API/IP/用户级</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">AI 安全护轨</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">输入过滤 + 输出检查，防止 Prompt 注入</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-alt)]">
                <Check class="w-4 h-4 text-[var(--color-tertiary)] mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-sm font-medium text-[var(--color-text)]">Docker 沙箱</span>
                  <p class="text-xs text-[var(--color-text-muted)] mt-1">容器隔离执行，Cgroups 限制资源</p>
                </div>
              </div>
            </div>

            <!-- Action -->
            <a
              href="http://120.26.186.0:8888"
              target="_blank"
              class="btn btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium"
            >
              <Rocket class="w-5 h-5" />
              <span>访问 AI Coder</span>
              <ExternalLink class="w-4 h-4" />
            </a>
          </div>

          <!-- Right: Debug Records -->
          <div class="p-8 lg:p-10 bg-[var(--color-bg-alt)] border-l border-[var(--color-border-light)]">
            <div class="flex items-center gap-2 mb-6">
              <Bug class="w-5 h-5 text-[#C4613F]" />
              <span class="text-lg font-semibold text-[var(--color-text)]">Debug 记录</span>
              <span class="text-xs text-[var(--color-text-muted)] ml-2">踩坑与解决方案</span>
            </div>

            <div class="space-y-4">
              <!-- Debug 1 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">大模型上下文遗忘与跨服务漂移</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>无状态的微服务难以维持多轮 AI 对话上下文，且容易超出 Token 限制，导致对话断裂、信息丢失。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>基于 Redis 定制化开发多租户跨微服务对话记忆存储 (RedisChatMemoryStore)，并引入安全护轨（Guardrail）机制动态截断冗余历史，防止 Prompt 注入攻击。实现跨服务的对话状态持久化。
                </p>
              </div>

              <!-- Debug 2 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">恶意代码沙箱逃逸防御</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>运行 AI 生成的不可信代码可能导致宿主机崩溃或数据泄露，存在严重的安全隐患。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>利用 Docker API 动态构建隔离容器环境，结合 Linux Cgroups 严格限制 CPU/内存资源，切断容器外网访问权限。当运行异常时，系统自动抓取 Exception 堆栈并回传给大模型进行"自愈修复"，形成完整的 Agentic 闭环。
                </p>
              </div>

              <!-- Debug 3 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">流式输出与数据库一致性</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>SSE 流式输出过程中如何确保代码片段顺序写入数据库，避免数据错乱？
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>采用 Flux.concatMap 保证顺序执行，结合 @Transactional 事务管理，在流完成时统一提交数据库变更，兼顾实时性与数据一致性。
                </p>
              </div>

              <!-- Debug 4 -->
              <div class="p-4 rounded-xl bg-white border border-[#F0D0C5]">
                <div class="flex items-center gap-2 mb-3">
                  <AlertTriangle class="w-4 h-4 text-[var(--color-accent)]" />
                  <span class="text-sm font-semibold text-[var(--color-accent)]">AI 工具调用死循环防护</span>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span class="text-[var(--color-text)] font-medium">挑战：</span>AI Agent 可能陷入无限循环的 Tool Calling，消耗大量 Token 且无法完成任务。
                </p>
                <p class="text-sm text-[var(--color-text-secondary)]">
                  <span class="text-[var(--color-tertiary)] font-medium">解决：</span>实现最大步数限制（Max Steps）和 ExitTool 强制退出机制，配合 Token 使用量监控，当超过阈值时自动终止并返回中间结果。
                </p>
              </div>
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
            <h3 class="text-xl font-bold text-[var(--color-text)]">CI/CD 自动化流水线</h3>
            <p class="text-[var(--color-text-muted)] text-sm">完整的自动化部署流水线，push 即部署</p>
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

        <p class="text-sm text-[var(--color-text-muted)] text-center">
          代码推送 -> GitHub Actions 自动构建 (Maven + pnpm) -> Docker 镜像推送到阿里云容器镜像服务 ACR -> 阿里云 ECS 服务器 SSH 拉取并部署
        </p>
      </div>

      <!-- ==================== Tech Highlights ==================== -->
      <div class="card rounded-3xl border border-[var(--color-border)] p-8">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 rounded-2xl bg-[var(--color-accent-light)] flex items-center justify-center">
            <Code2 class="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-[var(--color-text)]">技术亮点速览</h3>
            <p class="text-[var(--color-text-muted)] text-sm">Technical Highlights</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">自研 RPC 协议</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-tertiary)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">控制面/数据面分离</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">GitHub App 生态</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-tertiary)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">LangChain4j Agent</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">滑动窗口熔断</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">Token Bucket 限流</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">Mock 规则引擎</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-tertiary)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">分布式链路追踪</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">AI Guardrail 安全</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-tertiary)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">多级缓存架构</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">AST 代码分析</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border-light)]">
            <div class="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></div>
            <span class="text-sm text-[var(--color-text-secondary)]">Docker 沙箱隔离</span>
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
  Layers, Cloud as CloudIcon
} from 'lucide-vue-next'
</script>

<style scoped>
.project-featured,
.project-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
