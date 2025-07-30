// 測試Google Sheets連接的診斷腳本
const { google } = require('googleapis');
require('dotenv').config();

const SPREADSHEET_ID = '1SLjRNzzjm62PzKlifrEoFd2YplxLLf2i_2-c4l1IJBs';

async function testSheetAccess() {
  console.log('🔍 開始診斷Google Sheets連接...');
  console.log('📋 Spreadsheet ID:', SPREADSHEET_ID);
  console.log('🔑 API Key:', process.env.GOOGLE_API_KEY ? '已設定 (前8字元: ' + process.env.GOOGLE_API_KEY.substring(0, 8) + '...)' : '未設定');
  
  try {
    const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_API_KEY });
    
    // 1. 測試基本工作表訪問
    console.log('\n📊 測試 1: 取得工作表資訊...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    
    console.log('✅ 工作表標題:', spreadsheet.data.properties.title);
    console.log('📝 工作表清單:');
    spreadsheet.data.sheets.forEach((sheet, index) => {
      console.log(`  ${index + 1}. ${sheet.properties.title} (ID: ${sheet.properties.sheetId})`);
    });
    
    // 2. 測試各種可能的工作表名稱
    const possibleSheetNames = [
      'IMU雲端查詢系統_進度管控表',
      '工作表1',
      'Sheet1',
      spreadsheet.data.sheets[0]?.properties.title // 使用第一個工作表
    ];
    
    for (const sheetName of possibleSheetNames) {
      if (!sheetName) continue;
      
      console.log(`\n📊 測試工作表: "${sheetName}"`);
      try {
        const range = `${sheetName}!A1:M10`; // 只取前10行來測試
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: range,
        });
        
        const rows = response.data.values;
        console.log('✅ 成功讀取', rows ? rows.length : 0, '行數據');
        
        if (rows && rows.length > 0) {
          console.log('📋 第一行（標題行）:', rows[0]);
          if (rows.length > 1) {
            console.log('📋 第二行（範例數據）:', rows[1]);
          }
          
          // 如果找到了數據，嘗試完整範圍
          const fullRange = `${sheetName}!A:M`;
          const fullResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: fullRange,
          });
          
          const allRows = fullResponse.data.values;
          console.log('📊 總數據行數:', allRows ? allRows.length : 0);
          break; // 找到有效工作表就停止
        }
      } catch (error) {
        console.log('❌ 無法讀取工作表:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ 連接錯誤:', error.message);
    
    if (error.message.includes('API key not valid')) {
      console.log('\n🔧 可能的解決方案:');
      console.log('1. 確認 API Key 正確');
      console.log('2. 確認已啟用 Google Sheets API');
      console.log('3. 檢查 API Key 權限設定');
    } else if (error.message.includes('not found')) {
      console.log('\n🔧 可能的解決方案:');
      console.log('1. 確認 Spreadsheet ID 正確');
      console.log('2. 確認工作表為公開或可分享');
    }
  }
}

testSheetAccess();
