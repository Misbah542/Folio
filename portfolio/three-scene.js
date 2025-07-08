let scene, camera, renderer;
let stars = [], starLayers = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let targetZoom = 100;

// Initialize the scene
function initPortfolioScene() {
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    camera.position.z = targetZoom;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add multiple layers of stars
    addStarfieldLayer(1000, 600, 1.5, 0xffffff);
    addStarfieldLayer(800, 800, 2.0, 0x44ff88);
    addStarfieldLayer(500, 1000, 3.0, 0x4466ff);

    // Events
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('wheel', onDocumentScroll, { passive: true });
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

// Adds a star layer
function addStarfieldLayer(count, range, size, color) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < count; i++) {
        positions.push(
            (Math.random() - 0.5) * range,
            (Math.random() - 0.5) * range,
            (Math.random() - 0.5) * range
        );

        const hue = (Math.random() * 0.3 + 0.5); // Subtle color variation
        colors.push(hue, hue, hue);

        sizes.push(Math.random() * size + 0.5);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: size,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const starLayer = new THREE.Points(geometry, material);
    scene.add(starLayer);
    starLayers.push({ mesh: starLayer, speed: size * 0.002 });
}

// Mouse move
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.02;
    mouseY = (event.clientY - windowHalfY) * 0.02;
}

// Scroll handler (zoom)
function onDocumentScroll(event) {
    targetZoom += event.deltaY * 0.2;
    targetZoom = Math.max(50, Math.min(1500, targetZoom));
}

// Resize
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation
function animate() {
    requestAnimationFrame(animate);

    // Smooth zoom
    camera.position.z += (targetZoom - camera.position.z) * 0.05;

    // Parallax mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;

    // Twinkle and rotate layers
    const time = Date.now() * 0.001;
    starLayers.forEach(({ mesh, speed }, index) => {
        mesh.rotation.y += speed;
        mesh.material.opacity = 0.5 + Math.sin(time + index) * 0.3;
    });

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

// Init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioScene);
} else {
    initPortfolioScene();
}
