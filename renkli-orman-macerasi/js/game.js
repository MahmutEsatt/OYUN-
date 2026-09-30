class GameEngine {
    constructor() {
        this.currentLevelId = 1;
        this.completedLevels = JSON.parse(localStorage.getItem('completed_levels') || '[]');
        this.leavesCount = this.completedLevels.length;
    }

    init() {
        // Render hero avatar on splash
        const avatarEl = document.getElementById('fox-avatar');
        if (avatarEl) {
            avatarEl.innerHTML = SVGGraphics.getFoxSVG(160, 160);
        }
        this.updateTopBar();
        this.renderMap();
    }

    updateTopBar() {
        const leafEl = document.getElementById('leaf-count');
        if (leafEl) {
            leafEl.textContent = this.completedLevels.length;
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
        }
    }

    startPlay() {
        this.showMap();
        audioManager.speak("Orman Haritasına Hoş Geldin! Bir durağa dokun!");
    }

    showMap() {
        this.renderMap();
        this.showScreen('screen-map');
    }

    renderMap() {
        const mapNodesEl = document.getElementById('map-nodes');
        if (!mapNodesEl) return;
        mapNodesEl.innerHTML = '';

        const locationIcons = {
            "Meyve Bahçesi": "🍎",
            "Şekiller Deresi": "🔺",
            "Orman Evi": "🏡",
            "Müzik Çayırı": "🎵",
            "Çiçekli Tepe": "🌸",
            "Baykuşun Ağacı": "🦉",
            "Taş Köprü": "🌉",
            "Sesli Çayır": "🔊",
            "Bahçıvan Kaplumbağa'nın Bahçesi": "🐢",
            "Kıvrımlı Patika": "🛣️"
        };

        LevelDefinitions.forEach(level => {
            const isCompleted = this.completedLevels.includes(level.id);
            const isUnlocked = level.id === 1 || this.completedLevels.includes(level.id - 1) || isCompleted;

            const node = document.createElement('div');
            node.className = `map-node ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`;
            
            node.innerHTML = `
                <div class="node-num">${level.id}</div>
                <div class="node-icon">${locationIcons[level.location] || '🌳'}</div>
                <div class="node-name">${level.title}</div>
            `;

            node.onclick = () => {
                if (isUnlocked) {
                    this.loadLevel(level.id);
                } else {
                    audioManager.playGentleHint();
                    audioManager.speak("Bu durağı açmak için önceki bölümü tamamla!");
                }
            };

            mapNodesEl.appendChild(node);
        });
    }

    loadLevel(levelId) {
        this.currentLevelId = levelId;
        const levelDef = LevelDefinitions.find(l => l.id === levelId);
        if (!levelDef) return;

        document.getElementById('level-badge').textContent = `Bölüm ${levelDef.id}`;
        document.getElementById('level-title').textContent = levelDef.title;
        document.getElementById('instruction-text').textContent = levelDef.instruction;

        const playArea = document.getElementById('level-play-area');
        playArea.innerHTML = '';

        levelDef.render(playArea, () => this.onLevelComplete());
        this.showScreen('screen-level');

        // Speak instruction
        setTimeout(() => {
            audioManager.speak(levelDef.instruction);
        }, 300);
    }

    repeatInstruction() {
        const levelDef = LevelDefinitions.find(l => l.id === this.currentLevelId);
        if (levelDef) {
            audioManager.speak(levelDef.instruction);
        }
    }

    onLevelComplete() {
        audioManager.playSuccess();
        
        if (!this.completedLevels.includes(this.currentLevelId)) {
            this.completedLevels.push(this.currentLevelId);
            localStorage.setItem('completed_levels', JSON.stringify(this.completedLevels));
            this.updateTopBar();
        }

        const modal = document.getElementById('modal-victory');
        if (modal) {
            modal.classList.add('active');
        }

        setTimeout(() => {
            audioManager.speak("Tebrikler! Bir yaprak rozeti daha kazandın!");
        }, 400);
    }

    repeatCurrentLevel() {
        const modal = document.getElementById('modal-victory');
        if (modal) modal.classList.remove('active');
        this.loadLevel(this.currentLevelId);
    }

    nextLevelOrMap() {
        const modal = document.getElementById('modal-victory');
        if (modal) modal.classList.remove('active');

        if (this.currentLevelId < LevelDefinitions.length) {
            this.loadLevel(this.currentLevelId + 1);
        } else {
            this.showMap();
            audioManager.speak("Harika! Ormanın bütün duraklarını keşfettin!");
        }
    }

    // Parent Gate Logic
    openParentGate() {
        const modal = document.getElementById('modal-parent');
        document.getElementById('parent-answer').value = '';
        document.getElementById('parent-dashboard').classList.add('hidden');
        if (modal) modal.classList.add('active');
    }

    closeParentGate() {
        const modal = document.getElementById('modal-parent');
        if (modal) modal.classList.remove('active');
    }

    verifyParentGate() {
        const ans = document.getElementById('parent-answer').value;
        if (parseInt(ans, 10) === 5) {
            document.getElementById('parent-dashboard').classList.remove('hidden');
            document.getElementById('parent-completed-count').textContent = this.completedLevels.length;
            document.getElementById('parent-leaves-count').textContent = this.completedLevels.length;
        } else {
            audioManager.playGentleHint();
            alert("Yanlış cevap. Bu alan yalnızca ebeveynler içindir.");
        }
    }

    resetProgress() {
        if (confirm("Tüm oyun ilerlemesini ve rozetleri sıfırlamak istediğinize emin misiniz?")) {
            this.completedLevels = [];
            localStorage.removeItem('completed_levels');
            this.updateTopBar();
            this.closeParentGate();
            this.showMap();
        }
    }
}

const game = new GameEngine();

window.addEventListener('DOMContentLoaded', () => {
    game.init();
});
