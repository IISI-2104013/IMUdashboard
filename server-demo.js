// 模擬數據版本的服務器，用於展示Dashboard效果
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 模擬的Google Sheets數據
const mockData = [
  {
    '應用程式代號': 'APP001',
    '需求類型': '新開發',
    '程式語言': 'React.js',
    '應用程式名稱': '客戶管理系統',
    '團隊': '前端開發組',
    '程式開發人員姓名': '張小明',
    '預計開發人日': '15',
    '啟動日期': '2025-01-15',
    '預計完成日期': '2025-02-28',
    '二代轉三代(%)': '80',
    '介接MangoDB(%)': '90',
    '開發進度%': '85'
  },
  {
    '應用程式代號': 'APP002',
    '需求類型': '維護',
    '程式語言': 'Node.js',
    '應用程式名稱': 'API服務系統',
    '團隊': '後端開發組',
    '程式開發人員姓名': '李美玲',
    '預計開發人日': '12',
    '啟動日期': '2025-01-20',
    '預計完成日期': '2025-03-15',
    '二代轉三代(%)': '95',
    '介接MangoDB(%)': '100',
    '開發進度%': '92'
  },
  {
    '應用程式代號': 'APP003',
    '需求類型': '新開發',
    '程式語言': 'Vue.js',
    '應用程式名稱': '進度管控系統',
    '團隊': '前端開發組',
    '程式開發人員姓名': '王大華',
    '預計開發人日': '20',
    '啟動日期': '2025-01-10',
    '預計完成日期': '2025-02-20',
    '二代轉三代(%)': '70',
    '介接MangoDB(%)': '85',
    '開發進度%': '78'
  },
  {
    '應用程式代號': 'APP004',
    '需求類型': '增強',
    '程式語言': 'Python',
    '應用程式名稱': '數據分析平台',
    '團隊': '數據組',
    '程式開發人員姓名': '陳志強',
    '預計開發人日': '25',
    '啟動日期': '2025-01-05',
    '預計完成日期': '2025-03-01',
    '二代轉三代(%)': '60',
    '介接MangoDB(%)': '75',
    '開發進度%': '68'
  },
  {
    '應用程式代號': 'APP005',
    '需求類型': '新開發',
    '程式語言': 'Java',
    '應用程式名稱': '企業資源規劃系統',
    '團隊': '後端開發組',
    '程式開發人員姓名': '林小雅',
    '預計開發人日': '30',
    '啟動日期': '2025-01-01',
    '預計完成日期': '2025-03-30',
    '二代轉三代(%)': '45',
    '介接MangoDB(%)': '60',
    '開發進度%': '55'
  },
  {
    '應用程式代號': 'APP006',
    '需求類型': '維護',
    '程式語言': 'React.js',
    '應用程式名稱': '用戶介面優化',
    '團隊': '前端開發組',
    '程式開發人員姓名': '張小明',
    '預計開發人日': '8',
    '啟動日期': '2025-02-01',
    '預計完成日期': '2025-02-15',
    '二代轉三代(%)': '100',
    '介接MangoDB(%)': '100',
    '開發進度%': '95'
  },
  {
    '應用程式代號': 'APP007',
    '需求類型': '新開發',
    '程式語言': 'Angular',
    '應用程式名稱': '行動應用管理',
    '團隊': '移動開發組',
    '程式開發人員姓名': '黃志明',
    '預計開發人日': '18',
    '啟動日期': '2025-01-25',
    '預計完成日期': '2025-03-10',
    '二代轉三代(%)': '35',
    '介接MangoDB(%)': '50',
    '開發進度%': '42'
  },
  {
    '應用程式代號': 'APP008',
    '需求類型': '增強',
    '程式語言': 'Python',
    '應用程式名稱': '機器學習模組',
    '團隊': '數據組',
    '程式開發人員姓名': '陳志強',
    '預計開發人日': '22',
    '啟動日期': '2025-01-12',
    '預計完成日期': '2025-02-25',
    '二代轉三代(%)': '80',
    '介接MangoDB(%)': '70',
    '開發進度%': '75'
  }
];

