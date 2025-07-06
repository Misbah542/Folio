/**
 * Enhanced Three.js Scene with Vector Graphics
 * Infinite scrolling vector patterns in spherical arrangement
 */

// Scene variables
let scene, camera, renderer;
let vectorGroups = [];
let particles;
let sphereGroup;
let scrollGroup;
let ambientParticles;

// Interaction variables
let isInteractive = false;
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;

// Scroll variables
let scrollY = 0;
let lastScrollY = 0;
let scrollVelocity = 0;

// Animation clock
const clock = new THREE.Clock();

// Colors
const colors = {
    primary: 0x00ff00,
    secondary: 0x00cc00,
    accent: 0x00ff88,
    particles: 0x00ff44,
    vectors: [0x00ff00, 0x00ff88, 0x00cc00, 0x00ffaa, 0x00ff44]
};

/**
 * Create vector pattern generators - Enhanced
 */
const vectorPatterns = {
    // Circuit Board Pattern - Enhanced
    circuit: () => {
        const group = new THREE.Group();
        const material = new THREE.LineBasicMaterial({ 
            color: colors.vectors[Math.floor(Math.random() * colors.vectors.length)],
            transparent: true,
            opacity: 0.7,
            linewidth: 2
        });
        
        // Create complex circuit paths
        for (let i = 0; i < 8; i++) {
            const points = [];
            let x = (Math.random() - 0.5) * 4;
            let y = (Math.random() - 0.5) * 4;
            
            points.push(new THREE.Vector3(x, y, 0));
            
            for (let j = 0; j < 6; j++) {
                const direction = Math.floor(Math.random() * 4);
                const distance = 0.5 + Math.random() * 1.5;
                
                switch(direction) {
                    case 0: x += distance; break;
                    case 1: x -= distance; break;
                    case 2: y += distance; break;
                    case 3: y -= distance; break;
                }
                
                points.push(new THREE.Vector3(x, y, 0));
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            group.add(line);
            
            // Add nodes at connection points with glow effect
            points.forEach((point, idx) => {
                const nodeGroup = new THREE.Group();
                
                // Outer glow
                const glowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                const glowMaterial = new THREE.MeshBasicMaterial({ 
                    color: material.color,
                    transparent: true,
                    opacity: 0.3
                });
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                nodeGroup.add(glow);
                
                // Inner node
                const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
                const nodeMaterial = new THREE.MeshBasicMaterial({ 
                    color: material.color,
                    emissive: material.color,
                    emissiveIntensity: 0.8
                });
                const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
                nodeGroup.add(node);
                
                nodeGroup.position.copy(point);
                group.add(nodeGroup);
                
                // Add small connecting lines
                if (idx < points.length - 1 && Math.random() > 0.5) {
                    const branchPoints = [
                        point,
                        new THREE.Vector3(
                            point.x + (Math.random() - 0.5) * 0.5,
                            point.y + (Math.random() - 0.5) * 0.5,
                            point.z
                        )
                    ];
                    const branchGeometry = new THREE.BufferGeometry().setFromPoints(branchPoints);
                    const branchLine = new THREE.Line(branchGeometry, material);
                    group.add(branchLine);
                }
            });
        }
        
        // Add microchip-like rectangles
        for (let i = 0; i < 3; i++) {
            const chipGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.1);
            const chipMaterial = new THREE.MeshBasicMaterial({
                color: material.color,
                wireframe: true,
                transparent: true,
                opacity: 0.5
            });
            const chip = new THREE.Mesh(chipGeometry, chipMaterial);
            chip.position.set(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                0
            );
            chip.rotation.z = Math.random() * Math.PI;
            group.add(chip);
        }
        
        return group;
    },
    
    // Hexagon Grid - Enhanced
    hexGrid: () => {
        const group = new THREE.Group();
        const hexRadius = 0.5;
        const layers = 3;
        
        for (let layer = 0; layer < layers; layer++) {
            const layerGroup = new THREE.Group();
            const layerScale = 1 + layer * 0.5;
            
            for (let i = -2; i <= 2; i++) {
                for (let j = -2; j <= 2; j++) {
                    const hexShape = new THREE.Shape();
                    for (let k = 0; k < 6; k++) {
                        const angle = (k / 6) * Math.PI * 2 + Math.PI / 6;
                        const x = Math.cos(angle) * hexRadius;
                        const y = Math.sin(angle) * hexRadius;
                        if (k === 0) hexShape.moveTo(x, y);
                        else hexShape.lineTo(x, y);
                    }
                    hexShape.closePath();
                    
                    // Create both filled and wireframe versions
                    const geometry = new THREE.ShapeGeometry(hexShape);
                    const material = new THREE.MeshBasicMaterial({
                        color: colors.vectors[Math.floor(Math.random() * colors.vectors.length)],
                        transparent: true,
                        opacity: 0.1 + (0.2 / (layer + 1)),
                        side: THREE.DoubleSide
                    });
                    
                    const wireMaterial = new THREE.MeshBasicMaterial({
                        color: material.color,
                        transparent: true,
                        opacity: 0.6 / (layer + 1),
                        wireframe: true
                    });
                    
                    const hex = new THREE.Mesh(geometry, material);
                    const hexWire = new THREE.Mesh(geometry, wireMaterial);
                    
                    const xPos = i * 1.5 * hexRadius * Math.sqrt(3);
                    const yPos = j * 1.5 * hexRadius * 2 + (i % 2) * hexRadius * 1.5;
                    
                    hex.position.set(xPos, yPos, layer * 0.2);
                    hexWire.position.set(xPos, yPos, layer * 0.2);
                    
                    layerGroup.add(hex);
                    layerGroup.add(hexWire);
                }
            }
            
            layerGroup.scale.setScalar(layerScale);
            group.add(layerGroup);
        }
        
        return group;
    },
    
    // DNA Helix - Enhanced
    dnaHelix: () => {
        const group = new THREE.Group();
        const helixMaterial = new THREE.LineBasicMaterial({ 
            color: colors.vectors[Math.floor(Math.random() * colors.vectors.length)],
            transparent: true,
            opacity: 0.8,
            linewidth: 3
        });
        
        // Create double helix with more detail
        const segments = 100;
        for (let h = 0; h < 2; h++) {
            const points = [];
            for (let i = 0; i <= segments; i++) {
                const t = (i / segments) * 4 * Math.PI;
                const radius = 1.5 + Math.sin(t * 0.5) * 0.3;
                const x = Math.sin(t + h * Math.PI) * radius;
                const y = (i / segments) * 8 - 4;
                const z = Math.cos(t + h * Math.PI) * radius;
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const helix = new THREE.Line(geometry, helixMaterial);
            group.add(helix);
        }
        
        // Add connecting bars with gradient effect
        const barMaterial = new THREE.LineBasicMaterial({
            color: helixMaterial.color,
            transparent: true,
            opacity: 0.5
        });
        
        for (let i = 0; i < 20; i++) {
            const t = (i / 20) * 4 * Math.PI;
            const y = (i / 20) * 8 - 4;
            const radius = 1.5 + Math.sin(t * 0.5) * 0.3;
            
            const points = [
                new THREE.Vector3(Math.sin(t) * radius, y, Math.cos(t) * radius),
                new THREE.Vector3(Math.sin(t + Math.PI) * radius, y, Math.cos(t + Math.PI) * radius)
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const bar = new THREE.Line(geometry, barMaterial);
            group.add(bar);
            
            // Add base pair indicators
            const baseGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.1);
            const baseMaterial = new THREE.MeshBasicMaterial({
                color: colors.accent,
                transparent: true,
                opacity: 0.6
            });
            
            points.forEach(point => {
                const base = new THREE.Mesh(baseGeometry, baseMaterial);
                base.position.copy(point);
                group.add(base);
            });
        }
        
        return group;
    },
    
    // Sacred Geometry - Enhanced
    sacredGeometry: () => {
        const group = new THREE.Group();
        const material = new THREE.LineBasicMaterial({ 
            color: colors.vectors[Math.floor(Math.random() * colors.vectors.length)],
            transparent: true,
            opacity: 0.6
        });
        
        // Flower of Life pattern with multiple layers
        const layers = 3;
        for (let layer = 0; layer < layers; layer++) {
            const layerGroup = new THREE.Group();
            const circles = 7 + layer * 6;
            const radius = 0.8;
            const layerRadius = radius * (1 + layer);
            
            for (let i = 0; i < circles; i++) {
                const angle = (i / circles) * Math.PI * 2;
                const x = i === 0 && layer === 0 ? 0 : Math.cos(angle) * layerRadius;
                const y = i === 0 && layer === 0 ? 0 : Math.sin(angle) * layerRadius;
                
                const curve = new THREE.EllipseCurve(x, y, radius, radius, 0, 2 * Math.PI, false, 0);
                const points = curve.getPoints(64);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const circle = new THREE.Line(geometry, material);
                layerGroup.add(circle);
            }
            
            layerGroup.rotation.z = layer * Math.PI / 6;
            group.add(layerGroup);
        }
        
        // Add central mandala
        const mandalaPoints = [];
        for (let i = 0; i < 360; i += 10) {
            const angle = (i / 180) * Math.PI;
            const r = 0.5 + Math.sin(angle * 6) * 0.2;
            mandalaPoints.push(new THREE.Vector3(
                Math.cos(angle) * r,
                Math.sin(angle) * r,
                0
            ));
        }
        mandalaPoints.push(mandalaPoints[0]); // Close the shape
        
        const mandalaGeometry = new THREE.BufferGeometry().setFromPoints(mandalaPoints);
        const mandala = new THREE.Line(mandalaGeometry, material);
        group.add(mandala);
        
        return group;
    },
    
    // Network Nodes - Enhanced
    networkNodes: () => {
        const group = new THREE.Group();
        const nodes = [];
        const nodeCount = 12;
        
        // Create nodes with different shapes
        const nodeShapes = [
            () => new THREE.OctahedronGeometry(0.15, 0),
            () => new THREE.TetrahedronGeometry(0.2, 0),
            () => new THREE.IcosahedronGeometry(0.15, 0),
            () => new THREE.BoxGeometry(0.2, 0.2, 0.2)
        ];
        
        for (let i = 0; i < nodeCount; i++) {
            const nodeGroup = new THREE.Group();
            
            // Random shape selection
            const shapeIndex = Math.floor(Math.random() * nodeShapes.length);
            const nodeGeometry = nodeShapes[shapeIndex]();
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: colors.vectors[Math.floor(Math.random() * colors.vectors.length)],
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            nodeGroup.add(node);
            
            // Add glow sphere
            const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: nodeMaterial.color,
                transparent: true,
                opacity: 0.1
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            nodeGroup.add(glow);
            
            // Position in 3D space
            nodeGroup.position.set(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 3
            );
            
            nodes.push(nodeGroup);
            group.add(nodeGroup);
        }
        
        // Create dynamic connections
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: colors.primary,
            transparent: true,
            opacity: 0.3
        });
        
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                if (distance < 3 && Math.random() > 0.3) {
                    // Create curved connection
                    const curve = new THREE.QuadraticBezierCurve3(
                        nodes[i].position,
                        new THREE.Vector3(
                            (nodes[i].position.x + nodes[j].position.x) / 2,
                            (nodes[i].position.y + nodes[j].position.y) / 2 + Math.random() - 0.5,
                            (nodes[i].position.z + nodes[j].position.z) / 2
                        ),
                        nodes[j].position
                    );
                    
                    const points = curve.getPoints(20);
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, lineMaterial);
                    group.add(line);
                }
            }
        }
        
        return group;
    },
    
    // Wave Pattern - Enhanced
    wavePattern: () => {
        const group = new THREE.Group();
        const waves = 5;
        const resolution = 100;
        
        for (let w = 0; w < waves; w++) {
            const points = [];
            const frequency = 1 + w * 0.5;
            const amplitude = 0.5 - w * 0.08;
            
            for (let i = 0; i <= resolution; i++) {
                const x = (i / resolution) * 8 - 4;
                const y = Math.sin(x * frequency + w * 0.5) * amplitude;
                const z = w * 0.3 - 0.5;
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: colors.vectors[Math.floor(Math.random() * colors.vectors.length)],
                transparent: true,
                opacity: 0.7 - w * 0.1,
                linewidth: 3 - w * 0.5
            });
            const wave = new THREE.Line(geometry, material);
            
            // Add wave particles
            if (w === 0) {
                const particleGeometry = new THREE.BufferGeometry();
                const particlePositions = new Float32Array(resolution * 3);
                
                for (let i = 0; i < resolution; i++) {
                    particlePositions[i * 3] = points[i].x;
                    particlePositions[i * 3 + 1] = points[i].y;
                    particlePositions[i * 3 + 2] = points[i].z;
                }
                
                particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
                const particleMaterial = new THREE.PointsMaterial({
                    color: material.color,
                    size: 0.05,
                    transparent: true,
                    opacity: 0.8
                });
                const particles = new THREE.Points(particleGeometry, particleMaterial);
                group.add(particles);
            }
            
            group.add(wave);
        }
        
        return group;
    },
    
    // Fractal Tree - Enhanced
    fractalTree: () => {
        const group = new THREE.Group();
        const material = new THREE.LineBasicMaterial({
            color: colors.vectors[Math.floor(Math.random() * colors.vectors.length)],
            transparent: true,
            opacity: 0.7
        });
        
        const branches = [];
        
        function createBranch(start, direction, length, depth, thickness) {
            if (depth === 0 || length < 0.1) return;
            
            const end = new THREE.Vector3().addVectors(
                start,
                direction.clone().multiplyScalar(length)
            );
            
            // Create tapered branch
            const points = [start, end];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const branchMaterial = material.clone();
            branchMaterial.opacity = thickness;
            const branch = new THREE.Line(geometry, branchMaterial);
            group.add(branch);
            
            // Store branch info for leaves
            if (depth === 1) {
                branches.push(end);
            }
            
            // Create sub-branches with randomization
            const angleVariation = 0.1 + Math.random() * 0.3;
            const lengthReduction = 0.65 + Math.random() * 0.1;
            const branchCount = depth > 3 ? 2 : 3;
            
            for (let i = 0; i < branchCount; i++) {
                const rotationAxis = new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize();
                
                const newDirection = direction.clone();
                newDirection.applyAxisAngle(rotationAxis, angleVariation * (i - branchCount / 2));
                
                createBranch(
                    end,
                    newDirection,
                    length * lengthReduction,
                    depth - 1,
                    thickness * 0.8
                );
            }
        }
        
        // Create main trunk
        createBranch(
            new THREE.Vector3(0, -2, 0),
            new THREE.Vector3(0, 1, 0),
            1.5,
            6,
            1
        );
        
        // Add leaves to branch ends
        branches.forEach(pos => {
            const leafGeometry = new THREE.SphereGeometry(0.15, 6, 6);
            const leafMaterial = new THREE.MeshBasicMaterial({
                color: colors.accent,
                transparent: true,
                opacity: 0.6
            });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.copy(pos);
            leaf.scale.set(1, 1.5, 0.5);
            group.add(leaf);
        });
        
        return group;
    },
    
    // Constellation Pattern
    constellation: () => {
        const group = new THREE.Group();
        const starCount = 15;
        const stars = [];
        
        // Create stars
        for (let i = 0; i < starCount; i++) {
            const starGroup = new THREE.Group();
            
            // Star core
            const coreGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.05, 8, 8);
            const coreMaterial = new THREE.MeshBasicMaterial({
                color: colors.vectors[Math.floor(Math.random() * colors.vectors.length)],
                emissive: colors.primary,
                emissiveIntensity: 1
            });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            starGroup.add(core);
            
            // Star rays
            const rayCount = 4 + Math.floor(Math.random() * 4);
            for (let r = 0; r < rayCount; r++) {
                const angle = (r / rayCount) * Math.PI * 2;
                const rayLength = 0.2 + Math.random() * 0.3;
                const points = [
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(
                        Math.cos(angle) * rayLength,
                        Math.sin(angle) * rayLength,
                        0
                    )
                ];
                const rayGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const rayMaterial = new THREE.LineBasicMaterial({
                    color: coreMaterial.color,
                    transparent: true,
                    opacity: 0.5
                });
                const ray = new THREE.Line(rayGeometry, rayMaterial);
                starGroup.add(ray);
            }
            
            starGroup.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 2
            );
            
            stars.push(starGroup);
            group.add(starGroup);
        }
        
        // Connect nearby stars
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: colors.primary,
            transparent: true,
            opacity: 0.2
        });
        
        for (let i = 0; i < starCount; i++) {
            for (let j = i + 1; j < starCount; j++) {
                const distance = stars[i].position.distanceTo(stars[j].position);
                if (distance < 2.5 && Math.random() > 0.6) {
                    const points = [stars[i].position, stars[j].position];
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const connection = new THREE.Line(geometry, connectionMaterial);
                    group.add(connection);
                }
            }
        }
        
        return group;
    },
    
    // Data Flow Visualization
    dataFlow: () => {
        const group = new THREE.Group();
        const nodeCount = 8;
        const nodes = [];
        
        // Create data nodes
        for (let i = 0; i < nodeCount; i++) {
            const nodeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: colors.vectors[Math.floor(Math.random() * colors.vectors.length)],
                wireframe: true
            });
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = 2;
            node.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
            
            nodes.push(node);
            group.add(node);
        }
        
        // Create flowing data lines
        for (let i = 0; i < nodeCount; i++) {
            const nextIndex = (i + 1) % nodeCount;
            const curve = new THREE.CubicBezierCurve3(
                nodes[i].position,
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1),
                nodes[nextIndex].position
            );
            
            const points = curve.getPoints(30);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: colors.primary,
                transparent: true,
                opacity: 0.5
            });
            const flow = new THREE.Line(geometry, material);
            group.add(flow);
            
            // Add data packets
            const packetGeometry = new THREE.SphereGeometry(0.08, 6, 6);
            const packetMaterial = new THREE.MeshBasicMaterial({
                color: colors.accent,
                emissive: colors.accent,
                emissiveIntensity: 0.5
            });
            const packet = new THREE.Mesh(packetGeometry, packetMaterial);
            packet.userData = { curve, progress: Math.random() };
            group.add(packet);
            
            // Store packet for animation
            group.userData.packets = group.userData.packets || [];
            group.userData.packets.push(packet);
        }
        
        return group;
    }
};

