// Plugin AGUIA para acessibilidade - Inicialização simplificada

// Função para inicializar o plugin assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Criar o botão de acessibilidade
    const button = document.createElement('button');
    button.id = 'accessibilityButton';
    button.setAttribute('aria-label', 'Menu de Acessibilidade');
    button.innerHTML = '♿';
    button.style.position = 'fixed';
    button.style.bottom = '30px';
    button.style.right = '30px';
    button.style.width = '60px';
    button.style.height = '60px';
    button.style.backgroundColor = '#4caf50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.fontSize = '28px';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.3s ease';
    button.style.zIndex = '9999';

    // Efeito hover
    button.onmouseover = function() {
        this.style.transform = 'scale(1.1)';
        this.style.backgroundColor = '#45a049';
    };
    
    button.onmouseout = function() {
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = '#4caf50';
    };

    // Adicionar evento de clique para mostrar menu
    button.onclick = function() {
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    };

    // Criar o menu de acessibilidade
    const menu = document.createElement('div');
    menu.id = 'accessibilityMenu';
    menu.style.position = 'fixed';
    menu.style.bottom = '100px';
    menu.style.right = '30px';
    menu.style.backgroundColor = '#fff';
    menu.style.border = '1px solid #ddd';
    menu.style.borderRadius = '8px';
    menu.style.padding = '20px';
    menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    menu.style.display = 'none';
    menu.style.width = '250px';
    menu.style.zIndex = '9999';

    // Título do menu
    const title = document.createElement('h2');
    title.style.margin = '0 0 15px 0';
    title.style.fontSize = '18px';
    title.textContent = 'Menu de Acessibilidade';
    menu.appendChild(title);

    // Opções do menu
    const options = [
        { text: '🔍+ Aumentar Fonte', action: increaseFontSize },
        { text: '🔍- Diminuir Fonte', action: decreaseFontSize },
        { text: '🔄 Resetar Fonte', action: resetFontSize },
        { text: '🌓 Alto Contraste', action: toggleHighContrast },
        { text: '🔄 Cores Invertidas', action: toggleInvertedColors },
        { text: '🌈 Resetar Contraste', action: resetContrast },
        { text: '📝 Fontes Legíveis', action: toggleReadableFonts },
        { text: '↕️ Espaçamento', action: toggleLineSpacing },
        { text: '🔊 Texto para Fala', action: toggleTextToSpeech },
        { text: '👁️ Auxílio de Leitura', action: toggleReadingHelper }
    ];

    // Adicionar as opções ao menu
    options.forEach(function(option) {
        const btn = document.createElement('button');
        btn.textContent = option.text;
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.padding = '12px';
        btn.style.margin = '8px 0';
        btn.style.backgroundColor = '#f8f8f8';
        btn.style.border = '1px solid #ddd';
        btn.style.borderRadius = '5px';
        btn.style.fontSize = '16px';
        btn.style.cursor = 'pointer';
        btn.style.textAlign = 'left';
        
        btn.onmouseover = function() {
            this.style.backgroundColor = '#f0f0f0';
        };
        
        btn.onmouseout = function() {
            this.style.backgroundColor = '#f8f8f8';
        };
        
        btn.onclick = option.action;
        menu.appendChild(btn);
    });

    // Adicionar o botão e o menu ao corpo da página
    document.body.appendChild(button);
    document.body.appendChild(menu);

    // Funções de acessibilidade
    let currentFontSize = 100;
    let highContrastEnabled = false;
    let invertedColorsEnabled = false;
    let readableFontsEnabled = false;
    let lineSpacingEnabled = false;
    let textToSpeechEnabled = false;
    let readingHelperEnabled = false;

    // Estilos CSS
    const style = document.createElement('style');
    style.textContent = `
        .high-contrast {
            background-color: #000 !important;
            color: #fff !important;
        }
        
        .high-contrast * {
            background-color: #000 !important;
            color: #fff !important;
            border-color: #fff !important;
        }
        
        .high-contrast a {
            color: #ffff00 !important;
        }
        
        .high-contrast img {
            filter: grayscale(100%) contrast(150%) !important;
        }
        
        .inverted-colors {
            filter: invert(100%) hue-rotate(180deg) !important;
        }
        
        .inverted-colors img {
            filter: invert(100%) hue-rotate(180deg) !important;
        }
        
        .readable-fonts,
        .readable-fonts * {
            font-family: "Open Dyslexic", "Comic Sans MS", "Arial", sans-serif !important;
            letter-spacing: 0.05em !important;
            word-spacing: 0.15em !important;
        }
        
        .increased-spacing {
            line-height: 2 !important;
        }
        
        .increased-spacing p, 
        .increased-spacing li, 
        .increased-spacing h1, 
        .increased-spacing h2, 
        .increased-spacing h3, 
        .increased-spacing h4, 
        .increased-spacing h5, 
        .increased-spacing h6 {
            margin-bottom: 1.5em !important;
        }
        
        .text-to-speech-highlight {
            background-color: rgba(255, 255, 0, 0.3) !important;
        }
        
        .reading-helper {
            position: absolute;
            background-color: rgba(255, 255, 0, 0.3);
            height: 30px;
            pointer-events: none;
            z-index: 9998;
        }
    `;
    document.head.appendChild(style);

    // Função para aumentar o tamanho da fonte
    function increaseFontSize() {
        currentFontSize += 10;
        document.body.style.fontSize = currentFontSize + '%';
    }

    // Função para diminuir o tamanho da fonte
    function decreaseFontSize() {
        if (currentFontSize > 70) {
            currentFontSize -= 10;
            document.body.style.fontSize = currentFontSize + '%';
        }
    }

    // Função para resetar o tamanho da fonte
    function resetFontSize() {
        currentFontSize = 100;
        document.body.style.fontSize = '100%';
    }

    // Função para alternar alto contraste
    function toggleHighContrast() {
        resetContrast();
        highContrastEnabled = !highContrastEnabled;
        if (highContrastEnabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    // Função para alternar cores invertidas
    function toggleInvertedColors() {
        resetContrast();
        invertedColorsEnabled = !invertedColorsEnabled;
        if (invertedColorsEnabled) {
            document.body.classList.add('inverted-colors');
        } else {
            document.body.classList.remove('inverted-colors');
        }
    }

    // Função para resetar contraste
    function resetContrast() {
        highContrastEnabled = false;
        invertedColorsEnabled = false;
        document.body.classList.remove('high-contrast', 'inverted-colors');
    }

    // Função para alternar fontes legíveis
    function toggleReadableFonts() {
        readableFontsEnabled = !readableFontsEnabled;
        if (readableFontsEnabled) {
            document.body.classList.add('readable-fonts');
        } else {
            document.body.classList.remove('readable-fonts');
        }
    }

    // Função para alternar espaçamento
    function toggleLineSpacing() {
        lineSpacingEnabled = !lineSpacingEnabled;
        if (lineSpacingEnabled) {
            document.body.classList.add('increased-spacing');
        } else {
            document.body.classList.remove('increased-spacing');
        }
    }

    // Função para texto para fala
    function toggleTextToSpeech() {
        textToSpeechEnabled = !textToSpeechEnabled;
        
        if (!('speechSynthesis' in window)) {
            alert('Seu navegador não suporta a função de leitura de texto.');
            textToSpeechEnabled = false;
            return;
        }
        
        if (textToSpeechEnabled) {
            // Adicionar eventos de clique para leitura
            document.addEventListener('click', speakText);
        } else {
            // Remover eventos de clique para leitura
            document.removeEventListener('click', speakText);
            window.speechSynthesis.cancel();
        }
    }
    
    // Função para falar o texto
    function speakText(e) {
        if (!textToSpeechEnabled) return;
        
        const element = e.target.closest('p, h1, h2, h3, h4, h5, h6, li, td, th, a, button, span, div');
        if (element && element.textContent.trim().length > 0) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(element.textContent.trim());
            utterance.lang = document.documentElement.lang || 'pt-BR';
            window.speechSynthesis.speak(utterance);
            
            // Destacar elemento que está sendo lido
            element.classList.add('text-to-speech-highlight');
            utterance.onend = function() {
                element.classList.remove('text-to-speech-highlight');
            };
        }
    }

    // Função para auxiliar de leitura
    function toggleReadingHelper() {
        readingHelperEnabled = !readingHelperEnabled;
        
        if (readingHelperEnabled) {
            if (!document.getElementById('readingHelper')) {
                const helper = document.createElement('div');
                helper.id = 'readingHelper';
                helper.className = 'reading-helper';
                helper.style.display = 'none';
                document.body.appendChild(helper);
            }
            document.addEventListener('mousemove', updateReadingHelper);
        } else {
            document.removeEventListener('mousemove', updateReadingHelper);
            const helper = document.getElementById('readingHelper');
            if (helper) {
                helper.style.display = 'none';
            }
        }
    }
    
    // Atualiza a posição do auxiliar de leitura
    function updateReadingHelper(e) {
        const helper = document.getElementById('readingHelper');
        if (!helper || !readingHelperEnabled) return;
        
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
});
