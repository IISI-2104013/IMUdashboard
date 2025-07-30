// 全局變數
let dashboardData = null;
let teamChart = null;
let languageChart = null;

// 初始化Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // 設置自動重新整理（每5分鐘）
    setInterval(loadData, 5 * 60 * 1000);
});

// 載入數據
async function loadData() {
    try {
        showLoading();
        const response = await fetch('/api/data');
        const result = await response.json();
        
        if (result.success) {
            dashboardData = result;
            updateDashboard(result);
            hideLoading();
        } else {
            throw new Error(result.message || '無法載入數據');
        }
    } catch (error) {
        console.error('載入數據失敗:', error);
        showError('載入數據失敗: ' + error.message);
        hideLoading();
    }
}

// 更新Dashboard
function updateDashboard(data) {
    updateStatCards(data.stats);
    updateLastUpdated(data.lastUpdated);
    updateCharts(data.stats);
    updateIndividualProgress(data.stats.individualStats);
    updateProjectTable(data.data);
}

// 更新統計卡片
function updateStatCards(stats) {
    document.getElementById('totalProjects').textContent = stats.totalProjects;
    document.getElementById('overallProgress').textContent = stats.averageProgress + '%';
    document.getElementById('teamCount').textContent = Object.keys(stats.teamStats).length;
    document.getElementById('developerCount').textContent = Object.keys(stats.individualStats).length;
}

// 更新最後更新時間
function updateLastUpdated(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('lastUpdated').innerHTML = `
        <i class="fas fa-clock me-1"></i>
        最後更新: ${formattedDate}
    `;
}

// 更新圖表
function updateCharts(stats) {
    updateTeamChart(stats.teamStats);
    updateLanguageChart(stats.languageStats);
}

// 更新團隊進度圖表
function updateTeamChart(teamStats) {
    const ctx = document.getElementById('teamProgressChart').getContext('2d');
    
    if (teamChart) {
        teamChart.destroy();
    }
    
    const teams = Object.keys(teamStats);
    const progressData = teams.map(team => teamStats[team].averageProgress);
    const projectCounts = teams.map(team => teamStats[team].count);
    
    teamChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teams,
            datasets: [{
                label: '平均進度 (%)',
                data: progressData,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const teamName = context.label;
                            const projectCount = projectCounts[context.dataIndex];
                            return `專案數量: ${projectCount}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// 更新程式語言圖表
function updateLanguageChart(languageStats) {
    const ctx = document.getElementById('languageChart').getContext('2d');
    
    if (languageChart) {
        languageChart.destroy();
    }
    
    const languages = Object.keys(languageStats);
    const counts = languages.map(lang => languageStats[lang].count);
    
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    languageChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: languages,
            datasets: [{
                data: counts,
                backgroundColor: colors.slice(0, languages.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            family: 'Noto Sans TC'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const language = context.label;
                            const count = context.parsed;
                            const avgProgress = languageStats[language].averageProgress;
                            return `${language}: ${count}個專案 (平均進度: ${avgProgress}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 更新個人進度
function updateIndividualProgress(individualStats) {
    const container = document.getElementById('individualProgress');
    container.innerHTML = '';
    
    // 按進度排序
    const sortedIndividuals = Object.entries(individualStats)
        .sort((a, b) => b[1].averageProgress - a[1].averageProgress);
    
    sortedIndividuals.forEach(([name, stats]) => {
        const progressClass = getProgressClass(stats.averageProgress);
        const progressBarClass = getProgressBarClass(stats.averageProgress);
        
        const card = document.createElement('div');
        card.className = 'individual-card';
        card.innerHTML = `
            <div class="individual-name">${name}</div>
            <div class="individual-stats">
                <span class="project-count">${stats.count}個專案</span>
                <span class="progress-percentage ${progressClass}">${stats.averageProgress}%</span>
            </div>
            <div class="progress">
                <div class="progress-bar ${progressBarClass}" 
                     style="width: ${stats.averageProgress}%"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 更新專案表格
function updateProjectTable(projects) {
    const tbody = document.getElementById('projectTableBody');
    tbody.innerHTML = '';
    
    projects.forEach(project => {
        const row = document.createElement('tr');
        
        // 取得進度百分比的樣式
        const progress = parseFloat(project['開發進度%']) || 0;
        const progressClass = getProgressClass(progress);
        const progressBadge = getProgressBadge(progress);
        
        row.innerHTML = `
            <td><strong>${project['應用程式代號'] || '-'}</strong></td>
            <td><span class="badge bg-secondary">${project['需求類型'] || '-'}</span></td>
            <td><span class="badge bg-info">${project['程式語言'] || '-'}</span></td>
            <td>${project['應用程式名稱'] || '-'}</td>
            <td><span class="badge bg-primary">${project['團隊'] || '-'}</span></td>
            <td>${project['程式開發人員姓名'] || '-'}</td>
            <td>${project['預計開發人日'] || '-'}</td>
            <td>${formatDate(project['啟動日期'])}</td>
            <td>${formatDate(project['預計完成日期'])}</td>
            <td>${formatPercentage(project['二代轉三代(%)'])}</td>
            <td>${formatPercentage(project['介接MangoDB(%)'])}</td>
            <td>
                <span class="badge ${progressBadge} ${progressClass}">
                    ${progress}%
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 輔助函數
function getProgressClass(progress) {
    if (progress >= 90) return 'status-excellent';
    if (progress >= 70) return 'status-good';
    if (progress >= 50) return 'status-average';
    return 'status-poor';
}

function getProgressBarClass(progress) {
    if (progress >= 90) return 'progress-excellent';
    if (progress >= 70) return 'progress-good';
    if (progress >= 50) return 'progress-average';
    return 'progress-poor';
}

function getProgressBadge(progress) {
    if (progress >= 90) return 'bg-success';
    if (progress >= 70) return 'bg-info';
    if (progress >= 50) return 'bg-warning';
    return 'bg-danger';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('zh-TW');
    } catch {
        return dateStr;
    }
}

function formatPercentage(value) {
    if (!value) return '-';
    const num = parseFloat(value);
    return isNaN(num) ? value : `${num}%`;
}

// UI控制函數
function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorAlert.style.display = 'block';
    errorAlert.classList.add('show');
    
    // 5秒後自動隱藏
    setTimeout(hideError, 5000);
}

function hideError() {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.classList.remove('show');
    setTimeout(() => {
        errorAlert.style.display = 'none';
    }, 150);
}

// 重新整理數據
function refreshData() {
    loadData();
}

// 匯出數據功能
function exportData() {
    if (!dashboardData) {
        showError('沒有可匯出的數據');
        return;
    }
    
    try {
        const dataStr = JSON.stringify(dashboardData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `IMU進度管控表_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    } catch (error) {
        showError('匯出失敗: ' + error.message);
    }
}