/**
 * Initialize the Three.js scene
 */
function initThreeScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 50, 200);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create main groups
    sphereGroup = new THREE.Group();
    scrollGroup = new THREE.Group();
    scene.add(scrollGroup);
    scrollGroup.add(sphereGroup);

    // Add lights
    setupLighting();

    // Create all 3D elements
    createVectorSphere();
    createParticles();
    createAmbientParticles();
    createInfiniteVectors();

    // Set up event listeners
    setupEventListeners();

    // Start animation
    animate();
}

/**
 * Set up scene lighting
 */
function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Point lights with different colors
    const light1 = new THREE.PointLight(colors.primary, 1, 100);
    light1.position.set(20, 20, 20);
    scene.add(light1);

    const light2 = new THREE.PointLight(colors.accent, 0.8, 100);
    light2.position.set(-20, -20, 20);
    scene.add(light2);

    const light3 = new THREE.PointLight(colors.secondary, 0.6, 80);
    light3.position.set(0, 30, -20);
    scene.add(light3);
}

/**
 * Create spherical arrangement of vector patterns
 */
function createVectorSphere() {
    const patternTypes = Object.keys(vectorPatterns);
    const radius = 35;
    const count = 80;
    
    for (let i = 0; i < count; i++) {
        // Use fibonacci sphere distribution for even spacing
        const theta = Math.PI * (3 - Math.sqrt(5));
        const y = 1 - (i / (count - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const x = Math.cos(theta * i) * radiusAtY;
        const z = Math.sin(theta * i) * radiusAtY;
        
        // Create random vector pattern
        const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        const pattern = vectorPatterns[patternType]();
        
        // Position and orient pattern
        pattern.position.set(x * radius, y * radius, z * radius);
        pattern.lookAt(0, 0, 0);
        
        // Random rotation for variety
        pattern.rotation.z = Math.random() * Math.PI * 2;
        
        // Scale variation
        const scale = 0.4 + Math.random() * 0.6;
        pattern.scale.set(scale, scale, scale);
        
        sphereGroup.add(pattern);
        
        vectorGroups.push({
            mesh: pattern,
            type: patternType,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            pulseSpeed: Math.random() * 0.5 + 0.5,
            initialScale: scale,
            floatOffset: Math.random() * Math.PI * 2
        });
    }
}

/**
 * Create particle system
 */
function createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Create particles in sphere volume with varying density
        const radius = 20 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Green color variations
        const greenIntensity = 0.5 + Math.random() * 0.5;
        colors[i3] = 0;
        colors[i3 + 1] = greenIntensity;
        colors[i3 + 2] = Math.random() * 0.3;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        size: 1,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    sphereGroup.add(particles);
}

/**
 * Create ambient floating particles
 */
function createAmbientParticles() {
    const geometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
        
        velocities[i3] = (Math.random() - 0.5) * 0.1;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
    const material = new THREE.PointsMaterial({
        color: colors.particles,
        size: 0.5,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    ambientParticles = new THREE.Points(geometry, material);
    scene.add(ambientParticles);
}

/**
 * Create infinite scrolling vector layers
 */
function createInfiniteVectors() {
    // Create multiple layers at different depths
    for (let layer = 0; layer < 4; layer++) {
        const layerGroup = new THREE.Group();
        const z = -20 - layer * 25;
        const patternTypes = Object.keys(vectorPatterns);
        
        for (let i = 0; i < 25; i++) {
            const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
            const pattern = vectorPatterns[patternType]();
            
            pattern.position.set(
                (Math.random() - 0.5) * 120,
                (Math.random() - 0.5) * 120,
                z + (Math.random() - 0.5) * 10
            );
            
            pattern.scale.setScalar(1 + Math.random() * 2);
            pattern.rotation.z = Math.random() * Math.PI * 2;
            
            // Make background vectors more transparent
            pattern.traverse((child) => {
                if (child.material) {
                    child.material.opacity *= (0.3 - layer * 0.05);
                }
            });
            
            layerGroup.add(pattern);
            layerGroup.userData.patterns = layerGroup.userData.patterns || [];
            layerGroup.userData.patterns.push({
                mesh: pattern,
                speed: 0.1 + Math.random() * 0.2,
                rotationSpeed: (Math.random() - 0.5) * 0.01
            });
        }
        
        scrollGroup.add(layerGroup);
    }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Custom events from main.js
    window.addEventListener("sceneInteractionEnabled", () => {
        isInteractive = true;
        document.getElementById('canvas').classList.add('interactive');
    });

    window.addEventListener("sceneInteractionDisabled", () => {
        isInteractive = false;
        isDragging = false;
        document.getElementById('canvas').classList.remove('interactive', 'grabbing');
    });

    // Mouse events
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Touch events
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    // Scroll event
    window.addEventListener("scroll", handleScroll);

    // Resize
    window.addEventListener("resize", handleResize);
}

/**
 * Mouse event handlers
 */
function handleMouseDown(e) {
    if (!isInteractive) return;
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
    document.getElementById('canvas').classList.add('grabbing');
}

function handleMouseMove(e) {
    if (!isInteractive || !isDragging) return;

    const deltaX = e.clientX - previousMouseX;
    const deltaY = e.clientY - previousMouseY;

    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;
    targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX));

    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
}

function handleMouseUp() {
    isDragging = false;
    document.getElementById('canvas').classList.remove('grabbing');
}

/**
 * Touch event handlers
 */
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
    if (!isInteractive) return;
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!isInteractive) return;
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;

    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;
    targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX));

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchEnd() {
    // Touch end handling
}

