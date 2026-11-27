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
        已有 {{ mergedCount }} 个 PR 被上游合并。代表性贡献包括 ClickHouse 的 MySQL 协议包兼容修复、
        go-redis 的连接池与故障切换修复，以及 Wasmtime 的垃圾回收和内存转储修复。
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

      <p class="oss-footer">下载与拉取量为 2026 年 11 月查询快照。点击 PR 可查看 diff 与维护者讨论。</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GitPullRequest, Star } from 'lucide-vue-next'

const repos = [
  {
    name: 'infiniflow / ragflow',
    url: 'https://github.com/infiniflow/ragflow',
    stars: '94k+',
    desc: '开源 RAG 引擎，负责文档解析、索引与可追溯检索。可同步 Atlassian Confluence、Microsoft SharePoint 和 Google Drive 等数据源，供知识库和 Agent 查询。2025 年 1 月 24 日登顶 GitHub Trending 日榜，项目统计的 Docker 镜像累计拉取超过 400 万次。',
    prs: [
      {
        title: 'Preserve UTF-8 when truncating synced filenames (+73/-11)',
        note: '同步长 Confluence 页面名时，按字节截断可能切断 UTF-8 字符，生成 MySQL 无法写入的文件名。复用按字符边界截断的工具，同时保留扩展名和 255 字节限制。',
        url: 'https://github.com/infiniflow/ragflow/pull/22645',
      },
      {
        title: 'Use the Jin10 REST API in Go agent tools (#22814)',
        note: '将此前无法调用的金十数据工具接入 HTTPS API，支持快讯、财经日历、品种、行情与新闻五类查询。保留现有 Agent 的工具名和默认快讯调用，并验证从工具注册到发起 REST 请求的路径。',
        url: 'https://github.com/infiniflow/ragflow/pull/22814',
      },
    ],
  },
  {
    name: 'bytedance / deer-flow',
    url: 'https://github.com/bytedance/deer-flow',
    stars: '85k+',
    desc: '字节跳动开源的长程 Agent 框架，通过沙箱、记忆、工具和子 Agent 执行研究、编程与内容生成任务。2026 年 2 月 26 日登顶 GitHub Trending 日榜。',
    prs: [
      {
        title: 'fix(agents): pair tool results with malformed IDs when a sibling shares the name (#7822)',
        note: '模型返回的工具调用缺少 ID 时，同名但未执行的无效调用会妨碍正常结果配对。修正历史消息中的匹配逻辑，并用回归测试验证有效结果能关联到对应调用。',
        url: 'https://github.com/bytedance/deer-flow/pull/7822',
      },
    ],
  },
  {
    name: 'caddyserver / caddy',
    url: 'https://github.com/caddyserver/caddy',
    stars: '79k+',
    desc: 'Go 编写的跨平台 Web 服务器与反向代理，支持 HTTP/1.1、HTTP/2 和 HTTP/3，可自动签发与续期 TLS 证书，并与 Tailscale 集成，为 .ts.net 域名获取证书。Docker Hub 官方 Caddy 镜像累计拉取超 7.8 亿次。',
    prs: [
      {
        title: 'fix: prevent read_body deadline from truncating long responses (#8400)',
        note: '读取请求体的空闲超时被错误保留为连接上的硬截止时间，导致长响应还在传输就被截断。修正超时清理，并用回归测试验证修复前后及两种配置分支的行为。',
        url: 'https://github.com/caddyserver/caddy/pull/8400',
      },
    ],
  },
  {
    name: 'nestjs / nest',
    url: 'https://github.com/nestjs/nest',
    stars: '77k+',
    desc: '面向 Node.js 的 TypeScript 后端框架，通过模块、依赖注入和装饰器组织服务，支持 Express 与 Fastify。核心包 @nestjs/common 在 npm 近 30 天下载超 1 亿次。',
    prs: [
      {
        title: 'fix(common): restore decorator signatures for applyDecorators (#18710)',
        note: '组合装饰器的推断返回类型混合了构造函数和方法描述符，同一组权限守卫与元数据装饰器用于控制器或处理方法时会触发 TypeScript TS1270。为类、方法和属性声明各自的调用签名，保留装饰器替换类或方法的能力。补齐类型回归，PR 记录显示 7,584 项测试通过。',
        url: 'https://github.com/nestjs/nest/pull/18710',
      },
    ],
  },
  {
    name: 'docling-project / docling',
    url: 'https://github.com/docling-project/docling',
    stars: '70k+',
    desc: 'IBM Research 开源的文档解析与转换框架，覆盖 PDF、Word、PowerPoint 等格式。IBM 与 Red Hat 的 InstructLab 团队曾用 Docling 从 PDF 提取模型训练资料。2026 年 9 月 20 日登顶 GitHub Trending 日榜，PyPI 近 30 天下载超 430 万次。',
    prs: [
      {
        title: 'fix: avoid OpenCV FIPS aborts with Databricks opt-out setting (#5430)',
        note: 'Databricks Serverless 将 FIPS 设为明确关闭时，OpenCV 的底层依赖仍可能在 OCR 注册阶段触发 SIGABRT，连关闭 OCR 的任务也受影响。仅在原生依赖加载前处理显式关闭值，并添加进程级回归验证。',
        url: 'https://github.com/docling-project/docling/pull/5430',
      },
      {
        title: 'fix: serialize PDFium rendering in Office backends (+247/-93)',
        note: 'Office 图形与图表转换共用非线程安全的 PDFium，并发处理时可能崩溃。按维护者反馈将六条渲染路径迁移到 docling-parse，保留 RGB 输出，并验证各路径的渲染和异常行为。',
        url: 'https://github.com/docling-project/docling/pull/5377',
      },
      {
        title: 'fix(pdf): report missing pages in the native pipeline (#5554)',
        note: '修复 PDF 后端提前结束时漏页却报告成功的问题。逐页报告缺失页，保留已完成页面及其原始页码和来源信息，零页时让 CLI 返回失败且不写输出。回归覆盖完整、部分和零页三种交付情况，并验证 CLI 的 HTML 输出和退出码。',
        url: 'https://github.com/docling-project/docling/pull/5554',
      },
    ],
  },
  {
    name: 'prometheus / prometheus',
    url: 'https://github.com/prometheus/prometheus',
    stars: '67k+',
    desc: '源于 SoundCloud，2018 年成为继 Kubernetes 之后第二个从 CNCF 毕业的项目。用于时序监控和告警，CNCF 毕业公告列出的采用者包括 DigitalOcean 与 Uber。CNCF 2025 年度调查中，77% 的相关受访者已在生产环境使用 Prometheus。',
    prs: [
      {
        title: 'web: ui: align literal and duration keyword parsing with PromQL (#20456)',
        note: 'Prometheus 查询编辑器会把后端可执行的十六进制字面量、尾点浮点数或大写时长关键字误报为语法错误。对齐前端解析器与 Go 后端，并测试合法写法、非法输入及普通函数的大小写规则。',
        url: 'https://github.com/prometheus/prometheus/pull/20456',
      },
    ],
  },
  {
    name: 'ClickHouse / ClickHouse',
    url: 'https://github.com/ClickHouse/ClickHouse',
    stars: '50k+',
    desc: '面向实时分析的 C++ 列式 OLAP 数据库。Cloudflare 的工程案例披露，其基于 ClickHouse 的 Ready Analytics 系统截至 2024 年 12 月已存储超过 2 PiB，写入速率达每秒数百万行。ClickHouse 官方还披露，其 Google Cloud 配置曾于 2026 年 3 月 11 日在 ClickBench 综合榜排名第 1。',
    prs: [
      {
        title: 'fix: MySQL OK packet size accounting and optional field parsing (#129709)',
        note: '排查 Connector/J 9.x 兼容问题时发现 MySQL OK 包的两个独立缺陷。修正多字节 last_insert_id 的长度计算，以及可选字段缺省时的越界读取，各补一条协议测试。上游合并记录标注纳入 26.11。',
        url: 'https://github.com/ClickHouse/ClickHouse/pull/129709',
      },
    ],
  },
  {
    name: 'volcengine / OpenViking',
    url: 'https://github.com/volcengine/OpenViking',
    stars: '42k+',
    desc: '由字节跳动火山引擎 Viking 团队发起并维护的 Agent 上下文数据库，统一管理记忆、知识和技能三类上下文，并通过 LiteLLM 等组件接入模型。2026 年 3 月 14 日登顶 GitHub Trending 日榜。项目在 LoCoMo 长对话记忆基准中，将 Claude Code 的准确率从 57.21% 提升到 80.32%。',
    prs: [
      {
        title: 'fix(vlm): inherit configured reasoning effort in LiteLLM requests (#7703)',
        note: 'VLM 调用经 LiteLLM 发出时，缺省请求参数会让已配置的推理强度失效，模型转而使用自己的默认值。在共享请求构造逻辑中补齐配置继承，并保留调用方显式覆盖的优先级。',
        url: 'https://github.com/volcengine/OpenViking/pull/7703',
      },
      {
        title: 'fix(acl): reject principals outside the resource account (#8117)',
        note: '跨账号 ACL 操作曾返回成功，但账号隔离使这些授权实际无法生效。统一校验授权主体的账号归属，让无效配置在写入前返回明确错误，并保持本账号授权语义。',
        url: 'https://github.com/volcengine/OpenViking/pull/8117',
      },
      {
        title: 'fix(gateway): recover from malformed streamed Anthropic tool arguments (#8142)',
        note: 'Anthropic 流式工具参数包含非法 JSON 转义时，网关原先会中断整条响应。为网关托管的工具调用增加解析恢复，仍无法解析时将错误交回模型，并在既有工具调用限额内继续处理。',
        url: 'https://github.com/volcengine/OpenViking/pull/8142',
      },
    ],
  },
  {
    name: 'HKUDS / LightRAG',
    url: 'https://github.com/HKUDS/LightRAG',
    stars: '40k+',
    desc: '结合知识图谱与向量检索的 RAG 框架，对应论文收录于 Findings of EMNLP 2025。查询既能匹配语义相近的文本，也可沿实体关系检索相关信息。2025 年 4 月 8 日位列 GitHub Trending 日榜第 2，PyPI 的 lightrag-hku 包近 30 天下载超 16 万次。',
    prs: [
      {
        title: 'fix(chunker): verify token-window positions before attaching provenance (#4463)',
        note: '固定 token 窗口跨越 UTF-8 边界时，重复文本可能让来源标记指向错误位置。先校验窗口的解码锚点和映射，再写入溯源区间，无法可靠定位时省略区间。',
        url: 'https://github.com/HKUDS/LightRAG/pull/4463',
      },
      {
        title: 'Use shared boolean parsing for reranking and JSON extraction defaults (+73/-2)',
        note: '重排和 JSON 实体抽取曾只接受 true，导致设置为 1、yes 或 on 时功能依然关闭。改用项目共享的布尔解析逻辑，并测试常用值和错误值告警。',
        url: 'https://github.com/HKUDS/LightRAG/pull/4600',
      },
    ],
  },
  {
    name: 'Tencent / WeKnora',
    url: 'https://github.com/Tencent/WeKnora',
    stars: '38k+',
    desc: '腾讯开源的 LLM 知识库平台，涵盖文档入库、检索问答、Agent 和 Wiki。项目发布记录披露，v0.5.2 的 Wiki 文档入库可处理 4 万份文档规模的知识库。2025 年 11 月 1 日登顶 GitHub Trending 日榜。',
    prs: [
      {
        title: 'fix: stream TOS files without unsupported seeking (+85/-1)',
        note: '对象存储 SDK 声明了 Seek，但底层响应流不能跳转，文件预览因而返回 HTTP 500。接入既有流式响应路径，保留校验和资源清理，并用实际 SDK 验证预览和下载行为。',
        url: 'https://github.com/Tencent/WeKnora/pull/5732',
      },
      {
        title: 'fix(docreader): stabilize XLSX percent-format comparisons (#5999)',
        note: '修复 XLSX 百分比测试因两次保存时间不同而误报的问题。重写后的文件按 ZIP 成员与内容比较，忽略修改时间，并保留对原始分数值和未改写文件的严格断言。',
        url: 'https://github.com/Tencent/WeKnora/pull/5999',
      },
      {
        title: 'fix: preserve MinerU image page locators through ingestion (#5558)',
        note: '修复图文混排 PDF 入库后，后续页的图片可能被归到前一页的问题。将 MinerU 的显式页码贯穿解析、缓存和入库，并校正分段 PDF 合并时的页码偏移。',
        url: 'https://github.com/Tencent/WeKnora/pull/5558',
      },
      {
        title: 'fix: support KB-scoped knowledge reparse routes (#5538)',
        note: '修复知识库内单文档和批量重解析接口返回 404 的问题。复用原有处理器和写权限校验，回归覆盖成功派发、知识库不匹配和只读用户被拒绝的场景。',
        url: 'https://github.com/Tencent/WeKnora/pull/5538',
      },
      {
        title: 'fix: rearm durable wiki work despite fresh retry spans (#5670)',
        note: 'Wiki 导入的重试心跳可能掩盖已经丢失的唤醒信号，让任务持续挂起。先检查持久化任务状态，再决定是否重新触发消费，保留原有 48 小时过期规则与每个知识库的限流。',
        url: 'https://github.com/Tencent/WeKnora/pull/5670',
      },
      {
        title: 'fix: clarify DocReader SSRF allowlist errors for web imports (#5737)',
        note: '完善网页导入被 DocReader 拒绝时的诊断信息，帮助运维区分配置来自哪个服务。两种 gRPC 读取接口均返回明确的拒绝原因，沿用既有安全校验。',
        url: 'https://github.com/Tencent/WeKnora/pull/5737',
      },
    ],
  },
  {
    name: 'qdrant / qdrant',
    url: 'https://github.com/qdrant/qdrant',
    stars: '35k+',
    desc: 'Rust 编写的分布式向量数据库，支持混合检索、过滤和分组。HubSpot 工程团队披露，其承载逾 200 亿条向量的检索平台使用 Qdrant 执行语义搜索。该平台服务于 HubSpot 的 38 个以上团队。',
    prs: [
      {
        title: 'fix: group-by silently returns empty results (#11370)',
        note: '遇到不支持的 payload 值时，分组检索可能耗尽候选预算并返回空结果，调用方会误以为没有命中。定位候选处理的失败分支，补上修复前失败、修复后通过的回归用例。',
        url: 'https://github.com/qdrant/qdrant/pull/11370',
      },
      {
        title: 'fix: RecommendBestScore applies score_threshold in the wrong direction (#11350)',
        note: '推荐排序在欧氏距离下仍使用相似度的阈值方向，导致本应通过的结果被过滤。让比较方向取决于距离度量，并通过回归测试验证阈值边界。',
        url: 'https://github.com/qdrant/qdrant/pull/11350',
      },
    ],
  },
  {
    name: 'PrefectHQ / fastmcp',
    url: 'https://github.com/PrefectHQ/fastmcp',
    stars: '28k+',
    desc: 'Prefect 维护的 Python MCP 框架，支持发布工具、资源和提示模板。Anthropic 将 FastMCP 1.0 纳入官方 MCP Python SDK。2026 年 7 月 20 日位列 GitHub Trending 日榜第 8，PyPI 的 fastmcp 包近 30 天下载超 6,800 万次。',
    prs: [
      {
        title: 'fix: `session: UserSession` on a resource or resource template fails at registration (#6198)',
        note: '带 UserSession 依赖的 MCP 资源和资源模板会在注册阶段报错。修复资源注册与会话依赖注入的衔接，让这些资源可以正常注册，并在调用时访问会话上下文。',
        url: 'https://github.com/PrefectHQ/fastmcp/pull/6198',
      },
      {
        title: 'fix: from_openapi: cookie parameters with array/object values send Python repr strings (+242/-8)',
        note: '从 OpenAPI 生成的工具把数组和对象 Cookie 参数发成 Python 对象的显示文本，后端难以按协议解析。修正结构化参数的序列化，补上请求回归测试。',
        url: 'https://github.com/PrefectHQ/fastmcp/pull/6171',
      },
    ],
  },
  {
    name: 'apache / rocketmq',
    url: 'https://github.com/apache/rocketmq',
    stars: '22.6k+',
    desc: '源于阿里巴巴高并发电商业务的 Apache 顶级项目。官方文档将万亿级消息规模列为设计目标，用于异步解耦和突发流量缓冲。',
    prs: [
      {
        title: 'fix: CompressionType.of fails under the Turkish locale (#11514)',
        note: 'RocketMQ 用系统地区规则转换压缩算法名称，土耳其语环境会把合法的 zlib 识别为未知类型。改用固定地区规则，并用土耳其语环境验证修复。',
        url: 'https://github.com/apache/rocketmq/pull/11514',
      },
    ],
  },
  {
    name: 'redis / go-redis',
    url: 'https://github.com/redis/go-redis',
    stars: '22k+',
    desc: 'Redis 官方支持的 Go 客户端，支持 Cluster、Sentinel、流水线和发布订阅。连接池、协议解析和故障切换直接影响上层应用访问 Redis 的可靠性。Go Packages 收录的 v9 主包导入记录超过 1.6 万条。',
    prs: [
      {
        title: 'fix: proto — no nesting depth limit when reading RESP3 replies (#4296)',
        note: '为 go-redis 的 RESP3 回复解析增加嵌套深度上限，保护客户端处理异常输入时的稳定性。补齐深度边界测试，修复前后对比的 6 类解析基准中，每次操作的内存分配量与次数相同。',
        url: 'https://github.com/redis/go-redis/pull/4296',
      },
      {
        title: 'fix(pool): wait for idle reauthentication (#4313)',
        note: '凭据轮换期间，暂不可用的空闲连接在池已满时会触发连接池耗尽错误。只有在硬上限已满时才等待重认证，仍有容量时继续拨号，保留常规获取路径。',
        url: 'https://github.com/redis/go-redis/pull/4313',
      },
      {
        title: 'fix(tx): discard uncleared transaction state (#4316)',
        note: '事务退出时若无法确认清理成功，连接留在池中会污染后续请求。明确检查事务清理结果，并将状态无法确认的连接移出连接池，保留原始事务错误。',
        url: 'https://github.com/redis/go-redis/pull/4316',
      },
      {
        title: 'fix: multidb — FD outcomes settle into the window after a reselect of the active member (#4283)',
        note: 'MultiDB 切换活跃节点后，旧请求的迟到结果可能被计入新一轮熔断和故障检测。把异步结果与发起时的故障切换周期关联，避免旧结果干扰当前节点的健康判断。',
        url: 'https://github.com/redis/go-redis/pull/4283',
      },
      {
        title: 'fix(pool): return acquired idle connections (#4322)',
        note: '空闲连接扫描在最后一次尝试已拿到可用连接时，仍可能误报连接池耗尽，并让连接滞留在占用状态。获取成功即返回，测试覆盖 FIFO、LIFO 两种策略和 Get、TryGet 两个入口。',
        url: 'https://github.com/redis/go-redis/pull/4322',
      },
      {
        title: 'fix: reselect after endpoint dial exhaustion (#4331)',
        note: '单个地址拨号耗尽后，集群路由曾提前退出，错过拓扑更新后已经可用的候选节点。保留有界的重选机会，并按只读路由规则选择 SCAN 的候选副本。',
        url: 'https://github.com/redis/go-redis/pull/4331',
      },
      {
        title: 'fix(retry): stop replaying failed dial sequences (#4304)',
        note: '命令或路由的外层重试会反复启动同一地址已耗尽的拨号序列，放大连接失败时的等待。按连接获取过程记录已耗尽的地址，同时保留尝试其他节点的机会。',
        url: 'https://github.com/redis/go-redis/pull/4304',
      },
      {
        title: 'fix(scan): resume Vals from the iterator position (#4428)',
        note: '修复先调用 Next 或提前退出 range 后，再调用 Vals 会从当前页开头重复返回键的问题。统一迭代位置并在交付每个键前推进游标，保证续扫从下一项开始。补齐两种续扫场景的回归测试，并在 Redis 8.12 集群环境验证。',
        url: 'https://github.com/redis/go-redis/pull/4428',
      },
    ],
  },
  {
    name: 'bytecodealliance / wasmtime',
    url: 'https://github.com/bytecodealliance/wasmtime',
    stars: '18k+',
    desc: 'Bytecode Alliance 开发的 WebAssembly 运行时，提供 Cranelift 编译器和 WASI 接口。据 1.0 发布公告，Shopify 和 Fastly 已在生产中采用，Fastly 当时已用它处理万亿级请求。',
    prs: [
      {
        title: 'fix: Copying collector grow-vs-collect heuristic compares against the whole heap (#15207)',
        note: '复制式 GC 判断该扩堆还是回收时，将阈值与整个堆比较，偏离了实际可用的活动半空间容量。按活动半空间修正判断，并验证触发条件的边界。',
        url: 'https://github.com/bytecodealliance/wasmtime/pull/15207',
      },
      {
        title: 'fix: Core dumps of custom-page-size memories truncate their data and declare the wrong size (#15275)',
        note: '自定义页大小的 Wasm 内存在生成 core dump 时会丢失尾部数据，转储中的尺寸声明也不准确。补齐页大小元数据与末尾数据，回归覆盖自定义页大小。',
        url: 'https://github.com/bytecodealliance/wasmtime/pull/15275',
      },
    ],
  },
  {
    name: 'opensandbox-group / OpenSandbox',
    url: 'https://github.com/opensandbox-group/OpenSandbox',
    stars: '17k+',
    desc: '阿里巴巴捐献给 Linux Foundation 旗下 AAIF 的 Agent 隔离执行平台，支持在 Docker 和 Kubernetes 上运行代码与工具，提供 Python、TypeScript、Java、Go 等 SDK。官方在阿里云 ACK 双节点环境进行串行验证，103 次运行时创建的中位耗时为 39.43 ms。',
    prs: [
      {
        title: 'fix(python-sdk): normalize legacy SSE streams in linear time (#2845)',
        note: '旧版 SSE 事件分块到达时，SDK 会反复扫描或复制已有缓冲区，大事件的 CPU 开销随长度呈二次增长。用扫描游标和批量清理改为线性处理，并测试跨块边界和 CPU 增长。',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/2845',
      },
      {
        title: 'feat(server): optionally sync metadata labels to dedicated Pods (#2869)',
        note: '专用 Pod 的标签曾不会随沙箱元数据更新，依赖这些标签的 Kubernetes NetworkPolicy 可能读到旧值。新增默认关闭的同步选项，覆盖标签更新、删除与 Pod 重建。',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/2869',
      },
      {
        title: 'fix(python-sdk): log propagated failures at debug level (#2996)',
        note: 'Python SDK 文件读取失败时会抛出结构化异常并重复写 ERROR，即使调用方已捕获也可能触发告警。把已向上传递的错误日志改为 DEBUG，保留原有异常与 HTTP 细节。',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/2996',
      },
      {
        title: 'fix(egress): resolve exchange credentials from admitted snapshots (+775/-106)',
        note: '出口凭证交换与准入快照的处理不一致时，凭证配置虽然创建成功，沙箱仍无法通过就绪检查。让凭证解析绑定已准入的快照和身份，统一就绪判断与运行时行为。',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/2930',
      },
      {
        title: 'fix(kubernetes): exclude missing allocated pods from pool scaling (+83/-5)',
        note: '沙箱预留的 Pod 已经消失时，原有计数仍可能触发多创建一个空闲 Pod。让目标容量和当前容量使用同一组实际存在的 Pod，同时保留预留记录供状态统计。',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/2991',
      },
      {
        title: 'fix(sdk-kotlin): surface execution handler failures (+119/-18)',
        note: 'Kotlin SDK 会吞掉事件回调的异常，导致应用收到看似正常结束的执行结果。把回调故障交给现有异常转换逻辑，停止后续事件处理并保留原始错误原因。',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/2994',
      },
      {
        title: 'fix(server): let operators pin the execd isolation config path (+194/-11)',
        note: '为 Docker、Kubernetes 和预热池提供一致的 execd 隔离配置路径选项。启用后由运维指定的路径优先，便于跨部署方式统一下发隔离策略。',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/3021',
      },
      {
        title: 'fix(execd): serve the whole file for multiple byte ranges (+79/-7)',
        note: '客户端请求多个可满足的字节区间时，下载接口曾返回 206 却只发送第一个区间。修复后回退到 HTTP 200 并发送完整文件，覆盖常规和隔离会话下载路径。',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/3034',
      },
      {
        title: 'fix(execd): time out unacknowledged Jupyter executions (#3083)',
        note: 'Jupyter 内核未确认请求时，执行流会一直占用会话。增加 5 秒确认超时，超时后结束响应并释放会话，已确认的长任务仍可继续运行。补齐单测与集成验证。',
        url: 'https://github.com/opensandbox-group/OpenSandbox/pull/3083',
      },
    ],
  },
  {
    name: 'The-PR-Agent / pr-agent',
    url: 'https://github.com/The-PR-Agent/pr-agent',
    stars: '16k+',
    desc: 'Qodo 发起的开源 AI 代码评审工具，支持 GitHub、GitLab、Bitbucket、Microsoft Azure DevOps 和 AWS CodeCommit 等平台，可根据代码变更与关联工单生成审查建议。PyPI 的 pr-agent 包近 30 天下载超 9 万次。',
    prs: [
      {
        title: 'fix: guard GitLab ticket context with project issue visibility (#4932)',
        note: 'GitLab 评审中的工单上下文读取增加项目可见性检查。读取前核对工单的可见范围是否覆盖合并请求的受众，避免受限内容被带入评审输出。',
        url: 'https://github.com/The-PR-Agent/pr-agent/pull/4932',
      },
      {
        title: 'Use Markdown review identity markers on Bitbucket Server (#5136)',
        note: 'Bitbucket Server 和 Data Center 上的持久化评审偶尔会显示本应隐藏的身份标记。改用兼容的 Markdown 标记，同时识别历史格式，让重复评审能继续更新原评论。',
        url: 'https://github.com/The-PR-Agent/pr-agent/pull/5136',
      },
    ],
  },
  {
    name: 'pypa / pipx',
    url: 'https://github.com/pypa/pipx',
    stars: '13k+',
    desc: 'PyPA 维护的 Python 命令行工具安装器，为每个应用创建独立虚拟环境。Ubuntu 24.04 的软件仓库提供 pipx，macOS 和 Windows 也有官方安装指引。PyPI 近 30 天下载超 420 万次。',
    prs: [
      {
        title: 'docs(environment): explain what --value prints for unset variables (#2450)',
        note: '完善 CLI 帮助和文档，说明 --value 何时读取原始环境变量、何时返回推导值。用户排查配置时可以区分空输出与 pipx 实际采用的默认行为。',
        url: 'https://github.com/pypa/pipx/pull/2450',
      },
      {
        title: 'fix(run): honor binary format resets with uv (#2483)',
        note: 'uv 后端曾忽略安装选项中的 :none: 重置，导致用户解除限制后仍无法从源码包安装。按传入顺序处理格式选项，让应用和脚本的后续覆盖都正确生效。',
        url: 'https://github.com/pypa/pipx/pull/2483',
      },
    ],
  },
  {
    name: 'Arize-ai / phoenix',
    url: 'https://github.com/Arize-ai/phoenix',
    stars: '12.3k+',
    desc: 'Arize AI 开源的 LLM 与 Agent 可观测性及评估平台，基于 OpenTelemetry 采集调用链，可在 Playground 调试 OpenAI、Anthropic 等模型的提示词。PyPI 的 arize-phoenix 包近 30 天下载超 58 万次。',
    prs: [
      {
        title: 'fix: make playground task timeout configurable (#16545)',
        note: '高推理强度模型在流式输出的两段内容之间可能停顿超过 90 秒，触发 Playground 提前取消。新增环境变量配置等待下一段输出的超时时间，默认仍为 90 秒，并补齐参数校验、流式停顿回归测试和自托管配置文档。',
        url: 'https://github.com/Arize-ai/phoenix/pull/16545',
      },
    ],
  },
  {
    name: 'lancedb / lancedb',
    url: 'https://github.com/lancedb/lancedb',
    stars: '12k+',
    desc: '面向多模态数据的检索库，支持向量和全文检索。LanceDB 在 2026 年 11 月披露开源库累计下载超 1.2 亿次，旗下商业平台的客户包括 Netflix、Microsoft AI 和 Midjourney。其 PyPI 包近 30 天下载超 650 万次。',
    prs: [
      {
        title: 'fix(java): keep Maven coordinates in sync with release tags (+104/-28)',
        note: 'Java SDK 的两个 POM 曾停留在上一个预发布版本，导致 Maven 产物坐标与发布标签错位。将两处版本纳入共享升版配置，让预发布与正式发布使用相同的版本来源。',
        url: 'https://github.com/lancedb/lancedb/pull/5151',
      },
    ],
  },
  {
    name: 'mark3labs / mcp-go',
    url: 'https://github.com/mark3labs/mcp-go',
    stars: '9.2k+',
    desc: 'MCP 的 Go 实现，支持 stdio 和 Streamable HTTP 等传输，提供客户端与服务端能力。Grafana Labs 的分布式追踪项目 Tempo 在公开依赖清单中引用了 mcp-go。Go Packages 记录其 server 包被超过 2,800 个 Go 模块引用。',
    prs: [
      {
        title: 'Isolate stateless Streamable HTTP GET streams (+129/-9)',
        note: '无状态模式下，并发 GET 事件流会竞争同一个通知通道，一条连接关闭还可能注销另一条。为每条匿名流分配独立内部标识，让广播和断开清理按连接执行。',
        url: 'https://github.com/mark3labs/mcp-go/pull/1328',
      },
    ],
  },
  {
    name: 'google / adk-go',
    url: 'https://github.com/google/adk-go',
    stars: '9k+',
    desc: 'Google 开源的 Go 版 Agent Development Kit，用于开发、评估与部署多 Agent 应用，可接入 Gemini 和 Vertex AI。Go 版于 2026 年发布 1.0，GitHub 已获超过 9,000 Star。',
    prs: [
      {
        title: 'fix(agenttool): keep code artifacts out of structured replies (#2468)',
        note: '子 Agent 同时生成结构化回答和代码执行产物时，AgentTool 会把两者拼在一起，导致合法 JSON 在 schema 校验前就解析失败。对声明了输出 schema 的回复按顺序重组回答文本，兼容 JSON 字段跨片段的情况。补齐 4 个回归用例，并对 6 个相关 Go 包运行竞态检测。',
        url: 'https://github.com/google/adk-go/pull/2468',
      },
    ],
  },
  {
    name: 'pydantic / monty',
    url: 'https://github.com/pydantic/monty',
    stars: '8.9k+',
    desc: 'Pydantic 开发的 Rust 实现 Python 沙箱，用于受控执行 AI 生成的代码。提供 Python、JavaScript 和 Rust 接口，并可按会话限制内存等资源。按 Pydantic 官方基准，从预热池获取一个开源沙箱并运行 10 条 REPL 命令耗时约 1.2 ms。',
    prs: [
      {
        title: 'fix: preflight JSON integer indentation allocations (#1367)',
        note: '修复 JSON 格式化的内存分配未受会话配额约束的问题，让超出预算的操作返回 MemoryError。子进程回归覆盖两种 JSON API，并验证错误后仍能复用工作进程。',
        url: 'https://github.com/pydantic/monty/pull/1367',
      },
    ],
  },
  {
    name: 'prometheus / alertmanager',
    url: 'https://github.com/prometheus/alertmanager',
    stars: '8.7k+',
    desc: 'Prometheus 的告警管理组件，负责去重、分组和路由，集成 Slack、Microsoft Teams 和 PagerDuty 等通知渠道。Docker Hub 的 prom/alertmanager 镜像累计拉取超 4.9 亿次。',
    prs: [
      {
        title: 'app: outlast Prometheus client idle connections (#5744)',
        note: '告警每 90 秒重发一次时，恰好撞上服务端原有的 90 秒空闲超时，告警 POST 可能出现 EOF。将服务端超时调至 6 分钟，晚于客户端的 5 分钟，并验证两个监听器的超时设置。',
        url: 'https://github.com/prometheus/alertmanager/pull/5744',
      },
    ],
  },
  {
    name: 'agentgateway / agentgateway',
    url: 'https://github.com/agentgateway/agentgateway',
    stars: '6k+',
    desc: '由 Solo.io 发起、现为 Linux Foundation 旗下 AAIF 项目的 Rust 网关，统一代理 MCP 与 A2A 流量，集中处理鉴权、限流和可观测性。官方在 8 个 vLLM 后端的路由测试中观察到，首个 Token 的 p90 延迟从普通 Kubernetes Service 的 135.6 秒降至 0.2 秒。',
    prs: [
      {
        title: 'fix: Windows CLI shows version as True (#4276)',
        note: 'Windows 上的版本探测可能把布尔值当作版本输出，影响 CLI 与调用脚本读取版本。修正类型处理，并用回归用例验证修复前后的结果。',
        url: 'https://github.com/agentgateway/agentgateway/pull/4276',
      },
      {
        title: "fix: resolve the user's home directory on Windows (#4264)",
        note: 'Windows 上沿用 Unix 的 HOME 查找方式会让默认配置文件无法定位。按平台选择主目录来源并跳过空值，用户可直接使用默认的配置发现流程。',
        url: 'https://github.com/agentgateway/agentgateway/pull/4264',
      },
    ],
  },
  {
    name: 'python / typeshed',
    url: 'https://github.com/python/typeshed',
    stars: '5k+',
    desc: 'Python 的公共类型存根仓库，为标准库和第三方包提供注解。Microsoft Pyright 随工具分发一份 Typeshed 标准库存根，供静态分析和编辑器诊断使用。由 Typeshed 维护并发布的 types-requests 存根包，PyPI 近 30 天下载超 8,100 万次。',
    prs: [
      {
        title: 'Narrow real math and cmath constants to float (#16886)',
        note: '类型检查器曾把 math 和 cmath 的 pi、inf 等常量推断为 float | int。依据 CPython 的实际初始化行为改为 Final[float]，让调用方可直接使用浮点类型的方法。',
        url: 'https://github.com/python/typeshed/pull/16886',
      },
    ],
  },
  {
    name: 'ruvnet / RuVector',
    url: 'https://github.com/ruvnet/RuVector',
    stars: '4.7k+',
    desc: 'Rust 编写的向量检索引擎，支持 HNSW、嵌入式部署和 WebAssembly。相关原生模块修复覆盖 NVIDIA Jetson AGX Xavier 和树莓派 4 等 ARM 边缘设备。npm 上的 ruvector 包近 30 天下载超 78 万次。',
    prs: [
      {
        title: 'fix: native modules crash (SIGILL) on ARMv8.2 CPUs without LRCPC (#1384)',
        note: '部分 ARMv8.2 边缘设备缺少原生模块所用的 LRCPC 指令，模块启动时会触发 SIGILL。修正编译兼容性，让匹配该架构的模块能在这些设备上运行。',
        url: 'https://github.com/ruvnet/RuVector/pull/1384',
      },
      {
        title: 'fix: @ruvector/core 0.1.30 HNSW misses results on very small graphs (#1299)',
        note: '0.1.30 版 HNSW 在节点极少时存在遍历边界错误，索引正常仍可能漏掉应返回的结果。修正层遍历条件，并用小规模图验证召回。',
        url: 'https://github.com/ruvnet/RuVector/pull/1299',
      },
    ],
  },
  {
    name: 'pydantic / logfire',
    url: 'https://github.com/pydantic/logfire',
    stars: '4.5k+',
    desc: 'Pydantic 的 OpenTelemetry 可观测性平台，为应用与 Agent 记录日志和追踪。官方文档提供 OpenAI、Anthropic、Google ADK 等集成路径。Pydantic 公布的 AutonomyAI 生产案例中，Logfire 在 3 周内接收超过 3,500 万条追踪 Span。',
    prs: [
      {
        title: 'Render non-object model serializer output in the verbose console (#2870)',
        note: 'Pydantic 自定义序列化器返回字符串或列表时，verbose 控制台会把值当字典处理，导致整条记录的属性被丢弃。按返回类型渲染，保留异常排查所需的日志上下文。',
        url: 'https://github.com/pydantic/logfire/pull/2870',
      },
    ],
  },
  {
    name: 'gptme / gptme',
    url: 'https://github.com/gptme/gptme',
    stars: '4.4k+',
    desc: '开源终端 Agent 框架，支持代码编辑、命令执行和网页访问，并提供可配置的模型与工具评测。PyPI 的 gptme 包近 30 天下载超 2.2 万次。',
    prs: [
      {
        title: 'fix: constrain tools in Claude Code evaluations (#5286)',
        note: '修复 Claude Code 评测中工具清单未正确约束实际可用工具的问题。统一两个启动路径的工具映射，让默认隔离评测按指定工具集运行，减少宿主设置对评分的影响。PR 记录显示相关测试有 121 项通过。',
        url: 'https://github.com/gptme/gptme/pull/5286',
      },
    ],
  },
  {
    name: 'modelcontextprotocol / rust-sdk',
    url: 'https://github.com/modelcontextprotocol/rust-sdk',
    stars: '4.1k+',
    desc: 'MCP 的官方 Rust SDK，支持 stdio 和 Streamable HTTP 两类传输，覆盖客户端和服务端。MCP 由 Anthropic 发起，并于 2025 年捐献给 Linux Foundation 旗下 AAIF。crates.io 上的 rmcp 包累计下载超 5,400 万次。',
    prs: [
      {
        title: 'fix: stateful session workers ignore config.cancellation_token after shutdown (#1427)',
        note: 'Streamable HTTP 的有状态会话在关闭后会残留后台 worker。补齐取消信号从服务端到会话任务的传递，并用回归用例验证关闭时能回收任务。',
        url: 'https://github.com/modelcontextprotocol/rust-sdk/pull/1427',
      },
      {
        title: 'fix: reject unadvertised capability methods by default (#1446)',
        note: '默认处理器曾对服务端未声明的能力返回空成功，容易误导客户端的能力发现。按能力声明返回成功或标准的 JSON-RPC 方法不存在错误，并补充跨语言回归验证。',
        url: 'https://github.com/modelcontextprotocol/rust-sdk/pull/1446',
      },
    ],
  },
  {
    name: 'tox-dev / tox',
    url: 'https://github.com/tox-dev/tox',
    stars: '3.9k+',
    desc: 'Python 测试环境与任务自动化工具，用于隔离安装依赖并运行多版本测试。Django 仓库提供 tox 测试配置，JetBrains PyCharm 提供专门的 tox 运行配置。PyPI 近 30 天下载超 1,800 万次。',
    prs: [
      {
        title: 'fix(install): accept uppercase hash digests (#4463)',
        note: '依赖文件中的 SHA-256、SHA-384 和 SHA-512 摘要包含大写字符时，tox 会在调用 pip 前拒绝安装。允许混合大小写并统一比较形式，避免仅改变大小写便重建测试环境。补充解析与安装回归测试，PR 记录显示 31 项检查通过。',
        url: 'https://github.com/tox-dev/tox/pull/4463',
      },
    ],
  },
  {
    name: 'project-zot / zot',
    url: 'https://github.com/project-zot/zot',
    stars: '3k+',
    desc: '遵循 OCI Distribution 规范的容器镜像和制品仓库，支持复制、保留策略和垃圾回收。2022 年加入 CNCF Sandbox，GitHub 已获超过 3,000 Star。',
    prs: [
      {
        title: 'fix: protect recovered tags during the pull retention window (#4757)',
        note: '重建镜像元数据时，丢失的拉取时间会被设为 Unix 纪元，导致垃圾回收可能立即误删近期用过的旧标签。为恢复标签从重建时刻起保留一个配置周期，覆盖 BoltDB、Redis 和 DynamoDB 三种后端，并补充回归验证。',
        url: 'https://github.com/project-zot/zot/pull/4757',
      },
    ],
  },
  {
    name: 'agronholm / anyio',
    url: 'https://github.com/agronholm/anyio',
    stars: '2.5k+',
    desc: 'Python 异步并发库，统一 asyncio 和 Trio 两套运行后端，并提供 pytest 插件。OpenAI 与 Anthropic 的官方 Python SDK 都将 AnyIO 列为直接依赖。PyPI 近 30 天下载超 10 亿次。',
    prs: [
      {
        title: 'fix: preserve asyncio callback context in pytest exception notes (#1482)',
        note: '异步 pytest 测试中，回调异常缺少回调名称，尤其难以定位内置回调。把事件循环的诊断消息附到原始异常上，并覆盖内置回调失败场景。',
        url: 'https://github.com/agronholm/anyio/pull/1482',
      },
    ],
  },
  {
    name: 'bytecodealliance / wasm-tools',
    url: 'https://github.com/bytecodealliance/wasm-tools',
    stars: '1.8k+',
    desc: 'Bytecode Alliance 维护的 WebAssembly 工具集，覆盖模块与组件的解析、校验和变体生成。联盟由 Mozilla、Fastly、Intel 和 Red Hat 四家公司发起。crates.io 上的 wasm-tools 包累计下载超 65 万次。',
    prs: [
      {
        title: 'fix: Code-motion mutation retains a full syntax-tree clone at every nesting level (#2825)',
        note: '代码变换递归遍历语法树时，每深入一层都会保留一份完整副本，深层模块使活跃内存呈二次增长。改为借用节点遍历，并补充深层嵌套回归测试。',
        url: 'https://github.com/bytecodealliance/wasm-tools/pull/2825',
      },
    ],
  },
  {
    name: 'oceanbase / powercontext',
    url: 'https://github.com/oceanbase/powercontext',
    stars: '1.7k+',
    desc: 'OceanBase 开源的 Agent 长期记忆和上下文交接框架。项目主分支文档列出了 9 种 Agent 宿主适配，包括 OpenAI Codex 和 Anthropic Claude Code。项目在 LoCoMo 的 1,540 道计分题上报告 90.78% 准确率，完整上下文重放基线为 52.9%。',
    prs: [
      {
        title: 'fix(gateway): preserve distinct terminal turn captures (#2717)',
        note: '同一用户轮次的不同最终回复曾共享记忆来源标识，导致后一次回复被判为冲突。按回复内容区分来源、对重复内容保持幂等，覆盖串行重试和并发回复。PR 记录显示网关执行语义套件 86 项测试通过。',
        url: 'https://github.com/oceanbase/powercontext/pull/2717',
      },
      {
        title: 'fix(gateway): record completed turns from Chat SSE (#2812)',
        note: 'Chat Completions 流式回复可正常送达，但网关曾把 SSE 当成单个 JSON 解析，导致已完成轮次丢失记忆记录。按顺序重组主候选回复的文本增量，等待轮次完成再记录。进程级回归验证流式与等价 JSON 回复生成一致的会话记录。',
        url: 'https://github.com/oceanbase/powercontext/pull/2812',
      },
      {
        title: 'fix(gateway): strip replayed plugin context before model admission (#2809)',
        note: '修复从插件切换到网关后，Codex 与 OpenCode 的历史会话可能无法继续的问题。网关识别并规范化历史中的旧插件上下文，保留原有发送和发布校验。两种客户端均补上回归，PR 记录显示网关工作区有 290 项测试通过。',
        url: 'https://github.com/oceanbase/powercontext/pull/2809',
      },
      {
        title: 'fix(knowledge-base): clear the import spinner when retries settle (#2802)',
        note: '知识库导入重试结束后，旧的加载动画可能改变按钮的无障碍名称，使后续重试无法定位控件。用请求的实际状态控制动画与按钮的忙碌状态，并端到端验证动画被中断后仍可重试，原始文件内容和幂等键正确复用。',
        url: 'https://github.com/oceanbase/powercontext/pull/2802',
      },
      {
        title: 'fix(gateway): omit unsupported Codex subscription options (#2798)',
        note: '部分客户端传入 Codex 订阅端点不支持的采样和缓存选项时，网关请求会返回 HTTP 400。按上游类型处理参数，保留 API Key 路径的配置。通过网关进程级回归验证两类请求的实际出站内容。',
        url: 'https://github.com/oceanbase/powercontext/pull/2798',
      },
      {
        title: 'fix(gateway): replay context for headerless conversations (#2813)',
        note: '缺少会话标识请求头时，网关可能漏掉上下文注入，或在工具续跑时重复准备同一轮上下文。为符合条件的会话建立进程内标识，复用本轮上下文并保留既有校验。',
        url: 'https://github.com/oceanbase/powercontext/pull/2813',
      },
      {
        title: 'test(atomic-memory): preserve prior revisions during correction recovery (#2753)',
        note: '为原子记忆的纠正恢复补回归测试，验证重试耗尽时仍保留较早的有效修订、证据与历史，并继续处理后续来源。更新分支上 226 项测试通过。',
        url: 'https://github.com/oceanbase/powercontext/pull/2753',
      },
      {
        title: 'Enable cost guidance and cached prefix reuse for Chat Completions (#2815)',
        note: '补齐 Chat Completions 路径的成本提示和缓存前缀复用。符合条件的非流式会话可复用已记录的提示词前缀来提取记忆，并通过网关进程级测试验证两种行为。',
        url: 'https://github.com/oceanbase/powercontext/pull/2815',
      },
    ],
  },
  {
    name: 'modelcontextprotocol / php-sdk',
    url: 'https://github.com/modelcontextprotocol/php-sdk',
    stars: '1.6k+',
    desc: '与 PHP Foundation 合作维护的 MCP 官方 PHP SDK，支持构建 MCP 客户端和服务端。Packagist 上的 mcp/sdk 月下载超 230 万次。',
    prs: [
      {
        title: 'Make client request handler results covariant (#770)',
        note: 'PHPStan 在最高检查级别会拒绝将交互请求、模型采样和根目录三类内置处理器注册到客户端。将仅用于返回值的泛型声明为协变，使具体结果类型符合客户端构建器的约束，保留现有运行时行为。补齐静态分析回归，PR 记录显示相关单元与集成测试共 1,459 项通过。',
        url: 'https://github.com/modelcontextprotocol/php-sdk/pull/770',
      },
    ],
  },
  {
    name: 'pydantic / pydantic-ai-harness',
    url: 'https://github.com/pydantic/pydantic-ai-harness',
    stars: '900+',
    desc: 'Pydantic AI 的 Agent 执行扩展，继承其 OpenAI、Anthropic 等模型接入能力，并提供请求数、工具调用数、Token 和金额四类预算信息。Pydantic 公开了使用 Harness 的 CodeMode 对 8 个模型所做的内部对照评测，共 5,276 次评分运行。',
    prs: [
      {
        title: 'Warn on the deprecated single-key get/add of spend stores (#747)',
        note: '为内存和 Redis 用量存储中的旧单键接口补上弃用告警，明确批量接口和移除版本，并迁移内部调用点。应用可在升级前发现仍需迁移的调用。',
        url: 'https://github.com/pydantic/pydantic-ai-harness/pull/747',
      },
    ],
  },
  {
    name: 'sparklyi / SOJ',
    url: 'https://github.com/sparklyi/SOJ',
    stars: '8',
    desc: '可单机部署的 Go 在线评测系统后端，通过 REST API 接收提交，并在异步判题流水线中处理评测和重判。',
    prs: [
      {
        title: 'test(submission): cover rejudge reason byte limits (#278)',
        note: '受项目维护者 @sparklyi 邀请参与贡献，为创建和取消重判补充 Go 回归测试。验证去除首尾空白后，恰好 500 字节的 UTF-8 理由可传给持久化层，501 字节会在写入前被拒绝，并覆盖取消理由只含空白的情况。',
        url: 'https://github.com/sparklyi/SOJ/pull/278',
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
