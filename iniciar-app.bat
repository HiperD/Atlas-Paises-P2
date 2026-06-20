@echo off
setlocal

cd /d "%~dp0"

if not exist "backend\package.json" (
  echo Pasta backend nao encontrada.
  exit /b 1
)

if not exist "frontend\package.json" (
  echo Pasta frontend nao encontrada.
  exit /b 1
)

echo Instalando dependencias do backend...
pushd backend
if not exist "node_modules" (
  call npm install
  if errorlevel 1 (
    echo Erro ao instalar dependencias do backend.
    popd
    exit /b 1
  )
)
popd

echo Instalando dependencias do frontend...
pushd frontend
if not exist "node_modules" (
  call npm install
  if errorlevel 1 (
    echo Erro ao instalar dependencias do frontend.
    popd
    exit /b 1
  )
)
popd

echo Iniciando backend e frontend...
start "Atlas Backend" cmd /k "cd /d ""%~dp0backend"" && npm run dev"
start "Atlas Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev -- --host 0.0.0.0"

echo Servicos iniciados.
exit /b 0
