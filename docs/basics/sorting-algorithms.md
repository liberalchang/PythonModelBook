---
layout: doc
title: Python 排序算法完全指南
permalink: /docs/basics/sorting-algorithms/
category: basics
tags: [排序算法, 冒泡排序, 选择排序, 插入排序, 快速排序, 归并排序, 堆排序, 时间复杂度]
description: 全面介绍Python中各种排序算法的原理、实现和性能分析
author: Python 算法工程师
date: 2024-01-02
updated: 2024-01-02
version: 1.0
difficulty: "中级"
---

# Python 排序算法完全指南

## 📝 概述

排序算法是计算机科学中的基础算法，用于将一组数据按照特定顺序重新排列。本文档全面介绍了Python中常见的排序算法，包括其原理、实现方式、时间复杂度分析和适用场景。排序算法可以分为内部排序和外部排序，内部排序是数据记录在内存中进行排序，而外部排序是因排序的数据很大，一次不能容纳全部的排序记录，在排序过程中需要访问外存。

![排序算法分类](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/image/Pasted%20image%2020240102152204.png)

## 🎯 学习目标

- 理解排序算法的基本概念和分类方法
- 掌握10种常见排序算法的原理和实现
- 学会分析排序算法的时间复杂度和空间复杂度
- 了解排序算法的稳定性概念
- 能够根据具体场景选择合适的排序算法

## 📋 前置知识

- Python 基本语法和数据结构
- 列表和数组的操作方法
- 递归和分治思想的理解
- 时间复杂度和空间复杂度的基本概念

## 🔍 详细内容

### 排序算法分类与性能对比

