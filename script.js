/* ==========================================================================
   WEDDING INVITATION INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // -------------------------------------------------------------
    // 1. DYNAMIC COUNTDOWN TIMER
    // -------------------------------------------------------------
    const weddingDate = new Date('2026-04-27T17:30:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (distance < 0) {
            // Event has passed or is happening now
            if (daysElement) daysElement.innerText = '00';
            if (hoursElement) hoursElement.innerText = '00';
            if (minutesElement) minutesElement.innerText = '00';
            if (secondsElement) secondsElement.innerText = '00';
            
            // Optionally change countdown text/label
            const timerContainer = document.getElementById('countdown-timer');
            if (timerContainer) {
                timerContainer.title = "Ngày trọng đại đã đến!";
            }
            return;
        }
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display results with leading zeros
        if (daysElement) daysElement.innerText = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.innerText = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.innerText = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.innerText = String(seconds).padStart(2, '0');
    }
    
    // Initial run and interval
    updateCountdown();
    setInterval(updateCountdown, 1000);


    // -------------------------------------------------------------
    // 2. ENVELOPE INTERACTION (OPEN & CLOSE)
    // -------------------------------------------------------------
    const envelope = document.getElementById('wedding-envelope');
    const seal = document.getElementById('envelope-seal');
    
    if (envelope) {
        envelope.addEventListener('click', (e) => {
            // If envelope is closed, open it and play music
            if (!envelope.classList.contains('is-open')) {
                envelope.classList.add('is-open');
                playBackgroundMusic();
            } else {
                // If it is open, we can close it if they click the flap or outer edges,
                // but let's allow toggling on envelope body click for playfulness.
                // Do not close if they are selecting/clicking the text inside the letter.
                if (!e.target.closest('.invitation-letter')) {
                    envelope.classList.remove('is-open');
                }
            }
        });
    }


    // -------------------------------------------------------------
    // 3. BACKGROUND MUSIC CONTROLLER
    // -------------------------------------------------------------
    const audioControl = document.getElementById('audio-control');
    const bgMusic = document.getElementById('bg-music');
    let hasPlayed = false;
    
    function playBackgroundMusic() {
        if (bgMusic && bgMusic.paused) {
            bgMusic.play()
                .then(() => {
                    audioControl.classList.add('playing');
                    hasPlayed = true;
                })
                .catch(err => {
                    console.log('Tự động phát nhạc bị trình duyệt chặn. Sẽ phát khi có tương tác trực tiếp.');
                });
        }
    }
    
    function pauseBackgroundMusic() {
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
            audioControl.classList.remove('playing');
        }
    }

    if (audioControl && bgMusic) {
        audioControl.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering envelope click if user clicked audio btn
            if (bgMusic.paused) {
                playBackgroundMusic();
            } else {
                pauseBackgroundMusic();
            }
        });
    }

    // Try playing when user scrolls or performs first click on the document
    document.addEventListener('click', () => {
        if (!hasPlayed) {
            playBackgroundMusic();
        }
    }, { once: true });


    // -------------------------------------------------------------
    // 4. CANVAS BLOSSOM/PETALS DRIFT ANIMATION
    // -------------------------------------------------------------
    const canvas = document.getElementById('blossom-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        // Handle window resize
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        const petalCount = Math.min(35, Math.floor(width / 30)); // Scale petal count with screen width
        const petals = [];
        
        // Petal Class/Definition
        class Petal {
            constructor() {
                this.reset();
                this.y = Math.random() * height; // Distribute vertically at startup
            }
            
            reset() {
                this.x = Math.random() * width + 50; // Start slightly right-bound
                this.y = -20;
                this.size = Math.random() * 8 + 6; // 6px to 14px size
                this.speedY = Math.random() * 1.2 + 0.8; // Vertical speed
                this.speedX = -(Math.random() * 0.8 + 0.4); // Drift to left
                this.opacity = Math.random() * 0.4 + 0.4; // 0.4 to 0.8 opacity
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.swing = Math.random() * Math.PI; // Swing phase
                this.swingSpeed = Math.random() * 0.02 + 0.01;
            }
            
            update() {
                this.y += this.speedY;
                
                // Add horizontal swinging motion to emulate wind resistance
                this.swing += this.swingSpeed;
                this.x += this.speedX + Math.sin(this.swing) * 0.3;
                
                this.rotation += this.rotationSpeed;
                
                // Reset if offscreen (left, bottom, or right)
                if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                // Draw delicate curved cherry blossom petal shape (ellipse)
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size, this.size / 1.8, 0, 0, 2 * Math.PI);
                
                // Gradient for realistic rose/peach blossom tint
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
                grad.addColorStop(0, `rgba(255, 200, 210, ${this.opacity})`);
                grad.addColorStop(1, `rgba(240, 140, 160, ${this.opacity * 0.4})`);
                
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Initialize petals
        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal());
        }
        
        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            petals.forEach(petal => {
                petal.update();
                petal.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }


    // -------------------------------------------------------------
    // 5. RSVP FORM SUBMISSION AND MOCK SAVING
    // -------------------------------------------------------------
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const rsvpResetBtn = document.getElementById('rsvp-reset-btn');
    const attendanceSelect = document.getElementById('attendance');
    const companionGroup = document.getElementById('companion-group');
    
    // Toggle companion dropdown based on attendance status
    if (attendanceSelect && companionGroup) {
        attendanceSelect.addEventListener('change', () => {
            if (attendanceSelect.value === 'no') {
                companionGroup.classList.add('hidden');
            } else {
                companionGroup.classList.remove('hidden');
            }
        });
    }

    if (rsvpForm && rsvpSuccess) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Capture values (could send to backend API or Webhook)
            const formData = {
                name: document.getElementById('guest-name').value,
                attendance: document.getElementById('attendance').value,
                companions: document.getElementById('attendance').value === 'yes' ? document.getElementById('companions').value : '0',
                wishes: document.getElementById('wishes').value
            };
            
            console.log('Dữ liệu RSVP nhận được:', formData);
            
            // Animate transition
            rsvpForm.style.opacity = '0';
            setTimeout(() => {
                rsvpForm.classList.add('hidden');
                rsvpSuccess.classList.remove('hidden');
                rsvpSuccess.style.opacity = '0';
                
                // Fade in success screen
                setTimeout(() => {
                    rsvpSuccess.style.transition = 'opacity 0.5s ease';
                    rsvpSuccess.style.opacity = '1';
                }, 50);
            }, 300);
        });
    }
    
    if (rsvpResetBtn && rsvpForm && rsvpSuccess) {
        rsvpResetBtn.addEventListener('click', () => {
            // Animate back to form
            rsvpSuccess.style.opacity = '0';
            setTimeout(() => {
                rsvpSuccess.classList.add('hidden');
                rsvpForm.classList.remove('hidden');
                rsvpForm.reset();
                if (companionGroup) companionGroup.classList.remove('hidden'); // Reset dropdown display
                
                setTimeout(() => {
                    rsvpForm.style.transition = 'opacity 0.5s ease';
                    rsvpForm.style.opacity = '1';
                }, 50);
            }, 300);
        });
    }
});
