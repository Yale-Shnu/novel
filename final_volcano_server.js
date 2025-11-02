const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 8888;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 提供静态文件

// 火山方舟API配置
const VOLCANO_CONFIG = {
    API_KEY: "bdc88b39-5c8d-45c4-b78d-fb71fbd0b534",
    BASE_URL: "https://ark.cn-beijing.volces.com/api/v3",
    MODEL: "doubao-seedream-4-0-250828"
};

// 图像生成代理端点
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, size = '1024x1024', model = VOLCANO_CONFIG.MODEL } = req.body;
        
        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: '缺少提示词参数'
            });
        }
        
        console.log('调用火山方舟API:', { model, size, promptLength: prompt.length });
        
        const postData = JSON.stringify({
            "model": model,
            "prompt": prompt,
            "sequential_image_generation": "disabled",
            "response_format": "url",
            "size": size,
            "stream": false,
            "watermark": true
        });
        
        const options = {
            hostname: 'ark.cn-beijing.volces.com',
            port: 443,
            path: '/api/v3/images/generations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${VOLCANO_CONFIG.API_KEY}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const apiResponse = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve({
                        status: res.statusCode,
                        data: data
                    });
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            req.write(postData);
            req.end();
        });
        
        if (apiResponse.status !== 200) {
            console.error('API请求失败:', apiResponse.status, apiResponse.data);
            return res.status(apiResponse.status).json({
                success: false,
                error: `API请求失败: ${apiResponse.status}`,
                details: apiResponse.data
            });
        }
        
        const data = JSON.parse(apiResponse.data);
        console.log('API响应成功');
        
        res.json({
            success: true,
            data: data
        });
        
    } catch (error) {
        console.error('API调用错误:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 简化版四格漫画生成端点（逐个生成，避免超时）
app.post('/api/generate-comic-panel', async (req, res) => {
    try {
        const { panelDescription, panelNumber } = req.body;
        
        if (!panelDescription) {
            return res.status(400).json({
                success: false,
                error: '缺少漫画描述参数'
            });
        }
        
        console.log('生成单格漫画:', { panelNumber, descriptionLength: panelDescription.length });
        
        // 定制黑白简笔画风格的提示词
        const comicPrompt = `黑白简笔画风格，四格漫画第${panelNumber || 1}格，${panelDescription}。要求：黑白线条简笔画风格，简洁明了，适合漫画分格，不要彩色，只要黑白线条`;
        
        const postData = JSON.stringify({
            "model": VOLCANO_CONFIG.MODEL,
            "prompt": comicPrompt,
            "sequential_image_generation": "disabled",
            "response_format": "url",
            "size": '1024x1024',
            "stream": false,
            "watermark": true
        });
        
        const options = {
            hostname: 'ark.cn-beijing.volces.com',
            port: 443,
            path: '/api/v3/images/generations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${VOLCANO_CONFIG.API_KEY}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const apiResponse = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve({
                        status: res.statusCode,
                        data: data
                    });
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            req.write(postData);
            req.end();
        });
        
        if (apiResponse.status !== 200) {
            console.error('API请求失败:', apiResponse.status, apiResponse.data);
            return res.status(apiResponse.status).json({
                success: false,
                error: `API请求失败: ${apiResponse.status}`,
                details: apiResponse.data
            });
        }
        
        const data = JSON.parse(apiResponse.data);
        console.log('单格漫画生成成功');
        
        res.json({
            success: true,
            data: {
                panelNumber: panelNumber || 1,
                description: panelDescription,
                imageUrl: data.data[0].url,
                success: true
            }
        });
        
    } catch (error) {
        console.error('单格漫画生成错误:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: '火山方舟代理服务器运行正常',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('火山方舟API代理服务器已启动');
    console.log(`服务地址: http://localhost:${PORT}`);
    console.log('='.repeat(60));
});