# 在微服务架构中使用 asyncio：BFF、超时、重试、熔断与降级

本文面向在微服务架构中落地 Python 异步方案的工程师，聚焦于 BFF（Backend for Frontend）模式下的并发聚合、超时控制、自动重试、断路器（熔断）与服务降级等关键能力，帮助你构建健壮、可恢复且高性能的聚合层。文中示例代码均带中文注释，力求简洁易懂。

## 一、BFF 与微服务概览（为何需要聚合层）
- 微服务“单一职责、独立部署”，一个页面/场景往往需要调用多个后端服务（商品、库存、购物车、收藏等）。
- 若由客户端直接对接多个微服务，将导致强耦合、版本兼容困难、网络往返多、端上聚合复杂等问题。
- BFF 作为“面向前端的后端”，负责数据编排与聚合，向不同端（Web/APP/Pad）暴露稳定友好的统一 API。
- API Gateway 负责横切能力（认证、鉴权、限流、观测、熔断等），BFF 专注业务编排与聚合。

## 二、使用 asyncio 并发聚合多个后端
BFF 通常需要并行请求多个服务，然后合并结果返回，这天然适合 asyncio：
- 使用 asyncio.gather 并发发起请求，缩短总时延；
- 合理设置超时并捕获异常，保证整体请求稳定返回；
- 对于可重试的错误配合“重试+退避”，进一步提升鲁棒性。

相关阅读：
- 并发聚合方法：见(./concurrent-tasks/)
- 任务工具函数：见(./asyncio-task-functions/)

## 三、超时控制：wait_for 的正确使用
超时是微服务可靠性的第一道防线，防止单个慢服务拖垮整体：

```python
import asyncio

async def fetch_svc():
    # 模拟调用下游服务
    await asyncio.sleep(2)
    return {"ok": True}

async def main():
    try:
        # 为单次调用设置超时
        res = await asyncio.wait_for(fetch_svc(), timeout=1.0)
        print(res)
    except asyncio.TimeoutError:
        # 及时超时，走降级或返回兜底数据
        print("下游超时，返回兜底")

asyncio.run(main())
```

要点：
- 超时应靠近调用处设置，避免大粒度超时掩盖问题；
- 对“批量并发请求”可设单个请求超时，也可在 gather 外再设整体超时；
- 超时后务必进行清理和降级，避免悬挂任务或资源泄漏。更多见(./cancellation/)、(./asyncio-task-functions/)。

## 四、重试策略：何时重试、如何退避
重试适用于“短暂性故障”（网络抖动、瞬时过载），但必须满足幂等性；对“业务性错误”不应盲目重试。

建议实践：
- 幂等优先：仅对幂等接口（GET、幂等写）进行自动重试；
- 指数退避 + 抖动：避免惊群效应；
- 限定最大重试次数与总时限；
- 失败要可观测（打点/日志）。

```python
import asyncio, random

async def call_svc_once():
    # 模拟不稳定的下游
    if random.random() < 0.5:
        raise ConnectionError("transient error")
    return {"ok": True}

async def call_svc_with_retry(max_attempts=3, base_delay=0.2):
    attempt = 0
    while True:
        try:
            return await call_svc_once()
        except Exception as e:
            attempt += 1
            if attempt >= max_attempts:
                # 达到最大次数，放弃并向上抛出或走降级
                raise
            # 指数退避 + 抖动
            delay = base_delay * (2 ** (attempt - 1))
            delay += random.uniform(0, delay)
            await asyncio.sleep(delay)
```

更多专业重试库可参考第三方章节：(../thirdparty/tenacity/)。

## 五、断路器（熔断器）：避免雪崩
当下游持续失败或延迟激增时，断路器可“快速失败”，保护系统资源，避免放大故障。典型状态机：
- Closed：正常放行，统计失败率/超时；
- Open：快速失败，等待冷却时间；
- Half-Open：放少量探测请求，若成功则关闭，否则继续打开。

