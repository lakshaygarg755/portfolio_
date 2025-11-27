// === PREMIUM SPACE PORTFOLIO JS ===

document.addEventListener('DOMContentLoaded', () => {

    // --- Three.js Background Scene ---
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create particle starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;

        // Color variation (white to cyan)
        const colorChoice = Math.random();
        if (colorChoice > 0.9) {
            colors[i] = 0;
            colors[i + 1] = 0.95;
            colors[i + 2] = 1;
        } else {
            colors[i] = 1;
            colors[i + 1] = 1;
            colors[i + 2] = 1;
        }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create rotating wireframe sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(3, -2, -5);
    scene.add(sphere);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate stars slowly
        stars.rotation.y += 0.0002;
        stars.rotation.x += 0.0001;

        // Rotate sphere
        sphere.rotation.x += 0.002;
        sphere.rotation.y += 0.003;

        // Parallax effect
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    let cursorX = 0;
    let cursorY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function animateCursor() {
        // Dot follows immediately
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';

        // Ring follows with delay
        ringX += (cursorX - ringX) * 0.15;
        ringY += (cursorY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .bento-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.width = '20px';
            cursorDot.style.height = '20px';
            cursorRing.style.width = '60px';
            cursorRing.style.height = '60px';
        });

        el.addEventListener('mouseleave', () => {
            cursorDot.style.width = '8px';
            cursorDot.style.height = '8px';
            cursorRing.style.width = '40px';
            cursorRing.style.height = '40px';
        });
    });

    // --- Mobile Navigation ---
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- GSAP Scroll Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections
    gsap.utils.toArray('.content-section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            immediateRender: false
        });
    });

    // Stagger bento cards
    gsap.utils.toArray('.bento-grid').forEach(grid => {
        gsap.from(grid.children, {
            scrollTrigger: {
                trigger: grid,
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            immediateRender: false
        });
    });

    // Skill pills animation
    gsap.from('.skill-pill', {
        scrollTrigger: {
            trigger: '.skills-wrapper',
            start: 'top 75%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        scale: 0.8,
        stagger: 0.05,
        duration: 0.6,
        ease: 'back.out(1.7)',
        immediateRender: false
    });

    // --- Vanilla Tilt Initialization ---
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 5,
        speed: 400,
        glare: true,
        'max-glare': 0.2
    });

    console.log('🚀 Premium Space Portfolio Loaded');
});