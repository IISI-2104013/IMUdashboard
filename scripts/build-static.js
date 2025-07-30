const fs = require('fs');
const path = require('path');

// 為GitHub Pages創建靜態版本
async function buildStatic() {
    console.log('🔨 構建GitHub Pages靜態版本...');
    
    // 創建docs目錄（GitHub Pages使用）
    const docsDir = path.join(__dirname, '..', 'docs');
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir);
    }
    
    // 複製public目錄到docs
    const publicDir = path.join(__dirname, '..', 'public');
    copyDir(publicDir, docsDir);
    
    // 修改HTML文件以使用靜態數據
    const indexPath = path.join(docsDir, 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // 替換API調用為靜態數據
    indexContent = indexContent.replace(
        '<script src="script.js"></script>',
        '<script src="script-static.js"></script>'
    );
    
    fs.writeFileSync(indexPath, indexContent);
    
    // 創建靜態版本的JavaScript
    createStaticScript(docsDir);
    
    // 創建示例數據
    createSampleData(docsDir);
    
    console.log('✅ 靜態版本構建完成！');
    console.log('📁 文件位置: docs/');
    console.log('🌐 可以直接部署到GitHub Pages');
}

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function createStaticScript(docsDir) {
    const staticScript = `
// 靜態版本的Dashboard腳本
let dashboardData = null;
let teamChart = null;
let languageChart = null;

// 初始化Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadStaticData();
});

// 載入靜態數據
async function loadStaticData() {
    try {
        showLoading();
        const response = await fetch('sample-data.json');
        const result = await response.json();
        
        dashboardData = result;
        updateDashboard(result);
        hideLoading();
    } catch (error) {
        console.error('載入數據失敗:', error);
        showError('載入數據失敗: ' + error.message);
        hideLoading();
    }
}

// 重新整理數據（靜態版本）
function refreshData() {
    loadStaticData();
}

// 複製原有的其他函數
${fs.readFileSync(path.join(__dirname, '..', 'public', 'script.js'), 'utf8')
    .replace('async function loadData() {', 'async function loadData_disabled() {')
    .replace('function refreshData() {', 'function refreshData_original() {')}
`;
    
    fs.writeFileSync(path.join(docsDir, 'script-static.js'), staticScript);
}

function createSampleData(docsDir) {
    // 創建示例數據
    const sampleData = {
        success: true,
        data: [
            {
                '應用程式代號': 'APP001',
                '需求類型': '新建',
                '程式語言': 'JavaScript',
                '應用程式名稱': '客戶管理系統',
                '團隊': '前端開發組',
                '程式開發人員姓名': '張小明',
                '預計開發人日': '15',
                '啟動日期': '2023-11-01',
                '預計完成日期': '2023-12-15',
                '二代轉三代(%)': '80',
                '介接MangoDB(%)': '90',
                '開發進度%': '75'
            },
            {
                '應用程式代號': 'APP002',
                '需求類型': '維護',
                '程式語言': 'Python',
                '應用程式名稱': '數據分析平台',
                '團隊': '後端開發組',
                '程式開發人員姓名': '李小華',
                '預計開發人日': '20',
                '啟動日期': '2023-10-15',
                '預計完成日期': '2023-12-01',
                '二代轉三代(%)': '95',
                '介接MangoDB(%)': '85',
                '開發進度%': '90'
            },
            {
                '應用程式代號': 'APP003',
                '需求類型': '優化',
                '程式語言': 'Java',
                '應用程式名稱': '庫存管理系統',
                '團隊': '系統架構組',
                '程式開發人員姓名': '王大寶',
                '預計開發人日': '12',
                '啟動日期': '2023-11-10',
                '預計完成日期': '2023-12-20',
                '二代轉三代(%)': '60',
                '介接MangoDB(%)': '70',
                '開發進度%': '45'
            },
            {
                '應用程式代號': 'APP004',
                '需求類型': '新建',
                '程式語言': 'React',
                '應用程式名稱': '報表系統',
                '團隊': '前端開發組',
                '程式開發人員姓名': '陳小美',
                '預計開發人日': '18',
                '啟動日期': '2023-11-05',
                '預計完成日期': '2023-12-25',
                '二代轉三代(%)': '85',
                '介接MangoDB(%)': '80',
                '開發進度%': '65'
            },
            {
                '應用程式代號': 'APP005',
                '需求類型': '維護',
                '程式語言': 'Node.js',
                '應用程式名稱': 'API閘道器',
                '團隊': '後端開發組',
                '程式開發人員姓名': '林小強',
                '預計開發人日': '25',
                '啟動日期': '2023-10-20',
                '預計完成日期': '2023-12-10',
                '二代轉三代(%)': '100',
                '介接MangoDB(%)': '95',
                '開發進度%': '95'
            }
        ],
        stats: {
            totalProjects: 5,
            averageProgress: 74,
            teamStats: {
                '前端開發組': {
                    count: 2,
                    totalProgress: 140,
                    averageProgress: 70,
                    projects: []
                },
                '後端開發組': {
                    count: 2,
                    totalProgress: 185,
                    averageProgress: 93,
                    projects: []
                },
                '系統架構組': {
                    count: 1,
                    totalProgress: 45,
                    averageProgress: 45,
                    projects: []
                }
            },
            individualStats: {
                '張小明': {
                    count: 1,
                    totalProgress: 75,
                    averageProgress: 75,
                    projects: []
                },
                '李小華': {
                    count: 1,
                    totalProgress: 90,
                    averageProgress: 90,
                    projects: []
                },
                '王大寶': {
                    count: 1,
                    totalProgress: 45,
                    averageProgress: 45,
                    projects: []
                },
                '陳小美': {
                    count: 1,
                    totalProgress: 65,
                    averageProgress: 65,
                    projects: []
                },
                '林小強': {
                    count: 1,
                    totalProgress: 95,
                    averageProgress: 95,
                    projects: []
                }
            },
            languageStats: {
                'JavaScript': { count: 1, totalProgress: 75, averageProgress: 75 },
                'Python': { count: 1, totalProgress: 90, averageProgress: 90 },
                'Java': { count: 1, totalProgress: 45, averageProgress: 45 },
                'React': { count: 1, totalProgress: 65, averageProgress: 65 },
                'Node.js': { count: 1, totalProgress: 95, averageProgress: 95 }
            },
            typeStats: {
                '新建': { count: 2, totalProgress: 140, averageProgress: 70 },
                '維護': { count: 2, totalProgress: 185, averageProgress: 93 },
                '優化': { count: 1, totalProgress: 45, averageProgress: 45 }
            }
        },
        lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(
        path.join(docsDir, 'sample-data.json'), 
        JSON.stringify(sampleData, null, 2)
    );
}

// 運行構建
if (require.main === module) {
    buildStatic().catch(console.error);
}

module.exports = { buildStatic };