```python
import time, asyncio

class CircuitBreaker:
    def __init__(self, fail_threshold=5, recovery_time=5.0, window=10.0):
        # 失败阈值、半开恢复时间、滑动时间窗口
        self.fail_threshold = fail_threshold
        self.recovery_time = recovery_time
        self.window = window
        self.state = "closed"  # closed/open/half_open
        self.fail_times = []
        self.open_since = 0.0

    def _prune(self, now):
        # 清理窗口外的失败时间点
        self.fail_times = [t for t in self.fail_times if now - t <= self.window]

    def allow(self):
        now = time.monotonic()
        if self.state == "open":
            if now - self.open_since >= self.recovery_time:
                # 进入半开，允许一次探测
                self.state = "half_open"
                return True
            return False
        return True

    def on_success(self):
        if self.state in ("half_open", "open"):
            # 探测成功，关闭
            self.state = "closed"
            self.fail_times.clear()

    def on_failure(self):
        now = time.monotonic()
        self.fail_times.append(now)
        self._prune(now)
        if len(self.fail_times) >= self.fail_threshold:
            self.state = "open"
            self.open_since = now

async def call_with_cb(cb: CircuitBreaker, coro_factory):
    # coro_factory: () -> awaitable
    if not cb.allow():
        # 快速失败，直接降级
        return {"ok": False, "reason": "circuit open"}
    try:
        res = await coro_factory()
        cb.on_success()
        return res
    except Exception:
        cb.on_failure()
        raise
```

## 六、服务降级：兜底与缓存
- 为每个关键下游定义“兜底数据”（默认值/缓存值/上次成功数据）；
- 明确降级范围与质量（是否提示缺失字段、是否弱提示告警）；
- 降级也要可观测（统计降级比例）。

```python
def inventory_fallback(product_id: str):
    # 示例兜底：库存未知时返回安全默认值
    return {"inventory": 0, "warning": "fallback"}
```

## 七、FastAPI BFF 示例：并发聚合 + 超时 + 重试 + 熔断 + 降级
下面以 aiohttp 为客户端展示一个简化版 BFF 端点：

```python
# pip install fastapi uvicorn aiohttp orjson
import asyncio
from typing import Dict
import aiohttp
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import orjson

app = FastAPI()

# 简易断路器实例（真实系统建议按服务维度维护多个实例）
cb_inventory = CircuitBreaker(fail_threshold=5, recovery_time=5.0, window=10.0)

async def fetch_json(session: aiohttp.ClientSession, url: str, timeout=1.0) -> Dict:
    # 带超时的 GET
    async with session.get(url, timeout=timeout) as resp:
        resp.raise_for_status()
        return await resp.json()

async def fetch_inventory(session, product_id: str):
    url = f"http://localhost:6000/products/{product_id}/inventory"

    async def do_call():
        # 单次调用（可被重试包装）
        return await fetch_json(session, url, timeout=1.0)

    async def with_retry():
        # 对瞬时失败执行有限次重试
        return await call_svc_with_retry(max_attempts=3, base_delay=0.2)

    # 断路器包裹
    try:
        return await call_with_cb(cb_inventory, with_retry)
    except Exception:
        # 最终失败，走降级
        return inventory_fallback(product_id)

@app.get("/bff/products/{user_id}")
async def products_bff(user_id: str):
    # 简化：仅演示并发调用库存 + 其他服务
    product_ids = ["product_001", "product_002", "product_003"]
    async with aiohttp.ClientSession() as session:
        # 并发拉取各产品库存
        tasks = [fetch_inventory(session, pid) for pid in product_ids]
        # 对批量调用可设置整体超时
        try:
            results = await asyncio.wait_for(asyncio.gather(*tasks, return_exceptions=True), timeout=2.0)
        except asyncio.TimeoutError:
            # 整体超时，全部降级
            results = [inventory_fallback(pid) for pid in product_ids]

    # 统一处理异常并做降级
    final = []
    for pid, r in zip(product_ids, results):
        if isinstance(r, Exception):
            final.append(inventory_fallback(pid))
        else:
            final.append(r)

    return JSONResponse(content=final, media_type="application/json")
```

要点回顾：
- 单次调用层：wait_for 控制超时；
- 重试层：指数退避 + 抖动，限制最大次数；
- 熔断层：持续失败快速失败，半开探测恢复；
- 降级层：明确兜底策略，保障整体可用性；
- 批量并发：gather 合并结果，必要时整体设置超时。

## 八、工程化建议
- 观测优先：对“超时、重试、熔断、降级”进行指标化统计与日志埋点；
- 策略可配置：不同端点/服务允许设置不同的超时、重试与熔断参数；
- 分层解耦：Gateway（横切）与 BFF（业务编排）职责边界清晰；
- 失败即资产：保留失败样本用于压测与混沌工程演练。

扩展阅读：
- (./asyncio-intro/) (./concurrent-tasks/) (./asyncio-task-functions/) (./cancellation/)
- (../thirdparty/tenacity/)