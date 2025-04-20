// Morse Kodu Eşleşmeleri (Önceki script'ten kopyalayabilir veya import edebilirsiniz)
const morseToChar: { [key: string]: string } = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z',
    '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
    '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9'
    // Test için özel karakterleri şimdilik dışarıda bırakalım
};

const charToMorse: { [key: string]: string } = {};
for (const morse in morseToChar) {
    charToMorse[morseToChar[morse]] = morse;
}

// Test edilecek karakterlerin listesi
const charactersToTest: string[] = Object.keys(charToMorse);

// DOM Elementleri
const modeRadios = document.querySelectorAll<HTMLInputElement>('input[name="testMode"]');
const questionDisplay = document.getElementById('questionDisplay')!;
const charInputArea = document.getElementById('charInputArea')!;
const charInput = document.getElementById('charInput')! as HTMLInputElement;
const morseInputArea = document.getElementById('morseInputArea')!;
const morseInputDisplayTest = document.getElementById('morseInputDisplayTest')!;
const dotBtnTest = document.getElementById('dotBtnTest')!;
const dashBtnTest = document.getElementById('dashBtnTest')!;
const clearMorseInputBtn = document.getElementById('clearMorseInputBtn')!;
const checkAnswerBtn = document.getElementById('checkAnswerBtn')!;
const nextQuestionBtn = document.getElementById('nextQuestionBtn')!;
const feedbackDisplay = document.getElementById('feedbackDisplay')!;
const scoreValue = document.getElementById('scoreValue')!;

// Durum (State)
let currentMode: 'morseToChar' | 'charToMorse' = 'morseToChar'; // Başlangıç modu
let currentQuestion: string = '';
let correctAnswer: string = '';
let currentMorseInput: string = ''; // Harften Mors'a modu için
let score: number = 0;
let questionActive: boolean = true; // Cevap kontrol edilene kadar true

// --- Fonksiyonlar ---

// Rastgele bir karakter veya onun Mors kodunu seçer
function getRandomQuestion(): { question: string; answer: string } {
    const randomIndex = Math.floor(Math.random() * charactersToTest.length);
    const char = charactersToTest[randomIndex];
    const morse = charToMorse[char];

    if (currentMode === 'morseToChar') {
        return { question: morse, answer: char };
    } else { // charToMorse
        return { question: char, answer: morse };
    }
}

// Test alanını seçilen moda göre ayarlar
function setupTestUI() {
    if (currentMode === 'morseToChar') {
        charInputArea.style.display = 'block';
        morseInputArea.style.display = 'none';
        charInput.focus(); // Otomatik odaklanma
    } else { // charToMorse
        charInputArea.style.display = 'none';
        morseInputArea.style.display = 'flex'; // flex container olarak ayarladık
        morseInputArea.style.flexDirection = 'column'; // İçerikleri dikey hizala
        morseInputArea.style.alignItems = 'center'; // Ortala
        clearMorseInput(); // Önceki girişi temizle
    }
    // Giriş ve buton durumlarını sıfırla
    charInput.value = '';
    charInput.disabled = false;
    dotBtnTest.disabled = false;
    dashBtnTest.disabled = false;
    clearMorseInputBtn.disabled = false;
    feedbackDisplay.textContent = '';
    feedbackDisplay.className = 'feedback'; // Renk sınıflarını temizle
    checkAnswerBtn.style.display = 'inline-block';
    nextQuestionBtn.style.display = 'none';
    questionActive = true;
}

// Yeni bir soru oluşturur ve gösterir
function generateQuestion() {
    const { question, answer } = getRandomQuestion();
    currentQuestion = question;
    correctAnswer = answer;

    questionDisplay.textContent = currentQuestion;
    setupTestUI(); // UI'yi yeni soru için ayarla
}

// Kullanıcının cevabını kontrol eder
function checkAnswer() {
    if (!questionActive) return; // Zaten kontrol edildiyse tekrar çalıştırma

    let userAnswer: string;

    if (currentMode === 'morseToChar') {
        userAnswer = charInput.value.trim().toUpperCase();
        charInput.disabled = true; // Girişi kitle
    } else { // charToMorse
        userAnswer = currentMorseInput;
        // Mors giriş butonlarını kitle
        dotBtnTest.disabled = true;
        dashBtnTest.disabled = true;
        clearMorseInputBtn.disabled = true;
    }

    if (userAnswer === correctAnswer) {
        feedbackDisplay.textContent = 'Doğru!';
        feedbackDisplay.className = 'feedback correct';
        score++;
        updateScore();
    } else {
        const feedbackText = `Yanlış! Doğru cevap: ${correctAnswer}`;
        feedbackDisplay.textContent = feedbackText;
        feedbackDisplay.className = 'feedback incorrect';
    }

    questionActive = false; // Soru kontrol edildi
    checkAnswerBtn.style.display = 'none';
    nextQuestionBtn.style.display = 'inline-block';
    nextQuestionBtn.focus(); // Sonraki butona odaklan
}

// Mors girişini temizler (Mod 2)
function clearMorseInput() {
    currentMorseInput = '';
    morseInputDisplayTest.textContent = '-';
}

// Skoru günceller
function updateScore() {
    scoreValue.textContent = score.toString();
}

// --- Olay Dinleyicileri (Event Listeners) ---

// Mod değiştirme
modeRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        currentMode = target.value as 'morseToChar' | 'charToMorse';
        score = 0; // Mod değişince skoru sıfırla
        updateScore();
        generateQuestion(); // Yeni modla ilk soruyu getir
    });
});

// Cevabı Kontrol Et butonu
checkAnswerBtn.addEventListener('click', checkAnswer);

// Harf girişinde Enter tuşu ile kontrol etme (Mod 1)
charInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && currentMode === 'morseToChar' && questionActive) {
        checkAnswer();
    }
});

// Sonraki Soru butonu
nextQuestionBtn.addEventListener('click', generateQuestion);

// Mors Giriş Butonları (Mod 2)
dotBtnTest.addEventListener('click', () => {
    if (!questionActive) return;
    currentMorseInput += '.';
    morseInputDisplayTest.textContent = currentMorseInput;
});

dashBtnTest.addEventListener('click', () => {
    if (!questionActive) return;
    currentMorseInput += '-';
    morseInputDisplayTest.textContent = currentMorseInput;
});

clearMorseInputBtn.addEventListener('click', () => {
    if (!questionActive) return;
    clearMorseInput();
});


// --- Başlangıç ---
document.addEventListener('DOMContentLoaded', () => {
    generateQuestion(); // Sayfa yüklendiğinde ilk soruyu oluştur
    updateScore();
});