# IMU雲端查詢系統進度管控表Dashboard

這是一個漂亮的Node.js Dashboard，用於顯示Google Sheets中的IMU雲端查詢系統進度管控表數據。

## 功能特色

- 📊 **實時數據同步** - 自動從Google Sheets獲取最新數據
- 📈 **互動式圖表** - 使用Chart.js展示團隊和個人進度
- 👥 **多維度統計** - 整體進度、團隊統計、個人績效分析
- 🎨 **響應式設計** - 支援桌面和行動裝置
- 🔄 **自動重新整理** - 每5分鐘自動更新數據
- 💾 **數據匯出** - 支援JSON格式數據匯出

## 技術架構

- **後端**: Node.js + Express
- **前端**: Bootstrap 5 + Chart.js
- **數據源**: Google Sheets API
- **字體**: Noto Sans TC (繁體中文支援)

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設置Google Sheets API

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用Google Sheets API
4. 創建API Key (適用於公開工作表)
5. 將API Key複製到 `.env` 檔案中

### 3. 配置環境變數

編輯 `.env` 檔案：

```env
GOOGLE_API_KEY=your_google_api_key_here
PORT=3000
NODE_ENV=development
```

### 4. 確保Google Sheets權限

確保您的Google Sheets工作表：
- 設為「知道連結的任何人都可檢視」
- 包含正確的工作表名稱：`IMU雲端查詢系統_進度管控表`

### 5. 啟動應用程式

```bash
# 開發模式
npm run dev

# 生產模式
npm start
```

### 6. 訪問Dashboard

開啟瀏覽器前往: http://localhost:3000

## 數據欄位說明

Dashboard會顯示以下欄位的數據：

- **A欄**: 應用程式代號
- **B欄**: 需求類型
- **D欄**: 程式語言
- **E欄**: 應用程式名稱
- **F欄**: 團隊
- **G欄**: 程式開發人員姓名
- **H欄**: 預計開發人日
- **I欄**: 啟動日期
- **J欄**: 預計完成日期
- **K欄**: 二代轉三代(%)
- **L欄**: 介接MangoDB(%)
- **M欄**: 開發進度%

## Dashboard功能

### 統計卡片
- 總專案數
- 整體進度百分比
- 團隊數量
- 開發人員數量

### 圖表分析
- **團隊進度統計**: 橫條圖顯示各團隊平均進度
- **程式語言分布**: 圓餅圖顯示不同程式語言的使用情況

### 個人進度區域
- 按進度排序的個人績效
- 顯示每人負責的專案數量
- 視覺化進度條

### 專案清單
- 完整的專案資訊表格
- 可排序和篩選
- 進度狀態色彩標示

## 部署到GitHub Pages

### 1. 準備靜態版本

由於GitHub Pages不支援Node.js後端，需要創建靜態版本：

```bash
# 創建靜態版本的腳本
node scripts/build-static.js
```

### 2. 推送到GitHub

```bash
git add .
git commit -m "Add IMU Dashboard"
git push origin main
```

### 3. 設置GitHub Pages

1. 前往GitHub倉庫設定
2. 在Pages部分選擇來源分支
3. 選擇根目錄或docs資料夾

## 環境需求

- Node.js 14.0.0 或更新版本
- Google Sheets API存取權限
- 現代瀏覽器 (支援ES6+)

## API端點

### GET /api/data

返回所有專案數據和統計資訊：

```json
{
  "success": true,
  "data": [...], // 專案清單
  "stats": {
    "totalProjects": 10,
    "averageProgress": 75,
    "teamStats": {...},
    "individualStats": {...},
    "languageStats": {...},
    "typeStats": {...}
  },
  "lastUpdated": "2023-12-01T10:00:00.000Z"
}
```

## 自定義設定

### 修改更新頻率

在 `script.js` 中修改自動重新整理間隔：

```javascript
// 每5分鐘更新（預設）
setInterval(loadData, 5 * 60 * 1000);

// 改為每10分鐘更新
setInterval(loadData, 10 * 60 * 1000);
```

### 修改Google Sheets範圍

在 `server.js` 中修改資料範圍：

```javascript
const RANGE = 'IMU雲端查詢系統_進度管控表!A:M'; // 預設範圍
```

## 故障排除

### 常見問題

1. **API Key錯誤**
   - 確認API Key正確
   - 檢查Google Sheets API已啟用

2. **工作表無法存取**
   - 確認工作表為公開狀態
   - 檢查工作表名稱是否正確

3. **數據不顯示**
   - 檢查網路連線
   - 查看瀏覽器控制台錯誤訊息

### 日誌檢查

啟動伺服器時會顯示詳細日誌：

```bash
npm start
```

## 授權

MIT License

## 貢獻

歡迎提交Issue和Pull Request來改進這個專案。
