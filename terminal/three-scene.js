/**
 * Minimalistic Three.js Scene with Vector Graphics
 * Subtle geometric patterns and clean design
 */

// Scene variables
let scene, camera, renderer;
let vectorGroup, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Minimalistic color palette
const colors = {
    primary: 0x4f46e5,
    secondary: 0x6b7280,
    accent: 0x9ca3af,
    particles: 0x4b5563
};

/**
 * Initialize the minimalistic scene
 */
function initThreeScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 100, 300);

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
    renderer.setClearColor(0x000000, 0);

    // Create vector group
    vectorGroup = new THREE.Group();
    scene.add(vectorGroup);

    // Create minimalistic elements
    createMinimalVectors();
    createSubtleParticles();
    createGeometricGrid();

    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Check for interaction events
    window.addEventListener('sceneInteractionEnabled', () => {
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseDrag);
    });

    window.addEventListener('sceneInteractionDisabled', () => {
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseDrag);
    });

    // Start animation
    animate();
}

/**
 * Create minimalistic vector patterns
 */
function createMinimalVectors() {
    // Create wireframe sphere as centerpiece
    const sphereGeometry = new THREE.IcosahedronGeometry(30, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: colors.secondary,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    vectorGroup.add(sphere);

    // Add rotating rings
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(40 + i * 15, 0.5, 4, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: colors.accent,
            wireframe: true,
            transparent: true,
            opacity: 0.15 - i * 0.05
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 * i;
        ring.userData = { rotationSpeed: 0.001 * (i + 1) };
        vectorGroup.add(ring);
    }

    // Add subtle geometric shapes
    createFloatingShapes();
}

/**
 * Create floating geometric shapes
 */
function createFloatingShapes() {
    const shapes = [];
    
    // Create various geometric shapes
    for (let i = 0; i < 8; i++) {
        let geometry, material;
        
        switch (i % 4) {
            case 0:
                geometry = new THREE.TetrahedronGeometry(5, 0);
                break;
            case 1:
                geometry = new THREE.OctahedronGeometry(4, 0);
                break;
            case 2:
                geometry = new THREE.BoxGeometry(6, 6, 6);
                break;
            case 3:
                geometry = new THREE.IcosahedronGeometry(4, 0);
                break;
        }
        
        material = new THREE.MeshBasicMaterial({
            color: colors.secondary,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        
        const shape = new THREE.Mesh(geometry, material);
        
        // Position shapes around the center
        const angle = (i / 8) * Math.PI * 2;
        const radius = 60;
        shape.position.x = Math.cos(angle) * radius;
        shape.position.y = Math.sin(angle) * radius;
        shape.position.z = (Math.random() - 0.5) * 30;
        
        shape.userData = {
            floatSpeed: 0.0005 + Math.random() * 0.001,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01
            },
            initialY: shape.position.y
        };
        
        shapes.push(shape);
        vectorGroup.add(shape);
    }
    
    vectorGroup.userData.shapes = shapes;
}

/**
 * Create subtle particle system
 */
function createSubtleParticles() {
    const geometry = new THREE.BufferGeometry();
    const particles = 500; // Reduced number for minimalism
    const positions = new Float32Array(particles * 3);

    for (let i = 0; i < particles * 3; i += 3) {
        // Create particles in a sphere volume
        const radius = 50 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: colors.particles,
        size: 1,
        transparent: true,
        opacity: 0.3,
        sizeAttenuation: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

/**
 * Create geometric grid pattern
 */
function createGeometricGrid() {
    const gridGroup = new THREE.Group();
    const gridSize = 200;
    const divisions = 20;
    const step = gridSize / divisions;
    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.05
    });
    
    // Create grid lines
    for (let i = 0; i <= divisions; i++) {
        const position = -gridSize / 2 + i * step;
        
        // Horizontal lines
        const hGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-gridSize / 2, position, -50),
            new THREE.Vector3(gridSize / 2, position, -50)
        ]);
        const hLine = new THREE.Line(hGeometry, lineMaterial);
        gridGroup.add(hLine);
        
        // Vertical lines
        const vGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(position, -gridSize / 2, -50),
            new THREE.Vector3(position, gridSize / 2, -50)
        ]);
        const vLine = new THREE.Line(vGeometry, lineMaterial);
        gridGroup.add(vLine);
    }
    
    gridGroup.rotation.x = -Math.PI / 4;
    scene.add(gridGroup);
}

// Mouse interaction variables
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseDrag(event) {
    if (!isDragging) return;
    
    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };
    
    targetRotation.y += deltaMove.x * 0.01;
    targetRotation.x += deltaMove.y * 0.01;
    
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseUp() {
    isDragging = false;
}

// Mouse move handler
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.01;
    mouseY = (event.clientY - windowHalfY) * 0.01;
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

    // Smooth camera movement based on mouse position
    if (!isDragging) {
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    }
    
    camera.lookAt(scene.position);

    // Rotate main vector group slowly
    if (!isDragging) {
        vectorGroup.rotation.y += 0.0005;
        vectorGroup.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
    } else {
        // Apply drag rotation
        vectorGroup.rotation.x += (targetRotation.x - vectorGroup.rotation.x) * 0.1;
        vectorGroup.rotation.y += (targetRotation.y - vectorGroup.rotation.y) * 0.1;
    }

    // Animate rings
    vectorGroup.children.forEach(child => {
        if (child.userData.rotationSpeed) {
            child.rotation.z += child.userData.rotationSpeed;
        }
    });

    // Animate floating shapes
    if (vectorGroup.userData.shapes) {
        const time = Date.now() * 0.001;
        vectorGroup.userData.shapes.forEach((shape, index) => {
            // Float up and down
            shape.position.y = shape.userData.initialY + Math.sin(time * shape.userData.floatSpeed + index) * 5;
            
            // Rotate
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
        });
    }

    // Rotate particle system slowly
    if (particleSystem) {
        particleSystem.rotation.y += 0.0002;
    }

    // Render
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
} else {
    initThreeScene();
}