class AudioManager {
    constructor() {
        this.soundEnabled = true;
        this.ctx = null;
        this.synth = window.speechSynthesis || null;
        this.femaleVoice = null;
        
        if (this.synth) {
            // Load voices dynamically as browsers load them asynchronously
            const loadVoices = () => {
                const voices = this.synth.getVoices();
                const trVoices = voices.filter(v => v.lang.startsWith('tr'));
                if (trVoices.length > 0) {
                    // Search specifically for female Turkish voice or fallback to top TR voice
                    const femaleName = trVoices.find(v => 
                        v.name.toLowerCase().includes('female') || 
                        v.name.toLowerCase().includes('aysegul') || 
                        v.name.toLowerCase().includes('yelda') || 
                        v.name.toLowerCase().includes('seda') || 
                        v.name.toLowerCase().includes('zeynep') ||
                        v.name.toLowerCase().includes('google') ||
                        v.name.toLowerCase().includes('natural')
                    );
                    this.femaleVoice = femaleName || trVoices[0];
                }
            };
            loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = loadVoices;
            }
        }
    }

    initCtx() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('btn-sound');
        if (btn) {
            btn.textContent = this.soundEnabled ? '🔊' : '🔇';
        }
        if (!this.soundEnabled && this.synth) {
            this.synth.cancel();
        }
    }

    speak(text) {
        if (!this.soundEnabled) return;
        if (this.synth) {
            this.synth.cancel(); // Stop any current speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'tr-TR';
            
            // Set female voice if available
            if (this.femaleVoice) {
                utterance.voice = this.femaleVoice;
            }
            
            // Warm, cheerful female teacher/mother tone parameters
            utterance.rate = 0.88;  // Calm, clear speaking rate for kids
            utterance.pitch = 1.35; // Gentle, warm higher pitch for a soft female voice

            this.synth.speak(utterance);
        }
    }

    playTone(freq, type = 'sine', duration = 0.2, volume = 0.3) {
        if (!this.soundEnabled) return;
        this.initCtx();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn("Audio playback error", e);
        }
    }

    playSuccess() {
        if (!this.soundEnabled) return;
        this.initCtx();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.25, 0.25);
            }, idx * 100);
        });
    }

    playGentleHint() {
        if (!this.soundEnabled) return;
        this.playTone(330, 'sine', 0.25, 0.15);
    }

    playPop() {
        if (!this.soundEnabled) return;
        this.playTone(600, 'sine', 0.1, 0.2);
    }

    playAnimalSound(animal) {
        if (!this.soundEnabled) return;
        const animalSpeech = {
            'cat': 'Miyav, miyav!',
            'dog': 'Hav, hav!',
            'cow': 'Mööö!',
            'bird': 'Cık, cık, cık!',
            'frog': 'Vırak, vırak!',
            'bee': 'Vızzz, vızzz!',
            'fox': 'Yuva mutlu tilki dolu, harika!'
        };
        if (animalSpeech[animal]) {
            this.speak(animalSpeech[animal]);
        }
    }
}

const audioManager = new AudioManager();
