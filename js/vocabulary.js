// Dữ liệu từ vựng theo chủ đề
const vocabularyData = {
    'basic-conversations': {
        title: 'Giao Tiếp Cơ Bản',
        description: 'Học từ vựng về chào hỏi, giới thiệu và giao tiếp hàng ngày',
        words: [
            {
                english: 'Hello',
                vietnamese: 'Xin chào',
                example: 'Hello, how are you?',
                pronunciation: '/həˈləʊ/',
                image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624',
                audio: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/hello--_gb_1.mp3'
            },
            {
                english: 'Good morning',
                vietnamese: 'Chào buổi sáng',
                example: 'Good morning! Did you sleep well?',
                pronunciation: '/ɡʊd ˈmɔːnɪŋ/',
                image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8',
                audio: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/good%20morning--_gb_1.mp3'
            },
            {
                english: 'Thank you',
                vietnamese: 'Cảm ơn',
                example: 'Thank you for your help!',
                pronunciation: '/θæŋk juː/',
                image: 'https://images.unsplash.com/photo-1489533119213-66a5cd877091',
                audio: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/thank%20you--_gb_1.mp3'
            },
            {
                english: 'You\'re welcome',
                vietnamese: 'Không có gì',
                example: 'You\'re welcome! Happy to help.',
                pronunciation: '/jɔː ˈwelkəm/',
                image: 'https://images.unsplash.com/photo-1499557354967-2b2d8910bcca',
                audio: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/you%27re%20welcome--_gb_1.mp3'
            },
            {
                english: 'Goodbye',
                vietnamese: 'Tạm biệt',
                example: 'Goodbye! See you tomorrow.',
                pronunciation: '/ɡʊdˈbaɪ/',
                image: 'https://images.unsplash.com/photo-1537815749002-de6a533c64db',
                audio: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/goodbye--_gb_1.mp3'
            }
        ]
    },
    'family': {
        title: 'Gia Đình và Bạn Bè',
        description: 'Từ vựng về quan hệ gia đình, bạn bè và các mối quan hệ xã hội',
        words: [
            {
                english: 'Father',
                vietnamese: 'Bố/Cha',
                example: 'My father works at a hospital.',
                pronunciation: '/ˈfɑːðə/',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
                audio: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/father--_gb_1.mp3'
            },
            {
                english: 'Mother',
                vietnamese: 'Mẹ',
                example: 'My mother is a teacher.',
                pronunciation: '/ˈmʌðə/',
                image: 'https://images.unsplash.com/photo-1556760544-74068565f05c',
                audio: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/mother--_gb_1.mp3'
            }
        ]
    }
};

// Trạng thái học tập
let currentTopic = '';
let currentWordIndex = 0;
let learningProgress = {};
let isCardFlipped = false;

// Khởi tạo trạng thái học tập
function initializeLearningProgress() {
    Object.keys(vocabularyData).forEach(topic => {
        learningProgress[topic] = {
            completed: 0,
            total: vocabularyData[topic].words.length,
            mastered: new Set()
        };
    });
    updateAllProgress();
}

