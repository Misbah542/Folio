/**
 * Enhanced Three.js Scene with Interactive Elements
 * Minimalistic but more visible and interactive
 */

// Scene variables
let scene, camera, renderer;
let vectorGroup, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let interactionMode = false;
let raycaster, mouse;
let selectedObject = null;
let interactiveObjects = [];

// Enhanced color palette
const colors = {
    primary: 0x6366f1,
    secondary: 0x8b5cf6,
    accent: 0xec4899,
    particles: 0x64748b,
    highlight: 0x22d3ee,
    glow: 0x10b981
};

/**
 * Initialize the enhanced scene
 */
function initThreeScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 50, 200);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.z = 80;

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Initialize raycaster for interactions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create vector group
    vectorGroup = new THREE.Group();
    scene.add(vectorGroup);

    // Add lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(colors.highlight, 0.5, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create enhanced elements
    createCentralStructure();
    createFloatingElements();
    createInteractiveParticles();
    createBackgroundGrid();

    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Interaction mode events
    window.addEventListener('sceneInteractionEnabled', () => {
        interactionMode = true;
        enableInteractionMode();
    });

    window.addEventListener('sceneInteractionDisabled', () => {
        interactionMode = false;
        disableInteractionMode();
    });

    // Start animation
    animate();
}

/**
 * Create central interactive structure
 */
function createCentralStructure() {
    // Main wireframe sphere with glow effect
    const sphereGeometry = new THREE.IcosahedronGeometry(25, 2);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: colors.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.userData = { 
        type: 'central',
        rotationSpeed: 0.002,
        interactive: true,
        originalColor: colors.primary
    };
    vectorGroup.add(sphere);
    interactiveObjects.push(sphere);

    // Inner glowing core
    const coreGeometry = new THREE.SphereGeometry(10, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: colors.glow,
        transparent: true,
        opacity: 0.3
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    sphere.add(core);

    // Rotating rings around the sphere
    for (let i = 0; i < 4; i++) {
        const ringRadius = 35 + i * 10;
        const ringGeometry = new THREE.TorusGeometry(ringRadius, 1, 4, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: colors.secondary,
            wireframe: true,
            transparent: true,
            opacity: 0.3 - i * 0.05
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        
        // Random rotation axes
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        
        ring.userData = { 
            rotationSpeed: 0.001 * (i + 1),
            axis: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize(),
            interactive: true,
            originalColor: colors.secondary
        };
        
        vectorGroup.add(ring);
        interactiveObjects.push(ring);
    }
}

/**
 * Create floating interactive elements
 */
function createFloatingElements() {
    const shapes = [];
    const geometries = [
        new THREE.TetrahedronGeometry(6, 0),
        new THREE.OctahedronGeometry(5, 0),
        new THREE.BoxGeometry(7, 7, 7),
        new THREE.IcosahedronGeometry(5, 0),
        new THREE.DodecahedronGeometry(5, 0),
        new THREE.ConeGeometry(5, 10, 4)
    ];
    
    // Create various geometric shapes
    for (let i = 0; i < 12; i++) {
        const geometry = geometries[i % geometries.length];
        const material = new THREE.MeshBasicMaterial({
            color: colors.accent,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const shape = new THREE.Mesh(geometry, material);
        
        // Position shapes in a sphere around the center
        const angle = (i / 12) * Math.PI * 2;
        const radius = 60 + Math.random() * 20;
        const height = (Math.random() - 0.5) * 40;
        
        shape.position.x = Math.cos(angle) * radius;
        shape.position.y = height;
        shape.position.z = Math.sin(angle) * radius;
        
        shape.userData = {
            floatSpeed: 0.0005 + Math.random() * 0.001,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            initialPosition: shape.position.clone(),
            interactive: true,
            originalColor: colors.accent,
            floatAmplitude: 5 + Math.random() * 5
        };
        
        shapes.push(shape);
        vectorGroup.add(shape);
        interactiveObjects.push(shape);
    }
    
    vectorGroup.userData.shapes = shapes;
}

/**
 * Create interactive particle system
 */
function createInteractiveParticles() {
    const geometry = new THREE.BufferGeometry();
    const particles = 1000;
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);

    for (let i = 0; i < particles * 3; i += 3) {
        // Create particles in a sphere volume
        const radius = 30 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        // Gradient colors
        colors[i] = 0.5 + Math.random() * 0.5;
        colors[i + 1] = 0.3 + Math.random() * 0.7;
        colors[i + 2] = 0.8 + Math.random() * 0.2;
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    particleSystem.userData = { rotationSpeed: 0.0001 };
    // scene.add(particleSystem);
}

/**
 * Create animated background grid
 */
function createBackgroundGrid() {
    const gridGroup = new THREE.Group();
    const gridSize = 300;
    const divisions = 30;
    const step = gridSize / divisions;
    
    // Create animated grid lines
    for (let i = 0; i <= divisions; i++) {
        const position = -gridSize / 2 + i * step;
        const lineOpacity = 0.1 + (Math.abs(i - divisions/2) / divisions) * 0.1;
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: colors.particles,
            transparent: true,
            opacity: lineOpacity
        });
        
        // Horizontal lines
        const hGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-gridSize / 2, position, -80),
            new THREE.Vector3(gridSize / 2, position, -80)
        ]);
        const hLine = new THREE.Line(hGeometry, lineMaterial);
        gridGroup.add(hLine);
        
        // Vertical lines
        const vGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(position, -gridSize / 2, -80),
            new THREE.Vector3(position, gridSize / 2, -80)
        ]);
        const vLine = new THREE.Line(vGeometry, lineMaterial);
        gridGroup.add(vLine);
    }
    
    gridGroup.rotation.x = -Math.PI / 6;
    gridGroup.userData = { waveSpeed: 0.001 };
    scene.add(gridGroup);
    vectorGroup.userData.grid = gridGroup;
}

