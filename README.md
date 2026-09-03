# Marketing Quest

MVP de ensino gamificado de marketing em arquivo único (`index.html`, 20 KB). Sem build, sem backend. Progresso salvo no `localStorage` do navegador.

Produção: https://marketing-quest-production.up.railway.app

Deploy: Railway, projeto `marketing-quest`, serviço ligado ao repo com Dockerfile nginx na porta 8080.

```powershell
python -m http.server 8000
```

Loop: 5 missões (posicionamento, persona, funil, copy, tráfego) com lição curta e quiz de 3 perguntas. Acerto dá XP com bônus de sequência e coração cheio. Patentes de Iniciante a Lenda, selos, ofensiva diária e ranking local.
