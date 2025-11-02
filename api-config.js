// API配置 - 小说智阅坊
window.API_CONFIG = {
    // DeepSeek API配置 - 文本生成
    DEEPSEEK: {
        BASE_URL: 'https://api.deepseek.com/v1',
        API_KEY: 'sk-d1d3d5dd821046a8906bb77eebf436d6',
        MODEL: 'deepseek-chat',
        ENDPOINTS: {
            CHAT: '/chat/completions'
        }
    },
    
    // 火山方舟API配置 - 图像生成
    VOLCANO_ARK: {
        BASE_URL: '', // 使用相对路径，Netlify会自动重定向到函数
        API_KEY: 'bdc88b39-5c8d-45c4-b78d-fb71fbd0b534',
        MODEL: 'doubao-seedream-4-0-250828', // 指定模型
        ENDPOINTS: {
            IMAGE_GENERATION: '/api/generate-comic-panel'
        }
    },
    
    // CORS代理配置
    PROXY: {
        ENABLED: true,
        BASE_URL: 'https://cors-anywhere.herokuapp.com/',
        ALTERNATIVES: [
            'https://api.allorigins.win/get?url=',
            'https://corsproxy.io/?'
        ]
    },
    
    // 应用配置
    APP: {
        NAME: '小说智阅坊',
        VERSION: '1.0.0',
        DEBUG: false
    }
};

// API服务类
class APIService {
    constructor() {
        this.config = window.API_CONFIG;
    }
    
    // 通用API调用方法
    async callAPI(apiConfig, endpoint, data, options = {}) {
        const url = apiConfig.BASE_URL + endpoint;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiConfig.API_KEY}`,
            ...options.headers
        };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API调用失败:', error);
            
            // 如果启用了代理，尝试使用代理
            if (this.config.PROXY.ENABLED) {
                return await this.callWithProxy(apiConfig, endpoint, data, options);
            }
            
            throw error;
        }
    }
    
    // 使用代理调用API
    async callWithProxy(apiConfig, endpoint, data, options) {
        const proxyUrls = [this.config.PROXY.BASE_URL, ...this.config.PROXY.ALTERNATIVES];
        
        for (const proxyUrl of proxyUrls) {
            try {
                const targetUrl = apiConfig.BASE_URL + endpoint;
                const proxyFullUrl = proxyUrl + encodeURIComponent(targetUrl);
                
                const response = await fetch(proxyFullUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiConfig.API_KEY}`,
                        ...options.headers
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    return await response.json();
                }
            } catch (error) {
                console.warn(`代理 ${proxyUrl} 失败:`, error);
                continue;
            }
        }
        
        throw new Error('所有代理服务器都失败了');
    }
    
    // DeepSeek文本生成
    async generateText(prompt, maxTokens = 1000) {
        const data = {
            model: this.config.DEEPSEEK.MODEL,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: maxTokens,
            temperature: 0.7
        };
        
        const result = await this.callAPI(
            this.config.DEEPSEEK, 
            this.config.DEEPSEEK.ENDPOINTS.CHAT, 
            data
        );
        
        return result.choices[0].message.content;
    }
    
    // 火山方舟图像生成
    async generateVolcanoImage(prompt, size = '1024x1024') {
        const data = {
            prompt: prompt,
            size: size,
            model: this.config.VOLCANO_ARK.MODEL
        };
        
        try {
            const response = await fetch(`${this.config.VOLCANO_ARK.BASE_URL}/generate-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            console.log('API响应结果:', result);
            
            // 修复API响应格式处理
            if (result.success && result.data && result.data.data && result.data.data.length > 0) {
                const imageUrl = result.data.data[0].url;
                console.log('获取到图像URL:', imageUrl);
                return imageUrl;
            } else if (result.success && result.data && result.data.url) {
                // 备用格式处理
                const imageUrl = result.data.url;
                console.log('获取到图像URL(备用格式):', imageUrl);
                return imageUrl;
            } else {
                console.error('API返回数据格式错误:', result);
                throw new Error('API返回数据格式错误');
            }
        } catch (error) {
            console.error('火山方舟API调用失败:', error);
            throw error;
        }
    }
    
    // 生成四格漫画图像（黑白简笔画风格）
    async generateComicImage(panelDescription, panelNumber) {
        // 使用新的简化版API端点
        const data = {
            panelDescription: panelDescription,
            panelNumber: panelNumber
        };
        
        try {
            const response = await fetch(`${this.config.VOLCANO_ARK.BASE_URL}/generate-comic-panel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            console.log('单格漫画API响应结果:', result);
            
            if (result.success && result.data && result.data.imageUrl) {
                return result.data.imageUrl;
            } else {
                console.error('单格漫画生成API返回数据格式错误:', result);
                throw new Error('单格漫画生成API返回数据格式错误');
            }
        } catch (error) {
            console.error('单格漫画生成API调用失败:', error);
            throw error;
        }
    }
    
    // 批量生成四格漫画（逐个生成，避免超时）
    async generateComicPanels(panelDescriptions) {
        const comicPanels = [];
        
        for (let i = 0; i < Math.min(panelDescriptions.length, 4); i++) {
            try {
                const imageUrl = await this.generateComicImage(panelDescriptions[i], i + 1);
                comicPanels.push({
                    panelNumber: i + 1,
                    description: panelDescriptions[i],
                    imageUrl: imageUrl,
                    success: true
                });
                
                // 添加延迟避免API限制
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                comicPanels.push({
                    panelNumber: i + 1,
                    description: panelDescriptions[i],
                    error: error.message,
                    success: false
                });
            }
        }
        
        return comicPanels;
    }
}

// 创建全局API服务实例
window.apiService = new APIService();