const LevelDefinitions = [
    {
        id: 1,
        title: "Kırmızı Meyveler",
        location: "Meyve Bahçesi",
        instruction: "Orman bahçesindeki kırmızı meyvelere dokunup sepete topla!",
        render: function(container, onComplete) {
            let collected = 0;
            const targetCount = 3;

            container.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
                    <div class="basket-dropzone" id="fruit-basket" style="width:220px; height:120px;">
                        🧺 <span style="font-size:18px; font-weight:bold; color:#FF7B54;">Sepet (<span id="collected-count">0</span>/${targetCount})</span>
                    </div>
                    <p style="font-size:14px; font-weight:bold; color:#6C7A89;">Kırmızı olan 3 meyveyi bulalım:</p>
                    <div class="items-container" id="fruits-list" style="max-width:550px; gap:12px;"></div>
                </div>
            `;

            const fruits = [
                { emoji: '🍓', color: 'red', name: 'Çilek' },
                { emoji: '🍌', color: 'yellow', name: 'Muz' },
                { emoji: '🍎', color: 'red', name: 'Elma' },
                { emoji: '🍐', color: 'green', name: 'Armut' },
                { emoji: '🍒', color: 'red', name: 'Kiraz' },
                { emoji: '🍇', color: 'purple', name: 'Üzüm' },
                { emoji: '🍊', color: 'orange', name: 'Portakal' }
            ];

            const listEl = container.querySelector('#fruits-list');
            fruits.forEach(item => {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.style.width = '85px';
                card.style.height = '85px';
                card.style.fontSize = '40px';
                card.innerHTML = item.emoji;
                card.onclick = () => {
                    if (card.classList.contains('correct')) return;

                    if (item.color === 'red') {
                        audioManager.playPop();
                        card.classList.add('correct');
                        card.style.opacity = '0.3';
                        card.style.pointerEvents = 'none';
                        collected++;
                        container.querySelector('#collected-count').textContent = collected;

                        if (collected >= targetCount) {
                            setTimeout(onComplete, 600);
                        }
                    } else {
                        audioManager.playGentleHint();
                        card.classList.add('wrong');
                        setTimeout(() => card.classList.remove('wrong'), 500);
                        audioManager.speak(`Bu ${item.name} kırmızı değil. Kırmızı çilek, elma veya kiraz bulalım!`);
                    }
                };
                listEl.appendChild(card);
            });
        }
    },
    {
        id: 2,
        title: "Şekil Arkadaşları",
        location: "Şekiller Deresi",
        instruction: "Sol taraftaki renkli şekle dokun, sonra sağdaki doğru gölgeye dokun!",
        render: function(container, onComplete) {
            let matched = 0;
            let selectedShape = null;

            container.innerHTML = `
                <div style="display:flex; justify-content:space-around; align-items:center; width:100%; height:100%;">
                    <div style="display:flex; flex-direction:column; gap:12px;" id="colored-shapes"></div>
                    <div style="font-size:36px; color:#FF7B54;">➡️</div>
                    <div style="display:flex; flex-direction:column; gap:12px;" id="shadow-shapes"></div>
                </div>
            `;

            const shapes = ['circle', 'square', 'triangle', 'star'];
            const colors = { circle: '#FF7B54', square: '#4CAF50', triangle: '#2196F3', star: '#FFD700' };

            const coloredCol = container.querySelector('#colored-shapes');
            const shadowCol = container.querySelector('#shadow-shapes');

            shapes.forEach(type => {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.style.width = '75px';
                card.style.height = '75px';
                card.innerHTML = SVGGraphics.getShapeSVG(type, colors[type], 50, 50);
                card.dataset.shape = type;
                card.onclick = () => {
                    audioManager.playPop();
                    coloredCol.querySelectorAll('.game-card').forEach(c => c.style.borderColor = '#E2E7D6');
                    card.style.borderColor = '#FF7B54';
                    selectedShape = type;
                };
                coloredCol.appendChild(card);
            });

            const shuffledShadows = [...shapes].sort(() => Math.random() - 0.5);
            shuffledShadows.forEach(type => {
                const shadowCard = document.createElement('div');
                shadowCard.className = 'game-card';
                shadowCard.style.width = '75px';
                shadowCard.style.height = '75px';
                shadowCard.innerHTML = SVGGraphics.getShadowSVG(type, 50, 50);
                shadowCard.onclick = () => {
                    if (!selectedShape) {
                        audioManager.speak("Önce sol taraftaki renkli şekillerden birine dokun!");
                        return;
                    }

                    if (selectedShape === type) {
                        audioManager.playPop();
                        shadowCard.classList.add('correct');
                        shadowCard.style.pointerEvents = 'none';
                        
                        const srcCard = coloredCol.querySelector(`[data-shape="${type}"]`);
                        if (srcCard) {
                            srcCard.style.opacity = '0.3';
                            srcCard.style.pointerEvents = 'none';
                        }
                        
                        matched++;
                        selectedShape = null;
                        if (matched === shapes.length) {
                            setTimeout(onComplete, 600);
                        }
                    } else {
                        audioManager.playGentleHint();
                        shadowCard.classList.add('wrong');
                        setTimeout(() => shadowCard.classList.remove('wrong'), 500);
                        audioManager.speak("Bu gölge seçtiğin şekle benzemiyor. Tekrar dene!");
                    }
                };
                shadowCol.appendChild(shadowCard);
            });
        }
    },
    {
        id: 3,
        title: "Hayvanların Yuvası",
        location: "Orman Evi",
        instruction: "Bir hayvana dokun, sonra onun yaşadığı yuvayı seç!",
        render: function(container, onComplete) {
            let matched = 0;
            let selectedAnimal = null;

            container.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:16px; width:100%; align-items:center;">
                    <div style="display:flex; gap:12px;" id="animals-list"></div>
                    <div style="font-size:16px; font-weight:bold; color:#777;">Yuvalar:</div>
                    <div style="display:flex; gap:12px;" id="homes-list"></div>
                </div>
            `;

            const pairs = [
                { id: 'rabbit', animal: '🐇 Tavşan', home: 'Havuç Yuvası', homeIcon: '🕳️' },
                { id: 'bird', animal: '🐦 Kuş', home: 'Ağaç Yuvası', homeIcon: '🌳' },
                { id: 'fish', animal: '🐟 Balık', home: 'Gölet', homeIcon: '🌊' },
                { id: 'bee', animal: '🐝 Arı', home: 'Kovan', homeIcon: '🍯' }
            ];

            const animList = container.querySelector('#animals-list');
            const homesList = container.querySelector('#homes-list');

            pairs.forEach(p => {
                const aCard = document.createElement('div');
                aCard.className = 'game-card';
                aCard.style.width = '100px';
                aCard.style.height = '100px';
                aCard.innerHTML = `<span style="font-size:32px;">${p.animal.split(' ')[0]}</span><span style="font-size:12px; font-weight:bold;">${p.animal.split(' ')[1]}</span>`;
                aCard.onclick = () => {
                    audioManager.playPop();
                    audioManager.playAnimalSound(p.id);
                    animList.querySelectorAll('.game-card').forEach(c => c.style.borderColor = '#E2E7D6');
                    aCard.style.borderColor = '#FF7B54';
                    selectedAnimal = p.id;
                };
                animList.appendChild(aCard);
            });

            [...pairs].sort(() => Math.random() - 0.5).forEach(p => {
                const hCard = document.createElement('div');
                hCard.className = 'game-card';
                hCard.style.width = '100px';
                hCard.style.height = '100px';
                hCard.innerHTML = `<span style="font-size:32px;">${p.homeIcon}</span><span style="font-size:11px; font-weight:bold;">${p.home}</span>`;
                hCard.onclick = () => {
                    if (!selectedAnimal) {
                        audioManager.speak("Önce bir hayvan seç!");
                        return;
                    }
                    if (selectedAnimal === p.id) {
                        audioManager.playPop();
                        hCard.classList.add('correct');
                        hCard.style.pointerEvents = 'none';

                        const aCard = animList.querySelector(`.game-card:nth-child(${pairs.findIndex(x => x.id === p.id) + 1})`);
                        if (aCard) {
                            aCard.style.opacity = '0.3';
                            aCard.style.pointerEvents = 'none';
                        }
                        matched++;
                        selectedAnimal = null;
                        if (matched === pairs.length) {
                            setTimeout(onComplete, 600);
                        }
                    } else {
                        audioManager.playGentleHint();
                        hCard.classList.add('wrong');
                        setTimeout(() => hCard.classList.remove('wrong'), 500);
                        audioManager.speak("Bu yuva bu hayvana ait değil. Başka bir yuva deneyelim!");
                    }
                };
                homesList.appendChild(hCard);
            });
        }
    },
    {
        id: 4,
        title: "Ritmi Tekrar Et",
        location: "Müzik Çayırı",
        instruction: "Sırayla çalan müzikli mantarları aynı sırada çal!",
        render: function(container, onComplete) {
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%;">
                    <p id="rhythm-status" style="font-size:18px; font-weight:bold; color:#FF7B54;">Dinle ve izle...</p>
                    <div style="display:flex; gap:14px;" id="mushrooms"></div>
                </div>
            `;

            const colors = [
                { name: 'Kırmızı', color: '#FF5252', freq: 440, emoji: '🔴' },
                { name: 'Mavi', color: '#448AFF', freq: 554.37, emoji: '🔵' },
                { name: 'Sarı', color: '#FFD700', freq: 659.25, emoji: '🟡' },
                { name: 'Yeşil', color: '#4CAF50', freq: 783.99, emoji: '🟢' }
            ];

            const targetSequence = [0, 2, 1];
            let userSequence = [];
            let isPlayingPattern = true;

            const mushroomsDiv = container.querySelector('#mushrooms');

            colors.forEach((item, idx) => {
                const btn = document.createElement('div');
                btn.className = 'game-card';
                btn.style.width = '90px';
                btn.style.height = '90px';
                btn.style.borderColor = item.color;
                btn.innerHTML = `<span style="font-size:38px;">${item.emoji}</span>`;
                btn.onclick = () => {
                    if (isPlayingPattern) return;
                    audioManager.playTone(item.freq, 'triangle', 0.3, 0.3);
                    btn.style.background = item.color;
                    setTimeout(() => btn.style.background = '#FFF', 250);

                    userSequence.push(idx);
                    if (userSequence[userSequence.length - 1] !== targetSequence[userSequence.length - 1]) {
                        audioManager.playGentleHint();
                        audioManager.speak("Sırayı karıştırdın. Tekrar dinleyelim!");
                        userSequence = [];
                        setTimeout(playPattern, 1000);
                        return;
                    }

                    if (userSequence.length === targetSequence.length) {
                        setTimeout(onComplete, 600);
                    }
                };
                mushroomsDiv.appendChild(btn);
            });

            function playPattern() {
                isPlayingPattern = true;
                container.querySelector('#rhythm-status').textContent = "Dinle ve izle...";
                let i = 0;
                const interval = setInterval(() => {
                    if (i >= targetSequence.length) {
                        clearInterval(interval);
                        isPlayingPattern = false;
                        container.querySelector('#rhythm-status').textContent = "Şimdi sıra sende! Dokun!";
                        return;
                    }
                    const idx = targetSequence[i];
                    const btn = mushroomsDiv.children[idx];
                    audioManager.playTone(colors[idx].freq, 'triangle', 0.3, 0.3);
                    btn.style.background = colors[idx].color;
                    setTimeout(() => btn.style.background = '#FFF', 350);
                    i++;
                }, 750);
            }

            setTimeout(playPattern, 600);
        }
    },
    {
        id: 5,
        title: "Kelebeğe Yardım Et",
        location: "Çiçekli Tepe",
        instruction: "Pembe kelebeği Pembe Çiçeğe konması için seç!",
        render: function(container, onComplete) {
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
                    <div id="butterfly-hero" style="transition: transform 0.6s ease;">
                        ${SVGGraphics.getButterflySVG('#E91E63', 85, 85)}
                    </div>
                    <p style="font-weight:bold; color:#6C7A89;">Hangi çiçek PEMBE?</p>
                    <div style="display:flex; gap:12px;" id="flowers"></div>
                </div>
            `;

            const flowers = [
                { color: 'yellow', name: 'Sarı Çiçek', emoji: '🌻', isCorrect: false },
                { color: 'pink', name: 'Pembe Çiçek', emoji: '🌸', isCorrect: true },
                { color: 'blue', name: 'Mavi Çiçek', emoji: '🪻', isCorrect: false },
                { color: 'red', name: 'Kırmızı Çiçek', emoji: '🌹', isCorrect: false },
                { color: 'purple', name: 'Mor Çiçek', emoji: '🌺', isCorrect: false }
            ];

            const flowersDiv = container.querySelector('#flowers');
            flowers.forEach(fl => {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.style.width = '80px';
                card.style.height = '80px';
                card.innerHTML = `<span style="font-size:38px;">${fl.emoji}</span>`;
                card.onclick = () => {
                    if (fl.isCorrect) {
                        audioManager.playPop();
                        card.classList.add('correct');
                        const bFly = container.querySelector('#butterfly-hero');
                        bFly.style.transform = 'translateY(65px) scale(1.2)';
                        setTimeout(onComplete, 800);
                    } else {
                        audioManager.playGentleHint();
                        card.classList.add('wrong');
                        setTimeout(() => card.classList.remove('wrong'), 500);
                        audioManager.speak(`Bu ${fl.name}. Pembe çiçeği bulup kelebeği ona götürelim!`);
                    }
                };
                flowersDiv.appendChild(card);
            });
        }
    },
    {
        id: 6,
        title: "Eksik Parçayı Bul",
        location: "Baykuşun Ağacı",
        instruction: "Tavşanın başındaki eksik kulağı tamamla!",
        render: function(container, onComplete) {
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
                    <div style="font-size:75px; position:relative; background:#FFF5E4; padding:10px 30px; border-radius:20px;">
                        🐰 <span style="position:absolute; top:-12px; right:15px; font-size:32px; color:#FF7B54;">❓</span>
                    </div>
                    <p style="font-weight:bold; color:#6C7A89;">Hangi kulak tavşana ait?</p>
                    <div style="display:flex; gap:12px;" id="ear-options"></div>
                </div>
            `;

            const options = [
                { emoji: '🐻', name: 'Ayı Kulağı', isCorrect: false },
                { emoji: '👂', name: 'Tavşan Kulağı', isCorrect: true },
                { emoji: '🐱', name: 'Kedi Kulağı', isCorrect: false },
                { emoji: '🐘', name: 'Fil Kulağı', isCorrect: false }
            ];

            const optDiv = container.querySelector('#ear-options');
            options.forEach(opt => {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.style.width = '85px';
                card.style.height = '85px';
                card.style.fontSize = '40px';
                card.innerHTML = opt.emoji;
                card.onclick = () => {
                    if (opt.isCorrect) {
                        audioManager.playPop();
                        card.classList.add('correct');
                        setTimeout(onComplete, 600);
                    } else {
                        audioManager.playGentleHint();
                        card.classList.add('wrong');
                        setTimeout(() => card.classList.remove('wrong'), 500);
                        audioManager.speak(`Bu ${opt.name}. Uzun tavşan kulağını seçelim!`);
                    }
                };
                optDiv.appendChild(card);
            });
        }
    },
    {
        id: 7,
        title: "Büyük ve Küçük",
        location: "Taş Köprü",
        instruction: "Büyük elmaları BÜYÜK sepete, küçük elmaları KÜÇÜK sepete yerleştir!",
        render: function(container, onComplete) {
            let doneCount = 0;
            container.innerHTML = `
                <div style="display:flex; justify-content:space-around; align-items:center; width:100%;">
                    <div id="big-basket" class="basket-dropzone" style="width:130px; height:110px;">
                        🧺 <span style="font-size:13px; font-weight:bold;">BÜYÜK SEPET</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;" id="apples-list"></div>
                    <div id="small-basket" class="basket-dropzone" style="width:95px; height:85px; font-size:28px;">
                        🧺 <span style="font-size:11px; font-weight:bold;">KÜÇÜK SEPET</span>
                    </div>
                </div>
            `;

            const apples = [
                { size: 'big', emoji: '🍎', scale: '1.4' },
                { size: 'small', emoji: '🍎', scale: '0.75' },
                { size: 'big', emoji: '🍎', scale: '1.4' },
                { size: 'small', emoji: '🍎', scale: '0.75' }
            ];

            let selectedApple = null;
            const applesDiv = container.querySelector('#apples-list');

            apples.forEach(a => {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.style.width = '75px';
                card.style.height = '75px';
                card.innerHTML = `<span style="transform:scale(${a.scale}); display:inline-block;">${a.emoji}</span>`;
                card.onclick = () => {
                    audioManager.playPop();
                    applesDiv.querySelectorAll('.game-card').forEach(c => c.style.borderColor = '#E2E7D6');
                    card.style.borderColor = '#FF7B54';
                    selectedApple = { size: a.size, card: card };
                };
                applesDiv.appendChild(card);
            });

            const bigBasket = container.querySelector('#big-basket');
            const smallBasket = container.querySelector('#small-basket');

            bigBasket.onclick = () => checkBasket('big');
            smallBasket.onclick = () => checkBasket('small');

            function checkBasket(targetSize) {
                if (!selectedApple) {
                    audioManager.speak("Önce bir elma seç!");
                    return;
                }
                if (selectedApple.size === targetSize) {
                    audioManager.playPop();
                    selectedApple.card.style.opacity = '0.2';
                    selectedApple.card.style.pointerEvents = 'none';
                    selectedApple = null;
                    doneCount++;
                    if (doneCount === apples.length) {
                        setTimeout(onComplete, 600);
                    }
                } else {
                    audioManager.playGentleHint();
                    audioManager.speak(targetSize === 'big' ? "Bu elma küçük, küçük sepete koymalıyız!" : "Bu elma büyük, büyük sepete koymalıyız!");
                }
            }
        }
    },
    {
        id: 8,
        title: "Bu Ses Kimin?",
        location: "Sesli Çayır",
        instruction: "Sesi dinle ve sesin hangi hayvana ait olduğunu seç!",
        render: function(container, onComplete) {
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
                    <button class="btn-primary" id="listen-sound-btn" style="font-size:20px; padding:10px 24px;">
                        🔊 Sesi Dinle
                    </button>
                    <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;" id="animal-choices"></div>
                </div>
            `;

            const targetAnimal = 'cat';
            const choices = [
                { id: 'cat', emoji: '🐱', name: 'Kedi' },
                { id: 'dog', emoji: '🐶', name: 'Köpek' },
                { id: 'cow', emoji: '🐮', name: 'İnek' },
                { id: 'bird', emoji: '🐦', name: 'Kuş' },
                { id: 'bee', emoji: '🐝', name: 'Arı' }
            ];

            const playSound = () => audioManager.playAnimalSound('cat');
            container.querySelector('#listen-sound-btn').onclick = playSound;

            setTimeout(playSound, 500);

            const choicesDiv = container.querySelector('#animal-choices');
            choices.forEach(ch => {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.style.width = '90px';
                card.style.height = '90px';
                card.innerHTML = `<span style="font-size:36px;">${ch.emoji}</span><span style="font-size:12px; font-weight:bold;">${ch.name}</span>`;
                card.onclick = () => {
                    if (ch.id === targetAnimal) {
                        audioManager.playPop();
                        card.classList.add('correct');
                        setTimeout(onComplete, 600);
                    } else {
                        audioManager.playGentleHint();
                        card.classList.add('wrong');
                        setTimeout(() => card.classList.remove('wrong'), 500);
                        audioManager.speak(`Bu ses ${ch.name} sesi değil. Tekrar dinleyelim!`);
                    }
                };
                choicesDiv.appendChild(card);
            });
        }
    },
    {
        id: 9,
        title: "Çiçek Nasıl Büyür?",
        location: "Bahçıvan Kaplumbağa'nın Bahçesi",
        instruction: "Çiçeğin büyüme sırasına göre bas: 1. Tohum 🌱 -> 2. Filiz 🌿 -> 3. Tomurcuk 🌷 -> 4. Çiçek 🌸",
        render: function(container, onComplete) {
            let currentStep = 1;

            container.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
                    <p style="font-weight:bold; color:#4E9F3D; font-size:18px;">Sıradaki Adım: <span id="current-step-label">1. Tohum 🌱</span></p>
                    <div style="display:flex; gap:10px;" id="growth-stages"></div>
                </div>
            `;

            const stages = [
                { step: 2, emoji: '🌿', name: 'Filiz' },
                { step: 1, emoji: '🌱', name: 'Tohum' },
                { step: 4, emoji: '🌸', name: 'Çiçek' },
                { step: 3, emoji: '🌷', name: 'Tomurcuk' }
            ];

            const stepLabels = {
                1: "1. Tohum 🌱",
                2: "2. Filiz 🌿",
                3: "3. Tomurcuk 🌷",
                4: "4. Çiçek 🌸"
            };

            const stagesDiv = container.querySelector('#growth-stages');
            stages.forEach(st => {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.style.width = '90px';
                card.style.height = '90px';
                card.innerHTML = `<span style="font-size:36px;">${st.emoji}</span><span style="font-size:12px; font-weight:bold;">${st.name}</span>`;
                card.onclick = () => {
                    if (st.step === currentStep) {
                        audioManager.playPop();
                        card.classList.add('correct');
                        card.style.pointerEvents = 'none';
                        currentStep++;
                        if (stepLabels[currentStep]) {
                            container.querySelector('#current-step-label').textContent = stepLabels[currentStep];
                        }
                        if (currentStep > 4) {
                            setTimeout(onComplete, 600);
                        }
                    } else {
                        audioManager.playGentleHint();
                        card.classList.add('wrong');
                        setTimeout(() => card.classList.remove('wrong'), 500);
                        audioManager.speak("Önce tohum ekilir, sonra filizlenir, ardından tomurcuklanır ve çiçek açar!");
                    }
                };
                stagesDiv.appendChild(card);
            });
        }
    },
    {
        id: 10,
        title: "Tilki Yuvasına Dönsün",
        location: "Kıvrımlı Patika",
        instruction: "Sağ yön oklarına dokunarak Minik Tilki'yi yuvasına ulaştır!",
        render: function(container, onComplete) {
            let currentPos = 0;
            const targetPos = 4;

            container.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
                    <div style="display:flex; gap:12px; align-items:center; background:#FFF; padding:14px 24px; border-radius:24px; border:3px solid #E2E7D6; min-width:320px;">
                        <span id="fox-runner" style="font-size:38px; transition:all 0.3s;">🦊</span>
                        <span style="font-size:20px; color:#DDD;">▫️</span>
                        <span style="font-size:20px; color:#DDD;">▫️</span>
                        <span style="font-size:20px; color:#DDD;">▫️</span>
                        <span style="font-size:20px; color:#DDD;">▫️</span>
                        <span style="font-size:38px;">🏡</span>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(3, 60px); grid-gap:10px;" id="arrows-pad">
                        <div></div>
                        <button class="btn-primary arrow-btn" data-dir="up" style="padding:10px;">⬆️</button>
                        <div></div>
                        <button class="btn-primary arrow-btn" data-dir="left" style="padding:10px;">⬅️</button>
                        <button class="btn-primary arrow-btn" data-dir="down" style="padding:10px;">⬇️</button>
                        <button class="btn-primary arrow-btn" data-dir="right" style="padding:10px;">➡️</button>
                    </div>
                </div>
            `;

            const buttons = container.querySelectorAll('.arrow-btn');
            buttons.forEach(btn => {
                btn.onclick = () => {
                    const dir = btn.dataset.dir;
                    if (dir === 'right' || dir === 'up') {
                        audioManager.playPop();
                        currentPos++;
                        container.querySelector('#fox-runner').style.transform = `translateX(${currentPos * 38}px)`;
                        if (currentPos >= targetPos) {
                            audioManager.playAnimalSound('fox');
                            setTimeout(onComplete, 800);
                        }
                    } else {
                        audioManager.playGentleHint();
                        audioManager.speak("Yuva sağ tarafta, sağ ok veya yukarı oka dokun!");
                    }
                };
            });
        }
    }
];
