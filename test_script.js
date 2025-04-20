// Morse Kodu Eşleşmeleri (Önceki script'ten kopyalayabilir veya import edebilirsiniz)
var morseToChar = {
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
var charToMorse = {};
for (var morse in morseToChar) {
    charToMorse[morseToChar[morse]] = morse;
}
// Test edilecek karakterlerin listesi
var charactersToTest = Object.keys(charToMorse);
// DOM Elementleri
var modeRadios = document.querySelectorAll('input[name="testMode"]');
var questionDisplay = document.getElementById('questionDisplay');
var charInputArea = document.getElementById('charInputArea');
var charInput = document.getElementById('charInput');
var morseInputArea = document.getElementById('morseInputArea');
var morseInputDisplayTest = document.getElementById('morseInputDisplayTest');
var dotBtnTest = document.getElementById('dotBtnTest');
var dashBtnTest = document.getElementById('dashBtnTest');
var clearMorseInputBtn = document.getElementById('clearMorseInputBtn');
var checkAnswerBtn = document.getElementById('checkAnswerBtn');
var nextQuestionBtn = document.getElementById('nextQuestionBtn');
var feedbackDisplay = document.getElementById('feedbackDisplay');
var scoreValue = document.getElementById('scoreValue');
// Durum (State)
var currentMode = 'morseToChar'; // Başlangıç modu
var currentQuestion = '';
var correctAnswer = '';
var currentMorseInput = ''; // Harften Mors'a modu için
var score = 0;
var questionActive = true; // Cevap kontrol edilene kadar true
// --- Fonksiyonlar ---
// Rastgele bir karakter veya onun Mors kodunu seçer
function getRandomQuestion() {
    var randomIndex = Math.floor(Math.random() * charactersToTest.length);
    var char = charactersToTest[randomIndex];
    var morse = charToMorse[char];
    if (currentMode === 'morseToChar') {
        return { question: morse, answer: char };
    }
    else { // charToMorse
        return { question: char, answer: morse };
    }
}
// Test alanını seçilen moda göre ayarlar
function setupTestUI() {
    if (currentMode === 'morseToChar') {
        charInputArea.style.display = 'block';
        morseInputArea.style.display = 'none';
        charInput.focus(); // Otomatik odaklanma
    }
    else { // charToMorse
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
    var _a = getRandomQuestion(), question = _a.question, answer = _a.answer;
    currentQuestion = question;
    correctAnswer = answer;
    questionDisplay.textContent = currentQuestion;
    setupTestUI(); // UI'yi yeni soru için ayarla
}
// Kullanıcının cevabını kontrol eder
function checkAnswer() {
    if (!questionActive)
        return; // Zaten kontrol edildiyse tekrar çalıştırma
    var userAnswer;
    if (currentMode === 'morseToChar') {
        userAnswer = charInput.value.trim().toUpperCase();
        charInput.disabled = true; // Girişi kitle
    }
    else { // charToMorse
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
    }
    else {
        var feedbackText = "Yanl\u0131\u015F! Do\u011Fru cevap: ".concat(correctAnswer);
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
modeRadios.forEach(function (radio) {
    radio.addEventListener('change', function (event) {
        var target = event.target;
        currentMode = target.value;
        score = 0; // Mod değişince skoru sıfırla
        updateScore();
        generateQuestion(); // Yeni modla ilk soruyu getir
    });
});
// Cevabı Kontrol Et butonu
checkAnswerBtn.addEventListener('click', checkAnswer);
// Harf girişinde Enter tuşu ile kontrol etme (Mod 1)
charInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && currentMode === 'morseToChar' && questionActive) {
        checkAnswer();
    }
});
// Sonraki Soru butonu
nextQuestionBtn.addEventListener('click', generateQuestion);
// Mors Giriş Butonları (Mod 2)
dotBtnTest.addEventListener('click', function () {
    if (!questionActive)
        return;
    currentMorseInput += '.';
    morseInputDisplayTest.textContent = currentMorseInput;
});
dashBtnTest.addEventListener('click', function () {
    if (!questionActive)
        return;
    currentMorseInput += '-';
    morseInputDisplayTest.textContent = currentMorseInput;
});
clearMorseInputBtn.addEventListener('click', function () {
    if (!questionActive)
        return;
    clearMorseInput();
});
// --- Başlangıç ---
document.addEventListener('DOMContentLoaded', function () {
    generateQuestion(); // Sayfa yüklendiğinde ilk soruyu oluştur
    updateScore();
});
