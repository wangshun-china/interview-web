# 优雅部署模式迁移指南

## 架构对比

### 旧模式（SSH Push）
```
GitHub Actions → SSH 登录服务器 → 执行部署命令
                ↓
         [安全风险: 需要存储 SSH 私钥]
         [耦合问题: 构建和部署在一起]
```

### 新模式（Cloud Build + Self-hosted Pull）
```
GitHub Actions (Cloud Build) ──Push──→ GHCR + 阿里云 ACR
                                          ↓
Self-hosted Runner (ECS) ──Pull GHCR，失败回退 ACR
                ↓
         [更安全: 无需 SSH 密钥]
         [更解耦: 构建和部署分离]
         [更可控: 部署权限在本地]
```

## 迁移步骤

### 1. 配置 Self-hosted Runner

在阿里云 ECS 服务器上执行：

```bash
# 1. 创建 runner 目录
mkdir -p ~/actions-runner && cd ~/actions-runner

# 2. 下载 runner (替换为你的版本)
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# 3. 解压
tar xzf actions-runner-linux-x64-2.311.0.tar.gz

# 4. 配置 runner (从 GitHub 仓库设置页面获取 token)
./config.sh --url https://github.com/xixi-box/interview --token <YOUR_TOKEN>

# 5. 安装为服务
sudo ./svc.sh install
sudo ./svc.sh start
```

### 2. 给 Runner 打标签

在 GitHub 仓库 Settings → Actions → Runners 中，编辑你的 runner，添加标签：
- `self-hosted`

### 3. 测试部署

提交代码到 main/master 分支，触发新的工作流。

## 工作流说明

只有一个 `deploy.yml` 文件，包含两个 job：

### build (runs-on: ubuntu-latest)
- 构建前端 Docker 镜像
- 同时推送到 GHCR 和阿里云 ACR
- 使用 Buildx 缓存加速

### deploy (runs-on: self-hosted)
- 在 ECS 上执行
- 优先拉取 GHCR 不可变版本，失败时回退阿里云 ACR
- 启动服务

## 后续优化

ACR 密码保存在 GitHub Secret `ALIYUN_ACR_PASSWORD`，仓库地址、用户名和镜像名使用 GitHub Variables。

## 故障排查

### Runner 离线
```bash
# 查看 runner 状态
sudo systemctl status actions.runner.xixi-box-interview.*

# 重启 runner
sudo systemctl restart actions.runner.xixi-box-interview.*
```

### 部署失败
```bash
# 查看日志
cd ~/wangshun-portfolio
docker compose logs -f
```
