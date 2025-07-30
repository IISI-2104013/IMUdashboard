# 🚀 快速開始指南

## 立即體驗Dashboard

您現在有兩個選項來運行Dashboard：

### 🎭 選項1: 模擬數據模式（立即可用）
```bash
npm run demo
```
- 服務器地址：http://localhost:3001
- 使用模擬數據展示完整功能
- 無需任何設定，立即可用

### 📊 選項2: 真實Google Sheets連接
```bash
npm start
```
- 服務器地址：http://localhost:3000  
- 連接您的真實Google Sheets數據
- 需要先完成Google API設定

---

## 📋 Google Sheets設定步驟

如果您想連接真實的Google Sheets數據，請按照以下步驟：

1. **閱讀詳細設定指南**：[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)

2. **快速設定清單**：
   - [ ] 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - [ ] 創建專案並啟用Google Sheets API
   - [ ] 創建API Key
   - [ ] 將您的Google Sheets設為公開檢視
   - [ ] 將API Key複製到`.env`檔案
   - [ ] 重新啟動服務器

3. **您的Google Sheets資訊**：
   - 連結：https://reurl.cc/9n1Q7n
   - 工作表名稱：`IMU雲端查詢系統_進度管控表`
   - Spreadsheet ID：`1DIFi-3n0LL--Ss-BNgYJYaGLb3v2s0-NWGOVNp8w5hs`

---

## 🎨 Dashboard功能特色

✅ **統計概覽**
- 總專案數、整體進度、團隊數量、開發人員數量

✅ **視覺化圖表** 
- 團隊進度橫條圖
- 程式語言分布圓餅圖

✅ **個人績效**
- 按進度排序的個人統計
- 視覺化進度條

✅ **專案清單**
- 完整的專案資訊表格
- 進度狀態色彩標示

✅ **自動更新**
- 每5分鐘自動重新整理數據
- 實時顯示最後更新時間

✅ **響應式設計**
- 支援桌面和行動裝置
- 使用繁體中文介面

---

## 🛠 開發命令

```bash
# 安裝依賴
npm install

# 模擬數據模式（推薦先試用）
npm run demo

# 真實數據模式
npm start

# 開發模式（自動重新載入）
npm run dev
npm run dev-demo

# 查看版本
npm --version
node --version
```

---

## 📱 瀏覽器訪問

### 模擬數據版本
http://localhost:3001

### 真實數據版本  
http://localhost:3000

### API端點測試
- 模擬數據：http://localhost:3001/api/data
- 真實數據：http://localhost:3000/api/data

---

## 🎯 部署到GitHub Pages

準備部署到GitHub Pages時，請查看：
- [README.md](./README.md) - 完整的部署指南
- `.gitignore` - 已配置正確的忽略文件

---

## 💡 使用建議

1. **第一次使用**：建議先運行`npm run demo`來體驗完整功能
2. **正式使用**：完成Google API設定後使用`npm start`
3. **開發調試**：使用`npm run dev`可自動重新載入
4. **部署準備**：確保`.env`檔案不會被提交到版本控制

---

## 🔧 故障排除

如果遇到問題，請檢查：

1. **端口衝突**：確認3000和3001端口未被佔用
2. **依賴安裝**：運行`npm install`重新安裝依賴
3. **權限問題**：確保有檔案讀寫權限
4. **防火牆**：確認防火牆未阻擋相關端口

需要詳細的技術支援，請查看 [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) 中的故障排除章節。

---

**🎉 享受您的IMU Dashboard體驗！**
