// Plugin AGUIA para acessibilidade - Implementação WCAG 2.1 Nível AA
// Interface inspirada no design do UserWay

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
    
    // Recupera preferências salvas do usuário
    loadUserPreferences();
    
    // Função para criar o botão de acessibilidade
    function createAccessibilityButton() {
        const button = document.createElement('button');
        button.id = 'aguiaButton';
        button.className = 'aguia-button pulse';
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
        
        // Remove a animação de pulsar após 5 segundos
        setTimeout(function() {
            button.classList.remove('pulse');
        }, 5000);
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
            const firstFocusable = menu.querySelector('button, [tabindex="0"]');
            if (firstFocusable) {
                firstFocusable.focus();
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
                icon: '📝', 
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
                icon: '🌓', 
                text: 'Alto Contraste', 
                action: toggleHighContrast,
                ariaLabel: 'Ativar ou desativar o modo de alto contraste',
                id: 'aguiaHighContrastBtn'
            },
            { 
                icon: '🔄', 
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
        
        // Adiciona todas as categorias ao conteúdo do menu
        menuContent.appendChild(contentCategory);
        menuContent.appendChild(colorsCategory);
        menuContent.appendChild(navigationCategory);
        menu.appendChild(menuContent);
        
        // Adiciona o rodapé do menu
        const footer = document.createElement('div');
        footer.className = 'aguia-menu-footer';
        
        // Botão de reset
        const resetButton = document.createElement('button');
        resetButton.className = 'aguia-reset-button';
        resetButton.textContent = 'Resetar Tudo';
        resetButton.setAttribute('aria-label', 'Resetar todas as configurações de acessibilidade');
        resetButton.addEventListener('click', resetAll);
        
        // Créditos
        const credits = document.createElement('div');
        credits.className = 'aguia-credits';
        credits.textContent = 'AGUIA Acessibilidade';
        
        footer.appendChild(resetButton);
        footer.appendChild(credits);
        menu.appendChild(footer);
        
        // Adiciona o menu completo ao corpo do documento
        document.body.appendChild(menu);
    }
    
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
            // Permitir navegação por teclado (WCAG 2.1.1)
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                option.action();
            }
        });
        
        return button;
    }
    
    // Função para criar a mensagem de status
    function createStatusMessage() {
        const message = document.createElement('div');
        message.id = 'aguiaStatusMessage';
        message.className = 'aguia-status-message';
        message.setAttribute('role', 'status');
        message.setAttribute('aria-live', 'polite');
        document.body.appendChild(message);
    }
    
    // Função para exibir mensagem de status
    function showStatusMessage(text, type = '') {
        const message = document.getElementById('aguiaStatusMessage');
        message.textContent = text;
        message.className = 'aguia-status-message ' + type;
        message.style.display = 'block';
        
        // Oculta a mensagem após 3 segundos
        setTimeout(function() {
            message.style.display = 'none';
        }, 3000);
    }
    
    // Função para aumentar o tamanho da fonte
    function increaseFontSize() {
        if (currentFontSize < 150) {
            currentFontSize += 10;
            setFontSize(currentFontSize);
            const fontSizeLabel = document.getElementById('aguiaFontSizeLabel');
            if (fontSizeLabel) {
                fontSizeLabel.setAttribute('data-value', currentFontSize + '%');
            }
            const fontSizeSlider = document.getElementById('aguiaFontSizeSlider');
            if (fontSizeSlider) {
                fontSizeSlider.value = currentFontSize;
            }
        }
    }
    
    // Função para diminuir o tamanho da fonte
    function decreaseFontSize() {
        if (currentFontSize > 100) {
            currentFontSize -= 10;
            setFontSize(currentFontSize);
            const fontSizeLabel = document.getElementById('aguiaFontSizeLabel');
            if (fontSizeLabel) {
                fontSizeLabel.setAttribute('data-value', currentFontSize + '%');
            }
            const fontSizeSlider = document.getElementById('aguiaFontSizeSlider');
            if (fontSizeSlider) {
                fontSizeSlider.value = currentFontSize;
            }
        }
    }
    
    // Função para definir o tamanho da fonte
    function setFontSize(size) {
        // Remove todas as classes anteriores de tamanho de fonte
        document.body.classList.remove(
            'aguia-text-size-100',
            'aguia-text-size-110',
            'aguia-text-size-120',
            'aguia-text-size-130',
            'aguia-text-size-140',
            'aguia-text-size-150'
        );
        
        // Aplica a nova classe de tamanho
        document.body.classList.add('aguia-text-size-' + size);
        
        // Atualiza a variável atual
        currentFontSize = size;
        
        // Exibe mensagem
        showStatusMessage('Tamanho do texto ajustado para ' + size + '%', 'success');
        
        // Salva preferência
        saveUserPreference('fontSize', size);
    }
    
    // Função para resetar o tamanho da fonte
    function resetFontSize() {
        setFontSize(100);
    }
    
    // Função para alternar alto contraste
    function toggleHighContrast() {
        highContrastEnabled = !highContrastEnabled;
        
        // Desativa cores invertidas se estiver ativando alto contraste
        if (highContrastEnabled && invertedColorsEnabled) {
            invertedColorsEnabled = false;
            document.body.classList.remove('aguia-inverted-colors');
            
            const invertedBtn = document.getElementById('aguiaInvertedColorsBtn');
            if (invertedBtn) {
                invertedBtn.classList.remove('active');
            }
        }
        
        // Atualiza UI
        const contrastBtn = document.getElementById('aguiaHighContrastBtn');
        if (contrastBtn) {
            if (highContrastEnabled) {
                contrastBtn.classList.add('active');
            } else {
                contrastBtn.classList.remove('active');
            }
        }
        
        if (highContrastEnabled) {
            document.body.classList.add('aguia-high-contrast');
            showStatusMessage('Alto contraste ativado', 'success');
        } else {
            document.body.classList.remove('aguia-high-contrast');
            showStatusMessage('Alto contraste desativado');
        }
        
        // Salva preferência
        saveUserPreference('highContrast', highContrastEnabled);
    }
    
    // Função para alternar cores invertidas
    function toggleInvertedColors() {
        invertedColorsEnabled = !invertedColorsEnabled;
        
        // Desativa alto contraste se estiver ativando cores invertidas
        if (invertedColorsEnabled && highContrastEnabled) {
            highContrastEnabled = false;
            document.body.classList.remove('aguia-high-contrast');
            
            const contrastBtn = document.getElementById('aguiaHighContrastBtn');
            if (contrastBtn) {
                contrastBtn.classList.remove('active');
            }
        }
        
        // Atualiza UI
        const invertedBtn = document.getElementById('aguiaInvertedColorsBtn');
        if (invertedBtn) {
            if (invertedColorsEnabled) {
                invertedBtn.classList.add('active');
            } else {
                invertedBtn.classList.remove('active');
            }
        }
        
        if (invertedColorsEnabled) {
            document.body.classList.add('aguia-inverted-colors');
            showStatusMessage('Cores invertidas ativadas', 'success');
        } else {
            document.body.classList.remove('aguia-inverted-colors');
            showStatusMessage('Cores invertidas desativadas');
        }
        
        // Salva preferência
        saveUserPreference('invertedColors', invertedColorsEnabled);
    }
    
    // Função para resetar configurações de contraste
    function resetContrast() {
        // Reset de alto contraste
        if (highContrastEnabled) {
            highContrastEnabled = false;
            document.body.classList.remove('aguia-high-contrast');
            
            const contrastBtn = document.getElementById('aguiaHighContrastBtn');
            if (contrastBtn) {
                contrastBtn.classList.remove('active');
            }
        }
        
        // Reset de cores invertidas
        if (invertedColorsEnabled) {
            invertedColorsEnabled = false;
            document.body.classList.remove('aguia-inverted-colors');
            
            const invertedBtn = document.getElementById('aguiaInvertedColorsBtn');
            if (invertedBtn) {
                invertedBtn.classList.remove('active');
            }
        }
        
        showStatusMessage('Configurações de contraste resetadas');
        
        // Salva preferências
        saveUserPreference('highContrast', false);
        saveUserPreference('invertedColors', false);
    }
    
    // Função para alternar fontes legíveis
    function toggleReadableFonts() {
        readableFontsEnabled = !readableFontsEnabled;
        
        // Atualiza UI
        const fontsBtn = document.getElementById('aguiaReadableFontsBtn');
        if (fontsBtn) {
            if (readableFontsEnabled) {
                fontsBtn.classList.add('active');
            } else {
                fontsBtn.classList.remove('active');
            }
        }
        
        if (readableFontsEnabled) {
            document.body.classList.add('aguia-readable-fonts');
            showStatusMessage('Fontes legíveis ativadas', 'success');
        } else {
            document.body.classList.remove('aguia-readable-fonts');
            showStatusMessage('Fontes legíveis desativadas');
        }
        
        // Salva preferência
        saveUserPreference('readableFonts', readableFontsEnabled);
    }
    
    // Função para alternar espaçamento de linha
    function toggleLineSpacing() {
        lineSpacingEnabled = !lineSpacingEnabled;
        
        // Atualiza UI
        const spacingBtn = document.getElementById('aguiaLineSpacingBtn');
        if (spacingBtn) {
            if (lineSpacingEnabled) {
                spacingBtn.classList.add('active');
            } else {
                spacingBtn.classList.remove('active');
            }
        }
        
        if (lineSpacingEnabled) {
            document.body.classList.add('aguia-increased-spacing');
            showStatusMessage('Espaçamento aumentado ativado', 'success');
        } else {
            document.body.classList.remove('aguia-increased-spacing');
            showStatusMessage('Espaçamento aumentado desativado');
        }
        
        // Salva preferência
        saveUserPreference('lineSpacing', lineSpacingEnabled);
    }
    
    // Texto para fala (WCAG 1.4.1)
    function toggleTextToSpeech() {
        textToSpeechEnabled = !textToSpeechEnabled;
        
        // Atualiza UI
        const ttsBtn = document.getElementById('aguiaTextToSpeechBtn');
        if (ttsBtn) {
            if (textToSpeechEnabled) {
                ttsBtn.classList.add('active');
            } else {
                ttsBtn.classList.remove('active');
            }
        }
        
        if (textToSpeechEnabled) {
            // Adiciona listeners para elementos que podem ser lidos
            addTextToSpeechListeners();
            showStatusMessage('Texto para fala ativado', 'success');
        } else {
            // Remove listeners
            removeTextToSpeechListeners();
            showStatusMessage('Texto para fala desativado');
            
            // Para qualquer leitura em andamento
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }
        
        // Salva preferência
        saveUserPreference('textToSpeech', textToSpeechEnabled);
    }
    
    // Função para adicionar listeners de texto para fala
    function addTextToSpeechListeners() {
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, a, button, label');
        
        elements.forEach(function(element) {
            element.setAttribute('data-aguia-tts', 'true');
            element.addEventListener('click', speakText);
            
            // Adiciona efeito de hover para indicar que é clicável
            element.addEventListener('mouseenter', function() {
                if (textToSpeechEnabled) {
                    this.classList.add('aguia-tts-hoverable');
                }
            });
            
            element.addEventListener('mouseleave', function() {
                this.classList.remove('aguia-tts-hoverable');
            });
        });
    }
    
    // Função para remover listeners de texto para fala
    function removeTextToSpeechListeners() {
        const elements = document.querySelectorAll('[data-aguia-tts="true"]');
        
        elements.forEach(function(element) {
            element.removeEventListener('click', speakText);
            element.removeAttribute('data-aguia-tts');
            element.classList.remove('aguia-tts-hoverable');
            element.classList.remove('aguia-text-highlight');
        });
    }
    
    // Função para ler texto em voz alta
    function speakText(event) {
        // Só executa se TTS estiver ativado
        if (!textToSpeechEnabled) return;
        
        // Previne a navegação para links
        if (this.tagName.toLowerCase() === 'a') {
            event.preventDefault();
        }
        
        // Remove destaque de texto anterior
        const highlighted = document.querySelectorAll('.aguia-text-highlight');
        highlighted.forEach(function(el) {
            el.classList.remove('aguia-text-highlight');
        });
        
        // Adiciona destaque ao elemento atual
        this.classList.add('aguia-text-highlight');
        
        const text = this.textContent.trim();
        
        if (text && 'speechSynthesis' in window) {
            // Para qualquer leitura em andamento
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = document.documentElement.lang || 'pt-BR';
            
            // Quando terminar a leitura, remove o destaque
            utterance.onend = function() {
                document.querySelectorAll('.aguia-text-highlight').forEach(function(el) {
                    el.classList.remove('aguia-text-highlight');
                });
            };
            
            window.speechSynthesis.speak(utterance);
        }
    }
    
    // Auxiliar de leitura (WCAG 2.4.8)
    function toggleReadingHelper() {
        readingHelperEnabled = !readingHelperEnabled;
        
        // Atualiza UI
        const helperBtn = document.getElementById('aguiaReadingHelperBtn');
        if (helperBtn) {
            if (readingHelperEnabled) {
                helperBtn.classList.add('active');
            } else {
                helperBtn.classList.remove('active');
            }
        }
        
        if (readingHelperEnabled) {
            createReadingHelper();
            showStatusMessage('Guia de leitura ativado', 'success');
        } else {
            const helper = document.getElementById('aguiaReadingHelper');
            if (helper) {
                helper.remove();
            }
            document.removeEventListener('mousemove', updateReadingHelper);
            showStatusMessage('Guia de leitura desativado');
        }
        
        // Salva preferência
        saveUserPreference('readingHelper', readingHelperEnabled);
    }
    
    // Função para criar o auxiliar de leitura
    function createReadingHelper() {
        const helper = document.createElement('div');
        helper.id = 'aguiaReadingHelper';
        helper.className = 'aguia-reading-helper';
        document.body.appendChild(helper);
        
        // Adiciona evento para seguir o cursor
        document.addEventListener('mousemove', updateReadingHelper);
    }
    
    // Função para atualizar a posição do auxiliar de leitura
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
        
        // Atualiza UI
        const linksBtn = document.getElementById('aguiaEmphasizeLinksBtn');
        if (linksBtn) {
            if (emphasizeLinksEnabled) {
                linksBtn.classList.add('active');
            } else {
                linksBtn.classList.remove('active');
            }
        }
        
        if (emphasizeLinksEnabled) {
            document.body.classList.add('aguia-emphasize-links');
            showStatusMessage('Links destacados ativados', 'success');
        } else {
            document.body.classList.remove('aguia-emphasize-links');
            showStatusMessage('Links destacados desativados');
        }
        
        // Salva preferência
        saveUserPreference('emphasizeLinks', emphasizeLinksEnabled);
    }
    
    // Função para resetar todas as configurações
    function resetAll() {
        // Reset de tamanho de fonte
        resetFontSize();
        
        // Reset de contraste
        if (highContrastEnabled || invertedColorsEnabled) {
            resetContrast();
        }
        
        // Reset de fontes legíveis
        if (readableFontsEnabled) {
            toggleReadableFonts();
        }
        
        // Reset de espaçamento
        if (lineSpacingEnabled) {
            toggleLineSpacing();
        }
        
        // Reset de texto para fala
        if (textToSpeechEnabled) {
            toggleTextToSpeech();
        }
        
        // Reset de auxiliar de leitura
        if (readingHelperEnabled) {
            toggleReadingHelper();
        }
        
        // Reset de destaque de links
        if (emphasizeLinksEnabled) {
            toggleEmphasizeLinks();
        }
        
        showStatusMessage('Todas as configurações foram resetadas', 'success');
    }
    
    // Função para salvar preferências do usuário
    function saveUserPreference(preference, value) {
        // Se o usuário estiver logado no Moodle, salva via AJAX
        if (typeof M !== 'undefined' && M.cfg && M.cfg.sesskey) {
            // Usando o webservice para salvar preferências
            const data = {
                preference: preference,
                value: value
            };
            
            fetch(M.cfg.wwwroot + '/local/aguiaplugin/save_preference.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Moodle-Sesskey': M.cfg.sesskey
                },
                body: JSON.stringify(data)
            })
            .catch(function(error) {
                console.error('Erro ao salvar preferência:', error);
            });
        } else {
            // Fallback para localStorage quando não estiver logado
            localStorage.setItem('aguia_' + preference, JSON.stringify(value));
        }
    }
    
    // Função para carregar preferências do usuário
    function loadUserPreferences() {
        // Primeiro tenta carregar do Moodle para usuários logados
        if (typeof M !== 'undefined' && M.cfg && M.cfg.sesskey) {
            fetch(M.cfg.wwwroot + '/local/aguiaplugin/get_preferences.php', {
                method: 'GET',
                headers: {
                    'X-Moodle-Sesskey': M.cfg.sesskey
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.preferences) {
                    applyUserPreferences(data.preferences);
                } else {
                    // Se não houver preferências no Moodle, tenta carregar do localStorage
                    loadFromLocalStorage();
                }
            })
            .catch(function() {
                // Em caso de erro, tenta carregar do localStorage
                loadFromLocalStorage();
            });
        } else {
            // Para usuários não logados, carrega do localStorage
            loadFromLocalStorage();
        }
    }
    
    // Função para carregar preferências do localStorage
    function loadFromLocalStorage() {
        const preferences = {
            fontSize: getFromLocalStorage('fontSize', 100),
            highContrast: getFromLocalStorage('highContrast', false),
            invertedColors: getFromLocalStorage('invertedColors', false),
            readableFonts: getFromLocalStorage('readableFonts', false),
            lineSpacing: getFromLocalStorage('lineSpacing', false),
            textToSpeech: getFromLocalStorage('textToSpeech', false),
            readingHelper: getFromLocalStorage('readingHelper', false),
            emphasizeLinks: getFromLocalStorage('emphasizeLinks', false)
        };
        
        applyUserPreferences(preferences);
    }
    
    // Função auxiliar para obter valores do localStorage
    function getFromLocalStorage(key, defaultValue) {
        const stored = localStorage.getItem('aguia_' + key);
        return stored ? JSON.parse(stored) : defaultValue;
    }
    
    // Função para aplicar preferências carregadas
    function applyUserPreferences(preferences) {
        // Aplicar tamanho de fonte
        if (preferences.fontSize && preferences.fontSize !== 100) {
            currentFontSize = preferences.fontSize;
            setFontSize(currentFontSize);
            
            // Atualiza o slider se existir
            const fontSizeSlider = document.getElementById('aguiaFontSizeSlider');
            if (fontSizeSlider) {
                fontSizeSlider.value = currentFontSize;
            }
            
            // Atualiza o label se existir
            const fontSizeLabel = document.getElementById('aguiaFontSizeLabel');
            if (fontSizeLabel) {
                fontSizeLabel.setAttribute('data-value', currentFontSize + '%');
            }
        }
        
        // Aplicar alto contraste
        if (preferences.highContrast) {
            highContrastEnabled = true;
            document.body.classList.add('aguia-high-contrast');
            
            // Atualiza botão se existir
            const contrastBtn = document.getElementById('aguiaHighContrastBtn');
            if (contrastBtn) {
                contrastBtn.classList.add('active');
            }
        }
        
        // Aplicar cores invertidas
        if (preferences.invertedColors) {
            invertedColorsEnabled = true;
            document.body.classList.add('aguia-inverted-colors');
            
            // Atualiza botão se existir
            const invertedBtn = document.getElementById('aguiaInvertedColorsBtn');
            if (invertedBtn) {
                invertedBtn.classList.add('active');
            }
        }
        
        // Aplicar fontes legíveis
        if (preferences.readableFonts) {
            readableFontsEnabled = true;
            document.body.classList.add('aguia-readable-fonts');
            
            // Atualiza botão se existir
            const fontsBtn = document.getElementById('aguiaReadableFontsBtn');
            if (fontsBtn) {
                fontsBtn.classList.add('active');
            }
        }
        
        // Aplicar espaçamento
        if (preferences.lineSpacing) {
            lineSpacingEnabled = true;
            document.body.classList.add('aguia-increased-spacing');
            
            // Atualiza botão se existir
            const spacingBtn = document.getElementById('aguiaLineSpacingBtn');
            if (spacingBtn) {
                spacingBtn.classList.add('active');
            }
        }
        
        // Aplicar texto para fala
        if (preferences.textToSpeech) {
            textToSpeechEnabled = true;
            addTextToSpeechListeners();
            
            // Atualiza botão se existir
            const ttsBtn = document.getElementById('aguiaTextToSpeechBtn');
            if (ttsBtn) {
                ttsBtn.classList.add('active');
            }
        }
        
        // Aplicar auxiliar de leitura
        if (preferences.readingHelper) {
            readingHelperEnabled = true;
            createReadingHelper();
            
            // Atualiza botão se existir
            const helperBtn = document.getElementById('aguiaReadingHelperBtn');
            if (helperBtn) {
                helperBtn.classList.add('active');
            }
        }
        
        // Aplicar destaque de links
        if (preferences.emphasizeLinks) {
            emphasizeLinksEnabled = true;
            document.body.classList.add('aguia-emphasize-links');
            
            // Atualiza botão se existir
            const linksBtn = document.getElementById('aguiaEmphasizeLinksBtn');
            if (linksBtn) {
                linksBtn.classList.add('active');
            }
        }
    }
});
