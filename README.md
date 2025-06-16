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

local/aguia/
├── amd/
│ └── src/
│ └── main.js # Funcionalidades JavaScript (AMD).
├── classes/
│ ├── aguia_accessibility_manager.php # Gerenciador de acessibilidade.
│ └── output/
│ └── renderer.php # Renderer personalizado (opcional).
├── db/
│ ├── install.xml # Definição do banco de dados.
│ └── upgrade.php # Script de atualização (em desenvolvimento).
├── lang/
│ ├── en/local_aguia.php # Tradução em inglês.
│ └── pt_br/local_aguia.php # Tradução em português do Brasil.
├── pix/ # Ícones e imagens.
├── scss/
│ └── aguia_styles.scss # Estilos SCSS personalizados.
├── templates/
│ └── aguia_panel_icon.mustache # Template Mustache para o painel/ícone.
├── ajax_log.php # Endpoint AJAX para registro de logs.
├── lib.php # Funções e hooks do plugin.
├── settings.php # Configurações administrativas do plugin.
└── version.php # Versão e compatibilidade.


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
- Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

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

📄 Licença

Distribuído sob a GNU General Public License v3 ou posterior.
Consulte o arquivo LICENSE.txt para mais informações.
