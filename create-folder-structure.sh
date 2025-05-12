#!/bin/bash

BASE_DIR="call-center-dashboard"

create_file() {
  mkdir -p "$(dirname "$1")"
  touch "$1"
}

FILES=(
  # Public
  "$BASE_DIR/public/index.html"
  "$BASE_DIR/public/favicon.ico"

  # API
  "$BASE_DIR/src/api/index.js"
  "$BASE_DIR/src/api/dashboardService.js"
  "$BASE_DIR/src/api/reportService.js"
  "$BASE_DIR/src/api/metadataService.js"

  # Components - Common
  "$BASE_DIR/src/components/common/Header.jsx"
  "$BASE_DIR/src/components/common/Sidebar.jsx"
  "$BASE_DIR/src/components/common/Loading.jsx"
  "$BASE_DIR/src/components/common/ErrorBoundary.jsx"

  # Components - Dashboard
  "$BASE_DIR/src/components/dashboard/Dashboard.jsx"
  "$BASE_DIR/src/components/dashboard/DashboardControls.jsx"
  "$BASE_DIR/src/components/dashboard/DashboardGrid.jsx"
  "$BASE_DIR/src/components/dashboard/DashboardSettings.jsx"

  # Components - Sections
  "$BASE_DIR/src/components/sections/SectionContainer.jsx"
  "$BASE_DIR/src/components/sections/TableSection.jsx"
  "$BASE_DIR/src/components/sections/ChartSection.jsx"
  "$BASE_DIR/src/components/sections/CardSection.jsx"
  "$BASE_DIR/src/components/sections/SectionControls.jsx"

  # Components - Visualizations
  "$BASE_DIR/src/components/visualizations/LineChart.jsx"
  "$BASE_DIR/src/components/visualizations/BarChart.jsx"
  "$BASE_DIR/src/components/visualizations/PieChart.jsx"
  "$BASE_DIR/src/components/visualizations/DataTable.jsx"
  "$BASE_DIR/src/components/visualizations/MetricCard.jsx"

  # Contexts
  "$BASE_DIR/src/contexts/DashboardContext.jsx"
  "$BASE_DIR/src/contexts/AuthContext.jsx"
  "$BASE_DIR/src/contexts/ThemeContext.jsx"

  # Hooks
  "$BASE_DIR/src/hooks/useDashboard.js"
  "$BASE_DIR/src/hooks/useMetadata.js"
  "$BASE_DIR/src/hooks/useReport.js"
  "$BASE_DIR/src/hooks/useLocalStorage.js"

  # Pages
  "$BASE_DIR/src/pages/DashboardPage.jsx"
  "$BASE_DIR/src/pages/ReportsPage.jsx"
  "$BASE_DIR/src/pages/SettingsPage.jsx"
  "$BASE_DIR/src/pages/LoginPage.jsx"

  # Utils
  "$BASE_DIR/src/utils/dateUtils.js"
  "$BASE_DIR/src/utils/chartUtils.js"
  "$BASE_DIR/src/utils/formatters.js"
  "$BASE_DIR/src/utils/queryBuilder.js"

  # Root Source
  "$BASE_DIR/src/App.jsx"
  "$BASE_DIR/src/index.jsx"
  "$BASE_DIR/src/styles.less"

  # Root files
  "$BASE_DIR/.gitignore"
  "$BASE_DIR/package.json"
  "$BASE_DIR/README.md"
  "$BASE_DIR/config-overrides.js"
)

for FILE in "${FILES[@]}"; do
  create_file "$FILE"
done

echo "✅ 'call-center-dashboard' structure created successfully."