// Mouse interaction variables
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

function enableInteractionMode() {
    document.getElementById('canvas').classList.add('interactive');
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onInteractiveMouseMove);
    document.addEventListener('click', onMouseClick);
    
    // Show interaction instructions
    const instructions = document.createElement('div');
    instructions.className = 'interaction-instructions show';
    instructions.innerHTML = `
        <h3>🎮 Interactive Mode Enabled</h3>
        <p>• Click and drag to rotate the scene</p>
        <p>• Click on objects to interact</p>
        <p>• Scroll to zoom in/out</p>
        <p>• Press ESC or toggle button to exit</p>
    `;
    document.body.appendChild(instructions);
    
    setTimeout(() => {
        instructions.classList.remove('show');
        setTimeout(() => instructions.remove(), 300);
    }, 3000);
    
    // Add scroll zoom
    document.addEventListener('wheel', onMouseWheel);
}

function disableInteractionMode() {
    document.getElementById('canvas').classList.remove('interactive');
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousemove', onInteractiveMouseMove);
    document.removeEventListener('click', onMouseClick);
    document.removeEventListener('wheel', onMouseWheel);
    
    // Reset any highlighted objects
    if (selectedObject) {
        selectedObject.material.color.setHex(selectedObject.userData.originalColor);
        selectedObject = null;
    }
}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onInteractiveMouseMove(event) {
    if (!interactionMode) return;
    
    // Update mouse position for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    if (isDragging) {
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
    } else {
        // Highlight objects on hover
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);
        
        // Reset previous highlight
        if (selectedObject && !intersects.find(i => i.object === selectedObject)) {
            selectedObject.material.color.setHex(selectedObject.userData.originalColor);
            selectedObject = null;
        }
        
        // Highlight new object
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.interactive) {
                selectedObject = object;
                object.material.color.setHex(colors.highlight);
            }
        }
    }
}

function onMouseUp() {
    isDragging = false;
}

