# BPMN — Gestão de cursos e materiais (To-Be MVP)

**Processos:** P-ACC-01, P-CUR-01/02, P-MAT-01, gatilho P-REV-01  
**RN:** RN-001 a RN-006, RN-004  

```mermaid
flowchart TB
  subgraph LaneUsuario["Revisor / Usuário autorizado"]
    start((Início))
    login[Tela de autenticação]
    credOk{Credenciais válidas?}
    painel[Painel principal de cursos]
    listar[Listar cursos existentes]
    cadastrar[Cadastrar curso: título + descrição]
    abrirCurso[Abrir curso selecionado]
    uploadMat[Upload material de apoio]
    listarMat[Listar / consultar anexos]
    iniciarRev[Iniciar Revisão]
    endPrep((Continua em P-REV-01))
  end

  subgraph LaneSAD["SAD-ILA"]
    authValid[Validar credenciais]
    emitJWT[Emitir JWT / sessão]
    persistCurso[Persistir curso]
    storeFile[Armazenar anexo por curso]
    deny[Acesso negado]
  end

  start --> login
  login --> authValid
  authValid --> credOk
  credOk -->|Não| deny
  deny --> login
  credOk -->|Sim| emitJWT
  emitJWT --> painel
  painel --> listar
  painel --> cadastrar
  cadastrar --> persistCurso
  persistCurso --> painel
  listar --> abrirCurso
  abrirCurso --> listarMat
  abrirCurso --> uploadMat
  uploadMat --> storeFile
  storeFile --> listarMat
  listarMat --> iniciarRev
  iniciarRev --> endPrep
```

**Notas:** Provisionamento de usuários (P-TI-01) ocorre fora deste fluxo. SSO COMAER — evolução (lacuna).