/**
 * Handle scroll for parallax effect
 */
function handleScroll() {
    scrollY = window.scrollY;
    scrollVelocity = scrollY - lastScrollY;
    lastScrollY = scrollY;
}

/**
 * Handle window resize
 */
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Animation loop
 */
function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth rotation transitions
    currentRotationX += (targetRotationX - currentRotationX) * 0.05;
    currentRotationY += (targetRotationY - currentRotationY) * 0.05;

    // Apply rotations based on interaction mode
    if (isInteractive) {
        sphereGroup.rotation.x = currentRotationX;
        sphereGroup.rotation.y = currentRotationY;
    } else {
        // Auto-rotation when not interactive
        sphereGroup.rotation.y = elapsedTime * 0.1;
        sphereGroup.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;
    }

    // Scroll-based animations
    const scrollProgress = scrollY / window.innerHeight;
    
    // Parallax effect on scroll
    scrollGroup.position.y = scrollY * 0.1;
    scrollGroup.rotation.z = scrollVelocity * 0.001;
    
    // Scale sphere based on scroll
    const scale = 1 + scrollProgress * 0.3;
    sphereGroup.scale.set(scale, scale, scale);

    // Animate vector patterns
    vectorGroups.forEach((group, index) => {
        // Rotate patterns
        group.mesh.rotation.z += group.rotationSpeed;
        
        // Pulse effect
        const pulse = Math.sin(elapsedTime * group.pulseSpeed + index) * 0.1 + 1;
        group.mesh.scale.setScalar(group.initialScale * pulse);
        
        // Float effect
        group.mesh.position.y += Math.sin(elapsedTime + group.floatOffset) * 0.01;
        
        // Change opacity based on scroll
        group.mesh.traverse((child) => {
            if (child.material && child.material.opacity !== undefined) {
                child.material.opacity = Math.max(0.1, (0.8 - scrollProgress * 0.4) * child.material.userData?.initialOpacity || 1);
            }
        });
        
        // Animate data flow packets
        if (group.type === 'dataFlow' && group.mesh.userData.packets) {
            group.mesh.userData.packets.forEach(packet => {
                packet.userData.progress += 0.01;
                if (packet.userData.progress > 1) packet.userData.progress = 0;
                
                const point = packet.userData.curve.getPointAt(packet.userData.progress);
                packet.position.copy(point);
            });
        }
    });

    // Animate particles
    if (particles) {
        particles.rotation.y = elapsedTime * 0.05;
        particles.rotation.x = elapsedTime * 0.03;
        
        // Wave motion for particles
        const positions = particles.geometry.attributes.position.array;
        const originalPositions = particles.geometry.userData.originalPositions;
        
        if (!originalPositions) {
            particles.geometry.userData.originalPositions = new Float32Array(positions);
        } else {
            for (let i = 0; i < positions.length; i += 3) {
                const waveX = Math.sin(elapsedTime + originalPositions[i] * 0.01) * 0.5;
                const waveY = Math.cos(elapsedTime + originalPositions[i + 1] * 0.01) * 0.5;
                
                positions[i] = originalPositions[i] + waveX;
                positions[i + 1] = originalPositions[i + 1] + waveY;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    // Animate ambient particles
    if (ambientParticles) {
        const positions = ambientParticles.geometry.attributes.position.array;
        const velocities = ambientParticles.geometry.attributes.velocity.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
            
            // Wrap around
            if (Math.abs(positions[i]) > 50) positions[i] *= -0.9;
            if (Math.abs(positions[i + 1]) > 50) positions[i + 1] *= -0.9;
            if (Math.abs(positions[i + 2]) > 50) positions[i + 2] *= -0.9;
        }
        ambientParticles.geometry.attributes.position.needsUpdate = true;
        ambientParticles.rotation.y = elapsedTime * 0.02;
    }
    
    // Animate infinite scrolling layers
    scrollGroup.children.forEach((layer, layerIndex) => {
        if (layer.userData.patterns) {
            layer.userData.patterns.forEach(pattern => {
                pattern.mesh.rotation.z += pattern.rotationSpeed;
                pattern.mesh.position.y -= pattern.speed * (1 + scrollVelocity * 0.1);
                
                // Reset position if moved too far
                if (pattern.mesh.position.y < -60) {
                    pattern.mesh.position.y = 60;
                }
            });
        }
    });

    // Render scene
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThreeScene);
} else {
    initThreeScene();
}