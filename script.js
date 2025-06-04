AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
});

/**
 * Инициализация 3D-слайдера под хироблоком
 */
function initHeroSlider() {
    const sliderContainer = document.querySelector('.slider-3d-carousel');
    if (!sliderContainer) return;

    const cards = sliderContainer.querySelectorAll('.slider-card');
    const prevButton = sliderContainer.querySelector('.carousel-control.prev');
    const nextButton = sliderContainer.querySelector('.carousel-control.next');
    const indicators = sliderContainer.querySelectorAll('.indicator');

    if (!prevButton || !nextButton || cards.length === 0) return;

    // Массив всех карточек
    const allCards = Array.from(cards);
    // Текущий индекс активной карточки
    let currentIndex = 0;
    // Задержка для автоматической прокрутки
    const autoScrollDelay = 5000;
    // Интервал автоматической прокрутки
    let autoScrollInterval;
    
    /**
     * Обновляет слайдер, расставляя карточки в нужном порядке
     */
    function updateSlider() {
        // Обновляем индикаторы
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        // Обновляем классы и атрибуты карточек
        allCards.forEach((card, index) => {
            // Удаляем все классы позиций
            card.classList.remove('slider-primary', 'slider-secondary', 'slider-hidden');
            
            if (index === currentIndex) {
                // Главная карточка - по центру
                card.classList.add('slider-primary');
                card.setAttribute('data-position', 'center');
            } else if (index === getPrevIndex(currentIndex)) {
                // Предыдущая карточка - слева
                card.classList.add('slider-secondary');
                card.setAttribute('data-position', 'left');
            } else if (index === getNextIndex(currentIndex)) {
                // Следующая карточка - справа
                card.classList.add('slider-secondary');
                card.setAttribute('data-position', 'right');
            } else {
                // Все остальные карточки - скрыты
                card.classList.add('slider-hidden');
                card.setAttribute('data-position', 'hidden');
            }
        });
    }

    /**
     * Получает индекс предыдущей карточки с учетом цикличности
     */
    function getPrevIndex(index) {
        return (index === 0) ? allCards.length - 1 : index - 1;
    }

    /**
     * Получает индекс следующей карточки с учетом цикличности
     */
    function getNextIndex(index) {
        return (index === allCards.length - 1) ? 0 : index + 1;
    }

    /**
     * Переключает на следующую карточку
     */
    function scrollToNext() {
        currentIndex = getNextIndex(currentIndex);
        updateSlider();
    }

    /**
     * Переключает на предыдущую карточку
     */
    function scrollToPrev() {
        currentIndex = getPrevIndex(currentIndex);
        updateSlider();
    }

    /**
     * Запускает автоматическую прокрутку
     */
    function startAutoScroll() {
        stopAutoScroll(); // Останавливаем предыдущий интервал, если он есть
        autoScrollInterval = setInterval(scrollToNext, autoScrollDelay);
    }

    /**
     * Останавливает автоматическую прокрутку
     */
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Обработчики событий кнопок
    nextButton.addEventListener('click', () => {
        scrollToNext();
        stopAutoScroll();
        startAutoScroll(); // Перезапускаем автопрокрутку при ручном взаимодействии
    });

    prevButton.addEventListener('click', () => {
        scrollToPrev();
        stopAutoScroll();
        startAutoScroll();
    });
    
    // Обработчики событий для индикаторов
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
            stopAutoScroll();
            startAutoScroll();
        });
    });

    // Останавливаем автопрокрутку при наведении на слайдер
    sliderContainer.addEventListener('mouseenter', stopAutoScroll);
    sliderContainer.addEventListener('mouseleave', startAutoScroll);
    
    // Поддержка свайпов для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Свайп влево - следующая карточка
            scrollToNext();
        } else if (touchEndX > touchStartX + 50) {
            // Свайп вправо - предыдущая карточка
            scrollToPrev();
        }
        stopAutoScroll();
        startAutoScroll();
    }
    
    // Инициализация слайдера
    updateSlider();
    startAutoScroll();
}

document.addEventListener('DOMContentLoaded', function() {
    // Получаем базовый URL из текущего пути
    const baseUrl = window.location.pathname.includes('/legal_ai') ? '/legal_ai/' : '/';
    
    const registrationButtons = document.querySelectorAll('.registration-btn');
    console.log('Found registration buttons:', registrationButtons.length); // Выведем количество найденных кнопок
    
    registrationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Sending Metrika event: registration_click');
            ym(99139090, 'reachGoal', 'registration_click');
            console.log('Event sent, redirecting...');
            window.location.href = baseUrl + 'legal_ai/auth';
        });
    });
});

// Обработчик для логотипа
const logo = document.querySelector('.gradient-text');
if (logo) {
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        
        const startPosition = window.pageYOffset;
        const duration = 1500;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, -startPosition, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (!targetElement) return;
            
            const targetPosition = targetElement.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1500; 
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
        });
    });
});

function showTooltip(message) {
    const existingTooltip = document.querySelector('.tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    document.body.appendChild(tooltip);

    // Force reflow
    tooltip.offsetHeight;
    tooltip.classList.add('show');

    setTimeout(() => {
        tooltip.classList.remove('show');
        setTimeout(() => tooltip.remove(), 300);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера
    initHeroSlider();
    
    // Добавляем обработчики для ссылок "в разработке"
    const devLinks = [
        'a[href="#"]:not([data-special])',  // Все ссылки без специального атрибута
    ];
    
    devLinks.forEach(selector => {
        document.querySelectorAll(selector).forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showTooltip('В разработке. Пожалуйста, ожидайте.');
            });
        });
    });

    // Специальный обработчик для "Статус сервиса"
    const statusLink = document.querySelector('a[href="#"][data-status]');
    if (statusLink) {
        statusLink.addEventListener('click', function(e) {
            e.preventDefault();
            showTooltip('Сервис работает в обычном режиме');
        });
    }
});

// Testimonials Slider
class TestimonialsSlider {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.slider = document.querySelector('.testimonials-slider');
        this.dots = document.querySelectorAll('.testimonial-dot');
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        if (!this.slider || !this.dots.length) return;
        
        // Set up dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Update initial state
        this.updateSlider();
        this.updateDots();
        
        // Start auto-play
        this.startAutoPlay();
        
        // Pause on hover
        const container = document.querySelector('.testimonials-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Handle responsive behavior
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }
    
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateSlider();
        this.updateDots();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.updateDots();
    }
    
    updateSlider() {
        if (!this.slider) return;
        
        const slideWidth = this.getSlideWidth();
        const translateX = -this.currentSlide * slideWidth;
        this.slider.style.transform = `translateX(${translateX}%)`;
    }
    
    getSlideWidth() {
        const width = window.innerWidth;
        if (width < 769) return 100; // Mobile: 1 slide
        if (width < 1024) return 50;  // Tablet: 2 slides
        return 33.333; // Desktop: 3 slides
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    handleResize() {
        // Recalculate slider position on resize
        this.updateSlider();
        
        // Adjust current slide if needed based on new layout
        const maxSlides = this.getMaxVisibleSlides();
        if (this.currentSlide >= this.totalSlides - maxSlides + 1) {
            this.currentSlide = Math.max(0, this.totalSlides - maxSlides);
            this.updateSlider();
            this.updateDots();
        }
    }
    
    getMaxVisibleSlides() {
        const width = window.innerWidth;
        if (width < 769) return 1;
        if (width < 1024) return 2;
        return 3;
    }
}

// Initialize testimonials slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new TestimonialsSlider();
});