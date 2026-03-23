document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = today.toLocaleDateString('en-US', options);
    }

    // Jalankan saat elemen terlihat di layar (bisa dikombinasikan dengan Intersection Observer)
    // Pastikan `typeWriter` terdefinisi sebelum memanggilnya; jika tidak, log peringatan
    if (typeof typeWriter === 'function') {
        window.addEventListener('load', typeWriter);
    } else {
        console.warn('typeWriter() tidak ditemukan — melewati inisialisasi typewriter.');
    }

    const daysTogether = document.getElementById('daysTogether');
    const momentsShared = document.getElementById('momentsShared');
    const smilesGiven = document.getElementById('smilesGiven');

    if (daysTogether && momentsShared && smilesGiven) {
        // Replace with your actual dates and numbers
        const startDate = new Date('2022-01-01');
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        animateCountUp(daysTogether, diffDays, 2000);
        animateCountUp(momentsShared, 1500, 2500); // Example number
        animateCountUp(smilesGiven, 9999, 3000);   // Example number
    }

   // Interactive memories slider (imported from /test/script.js, scoped to .interactive-slider)
    (function initInteractiveSlider() {
        // support both structures:
        // 1) <div class="interactive-slider"><div class="slider-container">...</div></div>
        // 2) <div class="slider-container interactive-slider">...</div>
        const container = document.querySelector('.interactive-slider .slider-container')
            || document.querySelector('.slider-container.interactive-slider')
            || document.querySelector('.interactive-slider');
        if (!container) return;

        const sliderWrapper = container.querySelector('.slider-wrapper');
        const slides = sliderWrapper ? sliderWrapper.querySelectorAll('.slide') : [];
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const dotsContainer = container.querySelector('.slider-dots');

        if (!sliderWrapper || slides.length === 0) return;

        let currentIndex = 0;
        let slideInterval;
        const autoPlayDelay = 20000;
        let touchStartX = 0;
        let touchEndX = 0;

        function createDots() {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Pergi ke slide ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        function updateSlider() {
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }

        function goToSlide(index) {
            currentIndex = (index + slides.length) % slides.length;
            updateSlider();
            resetAutoSlide();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        }

        function startAutoSlide() { slideInterval = setInterval(nextSlide, autoPlayDelay); }
        function stopAutoSlide() { clearInterval(slideInterval); }
        function resetAutoSlide() { stopAutoSlide(); startAutoSlide(); }

        function setupEventListeners() {
            if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
            if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

            container.addEventListener('mouseenter', stopAutoSlide);
            container.addEventListener('mouseleave', startAutoSlide);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') { nextSlide(); resetAutoSlide(); }
                else if (e.key === 'ArrowLeft') { prevSlide(); resetAutoSlide(); }
            });

            container.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            container.addEventListener('touchend', (e) => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, { passive: true });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) nextSlide(); else prevSlide();
                resetAutoSlide();
            }
        }

        // initialize
        createDots();
        updateSlider();
        setupEventListeners();
        startAutoSlide();
    })();

    // Music controls: play / pause / volume / mute and dynamic panel toggle
    const backgroundMusic = document.getElementById('background-music');
    const playBtn = document.getElementById('music-play-btn');
    const pauseBtn = document.getElementById('music-pause-btn');
    const volumeSlider = document.getElementById('music-volume');
    const muteBtn = document.getElementById('music-mute-btn');
    const toggleBtn = document.getElementById('music-toggle');
    const musicPanel = document.getElementById('music-panel');
    const volumeLabel = document.getElementById('volume-label');

    if (backgroundMusic) {
        if (typeof backgroundMusic.volume === 'number') backgroundMusic.volume = 0.5;

        if (playBtn) playBtn.addEventListener('click', () => backgroundMusic.play().catch(() => {}));
        if (pauseBtn) pauseBtn.addEventListener('click', () => backgroundMusic.pause());

        const muteIcon = muteBtn ? muteBtn.querySelector('i') : null;

        const updateVolLabel = (v) => {
            if (volumeLabel) volumeLabel.textContent = Math.round(v * 100) + '%';
        };

        if (volumeSlider) {
            volumeSlider.value = backgroundMusic.volume;
            updateVolLabel(backgroundMusic.volume);
            volumeSlider.addEventListener('input', (e) => {
                const vol = parseFloat(e.target.value);
                backgroundMusic.volume = vol;
                backgroundMusic.muted = vol === 0;
                updateVolLabel(vol);
                if (muteIcon) {
                    muteIcon.classList.toggle('fa-volume-mute', backgroundMusic.muted);
                    muteIcon.classList.toggle('fa-volume-up', !backgroundMusic.muted);
                }
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                backgroundMusic.muted = !backgroundMusic.muted;
                if (muteIcon) {
                    muteIcon.classList.toggle('fa-volume-mute', backgroundMusic.muted);
                    muteIcon.classList.toggle('fa-volume-up', !backgroundMusic.muted);
                }
                if (!backgroundMusic.muted && volumeSlider) volumeSlider.value = backgroundMusic.volume;
                if (volumeLabel) updateVolLabel(backgroundMusic.volume);
            });
        }
    }

    // Toggle panel behavior: clicking the music icon opens/closes the options panel.
    if (toggleBtn && musicPanel) {
        toggleBtn.addEventListener('click', (e) => {
            const opened = musicPanel.classList.toggle('open');
            toggleBtn.setAttribute('aria-expanded', opened);
            musicPanel.setAttribute('aria-hidden', !opened);
        });

        // Close the panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!musicPanel.classList.contains('open')) return;
            if (musicPanel.contains(e.target) || toggleBtn.contains(e.target)) return;
            musicPanel.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', false);
            musicPanel.setAttribute('aria-hidden', true);
        });
    }
});

