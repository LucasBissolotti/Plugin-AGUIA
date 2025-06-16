# 🦅AGUIA - Plugin de Acessibilidade para Moodle

O **AGUIA** (Acessibilidade e guia para pessoas com deficiência visual) é um plugin local desenvolvido para o Moodle, com o objetivo de aprimorar a acessibilidade da plataforma, tornando-a mais inclusiva e eficiente para usuários com deficiência visual.

## 🔍 Funcionalidades

- **Registro de Ações de Acessibilidade:**  
  Log de uso das funcionalidades de acessibilidade, permitindo análise e auditoria do impacto das ferramentas oferecidas.

- **Gestão de Recursos de Acessibilidade:**  
  Gerenciamento dinâmico de CSS e JavaScript através de uma classe dedicada (`aguia_accessibility_manager.php`), que injeta os recursos nas páginas e gerencia componentes de acessibilidade.

- **Estrutura de Logging:**  
  Banco de dados dedicado (`local_aguia_logs`) que armazena informações sobre as interações dos usuários com o plugin, como:
  - ID do usuário
  - Ação realizada
  - Valor associado
  - URL da página
  - Timestamp da interação

## 📁 Estrutura do Projeto
```
local/aguia/
├── amd/
│   ├── build/                       # Arquivos compilados (gerados, não versionar)
│   └── src/                          # Código fonte JS
│       ├── main.js                   # JS principal
│       └── utils.js                  # Funções utilitárias, se necessário
│
├── classes/
│   ├── event/                        # Eventos do Moodle (ex.: log personalizado)
│   │   └── accessibility_action_logged.php
│   ├── form/                         # Formulários customizados (se houver)
│   ├── output/                        # Renderers e templates PHP
│   │   └── renderer.php
│   ├── service/                       # Lógica de serviços (ex.: log, manipulação de dados)
│   │   └── accessibility_logger.php
│   └── manager/                       # Classes de gerenciamento
│       └── accessibility_manager.php
│
├── db/
│   ├── access.php                     # Permissões e capabilities
│   ├── events.php                     # Declaração dos eventos
│   ├── install.xml                    # Definição do banco de dados
│   ├── upgrade.php                    # Atualização do banco de dados
│   └── services.php                   # Web services (se usar API externa)
│
├── lang/
│   ├── en/                            # Idioma inglês
│   │   └── local_aguia.php
│   └── pt_br/                         # Idioma português (Brasil)
│       └── local_aguia.php
│
├── pix/                               # Ícones e imagens
│   └── icon.png
│
├── scss/                              # Estilos (SCSS moderno)
│   └── aguia.scss
│
├── templates/                         # Templates Mustache (HTML server-side)
│   ├── panel.mustache                 # Painel principal de acessibilidade
│   └── button.mustache                # Botões ou elementos do UI
│
├── ajax/                              # Endpoints AJAX (modularizado)
│   └── log_action.php                 # Recebe requisições de log
│
├── lib.php                             # Hooks do Moodle (core API)
├── settings.php                        # Página de configuração no admin
├── version.php                         # Metadados do plugin
├── LICENSE.txt                         # Licença
├── README.md                           # Documentação
└── .gitignore                          # Ignora cache, node_modules, etc.
```
## 🚀 Instalação

1. Copie a pasta `aguia` para o diretório `[moodle_root]/local/`.
2. Verifique as permissões do diretório (especialmente `[moodledata]`), garantindo escrita para o servidor web.
3. Acesse a página de administração do Moodle:  
   `[seu_moodle_url]/admin/index.php`
4. O Moodle detectará o plugin automaticamente e executará a instalação do banco de dados.
5. Após a instalação, limpe os caches:
   - Via interface:  
     *Administração do Site → Desenvolvimento → Limpar todos os caches*
   - Ou via terminal:  
     ```bash
     php admin/cli/purge_caches.php
     ```

## 🧑‍💻 Desenvolvimento e Contribuição

- Status: **Em desenvolvimento (Alpha)**

## 📜 Requisitos

- **Moodle:** 4.2.x ou superior  
- **PHP:** 8.0 ou superior (compatível com a versão do Moodle)

## 🛠️ Ambiente de Desenvolvimento

- Ambiente recomendado: XAMPP, Laragon, Docker ou outro ambiente local com Moodle.
- Habilite o modo de depuração no Moodle para facilitar o desenvolvimento.

### 🔄 Limpeza de Cache durante o Desenvolvimento

Execute no terminal sempre que fizer alterações relevantes:

```bash
cd [seu_diretorio_moodle]
php admin/cli/purge_caches.php
```
📄 Licença

Distribuído sob a GNU General Public License v3 ou posterior.
