/**
 * Three.js Scene for Portfolio
 * Creates a subtle particle system background
 */

// Scene variables
let scene, camera, renderer;
let particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Initialize the scene
function initPortfolioScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 100, 500);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.z = 100;

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0a0a0a, 0);

    // Create particles
    createParticleSystem();

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff00, 1, 200);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate();
}

// Create particle system
function createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const sizes = [];

    const particleCount = 1000;

    for (let i = 0; i < particleCount; i++) {
        // Position
        vertices.push(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300
        );

        // Color (various shades of green)
        const green = 0.5 + Math.random() * 0.5;
        colors.push(0, green, Math.random() * 0.3);

        // Size
        sizes.push(Math.random() * 2 + 0.5);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Particle material
    const material = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // Create particle system
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Create connecting lines
    createConnectingLines();
}

// Create connecting lines between nearby particles
function createConnectingLines() {
    const positions = particleSystem.geometry.attributes.position.array;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];

    const maxDistance = 50;

    for (let i = 0; i < positions.length; i += 3) {
        for (let j = i + 3; j < positions.length; j += 3) {
            const dx = positions[i] - positions[j];
            const dy = positions[i + 1] - positions[j + 1];
            const dz = positions[i + 2] - positions[j + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < maxDistance) {
                // Add line positions
                linePositions.push(
                    positions[i], positions[i + 1], positions[i + 2],
                    positions[j], positions[j + 1], positions[j + 2]
                );

                // Add line colors (fade based on distance)
                const alpha = 1 - (distance / maxDistance);
                lineColors.push(
                    0, alpha * 0.5, 0,
                    0, alpha * 0.5, 0
                );
            }
        }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
}

// Mouse move handler
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

// Window resize handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate particle system
    particleSystem.rotation.x += 0.0005;
    particleSystem.rotation.y += 0.001;

    // Mouse interaction
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Animate particles
    const positions = particleSystem.geometry.attributes.position.array;
    const time = Date.now() * 0.0001;

    for (let i = 0; i < positions.length; i += 3) {
        // Wave motion
        positions[i + 1] += Math.sin(time + positions[i]) * 0.01;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;

    // Render
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioScene);
} else {
    initPortfolioScene();
}