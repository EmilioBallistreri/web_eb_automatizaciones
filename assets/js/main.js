/**
 * eb_automatizaciones - Script Principal Interactivo
 * Desarrollado para Emilio Ballistreri
 */

document.addEventListener('DOMContentLoaded', () => {
    initTechCanvas();
    initScrollProgress();
    initScrollReveal();
    initNavbar();
    initMobileMenu();
    initEstimator();
    initFAQ();
    initCopyChips();
    initContactForm();
    initSmoothScroll();
});

/* ==========================================================================
   1. Canvas Interactivo de Circuitos & Partículas Tecnológicas
   ========================================================================== */
function initTechCanvas() {
    const canvas = document.getElementById('tech-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 24), 50);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1.2;
            this.color = Math.random() > 0.4 ? '#0066ff' : '#00d2ff';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const alpha = 1 - dist / 130;
                    ctx.strokeStyle = `rgba(0, 150, 255, ${alpha * 0.22})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. Barra Superior de Progreso de Scroll
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

/* ==========================================================================
   3. Animaciones Scroll Reveal (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. Navbar Scroll & Menú Activo
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   5. Menú Mobile Drawer
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !mobileDrawer) return;

    menuToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ==========================================================================
   6. Cotizador Interactivo en 3 Pasos
   ========================================================================== */
function initEstimator() {
    const estimator = document.getElementById('cotizador');
    if (!estimator) return;

    const state = {
        servicio: 'Páginas Web',
        etapa: 'Emprendimiento nuevo / Lanzamiento',
        objetivo: 'Vender más y captar clientes calificados'
    };

    const summaryService = document.getElementById('summary-service');
    const summaryStage = document.getElementById('summary-stage');
    const summaryGoal = document.getElementById('summary-goal');
    const btnEstimatorWhatsApp = document.getElementById('btn-estimator-whatsapp');
    const btnApplyToForm = document.querySelector('.btn-apply-to-form');
    const WHATSAPP_NUMBER = '5493515171905';

    function updateSummary() {
        if (summaryService) summaryService.textContent = state.servicio;
        if (summaryStage) summaryStage.textContent = state.etapa;
        if (summaryGoal) summaryGoal.textContent = state.objetivo;
    }

    // Manejo de clicks en opciones
    document.querySelectorAll('.option-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const group = btn.getAttribute('data-group');
            const value = btn.getAttribute('data-value');

            // Desmarcar hermanos del mismo grupo
            document.querySelectorAll(`.option-btn[data-group="${group}"]`).forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            state[group] = value;
            updateSummary();
        });
    });

    // Navegación entre pasos
    function goToStep(stepNum) {
        // Indicadores
        document.querySelectorAll('.step-indicator').forEach((ind) => {
            const num = parseInt(ind.getAttribute('data-step'), 10);
            if (num <= stepNum) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });

        // Contenidos
        document.querySelectorAll('.step-content').forEach((content) => {
            content.classList.remove('active');
        });

        const targetPane = document.getElementById(`step-pane-${stepNum}`);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    }

    document.querySelectorAll('.step-indicator').forEach((ind) => {
        ind.addEventListener('click', () => {
            const step = parseInt(ind.getAttribute('data-step'), 10);
            goToStep(step);
        });
    });

    document.querySelectorAll('.btn-next-step').forEach((btn) => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.getAttribute('data-next'), 10);
            goToStep(nextStep);
        });
    });

    document.querySelectorAll('.btn-prev-step').forEach((btn) => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.getAttribute('data-prev'), 10);
            goToStep(prevStep);
        });
    });

    // Enviar estimación a WhatsApp
    if (btnEstimatorWhatsApp) {
        btnEstimatorWhatsApp.addEventListener('click', () => {
            const text = 
`*Hola Emilio! Armé una propuesta desde el Cotizador de eb_automatizaciones:* ⚡
📌 *Servicio requerido:* ${state.servicio}
🏢 *Etapa de mi negocio:* ${state.etapa}
🎯 *Objetivo principal:* ${state.objetivo}

¿Podrías brindarme asesoramiento y presupuesto estimado para este proyecto? Muchas gracias!`;

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }

    // Aplicar al formulario de contacto
    if (btnApplyToForm) {
        btnApplyToForm.addEventListener('click', () => {
            const servicioSelect = document.getElementById('servicio');
            const mensajeTextarea = document.getElementById('mensaje');

            if (servicioSelect) {
                // Mapear al select si coincide
                for (let i = 0; i < servicioSelect.options.length; i++) {
                    if (servicioSelect.options[i].value.includes(state.servicio) || state.servicio.includes(servicioSelect.options[i].value)) {
                        servicioSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            if (mensajeTextarea) {
                mensajeTextarea.value = `Hola Emilio, armé una consulta desde el cotizador:\n- Etapa: ${state.etapa}\n- Objetivo: ${state.objetivo}\nMe gustaría conversar sobre plazos y presupuesto.`;
            }

            showToast('✅ Datos aplicados al formulario de contacto', 'info');
        });
    }

    updateSummary();
}

/* ==========================================================================
   7. Preguntas Frecuentes (FAQ Acordeón)
   ========================================================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Cerrar los demás acordeones
            faqItems.forEach((other) => other.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   8. Botones de Copiar al Portapapeles (Chips)
   ========================================================================== */
function initCopyChips() {
    document.querySelectorAll('.btn-copy-chip').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = btn.textContent;
                btn.textContent = '✓ Copiado';
                btn.style.color = '#00d2ff';

                showToast(`📋 Copiado al portapapeles: ${textToCopy}`, 'success');

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.color = '';
                }, 2200);
            }).catch(() => {
                showToast(`Seleccioná y copiá: ${textToCopy}`, 'info');
            });
        });
    });
}

/* ==========================================================================
   9. Notificaciones Toast Elegantes
   ========================================================================== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Animación de entrada
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto-remoción tras 3.5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* ==========================================================================
   10. Formulario de Contacto (Validación Inline + WhatsApp + Email)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const btnSubmitWhatsApp = document.getElementById('btn-submit-whatsapp');
    const WHATSAPP_NUMBER = '5493515171905';
    const EMAIL_DESTINATION = 'ballistreriemilio18@gmail.com';

    if (!form) return;

    const fields = {
        nombre: document.getElementById('nombre'),
        telefono: document.getElementById('telefono'),
        email: document.getElementById('email'),
        servicio: document.getElementById('servicio'),
        mensaje: document.getElementById('mensaje')
    };

    // Limpiar errores en input
    Object.values(fields).forEach((input) => {
        if (!input) return;
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('has-error');
        });
        input.addEventListener('change', () => {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('has-error');
        });
    });

    function validateAll() {
        let isValid = true;
        let firstInvalid = null;

        // Validar Nombre
        if (!fields.nombre.value.trim()) {
            document.getElementById('group-nombre').classList.add('has-error');
            isValid = false;
            if (!firstInvalid) firstInvalid = fields.nombre;
        }

        // Validar Teléfono
        if (!fields.telefono.value.trim() || fields.telefono.value.trim().length < 6) {
            document.getElementById('group-telefono').classList.add('has-error');
            isValid = false;
            if (!firstInvalid) firstInvalid = fields.telefono;
        }

        // Validar Email
        const emailVal = fields.email.value.trim();
        if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
            document.getElementById('group-email').classList.add('has-error');
            isValid = false;
            if (!firstInvalid) firstInvalid = fields.email;
        }

        // Validar Servicio
        if (!fields.servicio.value) {
            document.getElementById('group-servicio').classList.add('has-error');
            isValid = false;
            if (!firstInvalid) firstInvalid = fields.servicio;
        }

        // Validar Mensaje
        if (!fields.mensaje.value.trim()) {
            document.getElementById('group-mensaje').classList.add('has-error');
            isValid = false;
            if (!firstInvalid) firstInvalid = fields.mensaje;
        }

        if (!isValid && firstInvalid) {
            firstInvalid.focus();
            showToast('⚠️ Por favor completá los campos requeridos marcados en rojo.', 'info');
        }

        return isValid;
    }

    function getPayload() {
        return {
            nombre: fields.nombre.value.trim(),
            telefono: fields.telefono.value.trim(),
            email: fields.email.value.trim(),
            servicio: fields.servicio.value,
            mensaje: fields.mensaje.value.trim()
        };
    }

    // Botón Enviar por WhatsApp
    if (btnSubmitWhatsApp) {
        btnSubmitWhatsApp.addEventListener('click', () => {
            if (!validateAll()) return;
            const data = getPayload();

            const text = 
`*Nueva Consulta desde eb_automatizaciones* 🚀
👤 *Nombre:* ${data.nombre}
📱 *Teléfono:* ${data.telefono}
✉️ *Email:* ${data.email}
💼 *Servicio de interés:* ${data.servicio}
📝 *Detalles del proyecto:*
${data.mensaje}`;

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            showToast('🚀 Abriendo WhatsApp con tus datos...', 'success');
            window.open(url, '_blank');
        });
    }

    // Envío vía Correo Electrónico
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateAll()) return;
        const data = getPayload();

        const subject = `Consulta web de ${data.nombre} - ${data.servicio} [eb_automatizaciones]`;
        const body = `Hola Emilio,

Mi nombre es ${data.nombre} y te contacto a través de eb_automatizaciones.

Datos de contacto:
- Teléfono/WhatsApp: ${data.telefono}
- Correo electrónico: ${data.email}
- Servicio de interés: ${data.servicio}

Detalles de la consulta:
${data.mensaje}

Saludos cordiales.`;

        const mailtoUrl = `mailto:${EMAIL_DESTINATION}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        showToast('✉️ Abriendo tu cliente de correo...', 'success');
        window.location.href = mailtoUrl;
    });
}

/* ==========================================================================
   11. Desplazamiento Suave (Smooth Scroll)
   ========================================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
