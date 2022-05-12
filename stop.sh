#!/usr/bin/env bash
######################################################################
# Nome: Voce na facul
# Email: dev.vocenafacul@gmail.com
#
# Nome do programa: script de parada do servidor
# Versao: 0.1.0
# Licenca: GPLv2
# Descricao: Este programa para todos os servicos do backend
#
# CHANGELOG:
# 12/05/2022 - Leonardo do Nascimento
#    - [Adicionado] Funcionalidade para parar o servidor
# NEWS: PS1 => caminho no terminal
######################################################################
set -e # se der erro, saia!

################################### PM2
pm2 stop vcnafacul
#########################################


################################### PM2
docker stop mynginx
docker stop database
#########################################