// 計算進度統計
function calculateProgress(data) {
  const stats = {
    totalProjects: data.length,
    averageProgress: 0,
    teamStats: {},
    individualStats: {},
    languageStats: {},
    typeStats: {}
  };

  if (data.length === 0) return stats;

  let totalProgress = 0;
  
  data.forEach(item => {
    // 計算整體進度（取開發進度%）
    const progress = parseFloat(item['開發進度%']) || 0;
    totalProgress += progress;

    // 團隊統計
    const team = item['團隊'] || '未分配';
    if (!stats.teamStats[team]) {
      stats.teamStats[team] = { count: 0, totalProgress: 0, projects: [] };
    }
    stats.teamStats[team].count++;
    stats.teamStats[team].totalProgress += progress;
    stats.teamStats[team].projects.push(item);

    // 個人統計
    const developer = item['程式開發人員姓名'] || '未分配';
    if (!stats.individualStats[developer]) {
      stats.individualStats[developer] = { count: 0, totalProgress: 0, projects: [] };
    }
    stats.individualStats[developer].count++;
    stats.individualStats[developer].totalProgress += progress;
    stats.individualStats[developer].projects.push(item);

    // 程式語言統計
    const language = item['程式語言'] || '未指定';
    if (!stats.languageStats[language]) {
      stats.languageStats[language] = { count: 0, totalProgress: 0 };
    }
    stats.languageStats[language].count++;
    stats.languageStats[language].totalProgress += progress;

    // 需求類型統計
    const type = item['需求類型'] || '未分類';
    if (!stats.typeStats[type]) {
      stats.typeStats[type] = { count: 0, totalProgress: 0 };
    }
    stats.typeStats[type].count++;
    stats.typeStats[type].totalProgress += progress;
  });

  // 計算平均進度
  stats.averageProgress = Math.round(totalProgress / data.length);

  // 計算各組平均進度
  Object.keys(stats.teamStats).forEach(team => {
    stats.teamStats[team].averageProgress = Math.round(
      stats.teamStats[team].totalProgress / stats.teamStats[team].count
    );
  });

  Object.keys(stats.individualStats).forEach(person => {
    stats.individualStats[person].averageProgress = Math.round(
      stats.individualStats[person].totalProgress / stats.individualStats[person].count
    );
  });

  Object.keys(stats.languageStats).forEach(lang => {
    stats.languageStats[lang].averageProgress = Math.round(
      stats.languageStats[lang].totalProgress / stats.languageStats[lang].count
    );
  });

  Object.keys(stats.typeStats).forEach(type => {
    stats.typeStats[type].averageProgress = Math.round(
      stats.typeStats[type].totalProgress / stats.typeStats[type].count
    );
  });

  return stats;
}

// API路由
app.get('/api/data', (req, res) => {
  try {
    const stats = calculateProgress(mockData);
    
    res.json({
      success: true,
      data: mockData,
      stats,
      lastUpdated: new Date().toISOString(),
      note: "這是模擬數據，用於展示Dashboard效果。請參考 GOOGLE_SHEETS_SETUP.md 來連接真實的Google Sheets。"
    });
  } catch (error) {
    console.error('API錯誤:', error);
    res.status(500).json({
      success: false,
      error: '無法獲取數據',
      message: error.message
    });
  }
});

// 主頁路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 啟動服務器
app.listen(port, () => {
  console.log(`🎭 模擬數據服務器運行在 http://localhost:${port}`);
  console.log(`📊 IMU雲端查詢系統進度管控表Dashboard（模擬模式）已啟動`);
  console.log(`📖 請查看 GOOGLE_SHEETS_SETUP.md 來設定真實的Google Sheets連接`);
});

module.exports = app;