// Cập nhật tất cả các thanh tiến độ
function updateAllProgress() {
    Object.keys(vocabularyData).forEach(topic => {
        const progress = learningProgress[topic];
        const progressBar = document.getElementById(`progress-${topic}`);
        const progressText = document.getElementById(`progress-text-${topic}`);
        
        if (progressBar && progressText) {
            const percentage = (progress.completed / progress.total) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${progress.completed}/${progress.total} từ`;
        }
    });
}

// Bắt đầu bài học
function startLesson(topic) {
    if (!vocabularyData[topic]) return;
    
    currentTopic = topic;
    currentWordIndex = 0;
    isCardFlipped = false;
    
    // Ẩn phần chủ đề và hiện phần học tập
    document.getElementById('topics').classList.add('hidden');
    document.getElementById('learning').classList.remove('hidden');
    
    // Hiển thị từ đầu tiên
    displayCurrentWord();
}

// Hiển thị từ vựng hiện tại
function displayCurrentWord() {
    if (!currentTopic || !vocabularyData[currentTopic]) return;

    const word = vocabularyData[currentTopic].words[currentWordIndex];
    const cardFront = document.querySelector('.word-card-front');
    const cardBack = document.querySelector('.word-card-back');
    
    // Mặt trước (tiếng Anh)
    cardFront.innerHTML = `
        <div class="h-full flex flex-col">
            <div class="flex-1">
                <img src="${word.image}" alt="${word.english}" class="w-full h-64 object-cover rounded-xl mb-8">
                <h3 class="text-4xl font-bold mb-4">${word.english}</h3>
                <p class="text-gray-500 italic text-xl mb-4">${word.pronunciation}</p>
            </div>
            <div class="flex justify-center space-x-4">
                <button onclick="event.stopPropagation(); playAudio('${word.audio}')" class="btn-audio">
                    <i class="fas fa-volume-up text-xl"></i>
                    <span>Nghe</span>
                </button>
                <button onclick="event.stopPropagation(); flipCard()" class="btn-flip">
                    <i class="fas fa-sync-alt text-xl"></i>
                    <span>Lật thẻ</span>
                </button>
            </div>
        </div>
    `;

    // Mặt sau (tiếng Việt)
    cardBack.innerHTML = `
        <div class="h-full flex flex-col">
            <div class="flex-1">
                <h3 class="text-4xl font-bold mb-8">${word.vietnamese}</h3>
                <div class="bg-gray-50 p-8 rounded-xl mb-8">
                    <p class="text-gray-700 text-2xl italic">${word.example}</p>
                </div>
            </div>
            <div class="flex justify-center space-x-4">
                <button onclick="event.stopPropagation(); markAsMastered('${currentTopic}', ${currentWordIndex})" 
                        class="btn-success">
                    <i class="fas fa-check text-xl"></i>
                    <span>Đã học</span>
                </button>
                <button onclick="event.stopPropagation(); flipCard()" class="btn-secondary">
                    <i class="fas fa-sync-alt text-xl"></i>
                    <span>Lật lại</span>
                </button>
            </div>
        </div>
    `;

    // Reset card flip state
    const card = document.querySelector('.word-card');
    card.classList.remove('flipped');
    isCardFlipped = false;

    updateProgress();
}

// Lật thẻ
function flipCard() {
    const card = document.querySelector('.word-card');
    isCardFlipped = !isCardFlipped;
    if (isCardFlipped) {
        card.classList.add('flipped');
    } else {
        card.classList.remove('flipped');
    }
}

// Phát âm thanh
function playAudio(url) {
    const audio = new Audio(url);
    audio.play().catch(error => {
        console.log('Error playing audio:', error);
        showNotification('Không thể phát âm thanh', 'error');
    });
}

// Chuyển đến từ tiếp theo
function nextWord() {
    if (!currentTopic || !vocabularyData[currentTopic]) return;

    currentWordIndex++;
    if (currentWordIndex >= vocabularyData[currentTopic].words.length) {
        currentWordIndex = 0;
    }
    displayCurrentWord();
}

// Chuyển đến từ trước
function previousWord() {
    if (!currentTopic || !vocabularyData[currentTopic]) return;

    currentWordIndex--;
    if (currentWordIndex < 0) {
        currentWordIndex = vocabularyData[currentTopic].words.length - 1;
    }
    displayCurrentWord();
}

// Quay lại danh sách chủ đề
function backToTopics() {
    document.getElementById('learning').classList.add('hidden');
    document.getElementById('topics').classList.remove('hidden');
    updateAllProgress();
}

// Đánh dấu từ đã học
function markAsMastered(topic, wordIndex) {
    if (!learningProgress[topic]) return;

    learningProgress[topic].mastered.add(wordIndex);
    learningProgress[topic].completed = learningProgress[topic].mastered.size;
    updateProgress();
    showNotification('Đã lưu tiến độ học tập!', 'success');
}

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    } fade-in`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2700);
}

// Cập nhật tiến độ học tập
function updateProgress() {
    if (!currentTopic || !learningProgress[currentTopic]) return;

    const progress = learningProgress[currentTopic];
    const progressBar = document.getElementById('progress-current');
    const progressText = document.getElementById('progress-text-current');

    if (progressBar && progressText) {
        const percentage = (progress.completed / progress.total) * 100;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${progress.completed}/${progress.total} từ`;
    }

    updateAllProgress();
}

// Khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    initializeLearningProgress();
});