class ParticleSystem {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.particles = [];
                this.maxParticles = 100;
                this.mouse = { x: 0, y: 0 };
                this.resize();
                this.createParticles();
                this.bindEvents();
                this.animate();
            }
            resize() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
            createParticles() {
                for (let i = 0; i < this.maxParticles; i++) {
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        size: Math.random() * 3 + 1,
                        opacity: Math.random() * 0.5 + 0.1,
                        hue: Math.random() * 60 + 180,
                        life: Math.random() * 100
                    });
                }
            }
            bindEvents() {
                window.addEventListener('resize', () => this.resize());
                document.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX;
                    this.mouse.y = e.clientY;
                });
            }
            updateParticle(particle) {
                particle.x += particle.vx;
                particle.y += particle.vy;
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += dx * force * 0.0001;
                    particle.vy += dy * force * 0.0001;
                }
                particle.life += 1;
                if (particle.life > 500) {
                    particle.life = 0;
                    particle.x = Math.random() * this.canvas.width;
                    particle.y = Math.random() * this.canvas.height;
                    particle.vx = (Math.random() - 0.5) * 0.5;
                    particle.vy = (Math.random() - 0.5) * 0.5;
                }
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
            }
            drawParticle(particle) {
                this.ctx.save();
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 3
                );
                gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`);
                gradient.addColorStop(0.5, `hsla(${particle.hue}, 100%, 50%, ${particle.opacity * 0.5})`);
                gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 30%, 0)`);
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = `hsla(${particle.hue}, 100%, 80%, ${particle.opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
            drawConnections() {
                for (let i = 0; i < this.particles.length; i++) {
                    for (let j = i + 1; j < this.particles.length; j++) {
                        const dx = this.particles[i].x - this.particles[j].x;
                        const dy = this.particles[i].y - this.particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 150) {
                            const opacity = (150 - distance) / 150 * 0.1;
                            this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                            this.ctx.lineWidth = 1;
                            this.ctx.beginPath();
                            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                            this.ctx.stroke();
                        }
                    }
                }
            }
            animate() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (let particle of this.particles) {
                    this.updateParticle(particle);
                    this.drawParticle(particle);
                }
                this.drawConnections();
                requestAnimationFrame(() => this.animate());
            }
        }
        class LoadingScreen {
            constructor() {
                this.loadingElement = document.getElementById('loadingScreen');
                this.progressBar = document.querySelector('.loading-progress');
                this.loadingText = document.querySelector('.loading-text');
                this.progress = 0;
                this.messages = [
                    'Initializing Portfolio...',
                    'Loading Assets...',
                    'Connecting Particles...',
                    'Preparing Experience...',
                    'Almost Ready...'
                ];
                this.currentMessage = 0;
                this.startLoading();
            }
            startLoading() {
                const interval = setInterval(() => {
                    this.progress += Math.random() * 15 + 5;
                    if (this.progress >= 100) {
                        this.progress = 100;
                        clearInterval(interval);
                        setTimeout(() => this.hideLoading(), 500);
                    }
                    this.updateProgress();
                    const messageIndex = Math.floor((this.progress / 100) * this.messages.length);
                    if (messageIndex !== this.currentMessage && messageIndex < this.messages.length) {
                        this.currentMessage = messageIndex;
                        this.loadingText.textContent = this.messages[messageIndex];
                    }
                }, 200);
            }
            updateProgress() {
                this.progressBar.style.width = `${this.progress}%`;
            }
            hideLoading() {
                this.loadingElement.classList.add('hidden');
                document.body.classList.add('loaded');
                this.initializeWebsite();
            }
            initializeWebsite() {
                const canvas = document.getElementById('particleCanvas');
                new ParticleSystem(canvas);
                setTimeout(() => {
                    initializeAnimations();
                }, 300);
            }
        }
        function initializeAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        if (entry.target.classList.contains('skills')) {
                            animateSkillBars();
                        }
                        if (entry.target.classList.contains('about-stats')) {
                            animateCounters();
                        }
                        if (entry.target.classList.contains('projects-grid')) {
                            animateProjectCards();
                        }
                    }
                });
            }, observerOptions);
            document.querySelectorAll('section, .about-stats, .projects-grid').forEach(section => {
                observer.observe(section);
            });
        }
        function animateProjectCards() {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(50px) rotateX(20deg)';
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) rotateX(0deg)';
                    }, 100);
                }, index * 150);
            });
        }
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            createRipple(hamburger);
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                createRipple(link);
            });
        });
        function createRipple(element) {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            ripple.classList.add('ripple-effect');
            element.style.position = 'relative';
            element.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
        const typingText = document.querySelector('.typing-text');
        const textArray = [
             'WhatsApp Bot Developer',
             'Node.js Enthusiast',
             'Beginner Pythonista',
             'Web Developer Muda',
             'UI/UX Learner',
             'Digital Explorer'
                           ];
        let currentIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        function typeEffect() {
            const currentText = textArray[currentIndex];
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            let typeSpeed = isDeleting ? 100 : 150;
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % textArray.length;
                typeSpeed = 500;
            }
            setTimeout(typeEffect, typeSpeed);
        }
        function animateSkillBars() {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const percent = bar.getAttribute('data-percent');
                    bar.style.setProperty('--percent', percent + '%');
                    bar.style.animation = 'fillSkill 2s ease-in-out forwards';
                    createSkillParticles(bar);
                }, index * 200);
            });
        }
        function createSkillParticles(skillBar) {
            const container = skillBar.parentElement;
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'skill-particle';
                    particle.style.cssText = `
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: #00d4ff;
                        border-radius: 50%;
                        pointer-events: none;
                        left: ${Math.random() * 100}%;
                        top: 50%;
                        animation: skillParticleFloat 1.5s ease-out forwards;
                        box-shadow: 0 0 10px #00d4ff;
                    `;
                    container.style.position = 'relative';
                    container.appendChild(particle);
                    setTimeout(() => particle.remove(), 1500);
                }, i * 100);
            }
        }
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-item h4');
            counters.forEach((counter, index) => {
                setTimeout(() => {
                    const target = parseInt(counter.textContent.match(/\d+/)[0]);
                    const increment = target / 60;
                    let current = 0;
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            const icon = counter.querySelector('i').outerHTML;
                            const suffix = counter.textContent.replace(/\d+/, '').replace(/<[^>]*>/g, '');
                            counter.innerHTML = icon + ' ' + Math.ceil(current) + suffix.replace(icon, '');
                            requestAnimationFrame(updateCounter);
                        } else {
                            const icon = counter.querySelector('i').outerHTML;
                            const suffix = counter.textContent.replace(/\d+/, '').replace(/<[^>]*>/g, '');
                            counter.innerHTML = icon + ' ' + target + suffix.replace(icon, '');
                        }
                    };
                    updateCounter();
                }, index * 300);
            });
        }
        const playPauseBtn = document.getElementById('playPauseBtn');
        const musicBars = document.querySelectorAll('.music-visualizer .bar');
        let isPlaying = false;
        let audioContext;
        let oscillator;
        let analyser;
        let dataArray;
        function initAudio() {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 32;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
            } catch (e) {
                console.log('Web Audio API not supported');
            }
        }
        function createMusicVisualization() {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);
            musicBars.forEach((bar, index) => {
                if (dataArray[index]) {
                    const height = (dataArray[index] / 255) * 20 + 5;
                    bar.style.height = height + 'px';
                }
            });
            if (isPlaying) {
                requestAnimationFrame(createMusicVisualization);
            }
        }
        function playNeonSound() {
            if (!audioContext) return;
            oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(analyser);
            analyser.connect(audioContext.destination);
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
            oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 1);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 2);
            createMusicVisualization();
        }
        playPauseBtn.addEventListener('click', () => {
            if (!audioContext) {
                initAudio();
            }
            if (isPlaying) {
                if (oscillator) {
                    oscillator.stop();
                    oscillator = null;
                }
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                isPlaying = false;
                musicBars.forEach(bar => {
                    bar.style.height = '15px';
                });
            } else {
                playNeonSound();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = true;
                setTimeout(() => {
                    if (isPlaying) {
                        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                        isPlaying = false;
                        musicBars.forEach(bar => {
                            bar.style.height = '15px';
                        });
                    }
                }, 2000);
            }
            createRipple(playPauseBtn);
        });
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const header = document.querySelector('.header');
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled > 100) {
                header.classList.add('scrolled');
                scrollTopBtn.classList.add('show');
            } else {
                header.classList.remove('scrolled');
                scrollTopBtn.classList.remove('show');
            }
            const parallaxElements = document.querySelectorAll('.floating-icons i');
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            createRipple(scrollTopBtn);
        });
        document.querySelectorAll('.project-card, .skill-item, .contact-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
                createHoverParticles(e.currentTarget);
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
        function createHoverParticles(element) {
            const rect = element.getBoundingClientRect();
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'hover-particle';
                    particle.style.cssText = `
                        position: fixed;
                        width: 6px;
                        height: 6px;
                        background: #00d4ff;
                        border-radius: 50%;
                        pointer-events: none;
                        left: ${rect.left + Math.random() * rect.width}px;
                        top: ${rect.top + Math.random() * rect.height}px;
                        z-index: 1000;
                        animation: hoverParticleFloat 2s ease-out forwards;
                        box-shadow: 0 0 15px #00d4ff;
                    `;
                    document.body.appendChild(particle);
                    setTimeout(() => particle.remove(), 2000);
                }, i * 50);
            }
        }
        document.addEventListener('DOMContentLoaded', () => {
            new LoadingScreen();
            setTimeout(typeEffect, 2000);
        });
        const throttle = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        const throttledScrollHandler = throttle(() => {
        }, 16);
        window.addEventListener('scroll', throttledScrollHandler);
        console.log('%c🚀 Enhanced Portfolio by PouMods Official', 'color: #00d4ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00d4ff;');
        console.log('%c✨ Featuring: Blue Neon Particles, Modern UI, Enhanced Animations', 'color: #00d4ff; font-size: 14px;');
        console.log('%c💻 Built with: Vanilla JS, Advanced CSS, Canvas Particles', 'color: #0099cc; font-size: 12px;');