![排序算法性能对比](https://liberc.oss-cn-shanghai.aliyuncs.com/pastedimage/image/Pasted%20image%2020240102152230.png)

#### 时间复杂度分类

1. **平方阶 (O(n²)) 排序**：各类简单排序，如直接插入、直接选择和冒泡排序
2. **线性对数阶 (O(nlog₂n)) 排序**：快速排序、堆排序和归并排序
3. **O(n^1+§) 排序**：§ 是介于 0 和 1 之间的常数，如希尔排序
4. **线性阶 (O(n)) 排序**：基数排序，此外还有桶、箱排序

#### 稳定性说明

- **稳定的排序算法**：排序后2个相等键值的顺序和排序之前它们的顺序相同
- **稳定排序**：冒泡排序、插入排序、归并排序和基数排序
- **不稳定排序**：选择排序、快速排序、希尔排序、堆排序

#### 名词解释

- **n**：数据规模
- **k**："桶"的个数
- **In-place**：占用常数内存，不占用额外内存
- **Out-place**：占用额外内存

### 1. 冒泡排序 (Bubble Sort)

冒泡排序是一种简单直观的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。这个算法的名字由来是因为越小的元素会经由交换慢慢"浮"到数列的顶端。

#### 算法步骤

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对
3. 针对所有的元素重复以上的步骤，除了最后一个
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较

#### 动图演示

![冒泡排序演示](https://mmbiz.qpic.cn/mmbiz_gif/gPtPSmYD36icQUAWgkUI4rc6ss1VauypLOnkZr6sTCxbFluJnLicV3u28QZGeBqNvJwvQMCCdEsrP2TAyoQULHZQ/640?wx_fmt=gif&tp=wxpic&wxfrom=5&wx_lazy=1)

#### Python 实现

```python
def bubble_sort(arr):
    """冒泡排序实现
    
    Args:
        arr: 待排序的列表
    
    Returns:
        排序后的列表
    """
    n = len(arr)
    for i in range(n):
        # 设置标志位，如果这一轮没有交换，说明已经有序
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # 如果没有交换，提前结束
        if not swapped:
            break
    return arr

# 使用示例
if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print(f"原始数组: {data}")
    sorted_data = bubble_sort(data.copy())
    print(f"排序后: {sorted_data}")
```

### 2. 选择排序 (Selection Sort)

选择排序是一种简单直观的排序算法，无论什么数据进去都是 O(n²) 的时间复杂度。所以用到它的时候，数据规模越小最好。唯一的好处可能就是不占用额外的内存空间了吧。

#### 算法步骤

1. 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置
2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾
3. 重复第二步，直到所有元素均排序完毕

#### 动图演示

![选择排序演示](https://mmbiz.qpic.cn/mmbiz_gif/gPtPSmYD36icQUAWgkUI4rc6ss1VauypLQguJAY0ib6HW2cUZYOEibYkcaJTiaweET6kGOeZAaUZgRbdwm6SMBEhkw/640?wx_fmt=gif&tp=wxpic&wxfrom=5&wx_lazy=1)

#### Python 实现

```python
def selection_sort(arr):
    """选择排序实现
    
    Args:
        arr: 待排序的列表
    
    Returns:
        排序后的列表
    """
    n = len(arr)
    for i in range(n):
        # 记录最小数的索引
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        # i 不是最小数时，将 i 和最小数进行交换
        if i != min_index:
            arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr

# 使用示例
if __name__ == "__main__":
    data = [64, 25, 12, 22, 11]
    print(f"原始数组: {data}")
    sorted_data = selection_sort(data.copy())
    print(f"排序后: {sorted_data}")
```

### 3. 插入排序 (Insertion Sort)

插入排序的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。插入排序在实现上，通常采用in-place排序（即只需用到O(1)的额外内存空间），因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。

#### 算法步骤

1. 将第一待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列
2. 从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置

#### 动图演示

![插入排序演示](https://mmbiz.qpic.cn/mmbiz_gif/gPtPSmYD36icQUAWgkUI4rc6ss1VauypLP7QRFM2cfdIagksA4OrIdOQe2TXRKBqv3KVckhibekicibemlkJicOuHyQ/640?wx_fmt=gif&tp=wxpic&wxfrom=5&wx_lazy=1)

#### Python 实现

```python
def insertion_sort(arr):
    """插入排序实现
    
    Args:
        arr: 待排序的列表
    
    Returns:
        排序后的列表
    """
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        # 将大于key的元素后移一位
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# 使用示例
if __name__ == "__main__":
    data = [12, 11, 13, 5, 6]
    print(f"原始数组: {data}")
    sorted_data = insertion_sort(data.copy())
    print(f"排序后: {sorted_data}")
```

### 4. 希尔排序 (Shell Sort)

希尔排序，也称递减增量排序算法，是插入排序的一种更高效的改进版本。希尔排序是基于插入排序的以下两点性质而提出改进方法的：插入排序在对几乎已经排好序的数据操作时，效率高，即可以达到线性排序的效率；但插入排序一般来说是低效的，因为插入排序每次只能将数据移动一位。

#### 算法步骤

1. 选择一个增量序列 t₁，t₂，……，tₖ，其中 tᵢ > tⱼ, tₖ = 1
2. 按增量序列个数 k，对序列进行 k 趟排序
3. 每趟排序，根据对应的增量 tᵢ，将待排序列分割成若干长度为 m 的子序列，分别对各子表进行直接插入排序

#### Python 实现

```python
def shell_sort(arr):
    """希尔排序实现
    
    Args:
        arr: 待排序的列表
    
    Returns:
        排序后的列表
    """
    import math
    n = len(arr)
    gap = n // 2
    
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2
    
    return arr

# 使用示例
if __name__ == "__main__":
    data = [12, 34, 54, 2, 3]
    print(f"原始数组: {data}")
    sorted_data = shell_sort(data.copy())
    print(f"排序后: {sorted_data}")
```

### 5. 归并排序 (Merge Sort)

归并排序是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。归并排序的性能不受输入数据的影响，但表现比选择排序好的多，因为始终都是 O(nlogn) 的时间复杂度。代价是需要额外的内存空间。

#### 算法步骤

1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列
2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置
3. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置
4. 重复步骤3直到某一指针达到序列尾
5. 将另一序列剩下的所有元素直接复制到合并序列尾

#### 动图演示

![归并排序演示](https://mmbiz.qpic.cn/mmbiz_gif/gPtPSmYD36icQUAWgkUI4rc6ss1VauypLhQvIDqUPapGUswOiaS9lUSM6LkTBNAt7bwAZCvXIPzUwug0bX1kia6Wg/640?wx_fmt=gif&tp=wxpic&wxfrom=5&wx_lazy=1)

#### Python 实现

```python
def merge_sort(arr):
    """归并排序实现
    
    Args:
        arr: 待排序的列表
    
    Returns:
        排序后的列表
    """
    if len(arr) <= 1:
        return arr
    
    # 分割数组
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # 合并已排序的数组
    return merge(left, right)

def merge(left, right):
    """合并两个已排序的数组
    
    Args:
        left: 左半部分已排序数组
        right: 右半部分已排序数组
    
    Returns:
        合并后的已排序数组
    """
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # 添加剩余元素
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result

# 使用示例
if __name__ == "__main__":
    data = [12, 11, 13, 5, 6, 7]
    print(f"原始数组: {data}")
    sorted_data = merge_sort(data)
    print(f"排序后: {sorted_data}")
```

### 6. 快速排序 (Quick Sort)

快速排序使用分治法策略来把一个串行分为两个子串行。快速排序又是一种分而治之思想在排序算法上的典型应用。快速排序的名字起的是简单粗暴，因为一听到这个名字你就知道它存在的意义，就是快，而且效率高！虽然最坏情况的时间复杂度达到了 O(n²)，但是在大多数情况下都比平均时间复杂度为 O(n logn) 的排序算法表现要更好。

#### 算法步骤

1. 从数列中挑出一个元素，称为 "基准"（pivot）
2. 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面
3. 递归地把小于基准值元素的子数列和大于基准值元素的子数列排序

#### 动图演示

![快速排序演示](https://mmbiz.qpic.cn/mmbiz_gif/gPtPSmYD36icQUAWgkUI4rc6ss1VauypL55odG5zsGNoQLYrn2tssfwzdz8mGprsVl1ibutzibUAyicqZZhBa9bicYw/640?wx_fmt=gif&tp=wxpic&wxfrom=5&wx_lazy=1)

#### Python 实现

```python
def quick_sort(arr, low=0, high=None):
    """快速排序实现
    
    Args:
        arr: 待排序的列表
        low: 起始索引
        high: 结束索引
    
    Returns:
        排序后的列表
    """
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # 分区操作，返回基准元素的位置
        pivot_index = partition(arr, low, high)
        
        # 递归排序基准元素左边和右边的子数组
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    """分区函数
    
    Args:
        arr: 数组
        low: 起始索引
        high: 结束索引
    
    Returns:
        基准元素的最终位置
    """
    # 选择最后一个元素作为基准
    pivot = arr[high]
    i = low - 1  # 较小元素的索引
    
    for j in range(low, high):
        # 如果当前元素小于或等于基准
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# 使用示例
if __name__ == "__main__":
    data = [10, 7, 8, 9, 1, 5]
    print(f"原始数组: {data}")
    sorted_data = quick_sort(data.copy())
    print(f"排序后: {sorted_data}")
```

### 7. 堆排序 (Heap Sort)

堆排序是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。

#### 算法步骤

1. 创建一个堆 H[0……n-1]
2. 把堆首（最大值）和堆尾互换
3. 把堆的尺寸缩小1，并调用shift_down(0)，目的是把新的数组顶端数据调整到相应位置
4. 重复步骤2，直到堆的尺寸为1

#### 动图演示

![堆排序演示](https://mmbiz.qpic.cn/mmbiz_gif/gPtPSmYD36icQUAWgkUI4rc6ss1VauypLWhQCwqkVQtxpCEwia3K8tE3c7GznSUxJhQ1f693Sz5BpN4Nt0mQtDgw/640?wx_fmt=gif&tp=wxpic&wxfrom=5&wx_lazy=1)

#### Python 实现

```python
def heap_sort(arr):
    """堆排序实现
    
    Args:
        arr: 待排序的列表
    
    Returns:
        排序后的列表
    """
    n = len(arr)
    
    # 构建最大堆
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # 一个个从堆顶取出元素
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]  # 交换
        heapify(arr, i, 0)
    
    return arr

def heapify(arr, n, i):
    """维护堆的性质
    
    Args:
        arr: 数组
        n: 堆的大小
        i: 当前节点的索引
    """
    largest = i  # 初始化最大值为根节点
    left = 2 * i + 1     # 左子节点
    right = 2 * i + 2    # 右子节点
    
    # 如果左子节点存在且大于根节点
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    # 如果右子节点存在且大于当前最大值
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    # 如果最大值不是根节点
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        # 递归地调整受影响的子树
        heapify(arr, n, largest)

# 使用示例
if __name__ == "__main__":
    data = [12, 11, 13, 5, 6, 7]
    print(f"原始数组: {data}")
    sorted_data = heap_sort(data.copy())
    print(f"排序后: {sorted_data}")
```

### 8. 计数排序 (Counting Sort)

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

#### 动图演示

![计数排序演示](https://mmbiz.qpic.cn/mmbiz_gif/gPtPSmYD36icQUAWgkUI4rc6ss1VauypLiayE4LdiaUqmmzOZjIyo8G51Ug9kpFHHict0S4wace1u5s2OKeMGePhibQ/640?wx_fmt=gif&tp=wxpic&wxfrom=5&wx_lazy=1)

#### Python 实现

```python
def counting_sort(arr, max_value=None):
    """计数排序实现
    
    Args:
        arr: 待排序的列表
        max_value: 数组中的最大值
    
    Returns:
        排序后的列表
    """
    if max_value is None:
        max_value = max(arr)
    
    # 创建计数数组
    count = [0] * (max_value + 1)
    
    # 统计每个元素出现的次数
    for num in arr:
        count[num] += 1
    
    # 重构原数组
    sorted_arr = []
    for i in range(len(count)):
        sorted_arr.extend([i] * count[i])
    
    return sorted_arr

# 使用示例
if __name__ == "__main__":
    data = [4, 2, 2, 8, 3, 3, 1]
    print(f"原始数组: {data}")
    sorted_data = counting_sort(data)
    print(f"排序后: {sorted_data}")
```

### 9. 桶排序 (Bucket Sort)

桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。桶排序的工作的原理：假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序。

#### Python 实现

```python
def bucket_sort(arr):
    """桶排序实现
    
    Args:
        arr: 待排序的列表
    
    Returns:
        排序后的列表
    """
    if len(arr) == 0:
        return arr
    
    # 确定桶的数量
    bucket_count = len(arr)
    min_value = min(arr)
    max_value = max(arr)
    
    # 计算桶的范围
    bucket_range = (max_value - min_value) / bucket_count
    
    # 创建桶
    buckets = [[] for _ in range(bucket_count)]
    
    # 将元素分配到桶中
    for num in arr:
        if bucket_range == 0:
            bucket_index = 0
        else:
            bucket_index = int((num - min_value) / bucket_range)
        if bucket_index == bucket_count:
            bucket_index -= 1
        buckets[bucket_index].append(num)
    
    # 对每个桶进行排序
    sorted_arr = []
    for bucket in buckets:
        if bucket:
            sorted_arr.extend(sorted(bucket))
    
    return sorted_arr

# 使用示例
if __name__ == "__main__":
    data = [3.2, 6, 8, 4, 2, 6, 7, 3]
    print(f"原始数组: {data}")
    sorted_data = bucket_sort(data)
    print(f"排序后: {sorted_data}")
```

### 10. 基数排序 (Radix Sort)

基数排序是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。由于整数也可以表达字符串（比如名字或日期）和特定格式的浮点数，所以基数排序也不是只能使用于整数。

#### 动图演示

![基数排序演示](https://mmbiz.qpic.cn/mmbiz_gif/gPtPSmYD36icQUAWgkUI4rc6ss1VauypLJGFjonhPzo74074IBjxCPGHWsvqsy5NFhibfPHeECnLsbb0pYHS84Bw/640?wx_fmt=gif&tp=wxpic&wxfrom=5&wx_lazy=1)

#### Python 实现

```python
def radix_sort(arr):
    """基数排序实现
    
    Args:
        arr: 待排序的列表
    
    Returns:
        排序后的列表
    """
    if not arr:
        return arr
    
    # 找到最大数，确定位数
    max_num = max(arr)
    exp = 1
    
    # 对每一位进行计数排序
    while max_num // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    
    return arr

def counting_sort_by_digit(arr, exp):
    """按指定位数进行计数排序
    
    Args:
        arr: 数组
        exp: 当前位数的权重 (1, 10, 100, ...)
    """
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    
    # 统计每个数字出现的次数
    for i in range(n):
        index = arr[i] // exp
        count[index % 10] += 1
    
    # 计算累计计数
    for i in range(1, 10):
        count[i] += count[i - 1]
    
    # 构建输出数组
    i = n - 1
    while i >= 0:
        index = arr[i] // exp
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1
    
    # 复制输出数组到原数组
    for i in range(n):
        arr[i] = output[i]

# 使用示例
if __name__ == "__main__":
    data = [170, 45, 75, 90, 2, 802, 24, 66]
    print(f"原始数组: {data}")
    sorted_data = radix_sort(data.copy())
    print(f"排序后: {sorted_data}")
```

## 💡 实际应用

### 排序算法选择指南

```python
def choose_sorting_algorithm(data_size, data_type="integer", is_nearly_sorted=False):
    """根据数据特征选择合适的排序算法
    
    Args:
        data_size: 数据规模
        data_type: 数据类型 ("integer", "string", "float", "object")
        is_nearly_sorted: 数据是否接近有序
    
    Returns:
        推荐的排序算法名称
    """
    if data_size < 10:
        return "插入排序 - 小数据集效率高"
    elif data_size < 100:
        if is_nearly_sorted:
            return "插入排序 - 对接近有序的数据效率很高"
        else:
            return "选择排序或插入排序"
    elif data_size < 10000:
        if data_type == "integer" and data_size < 1000:
            return "计数排序 - 整数且范围不大时效率最高"
        else:
            return "快速排序 - 平均性能最好"
    else:
        if data_type == "integer":
            return "基数排序 - 大量整数排序的最佳选择"
        else:
            return "归并排序 - 稳定且时间复杂度保证O(nlogn)"

# 使用示例
print(choose_sorting_algorithm(50, "integer", True))
print(choose_sorting_algorithm(5000, "string"))
print(choose_sorting_algorithm(100000, "integer"))
```

### 性能测试比较

```python
import time
import random

def performance_test():
    """各种排序算法性能测试"""
    # 生成测试数据
    sizes = [100, 500, 1000]
    algorithms = {
        "冒泡排序": bubble_sort,
        "选择排序": selection_sort,
        "插入排序": insertion_sort,
        "快速排序": quick_sort,
        "归并排序": merge_sort,
        "堆排序": heap_sort
    }
    
    for size in sizes:
        print(f"\n数据规模: {size}")
        print("-" * 50)
        
        # 生成随机数据
        data = [random.randint(1, 1000) for _ in range(size)]
        
        for name, algorithm in algorithms.items():
            test_data = data.copy()
            start_time = time.time()
            
            try:
                algorithm(test_data)
                end_time = time.time()
                print(f"{name:10} : {(end_time - start_time)*1000:.2f} ms")
            except RecursionError:
                print(f"{name:10} : 递归深度超限")

# 运行性能测试
if __name__ == "__main__":
    performance_test()
```

### 实际应用场景

```python
# 学生成绩排序系统
class Student:
    def __init__(self, name, score, student_id):
        self.name = name
        self.score = score
        self.student_id = student_id
    
    def __repr__(self):
        return f"Student({self.name}, {self.score}, {self.student_id})"

def sort_students_by_score(students, reverse=True):
    """按成绩排序学生"""
    return sorted(students, key=lambda s: s.score, reverse=reverse)

def sort_students_multi_criteria(students):
    """多条件排序：先按成绩降序，再按学号升序"""
    return sorted(students, key=lambda s: (-s.score, s.student_id))

# 使用示例
students = [
    Student("张三", 85, "001"),
    Student("李四", 92, "002"),
    Student("王五", 78, "003"),
    Student("赵六", 92, "001")  # 同样成绩但学号不同
]

print("按成绩排序：")
for student in sort_students_by_score(students):
    print(student)

print("\n多条件排序：")
for student in sort_students_multi_criteria(students):
    print(student)
```

## ⚠️ 注意事项

- **稳定性要求**：如果需要保持相等元素的相对顺序，选择稳定的排序算法
- **内存限制**：空间复杂度敏感的场景避免使用归并排序等需要额外空间的算法
- **数据特征**：
  - 小数据集：插入排序或选择排序
  - 接近有序：插入排序或冒泡排序
  - 大数据集：快速排序、归并排序或堆排序
  - 整数且范围有限：计数排序或基数排序
- **最坏情况考虑**：快速排序在最坏情况下退化为O(n²)，关键场景考虑归并排序
- **递归深度**：快速排序和归并排序的递归实现可能导致栈溢出

## 🔗 相关内容

- [Python内置sorted()函数](../../builtins/sorted/)
- [列表的sort()方法](../../builtins/list/)
- [二分查找与插入 - bisect模块](../../stdlib/bisect/)
- [堆队列算法 - heapq模块](../../stdlib/heapq/)

## 📚 扩展阅读

- [算法导论 - 排序算法章节](https://mitpress.mit.edu/books/introduction-algorithms)
- [Python官方文档 - 排序HOW TO](https://docs.python.org/3/howto/sorting.html)
- [可视化排序算法](https://visualgo.net/en/sorting)
- [十大经典排序算法总结](https://github.com/hustcc/JS-Sorting-Algorithm)
- [维基百科 - 排序算法](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95)

## 🏷️ 标签

`排序算法` `冒泡排序` `选择排序` `插入排序` `快速排序` `归并排序` `堆排序` `时间复杂度`

---

**最后更新**: 2024-01-02  
**作者**: Python 算法工程师  
**版本**: 1.0