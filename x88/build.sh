#!/bin/bash
echo "Iniciando build do frontend..."
cd frontend
echo "Instalando dependências..."
npm install
echo "Executando build..."
npm run build
echo "Build concluído!"
