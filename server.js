const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Google Sheets配置
const SPREADSHEET_ID = '1SLjRNzzjm62PzKlifrEoFd2YplxLLf2i_2-c4l1IJBs'; // 從您提供的URL提取的ID
const RANGE = 'IMU!A:M'; // 實際的工作表名稱是 "IMU"

// 初始化Google Sheets API
async function getGoogleSheetsData() {
  try {
    // 使用API Key方式（適合公開的只讀工作表）
    const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_API_KEY });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // 處理數據，第一行是標題
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      
      // 創建標準化的欄位名稱對應
      const standardized = {
        '應用程式代號': obj['應用程式代號'] || '',
        '需求類型': obj['需求類型'] || '',
        '程式語言': obj['程式\n語言\n下拉\n選單'] || obj['程式語言'] || '',
        '應用程式名稱': obj['應用程式名稱'] || '',
        '團隊': obj['團隊'] || '',
        '程式開發人員姓名': obj['程式開發人員姓名'] || '',
        '預計開發人日': obj['預計開發人日'] || '',
        '啟動日期': obj['啟動日期'] || '',
        '預計完成日期': obj['預計完成日期'] || '',
        '二代轉三代(%)': obj['二代轉三代(%)'] || '',
        '介接MangoDB(%)': obj['介接MangoDB(%)'] || '',
        '開發進度%': obj['開發\n進度%'] || obj['開發進度%'] || ''
      };
      
      return standardized;
    });

    return data;
  } catch (error) {
    console.error('獲取Google Sheets數據時發生錯誤:', error);
    return [];
  }
}

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
    // 計算整體進度（取開發進度%，移除%符號並轉換為數字）
    const progressStr = (item['開發進度%'] || '0').toString().replace('%', '');
    const progress = parseFloat(progressStr) || 0;
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
app.get('/api/data', async (req, res) => {
  try {
    const data = await getGoogleSheetsData();
    const stats = calculateProgress(data);
    
    res.json({
      success: true,
      data,
      stats,
      lastUpdated: new Date().toISOString()
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
  console.log(`🚀 Dashboard服務器運行在 http://localhost:${port}`);
  console.log(`📊 IMU雲端查詢系統進度管控表Dashboard已啟動`);
});

module.exports = app;
