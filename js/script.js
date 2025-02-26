document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const exploreBtn = document.querySelector('#home .neon-gradient-btn');
    const sections = document.querySelectorAll('.scroll-section');
    const transitionOverlay = document.querySelector('.page-transition');
    const cyberHamburger = document.querySelector('.cyber-hamburger');
    const neonCross = document.querySelector('.neon-cross');
    const aside = document.querySelector('aside');
    const body = document.body;

    // Toggle Sidebar with Cyber Hamburger
    cyberHamburger.addEventListener('click', () => {
        aside.classList.toggle('aside-open');
        body.classList.toggle('sidebar-open');
    });

    // Close Sidebar with Neon Cross
    neonCross.addEventListener('click', () => {
        aside.classList.remove('aside-open');
        body.classList.remove('sidebar-open');
    });

    // Close Sidebar on Link Click (Optional for Mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                aside.classList.remove('aside-open');
                body.classList.remove('sidebar-open');
            }
        });
    });

    // Page Load Animation
    if (transitionOverlay) {
        setTimeout(() => {
            transitionOverlay.style.opacity = '0';
            transitionOverlay.style.pointerEvents = 'none';
        }, 400);
    }

   // Intersection Observer for Scroll Effects - Debounced
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `${sectionId}.html`) {
                        link.classList.add('active');
                    }
                });
            } else {
                entry.target.classList.remove('visible'); // Remove class when not in view
            }
        });
    }, { root: null, threshold: 0.6, rootMargin: '-50px' });

    sections.forEach(section => observer.observe(section));

     // Typing Text Animation - Optimized with requestAnimationFrame
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.getAttribute('data-text');
        let i = 0;
        let startTime = null;

        function type(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            if (i < text.length && progress > 80) { // Adjust speed here
                typingText.textContent = text.slice(0, i + 1);
                i++;
                startTime = timestamp;
            }

            if (i < text.length) {
                requestAnimationFrame(type);
            } else {
                setTimeout(() => {
                    i = 0;
                    startTime = null;
                    typingText.textContent = ''; // Clear the text before restarting
                    requestAnimationFrame(type);
                }, 1800);
            }
        }

        requestAnimationFrame(type);
    }

    // Explore Button Transition
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (transitionOverlay) {
                transitionOverlay.style.opacity = '1';
                transitionOverlay.style.pointerEvents = 'all';
                setTimeout(() => {
                    window.location.href = exploreBtn.getAttribute('href');
                }, 400);
            } else {
                window.location.href = exploreBtn.getAttribute('href');
            }
        });
    }

    // Debounce Helper (already defined, keep it)
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Conditionally initialize 3D Sphere - Reduced complexity, checks for container
    const navSphereContainer = document.getElementById('nav-3d-sphere');
    if (navSphereContainer && typeof THREE !== 'undefined') {
        initializeNavSphere(navSphereContainer);
    }

    // Conditionally initialize Home Page 3D Background - Checks for container
    const bgContainer = document.getElementById('bg-3d-container');
    if (bgContainer && typeof THREE !== 'undefined') {
        initializeHomePage3D(bgContainer);
    }

    // Project 3D Previews - Checks for container
    document.querySelectorAll('.project-3d-container').forEach(container => {
        if (typeof THREE !== 'undefined') {
            initializeProject3D(container);
        }
    });

    // Contact Page 3D Background - Checks for container
    const contact3DContainer = document.getElementById('contact-3d-container');
    if (contact3DContainer && typeof THREE !== 'undefined') {
        initializeContact3D(contact3DContainer);
    }

     // Simplified initialization functions for 3D elements
    function initializeNavSphere(container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(100, 100);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(0.5, 16, 16); // Reduced segments
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        camera.position.z = 2;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', debounce((event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        }, 16));

        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.01 + mouseY * 0.05;
            sphere.rotation.y += 0.01 + mouseX * 0.05;
            renderer.render(scene, camera);
        };
        animate();
    }

    function initializeHomePage3D(container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 50, 8); // Reduced segments
        const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.7, roughness: 0.1, wireframe: true });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

         // Reduce particle count significantly
        const particleCount = 150;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) positions[i] = (Math.random() - 0.5) * 10;
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.05, transparent: true });
        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        scene.add(new THREE.AmbientLight(0x404040));
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        camera.position.z = 3;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', debounce((event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        }, 16));

        const animate = () => {
            requestAnimationFrame(animate);
            torusKnot.rotation.x += 0.005 + mouseY * 0.02;
            torusKnot.rotation.y += 0.01 + mouseX * 0.02;
            particleSystem.rotation.y += 0.002;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    }

    function initializeProject3D(container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / 180, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.offsetWidth, 180);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.DodecahedronGeometry(1, 0); // Reduced detail
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, wireframe: true });
        const dodecahedron = new THREE.Mesh(geometry, material);
        scene.add(dodecahedron);

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(5, 5, 5);
        scene.add(light);

        camera.position.z = 3;

        let isHovered = false;
        container.addEventListener('mouseenter', () => (isHovered = true));
        container.addEventListener('mouseleave', () => (isHovered = false));

        const animate = () => {
            requestAnimationFrame(animate);
            dodecahedron.rotation.x += isHovered ? 0.02 : 0.005;
            dodecahedron.rotation.y += isHovered ? 0.02 : 0.005;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / 180;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, 180);
        });
    }

    function initializeContact3D(container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        const particleCount = 75; // Further reduced particle count
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;
        }
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.1 });
        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        camera.position.z = 10;

        const animate = () => {
            requestAnimationFrame(animate);
            particleSystem.rotation.y += 0.001;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    }

    // Floating Particles - reduced number and simplified
    function createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0';
        document.body.appendChild(particleContainer);

        for (let i = 0; i < 20; i++) { // Reduced to 20 particles
            const particle = document.createElement('div');
            particle.style.cssText = `position:absolute;width:2px;height:2px;background:rgba(0,255,255,0.5);border-radius:50%;left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:float ${Math.random() * 5 + 5}s infinite linear`; // Changed to linear
            particleContainer.appendChild(particle);
        }
    }

    

    createParticles();

    // Carousel Functionality - same as before, left unchanged
    const carouselTrack = document.querySelector('[data-carousel-track]');
    const carouselButtons = document.querySelectorAll('[data-carousel-button]');

    if (carouselTrack && carouselButtons.length === 2) {
        let slideIndex = 0;
        const slides = Array.from(carouselTrack.children);

        carouselButtons.forEach(button => {
            button.addEventListener('click', () => {
                const offset = button.dataset.carouselButton === 'next' ? 1 : -1;
                slideIndex = (slideIndex + offset + slides.length) % slides.length; // Ensure looping
                carouselTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
            });
        });
    }

       // Contact Form Submission - unchanged
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            if (!name || !email || !message) return alert('All fields are required.');
            if (!/\S+@\S+\.\S+/.test(email)) return alert('Please enter a valid email.');

            // Submit the form (this part depends on your form submission method)
            contactForm.submit(); // Or use AJAX for a smoother experience

            // Optionally display a success message
            alert('Transmission sent successfully!');
        });
    }
 const videos = document.querySelectorAll('.project-video');

    videos.forEach(video => {
        video.muted = true; // Start muted

        //Autoplay
        video.autoplay = true;

        //Event listener to check if video is stuck
        video.addEventListener('timeupdate', function() {
            if(this.currentTime > 3) { //Check at 3 seconds
                this.removeEventListener('timeupdate', arguments.callee); //Remove this event listener.
                console.log("Video Stuck at 3 seconds!");
            }
        });

        //Event listener for errors:
        video.addEventListener('error', function(e) {
            console.error("Video Error", e, this.src);
        });
    });
});