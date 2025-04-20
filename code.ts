// Morse Kodu Eşleşmeleri (Mors'tan Karaktere)
const morseToChar: { [key: string]: string } = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z',
    '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
    '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
    '.-.-.-': '.', '--..--': ',', '..--..': '?', '-.-.--': '!', '-....-': '-',
    '-..-.': '/', '.--.-.': '@', '-.--.': '(', '-.--.-': ')', ' ': ' ' // Boşluk için boşluk karakteri
};

// Karakterden Mors'a eşleşmeleri de oluşturalım (Tablo için)
const charToMorse: { [key: string]: string } = {};
for (const morse in morseToChar) {
    const char = morseToChar[morse];
    if (char !== ' ') { // Tabloda boşluğu göstermeyelim
       charToMorse[char] = morse;
    }
}


// DOM Elementleri
const dotBtn = document.getElementById('dotBtn') as HTMLButtonElement;
const dashBtn = document.getElementById('dashBtn') as HTMLButtonElement;
const translateBtn = document.getElementById('translateBtn') as HTMLButtonElement;
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
const morseInputDisplay = document.getElementById('morseInputDisplay') as HTMLDivElement;
const resultDisplay = document.getElementById('resultDisplay') as HTMLDivElement;
const morseTableBody = document.querySelector('#morseTable tbody') as HTMLTableSectionElement;
const audioToggle = document.getElementById('audioToggle') as HTMLInputElement;

// Durum (State)
let currentMorseInput: string = '';

// Ses için AudioContext (İsteğe Bağlı)
let audioContext: AudioContext | null = null;
const dotDuration = 0.08; // saniye
const dashDuration = dotDuration * 3;
const frequency = 700; // Hz

function initAudioContext() {
    if (window.AudioContext || (window as any).webkitAudioContext) {
        if (!audioContext) {
             audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        // Kullanıcı etkileşimi sonrası 'suspended' durumu çözme
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    } else {
        console.warn("Web Audio API bu tarayıcıda desteklenmiyor.");
        audioToggle.disabled = true; // Checkbox'ı devre dışı bırak
        audioToggle.checked = false;
    }
}

function playTone(duration: number) {
    if (!audioContext || !audioToggle.checked || audioContext.state !== 'running') return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine'; // Ton tipi
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Sesin aniden başlayıp bitmesini engellemek için küçük bir envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01); // Yavaşça başla
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01); // Yavaşça bitir

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Yardımcı Fonksiyon: Giriş ve Sonuç Alanlarını Güncelle
function updateDisplays(morse: string = currentMorseInput, result: string = '-') {
    morseInputDisplay.textContent = morse || '-'; // Boşsa tire göster
    resultDisplay.textContent = result;
}

// Yardımcı Fonksiyon: Mors Tablosunu Doldur
function populateMorseTable() {
    if (!morseTableBody) return;
    morseTableBody.innerHTML = ''; // Mevcut içeriği temizle

    // Harfleri ve rakamları sıralı göstermek için
    const sortedChars = Object.keys(charToMorse).sort((a, b) => {
        // Önce harfler, sonra rakamlar, sonra diğerleri
        const typeA = a.match(/[A-Z]/) ? 1 : (a.match(/[0-9]/) ? 2 : 3);
        const typeB = b.match(/[A-Z]/) ? 1 : (b.match(/[0-9]/) ? 2 : 3);
        if (typeA !== typeB) return typeA - typeB;
        return a.localeCompare(b); // Aynı tip içinde alfabetik/sayısal sırala
    });


    for (const char of sortedChars) {
        const morse = charToMorse[char];
        const row = morseTableBody.insertRow();
        const cellChar = row.insertCell();
        const cellMorse = row.insertCell();
        cellChar.textContent = char;
        cellMorse.textContent = morse;
    }
}

// Olay Dinleyicileri (Event Listeners)

dotBtn.addEventListener('click', () => {
    initAudioContext(); // Ses context'ini başlat (gerekirse)
    currentMorseInput += '.';
    updateDisplays();
    playTone(dotDuration); // Nokta sesi çal
});

dashBtn.addEventListener('click', () => {
    initAudioContext(); // Ses context'ini başlat (gerekirse)
    currentMorseInput += '-';
    updateDisplays();
    playTone(dashDuration); // Çizgi sesi çal
});

translateBtn.addEventListener('click', () => {
    const character = morseToChar[currentMorseInput];
    if (character) {
        updateDisplays(currentMorseInput, character);
    } else if (currentMorseInput === '') {
         updateDisplays('', '-'); // Boş giriş için tire
    }
    else {
        updateDisplays(currentMorseInput, '???'); // Bilinmeyen kod
    }
});

clearBtn.addEventListener('click', () => {
    currentMorseInput = '';
    updateDisplays('', '-'); // Her şeyi temizle
});

// Sayfa yüklendiğinde tabloyu doldur
document.addEventListener('DOMContentLoaded', () => {
    populateMorseTable();
    updateDisplays('', '-'); // Başlangıç durumunu ayarla
});