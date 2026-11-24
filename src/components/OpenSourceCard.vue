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

      <p class="oss-footer">点击 PR 条目可查看完整 diff 与维护者讨论。</p>
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
    desc: '开源 RAG 引擎，为知识库和 AI Agent 提供文档解析、索引与可追溯检索。负责把原始文档转成模型能检索、也能回查来源的上下文。',
    prs: [
      {
        title: 'Preserve UTF-8 when truncating synced filenames (+73/-11)',
        note: '同步长 Confluence 页面名时，按字节截断可能切断 UTF-8 字符，生成 MySQL 无法写入的文件名。复用按字符边界截断的工具，同时保留扩展名和 255 字节限制。',
        url: 'https://github.com/infiniflow/ragflow/pull/22645',
      },
    ],
  },
  {
    name: 'caddyserver / caddy',
    url: 'https://github.com/caddyserver/caddy',
    stars: '79k+',
    desc: 'Go 编写的跨平台 Web 服务器与反向代理，支持 HTTP/1.1、HTTP/2 和 HTTP/3。内置自动 HTTPS，可用于站点入口和后端服务转发。',
    prs: [
      {
        title: 'fix: prevent read_body deadline from truncating long responses (#8400)',
        note: '读取请求体的空闲超时被错误保留为连接上的硬截止时间，导致长响应还在传输就被截断。修正超时清理，并用回归测试验证修复前后及两种配置分支的行为。',
        url: 'https://github.com/caddyserver/caddy/pull/8400',
      },
    ],
  },
  {
    name: 'docling-project / docling',
    url: 'https://github.com/docling-project/docling',
    stars: '70k+',
    desc: '面向生成式 AI 的文档解析与转换框架，覆盖 PDF、Word、PowerPoint 等格式。保留文档结构，为知识库检索和文档问答准备输入。',
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
    ],
  },
  {
    name: 'prometheus / prometheus',
    url: 'https://github.com/prometheus/prometheus',
    stars: '67k+',
    desc: 'CNCF 毕业项目，用于采集和存储时序指标，并通过 PromQL 查询和定义告警规则。常与 Kubernetes、各类 Exporter 和 Grafana 配合使用。',
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
    desc: 'C++ 列式 OLAP 数据库，面向大规模数据的实时聚合与分析。事件、日志和明细查询之外，也通过 MySQL 接口兼容已有的驱动和工具。',
    prs: [
      {
        title: 'fix: MySQL OK packet size accounting and optional field parsing (#129709)',
        note: '排查 Connector/J 9.x 兼容问题时发现 MySQL OK 包的两个独立缺陷。修正多字节 last_insert_id 的长度计算，以及可选字段缺省时的越界读取，并分别添加协议级测试。',
        url: 'https://github.com/ClickHouse/ClickHouse/pull/129709',
      },
    ],
  },
  {
    name: 'volcengine / OpenViking',
    url: 'https://github.com/volcengine/OpenViking',
    stars: '42k+',
    desc: '火山引擎开源的 Agent 上下文数据库，统一管理记忆、知识和技能。它为 Agent 提供上下文检索，也通过 LiteLLM 等组件接入模型。',
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
    ],
  },
  {
    name: 'HKUDS / LightRAG',
    url: 'https://github.com/HKUDS/LightRAG',
    stars: '40k+',
    desc: '结合知识图谱与向量检索的 RAG 框架。向量匹配帮助找到语义相关的文本，图谱让查询还能沿实体关系查找相关信息。',
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
    desc: '腾讯开源的 LLM 知识库平台，涵盖文档入库、检索问答、Agent 和 Wiki。对象存储接入直接影响文档预览、下载与后续使用。',
    prs: [
      {
        title: 'fix: stream TOS files without unsupported seeking (+85/-1)',
        note: '对象存储 SDK 声明了 Seek，但底层响应流不能跳转，文件预览因而返回 HTTP 500。接入既有流式响应路径，保留校验和资源清理，并用实际 SDK 验证预览和下载行为。',
        url: 'https://github.com/Tencent/WeKnora/pull/5732',
      },
    ],
  },
  {
    name: 'qdrant / qdrant',
    url: 'https://github.com/qdrant/qdrant',
    stars: '35k+',
    desc: 'Rust 编写的分布式向量数据库，支持 HNSW、量化和稀疏混合检索，可结合元数据过滤、分组与推荐，用于语义搜索和 RAG。',
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
    desc: 'Prefect 维护的 Python MCP 框架，通过装饰器把应用能力注册为工具、资源和提示模板，也支持从 OpenAPI 描述生成工具。',
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
    desc: 'Apache 顶级项目，用于在服务之间可靠传递消息。常用于异步解耦和突发流量缓冲，客户端配置在不同运行环境下的一致性会影响消息链路。',
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
    desc: 'Redis 官方维护的 Go 客户端，支持 Cluster、Sentinel、流水线和发布订阅。连接池、协议解析和故障切换是上层应用访问 Redis 的基础。',
    prs: [
      {
        title: 'fix: proto — no nesting depth limit when reading RESP3 replies (#4296)',
        note: '为 go-redis 的 RESP3 回复解析增加嵌套深度上限，保护客户端处理异常输入时的稳定性。补齐深度边界回归测试，并对比修复前后的解析性能。',
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
        note: '空闲连接扫描在最后一次尝试已拿到可用连接时，仍可能误报连接池耗尽，并让连接滞留在占用状态。获取成功即返回，回归覆盖 FIFO、LIFO 和两种获取入口。',
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
    ],
  },
  {
    name: 'bytecodealliance / wasmtime',
    url: 'https://github.com/bytecodealliance/wasmtime',
    stars: '18k+',
    desc: 'Bytecode Alliance 开发的 WebAssembly 运行时，提供 Cranelift 编译器和 WASI 接口。负责 Wasm 模块的执行、内存管理和故障诊断。',
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
    desc: '面向 AI Agent 的隔离执行平台，支持在 Docker 和 Kubernetes 上运行代码与工具。服务端管理沙箱生命周期，SDK 负责传递执行事件和结果。',
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
    ],
  },
  {
    name: 'The-PR-Agent / pr-agent',
    url: 'https://github.com/The-PR-Agent/pr-agent',
    stars: '16k+',
    desc: 'Qodo 发起的开源 AI 代码评审工具，接入 GitHub、GitLab 等平台，可生成 PR 描述和审查建议。它会读取代码变更及关联工单作为上下文。',
    prs: [
      {
        title: 'fix: guard GitLab ticket context with project issue visibility (#4932)',
        note: 'GitLab 评审中的工单上下文读取增加项目可见性检查。读取前核对工单的可见范围是否覆盖合并请求的受众，避免受限内容被带入评审输出。',
        url: 'https://github.com/The-PR-Agent/pr-agent/pull/4932',
      },
    ],
  },
  {
    name: 'pypa / pipx',
    url: 'https://github.com/pypa/pipx',
    stars: '13k+',
    desc: 'PyPA 维护的 Python CLI 安装与运行工具，为每个应用创建独立的虚拟环境。多个命令行工具可以共存，并各自保留所需的依赖版本。',
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
    name: 'lancedb / lancedb',
    url: 'https://github.com/lancedb/lancedb',
    stars: '12k+',
    desc: '面向多模态数据的嵌入式检索库，支持向量和全文检索。应用可以把检索集成在进程内，并通过 SDK 接入现有服务。',
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
    desc: 'MCP 的 Go 语言实现，可在 Go 应用中构建 MCP 客户端和服务端，通过统一协议访问工具与外部数据。',
    prs: [
      {
        title: 'Isolate stateless Streamable HTTP GET streams (+129/-9)',
        note: '无状态模式下，并发 GET 事件流会竞争同一个通知通道，一条连接关闭还可能注销另一条。为每条匿名流分配独立内部标识，让广播和断开清理按连接执行。',
        url: 'https://github.com/mark3labs/mcp-go/pull/1328',
      },
    ],
  },
  {
    name: 'pydantic / monty',
    url: 'https://github.com/pydantic/monty',
    stars: '8.9k+',
    desc: 'Pydantic 开发的 Rust 实现 Python 沙箱，用于受控执行 AI 生成的代码。运行时负责限制资源用量，并把执行结果或异常交还给宿主。',
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
    desc: 'Prometheus 生态的告警管理组件。它接收告警事件，执行去重、分组和路由，再把通知送到配置的接收方。',
    prs: [
      {
        title: 'app: outlast Prometheus client idle connections (#5744)',
        note: 'Prometheus 重发告警的周期恰好撞上服务端空闲超时，连接关闭与告警 POST 并发时可能出现 EOF。协调客户端和服务端的空闲超时顺序，并为两个监听端口补上验证。',
        url: 'https://github.com/prometheus/alertmanager/pull/5744',
      },
    ],
  },
  {
    name: 'agentgateway / agentgateway',
    url: 'https://github.com/agentgateway/agentgateway',
    stars: '6k+',
    desc: '面向 AI Agent 的 Rust 网关，统一代理 MCP 和 A2A 流量，集中处理鉴权、限流和可观测性。',
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
    desc: 'Python 的公共类型存根仓库。mypy、Pyright 等类型检查器读取其中的标准库注解，用于分析调用方代码和提供 IDE 诊断。',
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
    desc: 'Rust 编写的向量检索引擎，支持 HNSW、嵌入式部署和 WebAssembly。可运行于浏览器、本地进程和边缘设备。',
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
    desc: 'Pydantic 的可观测性平台，为应用与 Agent 记录结构化日志和调用追踪，供开发者关联请求、模型调用与报错。',
    prs: [
      {
        title: 'Render non-object model serializer output in the verbose console (#2870)',
        note: 'Pydantic 自定义序列化器返回字符串或列表时，verbose 控制台会把值当字典处理，导致整条记录的属性被丢弃。按返回类型渲染，保留异常排查所需的日志上下文。',
        url: 'https://github.com/pydantic/logfire/pull/2870',
      },
    ],
  },
  {
    name: 'modelcontextprotocol / rust-sdk',
    url: 'https://github.com/modelcontextprotocol/rust-sdk',
    stars: '4.1k+',
    desc: 'MCP 官方 Rust SDK，支持客户端和服务端实现，以及 stdio 和 Streamable HTTP 传输，负责能力协商与会话生命周期。',
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
    desc: 'Python 测试环境与任务自动化工具。它创建隔离环境、安装项目依赖并运行测试，常用于在 CI 中验证多个 Python 版本。',
    prs: [
      {
        title: 'fix(install): accept uppercase hash digests (#4463)',
        note: '依赖文件中的 SHA-256、SHA-384 和 SHA-512 摘要包含大写字符时，tox 会在调用 pip 前拒绝安装。接受混合大小写，并在比较时统一形式，避免仅改变大小写便重建测试环境。补充解析和安装回归测试。',
        url: 'https://github.com/tox-dev/tox/pull/4463',
      },
    ],
  },
  {
    name: 'agronholm / anyio',
    url: 'https://github.com/agronholm/anyio',
    stars: '2.5k+',
    desc: '面向 Python 的异步并发和网络库，统一 asyncio 与 Trio 的接口，也提供 pytest 插件来运行和诊断异步测试。',
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
    desc: 'Bytecode Alliance 的 WebAssembly 工具集，覆盖模块与组件的处理。wasm-mutate 用于生成变体，帮助测试运行时与工具链的边界行为。',
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
    desc: 'OceanBase 开源的 Agent 长期记忆和上下文交接框架，支持 Claude Code 与 Codex。它负责从会话中留存信息，供后续任务接续。',
    prs: [
      {
        title: 'fix(gateway): preserve distinct terminal turn captures (#2717)',
        note: '同一用户轮次的多次最终回复曾共享一条记忆来源标识，导致后一次回复被判为冲突。按回复内容区分来源、保持相同内容幂等，测试串行重试和并发回复。',
        url: 'https://github.com/oceanbase/powercontext/pull/2717',
      },
    ],
  },
  {
    name: 'pydantic / pydantic-ai-harness',
    url: 'https://github.com/pydantic/pydantic-ai-harness',
    stars: '900+',
    desc: 'Pydantic 的 Agent 运行框架，负责执行过程中工具输出、事件和用量限额等管理逻辑。',
    prs: [
      {
        title: 'Warn on the deprecated single-key get/add of spend stores (#747)',
        note: '为内存和 Redis 用量存储中的旧单键接口补上弃用告警，明确批量接口和移除版本，并迁移内部调用点。应用可在升级前发现仍需迁移的调用。',
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