// Additional wiring for card-based music UI
document.addEventListener('DOMContentLoaded', () => {
    const bg = document.getElementById('background-music');
    const card = document.querySelector('.card');
    const playBtn = document.getElementById('card-play');
    const backBtn = document.getElementById('card-back');
    const nextBtn = document.getElementById('card-next');
    const volumeButton = document.querySelector('.volume_button');
    const volumeBar = document.querySelector('.card .volume .slider .green');
    const volumeContainer = document.querySelector('.card .volume .slider');
    const elapsedEl = document.querySelector('.card .elapsed');
    const timeNow = document.querySelector('.card .time_now');
    const timeFull = document.querySelector('.card .time_full');
    const likeBtn = document.getElementById('card-like');
    const trackListContainer = document.querySelector('.card .track-list');

    if (!bg || !card) return;

    // simple playlist (reuses existing audio file if only one exists)
    const playlist = [
        { src: 'music/audio1.mp3', title: 'Just The Way You Are', artist: 'Milky' },
        { src: 'music/audio2.mp3', title: 'Memories', artist: 'Conan Gray' },
        { src: 'music/audio3.mp3', title: 'Blue Hair', artist: 'TV Girl' },
        { src: 'music/audio4.mp3', title: 'The Man Who Can\'t Be Moved', artist: 'The Script' },
        { src: 'music/audio5.mp3', title: 'Happy Birthday To You', artist: 'Unknown' }
    ];
    let trackIndex = 0;

    const fmt = (s) => {
        if (!isFinite(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    function loadTrack(i, autoplay = false) {
        if (!playlist.length) return;
        i = ((i % playlist.length) + playlist.length) % playlist.length;
        trackIndex = i;
        const t = playlist[i];
        if (bg) {
            bg.src = t.src;
            bg.load();
            if (autoplay) bg.play().catch(() => {});
        }
        const titleEl = document.querySelector('.card .title-1');
        const artistEl = document.querySelector('.card .title-2');
        if (titleEl) titleEl.textContent = t.title;
        if (artistEl) artistEl.textContent = t.artist;
        // highlight current in track list
        const cards = card.querySelectorAll('.track-card');
        cards.forEach(c => c.classList.toggle('current', parseInt(c.dataset.index, 10) === trackIndex));
    }

    // populate next-track list
    if (trackListContainer) {
        trackListContainer.innerHTML = '';
        playlist.forEach((t, idx) => {
            const el = document.createElement('div');
            el.className = 'track-card';
            el.dataset.index = idx;
            el.innerHTML = `<span class="track-name">${t.title} - ${t.artist}</span><button class="track-like" aria-label="Like track">❤</button>`;
            trackListContainer.appendChild(el);
        });

        trackListContainer.addEventListener('click', (e) => {
            const cardEl = e.target.closest('.track-card');
            if (!cardEl) return;
            const idx = parseInt(cardEl.dataset.index, 10);
            if (isFinite(idx)) {
                loadTrack(idx, true);
            }
            // track like
            if (e.target.classList.contains('track-like')) {
                e.target.classList.toggle('liked');
            }
        });
    }

    // start with first track
    loadTrack(0, false);

    // update UI when time changes
    bg.addEventListener('timeupdate', () => {
        const pct = (bg.currentTime / (bg.duration || 1)) * 100;
        if (elapsedEl) elapsedEl.style.width = pct + '%';
        if (timeNow) timeNow.textContent = fmt(bg.currentTime);
        if (timeFull) timeFull.textContent = fmt(bg.duration || 0);
    });

    // play/pause toggle
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (bg.paused) {
                bg.play().catch(() => {});
                playBtn.style.color = '#1db954';
            } else {
                bg.pause();
                playBtn.style.color = '';
            }
        });
    }

    // previous/next now switch tracks in playlist
    if (backBtn) backBtn.addEventListener('click', () => { loadTrack(trackIndex - 1, true); });
    if (nextBtn) nextBtn.addEventListener('click', () => { loadTrack(trackIndex + 1, true); });

    // volume toggle: show/hide the small custom slider when pressing the volume icon
    if (volumeButton) {
        volumeButton.addEventListener('click', (e) => {
            const volEl = document.querySelector('.card .volume');
            if (!volEl) return;
            volEl.classList.toggle('visible');
        });
    }

    // click to set volume on the custom slider
    if (volumeContainer && volumeBar) {
        const setVolumeUI = (v) => {
            volumeBar.style.width = (v * 100) + '%';
        };
        setVolumeUI(bg.volume);

        volumeContainer.addEventListener('click', (e) => {
            const rect = volumeContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const v = Math.max(0, Math.min(1, x / rect.width));
            bg.volume = v;
            bg.muted = v === 0;
            setVolumeUI(v);
        });
    }

    // update total duration display once metadata is loaded
    bg.addEventListener('loadedmetadata', () => {
        if (timeFull) timeFull.textContent = fmt(bg.duration);
    });

    // sync UI when playback ends/starts
    bg.addEventListener('play', () => card.classList.add('is-playing'));
    bg.addEventListener('pause', () => card.classList.remove('is-playing'));

    // card-level like behavior
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            const liked = likeBtn.classList.toggle('liked');
            likeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
        });
    }
});

// Toggle visibility for the card (hide/show)
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('card-toggle-visibility');
    const card = document.querySelector('.card');
    if (!toggleBtn || !card) return;

    // restore saved state
    const saved = localStorage.getItem('cardHidden');
    if (saved === 'true') {
        card.classList.add('hidden');
        toggleBtn.setAttribute('aria-pressed', 'true');
    }

    toggleBtn.addEventListener('click', () => {
        const hidden = card.classList.toggle('hidden');
        toggleBtn.setAttribute('aria-pressed', hidden ? 'true' : 'false');
        localStorage.setItem('cardHidden', hidden ? 'true' : 'false');
    });
});