# Google Sheets API 設定指南

## 📋 目錄
1. [前置準備](#前置準備)
2. [Google Cloud Console 設定](#google-cloud-console-設定)
3. [取得 API Key](#取得-api-key)
4. [設定 Google Sheets 權限](#設定-google-sheets-權限)
5. [環境變數配置](#環境變數配置)
6. [測試連接](#測試連接)
7. [常見問題與解決方案](#常見問題與解決方案)

---

## 🚀 前置準備

### 確認 Google Sheets 連結
您的Google Sheets連結：`https://reurl.cc/9n1Q7n`

已自動解析的 Spreadsheet ID：`1DIFi-3n0LL--Ss-BNgYJYaGLb3v2s0-NWGOVNp8w5hs`

### 確認工作表名稱
工作表名稱：`IMU雲端查詢系統_進度管控表`

---

## 🔧 Google Cloud Console 設定

### 步驟 1: 前往 Google Cloud Console
1. 開啟瀏覽器，前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 使用您的 Google 帳號登入

### 步驟 2: 創建或選擇專案
```
選項 A: 創建新專案
1. 點擊頁面頂部的專案下拉選單
2. 點擊「新增專案」
3. 輸入專案名稱：IMU Dashboard
4. 點擊「建立」

選項 B: 使用現有專案
1. 點擊頁面頂部的專案下拉選單
2. 選擇您要使用的專案
```

### 步驟 3: 啟用 Google Sheets API
1. 在左側選單中，點擊「API 和服務」→「程式庫」
2. 搜尋「Google Sheets API」
3. 點擊「Google Sheets API」
4. 點擊「啟用」按鈕

---

## 🔑 取得 API Key

### 步驟 1: 創建憑證
1. 在左側選單中，點擊「API 和服務」→「憑證」
2. 點擊頁面頂部的「+ 建立憑證」
3. 選擇「API 金鑰」

### 步驟 2: 設定 API Key 限制（建議）
1. API Key 創建後，點擊「限制金鑰」
2. 在「應用程式限制」中選擇：
   - **開發環境**: 選擇「無」
   - **生產環境**: 選擇「HTTP 轉介連結」並加入您的網域

3. 在「API 限制」中：
   - 選擇「限制金鑰」
   - 在清單中勾選「Google Sheets API」

4. 點擊「儲存」

### 步驟 3: 複製 API Key
```
⚠️ 重要：請妥善保存您的 API Key
- 不要將 API Key 公開在 GitHub 或其他公開場所
- 建議定期輪換 API Key
```

---

## 📝 設定 Google Sheets 權限

### 步驟 1: 開啟您的 Google Sheets
前往：https://reurl.cc/9n1Q7n

### 步驟 2: 設定共用權限
1. 點擊右上角的「共用」按鈕
2. 在「一般存取權」中選擇：
   ```
   「知道連結的任何人」可以「檢視」
   ```
3. 點擊「完成」

### 步驟 3: 確認工作表名稱
確認工作表分頁名稱為：`IMU雲端查詢系統_進度管控表`

### 步驟 4: 驗證欄位結構
確認您的工作表包含以下欄位（A-M欄）：
```
A: 應用程式代號
B: 需求類型  
C: (可忽略)
D: 程式語言
E: 應用程式名稱
F: 團隊
G: 程式開發人員姓名
H: 預計開發人日
I: 啟動日期
J: 預計完成日期
K: 二代轉三代(%)
L: 介接MangoDB(%)
M: 開發進度%
```

---

## 🔐 環境變數配置

### 步驟 1: 編輯 .env 檔案
在專案根目錄找到 `.env` 檔案，使用文字編輯器開啟：

```env
# Google Sheets API Key (請替換為您的實際 API Key)
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 服務器端口
PORT=3000

# 生產環境設置
NODE_ENV=development
```

### 步驟 2: 替換 API Key
將 `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 替換為您從 Google Cloud Console 取得的實際 API Key。

### 步驟 3: 儲存檔案
確保儲存 `.env` 檔案的變更。

---

## 🧪 測試連接

### 步驟 1: 重新啟動服務器
```bash
# 停止當前服務器 (按 Ctrl+C)
# 然後重新啟動
npm start
```

### 步驟 2: 檢查服務器日誌
正常情況下應該看到：
```
🚀 Dashboard服務器運行在 http://localhost:3000
📊 IMU雲端查詢系統進度管控表Dashboard已啟動
```

### 步驟 3: 測試 API 端點
在瀏覽器中開啟：http://localhost:3000/api/data

成功的回應格式：
```json
{
  "success": true,
  "data": [...],
  "stats": {...},
  "lastUpdated": "2025-07-30T09:xx:xx.xxxZ"
}
```

### 步驟 4: 開啟 Dashboard
在瀏覽器中開啟：http://localhost:3000

您應該能看到：
- 統計卡片顯示實際數據
- 圖表正常載入
- 專案清單顯示您的數據

---

## ❗ 常見問題與解決方案

### 問題 1: "API key not valid"
**原因**: API Key 無效或未正確設定
**解決方案**:
1. 確認 API Key 正確複製到 `.env` 檔案
2. 確認 Google Sheets API 已啟用
3. 檢查 API Key 是否有正確的權限限制

### 問題 2: "The caller does not have permission"
**原因**: Google Sheets 權限設定問題
**解決方案**:
1. 確認 Google Sheets 設為「知道連結的任何人都可檢視」
2. 確認 Spreadsheet ID 正確

### 問題 3: "Unable to parse range"
**原因**: 工作表名稱不正確
**解決方案**:
1. 確認工作表分頁名稱為：`IMU雲端查詢系統_進度管控表`
2. 如果名稱不同，請修改 `server.js` 中的 `RANGE` 變數

### 問題 4: Dashboard 顯示空數據
**原因**: 可能是數據格式問題
**解決方案**:
1. 確認第一行是標題行
2. 確認進度欄位使用數字格式（如：75，不是 75%）
3. 確認日期格式正確

### 問題 5: CORS 錯誤
**原因**: 跨域請求問題
**解決方案**:
這在本地開發中不應該發生，如果遇到，請確認：
1. 服務器正常運行
2. 前端和後端使用相同的域名和端口

---

## 📞 技術支援

如果您在設定過程中遇到問題，請檢查：

1. **伺服器日誌**: 查看終端中的錯誤訊息
2. **瀏覽器控制台**: 按 F12 查看 JavaScript 錯誤
3. **網路請求**: 在開發者工具的 Network 分頁檢查 API 請求

### 快速診斷清單
- [ ] Google Cloud 專案已創建
- [ ] Google Sheets API 已啟用
- [ ] API Key 已創建並複製到 `.env`
- [ ] Google Sheets 權限設為公開檢視
- [ ] 工作表名稱正確
- [ ] 欄位結構符合要求
- [ ] 服務器重新啟動
- [ ] 沒有防火牆阻擋 3000 端口

---

## 🔒 安全性最佳實務

1. **保護 API Key**:
   - 不要提交 `.env` 到版本控制
   - 定期輪換 API Key
   - 在生產環境使用 HTTP 轉介連結限制

2. **數據安全**:
   - 確保 Google Sheets 只包含可公開的資訊
   - 定期檢查共用權限

3. **部署安全**:
   - 在 GitHub 使用 Secrets 管理環境變數
   - 考慮使用 Service Account 而非 API Key（進階用法）

---

**設定完成後，您的 IMU Dashboard 就可以正常顯示 Google Sheets 中的進度數據了！** 🎉