function onMouseClick(event) {
    if (!interactionMode || isDragging) return;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        // Animate clicked object
        const originalScale = object.scale.x;
        const scaleUp = setInterval(() => {
            object.scale.multiplyScalar(1.05);
            if (object.scale.x > originalScale * 1.5) {
                clearInterval(scaleUp);
                const scaleDown = setInterval(() => {
                    object.scale.multiplyScalar(0.95);
                    if (object.scale.x <= originalScale) {
                        object.scale.set(originalScale, originalScale, originalScale);
                        clearInterval(scaleDown);
                    }
                }, 20);
            }
        }, 20);
        
        // Create particle burst
        createParticleBurst(object.position);
    }
}

function onMouseWheel(event) {
    if (!interactionMode) return;
    
    // Zoom camera
    const zoomSpeed = 0.1;
    camera.position.z += event.deltaY * zoomSpeed;
    camera.position.z = Math.max(20, Math.min(150, camera.position.z));
}

function createParticleBurst(position) {
    const burstGeometry = new THREE.BufferGeometry();
    const burstCount = 50;
    const positions = new Float32Array(burstCount * 3);
    const velocities = [];
    
    for (let i = 0; i < burstCount * 3; i += 3) {
        positions[i] = position.x;
        positions[i + 1] = position.y;
        positions[i + 2] = position.z;
        
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        velocities.push(velocity);
    }
    
    burstGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const burstMaterial = new THREE.PointsMaterial({
        color: colors.highlight,
        size: 3,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });
    
    const burst = new THREE.Points(burstGeometry, burstMaterial);
    scene.add(burst);
    
    // Animate burst
    let frame = 0;
    const animateBurst = () => {
        frame++;
        const positions = burst.geometry.attributes.position.array;
        
        for (let i = 0; i < burstCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;
            velocities[i].multiplyScalar(0.98);
        }
        
        burst.geometry.attributes.position.needsUpdate = true;
        burst.material.opacity -= 0.02;
        
        if (burst.material.opacity > 0 && frame < 50) {
            requestAnimationFrame(animateBurst);
        } else {
            scene.remove(burst);
        }
    };
    
    animateBurst();
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
    if (!isDragging && !interactionMode) {
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    }
    
    camera.lookAt(scene.position);

    // Rotate main vector group
    if (!isDragging) {
        vectorGroup.rotation.y += 0.0005;
        vectorGroup.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
    } else if (interactionMode) {
        // Apply drag rotation with smooth damping
        vectorGroup.rotation.x += (targetRotation.x - vectorGroup.rotation.x) * 0.1;
        vectorGroup.rotation.y += (targetRotation.y - vectorGroup.rotation.y) * 0.1;
    }

    // Animate central structure
    vectorGroup.children.forEach(child => {
        if (child.userData.rotationSpeed) {
            if (child.userData.axis) {
                child.rotateOnAxis(child.userData.axis, child.userData.rotationSpeed);
            } else {
                child.rotation.z += child.userData.rotationSpeed;
            }
        }
    });

    // Animate floating shapes
    if (vectorGroup.userData.shapes) {
        const time = Date.now() * 0.001;
        vectorGroup.userData.shapes.forEach((shape, index) => {
            // Float up and down
            shape.position.y = shape.userData.initialPosition.y + 
                Math.sin(time * shape.userData.floatSpeed + index) * shape.userData.floatAmplitude;
            
            // Rotate
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;
        });
    }

    // Animate grid wave effect
    if (vectorGroup.userData.grid) {
        const grid = vectorGroup.userData.grid;
        grid.children.forEach((line, i) => {
            if (line.geometry.attributes.position) {
                const positions = line.geometry.attributes.position.array;
                const time = Date.now() * grid.userData.waveSpeed;
                for (let j = 0; j < positions.length; j += 3) {
                    positions[j + 2] = -80 + Math.sin(time + i * 0.1 + j * 0.05) * 5;
                }
                line.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    // Rotate particle system
    if (particleSystem) {
        particleSystem.rotation.y += particleSystem.userData.rotationSpeed;
        
        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        particleSystem.scale.set(scale, scale, scale);
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