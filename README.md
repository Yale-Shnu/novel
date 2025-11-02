# 小说智阅坊 - 智能阅读分析平台

## 项目概述

小说智阅坊是一个集成了AI智能分析功能的在线阅读平台，能够对小说内容进行深度分析和可视化展示。平台集成了DeepSeek和智谱AI两大API，提供智能批注、四格漫画生成、角色图谱分析等功能。

## 主要功能

### 1. 智能阅读器 (P-READER.html)
- 支持文本选择和高亮
- 智能批注生成（集成DeepSeek API）
- 四格漫画生成（集成智谱AI API）
- 章节导航和书签功能

### 2. 大纲总结分析 (P-ANALYSIS_OUTLINE.html)
- AI智能生成小说大纲
- 章节结构可视化展示
- 关键情节节点分析

### 3. 角色图谱分析 (P-ANALYSIS_CHARACTER.html)
- 角色关系网络可视化
- 角色属性深度分析
- 互动关系图谱展示

### 4. 四格漫画生成器 (P-COMIC_VIEWER.html)
- 基于小说场景生成四格漫画
- 智谱AI图像生成集成
- 漫画下载和分享功能

### 5. 智能批注查看器 (P-ANNOTATION_VIEWER.html)
- 场景分析、人物心理解读
- 情节意义和写作手法分析
- 批注复制和重新生成功能

### 6. 语义关系网络 (P-ANALYSIS_SEMANTIC.html)
- 概念、地点、事件关联分析
- 交互式网络图谱展示
- 节点详情深度解析

## API集成

### DeepSeek API
- **功能**: 文本分析、智能批注、内容生成
- **配置**: 通过api-config.js管理
- **主要用途**: 
  - 大纲总结生成
  - 角色分析
  - 语义网络分析
  - 智能批注生成

### 智谱AI API
- **功能**: 图像生成、四格漫画创作
- **配置**: 通过api-config.js管理
- **主要用途**: 
  - 四格漫画图像生成
  - 场景可视化展示

## 技术架构

### 前端技术
- HTML5 + CSS3 + JavaScript
- Tailwind CSS UI框架
- Font Awesome图标库
- 响应式设计，支持移动端

### API集成
- Fetch API进行HTTP请求
- JSON数据格式交互
- 异步加载和错误处理

### 文件结构
```
xiaoshuo/
├── api-config.js          # API配置管理
├── P-HOME.html            # 首页
├── P-SHELF.html           # 书架页面
├── P-READER.html          # 阅读器
├── P-ANALYSIS_OUTLINE.html # 大纲分析
├── P-ANALYSIS_CHARACTER.html # 角色图谱
├── P-ANALYSIS_SETTING.html  # 设定集分析
├── P-ANALYSIS_SEMANTIC.html # 语义网络
├── P-COMIC_VIEWER.html     # 四格漫画查看器
├── P-ANNOTATION_VIEWER.html # 智能批注查看器
└── README.md              # 项目说明
```

## 使用说明

### 1. 启动方式
直接打开HTML文件即可运行，无需服务器环境。

### 2. 主要操作流程
1. 打开P-HOME.html进入首页
2. 选择小说进入阅读器
3. 选择文本后使用工具栏功能：
   - 生成智能批注
   - 创建四格漫画
4. 通过侧边栏访问分析功能

### 3. API配置
在api-config.js中配置API密钥：
```javascript
const API_CONFIG = {
    deepseek: {
        url: "https://api.deepseek.com/v1/chat/completions",
        key: "your-deepseek-key",
        model: "deepseek-chat"
    },
    zhipu: {
        url: "https://open.bigmodel.cn/api/paas/v4/images/generations",
        key: "your-zhipu-key",
        model: "cogView-4-250304"
    }
};
```

## 优化特性

### 1. 内容匹配优化
- 修正了小说名目与正文内容不匹配的问题
- 增强了章节导航的准确性

### 2. 智能生成质量提升
- 集成专业AI模型提升生成内容质量
- 优化了提示词工程，确保分析深度

### 3. 用户体验改进
- 加载状态提示和错误处理
- 响应式设计适配多设备
- 直观的可视化展示

## 注意事项

1. **API密钥安全**: 当前使用调试密钥，生产环境请使用安全存储方案
2. **网络要求**: 需要互联网连接以调用API服务
3. **浏览器兼容**: 建议使用现代浏览器（Chrome、Firefox、Safari等）
4. **性能优化**: 大文件处理时注意内存使用

## 开发计划

- [ ] 添加离线缓存功能
- [ ] 实现用户个性化设置
- [ ] 增加更多小说分析维度
- [ ] 优化移动端交互体验
- [ ] 添加多语言支持

## 许可证

本项目仅供学习和演示使用，请遵守相关API服务的使用条款。