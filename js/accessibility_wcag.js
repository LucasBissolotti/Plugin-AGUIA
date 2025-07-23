// Plugin AGUIA para acessibilidade - Implementação WCAG 2.1 Nível AA

/**
 * Plugin AGUIA de Acessibilidade seguindo as diretrizes WCAG 2.1 nível AA
 *
 * Este script implementa um menu de acessibilidade com recursos como:
 * - Aumento/diminuição de texto (WCAG 1.4.4)
 * - Alto contraste (WCAG 1.4.3, 1.4.6)
 * - Fontes legíveis (WCAG 1.4.8)
 * - Espaçamento adequado (WCAG 1.4.8)
 * - Texto para fala (WCAG 1.4.1)
 * - Auxiliar de leitura (WCAG 2.4.8)
 * 
 * @module     local_aguiaplugin/accessibility_wcag
 * @copyright  2025 Prolux
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

document.addEventListener('DOMContentLoaded', function() {
    // Os estilos CSS agora são carregados pelo PHP
    
    // Inicialização das variáveis
    let currentFontSize = 100;
    let highContrastEnabled = false;
    let invertedColorsEnabled = false;
    let readableFontsEnabled = false;
    let lineSpacingEnabled = false;
    let textToSpeechEnabled = false;
    let readingHelperEnabled = false;
    let emphasizeLinksEnabled = false;
    
    // Cria o botão de acessibilidade com a imagem AGUIA
    createAccessibilityButton();
    
    // Cria o menu de acessibilidade
    createAccessibilityMenu();
    
    // Cria a mensagem de status
    createStatusMessage();
    
    // Os estilos CSS agora são carregados diretamente pelo PHP no cabeçalho
    
    // Função para criar o botão de acessibilidade
    function createAccessibilityButton() {
        const button = document.createElement('button');
        button.id = 'aguiaButton';
        button.className = 'aguia-button';
        button.setAttribute('aria-label', 'Menu de Acessibilidade AGUIA');
        button.setAttribute('title', 'Abrir menu de acessibilidade');
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
        
        // Criar a imagem do logo
        const img = document.createElement('img');
        img.src = M.cfg.wwwroot + '/local/aguiaplugin/pix/aguia_logo.png';
        img.alt = 'Logo AGUIA - Acessibilidade';
        img.className = 'aguia-logo';
        button.appendChild(img);
        
        // Adicionar evento de clique
        button.addEventListener('click', toggleMenu);
        button.addEventListener('keydown', function(e) {
            // Permitir navegação por teclado (WCAG 2.1.1)
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        document.body.appendChild(button);
    }
    
    // Função para alternar o menu
    function toggleMenu() {
        const menu = document.getElementById('aguiaMenu');
        const button = document.getElementById('aguiaButton');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            menu.style.display = 'none';
            button.setAttribute('aria-expanded', 'false');
        } else {
            menu.style.display = 'block';
            button.setAttribute('aria-expanded', 'true');
            // Foco no primeiro elemento do menu (WCAG 2.4.3)
            const firstOption = menu.querySelector('.aguia-option');
            if (firstOption) {
                firstOption.focus();
            }
        }
    }
    
    // Função para criar o menu de acessibilidade com estilo UserWay
    function createAccessibilityMenu() {
        const menu = document.createElement('div');
        menu.id = 'aguiaMenu';
        menu.className = 'aguia-menu';
        menu.setAttribute('role', 'dialog');
        menu.setAttribute('aria-labelledby', 'aguiaMenuTitle');
        
        // Cabeçalho do menu
        const header = document.createElement('div');
        header.className = 'aguia-menu-header';
        
        // Título do menu
        const title = document.createElement('h2');
        title.id = 'aguiaMenuTitle';
        title.textContent = 'Menu de Acessibilidade';
        
        // Botão de fechar
        const closeBtn = document.createElement('button');
        closeBtn.className = 'aguia-menu-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Fechar menu de acessibilidade');
        closeBtn.addEventListener('click', toggleMenu);
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        menu.appendChild(header);
        
        // Container para o conteúdo do menu com rolagem
        const menuContent = document.createElement('div');
        menuContent.className = 'aguia-menu-content';
        
        // Organizamos as opções em categorias, semelhante ao UserWay
        
        // Categoria: Conteúdo
        const contentCategory = document.createElement('div');
        contentCategory.className = 'aguia-category';
        
        const contentTitle = document.createElement('h3');
        contentTitle.className = 'aguia-category-title';
        contentTitle.textContent = 'Conteúdo';
        contentCategory.appendChild(contentTitle);
        
        // Grid para as opções da categoria Conteúdo
        const contentGrid = document.createElement('div');
        contentGrid.className = 'aguia-options-grid';
        
        // Opções de conteúdo
        const contentOptions = [
            { 
                icon: '🔍+', 
                text: 'Aumentar Texto', 
                action: increaseFontSize,
                ariaLabel: 'Aumentar tamanho do texto',
                id: 'aguiaIncreaseFontBtn'
            },
            { 
                icon: '�', 
                text: 'Fontes Legíveis', 
                action: toggleReadableFonts,
                ariaLabel: 'Ativar ou desativar fontes mais legíveis',
                id: 'aguiaReadableFontsBtn'
            },
            { 
                icon: '↕️', 
                text: 'Espaçamento', 
                action: toggleLineSpacing,
                ariaLabel: 'Ajustar espaçamento do texto',
                id: 'aguiaLineSpacingBtn'
            },
            { 
                icon: '🔗', 
                text: 'Destacar Links', 
                action: toggleEmphasizeLinks,
                ariaLabel: 'Ativar ou desativar destaque para links',
                id: 'aguiaEmphasizeLinksBtn'
            }
        ];
        
        // Adiciona as opções de conteúdo ao grid
        contentOptions.forEach(option => {
            const button = createOptionButton(option);
            contentGrid.appendChild(button);
        });
        
        contentCategory.appendChild(contentGrid);
        
        // Adiciona controle deslizante para tamanho de fonte
        const fontSizeControl = document.createElement('div');
        fontSizeControl.className = 'aguia-slider-control';
        
        const fontSizeLabel = document.createElement('label');
        fontSizeLabel.className = 'aguia-slider-label';
        fontSizeLabel.textContent = 'Tamanho do Texto';
        fontSizeLabel.setAttribute('for', 'aguiaFontSizeSlider');
        fontSizeLabel.setAttribute('data-value', currentFontSize + '%');
        fontSizeLabel.id = 'aguiaFontSizeLabel';
        
        const fontSizeSlider = document.createElement('input');
        fontSizeSlider.type = 'range';
        fontSizeSlider.id = 'aguiaFontSizeSlider';
        fontSizeSlider.className = 'aguia-slider';
        fontSizeSlider.min = '100';
        fontSizeSlider.max = '150';
        fontSizeSlider.step = '10';
        fontSizeSlider.value = currentFontSize;
        
        fontSizeSlider.addEventListener('input', function() {
            const newSize = parseInt(this.value);
            setFontSize(newSize);
            fontSizeLabel.setAttribute('data-value', newSize + '%');
        });
        
        fontSizeControl.appendChild(fontSizeLabel);
        fontSizeControl.appendChild(fontSizeSlider);
        contentCategory.appendChild(fontSizeControl);
        
        // Categoria: Cores
        const colorsCategory = document.createElement('div');
        colorsCategory.className = 'aguia-category';
        
        const colorsTitle = document.createElement('h3');
        colorsTitle.className = 'aguia-category-title';
        colorsTitle.textContent = 'Cores e Contraste';
        colorsCategory.appendChild(colorsTitle);
        
        // Grid para as opções da categoria Cores
        const colorsGrid = document.createElement('div');
        colorsGrid.className = 'aguia-options-grid';
        
        // Opções de cores
        const colorsOptions = [
            { 
                icon: '�', 
                text: 'Alto Contraste', 
                action: toggleHighContrast,
                ariaLabel: 'Ativar ou desativar o modo de alto contraste',
                id: 'aguiaHighContrastBtn'
            },
            { 
                icon: '�', 
                text: 'Cores Invertidas', 
                action: toggleInvertedColors,
                ariaLabel: 'Ativar ou desativar inversão de cores',
                id: 'aguiaInvertedColorsBtn'
            }
        ];
        
        // Adiciona as opções de cores ao grid
        colorsOptions.forEach(option => {
            const button = createOptionButton(option);
            colorsGrid.appendChild(button);
        });
        
        colorsCategory.appendChild(colorsGrid);
        
        // Categoria: Orientação
        const navigationCategory = document.createElement('div');
        navigationCategory.className = 'aguia-category';
        
        const navigationTitle = document.createElement('h3');
        navigationTitle.className = 'aguia-category-title';
        navigationTitle.textContent = 'Orientação e Navegação';
        navigationCategory.appendChild(navigationTitle);
        
        // Grid para as opções da categoria Navegação
        const navigationGrid = document.createElement('div');
        navigationGrid.className = 'aguia-options-grid';
        
        // Opções de navegação
        const navigationOptions = [
            { 
                icon: '🔊', 
                text: 'Texto para Fala', 
                action: toggleTextToSpeech,
                ariaLabel: 'Ativar ou desativar leitura de texto ao clicar',
                id: 'aguiaTextToSpeechBtn'
            },
            { 
                icon: '👁️', 
                text: 'Guia de Leitura', 
                action: toggleReadingHelper,
                ariaLabel: 'Ativar ou desativar guia visual de leitura',
                id: 'aguiaReadingHelperBtn'
            }
        ];
        
        // Adiciona as opções de navegação ao grid
        navigationOptions.forEach(option => {
            const button = createOptionButton(option);
            navigationGrid.appendChild(button);
        });
        
        navigationCategory.appendChild(navigationGrid);
        
        // Função para criar botões de opção com estilo consistente
        function createOptionButton(option) {
            const button = document.createElement('button');
            button.className = 'aguia-option';
            button.id = option.id;
            button.setAttribute('role', 'button');
            button.setAttribute('aria-label', option.ariaLabel);
            button.setAttribute('tabindex', '0');
            
            // Ícone
            const iconSpan = document.createElement('span');
            iconSpan.className = 'icon';
            iconSpan.textContent = option.icon;
            iconSpan.setAttribute('aria-hidden', 'true');
            button.appendChild(iconSpan);
            
            // Texto
            const textSpan = document.createElement('span');
            textSpan.className = 'text';
            textSpan.textContent = option.text;
            button.appendChild(textSpan);
            
            // Eventos
            button.addEventListener('click', option.action);
            button.addEventListener('keydown', function(e) {
                // Navegação por teclado dentro do menu (WCAG 2.1.1, 2.1.2)
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.action();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    toggleMenu();
                    document.getElementById('aguiaButton').focus();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextButton = document.querySelector(`#${option.id}`).nextElementSibling;
                    if (nextButton) nextButton.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevButton = document.querySelector(`#${option.id}`).previousElementSibling;
                    if (prevButton) prevButton.focus();
                }
            });
            
            return button;
        }
        
        // Adiciona todas as categorias ao conteúdo do menu
        menuContent.appendChild(contentCategory);
        menuContent.appendChild(colorsCategory);
        menuContent.appendChild(navigationCategory);
        menu.appendChild(menuContent);
        
        document.body.appendChild(menu);
    }
    
    // Função para criar mensagens de status
    function createStatusMessage() {
        const message = document.createElement('div');
        message.id = 'aguiaStatusMessage';
        message.className = 'aguia-status-message';
        message.setAttribute('role', 'alert');
        message.setAttribute('aria-live', 'polite');
        document.body.appendChild(message);
    }
    
    // Função para mostrar mensagem de status
    function showStatusMessage(text) {
        const message = document.getElementById('aguiaStatusMessage');
        message.textContent = text;
        message.style.display = 'block';
        
        // Esconde a mensagem após 3 segundos
        setTimeout(function() {
            message.style.display = 'none';
        }, 3000);
    }
    
    // Funções de acessibilidade
    
    // Aumentar tamanho da fonte (WCAG 1.4.4)
    function increaseFontSize() {
        if (currentFontSize < 150) {
            currentFontSize += 10;
            applyFontSize();
            showStatusMessage('Fonte aumentada para ' + currentFontSize + '%');
        } else {
            showStatusMessage('Tamanho máximo da fonte atingido');
        }
    }
    
    // Diminuir tamanho da fonte (WCAG 1.4.4)
    function decreaseFontSize() {
        if (currentFontSize > 100) {
            currentFontSize -= 10;
            applyFontSize();
            showStatusMessage('Fonte diminuída para ' + currentFontSize + '%');
        } else {
            showStatusMessage('Tamanho mínimo da fonte atingido');
        }
    }
    
    // Resetar tamanho da fonte (WCAG 1.4.4)
    function resetFontSize() {
        currentFontSize = 100;
        applyFontSize();
        showStatusMessage('Fonte restaurada ao tamanho padrão');
    }
    
    // Aplicar tamanho da fonte
    function applyFontSize() {
        // Remove classes anteriores
        document.body.classList.remove(
            'aguia-text-size-100', 
            'aguia-text-size-110',
            'aguia-text-size-120',
            'aguia-text-size-130',
            'aguia-text-size-140',
            'aguia-text-size-150'
        );
        
        // Adiciona a classe correspondente ao tamanho atual
        document.body.classList.add('aguia-text-size-' + currentFontSize);
    }
    
    // Alto contraste (WCAG 1.4.3, 1.4.6)
    function toggleHighContrast() {
        resetContrast();
        highContrastEnabled = !highContrastEnabled;
        
        if (highContrastEnabled) {
            document.body.classList.add('aguia-high-contrast');
            showStatusMessage('Modo alto contraste ativado');
        } else {
            document.body.classList.remove('aguia-high-contrast');
            showStatusMessage('Modo alto contraste desativado');
        }
    }
    
    // Cores invertidas (WCAG 1.4.3)
    function toggleInvertedColors() {
        resetContrast();
        invertedColorsEnabled = !invertedColorsEnabled;
        
        if (invertedColorsEnabled) {
            document.body.classList.add('aguia-inverted-colors');
            showStatusMessage('Modo de cores invertidas ativado');
        } else {
            document.body.classList.remove('aguia-inverted-colors');
            showStatusMessage('Modo de cores invertidas desativado');
        }
    }
    
    // Resetar contraste
    function resetContrast() {
        highContrastEnabled = false;
        invertedColorsEnabled = false;
        document.body.classList.remove('aguia-high-contrast', 'aguia-inverted-colors');
        showStatusMessage('Contraste restaurado ao padrão');
    }
    
    // Fontes mais legíveis (WCAG 1.4.8)
    function toggleReadableFonts() {
        readableFontsEnabled = !readableFontsEnabled;
        
        if (readableFontsEnabled) {
            document.body.classList.add('aguia-readable-fonts');
            showStatusMessage('Fontes legíveis ativadas');
        } else {
            document.body.classList.remove('aguia-readable-fonts');
            showStatusMessage('Fontes legíveis desativadas');
        }
    }
    
    // Espaçamento entre linhas (WCAG 1.4.8)
    function toggleLineSpacing() {
        lineSpacingEnabled = !lineSpacingEnabled;
        
        if (lineSpacingEnabled) {
            document.body.classList.add('aguia-increased-spacing');
            showStatusMessage('Espaçamento aumentado ativado');
        } else {
            document.body.classList.remove('aguia-increased-spacing');
            showStatusMessage('Espaçamento padrão restaurado');
        }
    }
    
    // Texto para fala (auxílio cognitivo)
    function toggleTextToSpeech() {
        if (!('speechSynthesis' in window)) {
            showStatusMessage('Seu navegador não suporta a leitura de texto');
            return;
        }
        
        textToSpeechEnabled = !textToSpeechEnabled;
        
        if (textToSpeechEnabled) {
            document.addEventListener('click', speakText);
            showStatusMessage('Clique em qualquer texto para ouvi-lo');
        } else {
            document.removeEventListener('click', speakText);
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            showStatusMessage('Leitura de texto desativada');
        }
    }
    
    // Função para falar o texto
    function speakText(e) {
        if (!textToSpeechEnabled) return;
        
        // Elementos que podem ser lidos
        const element = e.target.closest('p, h1, h2, h3, h4, h5, h6, li, td, th, a, button, label, span, div');
        
        if (element && element.textContent.trim().length > 0) {
            // Cancela qualquer fala anterior
            window.speechSynthesis.cancel();
            
            // Cria um novo objeto de fala
            const text = element.textContent.trim();
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Define o idioma com base no atributo lang do documento ou elemento
            utterance.lang = element.lang || document.documentElement.lang || 'pt-BR';
            
            // Destaca o elemento que está sendo lido
            const elementsWithHighlight = document.querySelectorAll('.aguia-text-highlight');
            elementsWithHighlight.forEach(el => el.classList.remove('aguia-text-highlight'));
            element.classList.add('aguia-text-highlight');
            
            // Remove o destaque quando a fala terminar
            utterance.onend = function() {
                element.classList.remove('aguia-text-highlight');
            };
            
            // Inicia a fala
            window.speechSynthesis.speak(utterance);
        }
    }
    
    // Auxiliar de leitura (WCAG 2.4.8)
    function toggleReadingHelper() {
        readingHelperEnabled = !readingHelperEnabled;
        
        if (readingHelperEnabled) {
            // Cria o elemento auxiliar se não existir
            if (!document.getElementById('aguiaReadingHelper')) {
                const helper = document.createElement('div');
                helper.id = 'aguiaReadingHelper';
                helper.className = 'aguia-reading-helper';
                helper.setAttribute('aria-hidden', 'true');  // Esconde do leitor de tela
                document.body.appendChild(helper);
            }
            
            // Adiciona o evento de movimento do mouse
            document.addEventListener('mousemove', updateReadingHelper);
            showStatusMessage('Auxiliar de leitura ativado');
        } else {
            // Remove o evento
            document.removeEventListener('mousemove', updateReadingHelper);
            
            // Esconde o auxiliar
            const helper = document.getElementById('aguiaReadingHelper');
            if (helper) {
                helper.style.display = 'none';
            }
            showStatusMessage('Auxiliar de leitura desativado');
        }
    }
    
    // Atualiza a posição do auxiliar de leitura
    function updateReadingHelper(e) {
        const helper = document.getElementById('aguiaReadingHelper');
        if (!helper || !readingHelperEnabled) return;
        
        // Encontra o elemento sob o cursor
        const element = document.elementFromPoint(e.clientX, e.clientY);
        
        if (element && element.textContent && element !== helper) {
            const rect = element.getBoundingClientRect();
            helper.style.width = rect.width + 'px';
            helper.style.top = (window.scrollY + rect.top) + 'px';
            helper.style.left = rect.left + 'px';
            helper.style.display = 'block';
        } else {
            helper.style.display = 'none';
        }
    }
    
    // Destacar links (WCAG 1.4.1)
    function toggleEmphasizeLinks() {
        emphasizeLinksEnabled = !emphasizeLinksEnabled;
        
        if (emphasizeLinksEnabled) {
            document.body.classList.add('aguia-emphasize-links');
            showStatusMessage('Links destacados ativados');
        } else {
            document.body.classList.remove('aguia-emphasize-links');
            showStatusMessage('Links destacados desativados');
        }
    }
});
