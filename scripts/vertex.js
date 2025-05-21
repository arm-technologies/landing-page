const spaceStarsVertex = `
  attribute float scale;
  uniform float uTime;

  void main() {
    vec3 p = position;
    float s = scale;

    // Floating movement
    p.y += sin(p.x * 0.05 + uTime * 0.2) * 0.1;
    p.x += cos(p.z * 0.05 + uTime * 0.1) * 0.1;

    // Fix twinkle: make small stars twinkle much slower + lower amplitude
    float minTwinkleSpeed = 0.02;
    float maxTwinkleSpeed = 0.4;
    float speedFactor = smoothstep(0.0, 4.0, scale); // 0 for tiny, 1 for large
    float twinkleSpeed = mix(minTwinkleSpeed, maxTwinkleSpeed, speedFactor);

    float minTwinkleAmp = 0.05;
    float maxTwinkleAmp = 0.6;
    float twinkleAmp = mix(minTwinkleAmp, maxTwinkleAmp, speedFactor);

    s *= 0.5 + abs(sin(uTime * twinkleSpeed + p.x * p.z)) * twinkleAmp;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp(s * 2.0 * (150.0 / -mvPosition.z), 1.5, 20.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const blueStarsFragment = `
  void main() {
    float distance = length(gl_PointCoord - vec2(0.5));
    if (distance > 0.5) discard;
    
    // Create a glow effect for stars
    float intensity = 0.85 - distance * 1.7; // Slightly reduced intensity
    
    // Blue stars with variation
    vec3 baseColor = vec3(0.4, 0.7, 1.0); // Base blue color
    
    // Add some variation in the blue tones
    float variation = gl_PointCoord.x * 0.4;
    vec3 color = baseColor + vec3(-0.2, 0.0, variation);
    
    gl_FragColor = vec4(color, intensity);
  }
`;

const yellowStarsFragment = `
  void main() {
    float distance = length(gl_PointCoord - vec2(0.5));
    if (distance > 0.5) discard;
    
    // Create a glow effect for stars
    float intensity = 0.85 - distance * 1.7; // Slightly reduced intensity
    
    // Yellow/gold stars with variation
    vec3 baseColor = vec3(1.0, 0.9, 0.4); // Base yellow/gold color
    
    // Add some variation in the yellow tones
    float variation = gl_PointCoord.y * 0.3;
    vec3 color = baseColor + vec3(variation, 0.0, -0.2);
    
    gl_FragColor = vec4(color, intensity);
  }
`;

const mixedStarsFragment = `
  void main() {
    float distance = length(gl_PointCoord - vec2(0.5));
    if (distance > 0.5) discard;
    
    // Create a glow effect for stars
    float intensity = 0.85 - distance * 1.7; // Slightly reduced intensity
    
    // Mix of star colors - whites, blues and yellows
    // Use the point position to determine color
    float colorDeterminer = fract(gl_PointCoord.x * 10.0) * 3.0; // Value 0-3
    
    vec3 color;
    
    if (colorDeterminer < 1.0) {
      // Blue stars
      color = vec3(0.4, 0.7, 1.0);
    } else if (colorDeterminer < 2.0) {
      // Yellow stars
      color = vec3(1.0, 0.9, 0.4);
    } else {
      // White stars (most common)
      color = vec3(1.0, 1.0, 1.0);
    }
    
    gl_FragColor = vec4(color, intensity);
  }
`;

class Canvas {
  constructor(colorOption = 'mixed') {
    this.config = {
      canvas: document.querySelector('#background-dots'),
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
      aspectRatio: window.innerWidth / window.innerHeight,
      mouse: new THREE.Vector2(-10, -10),
      colorOption: colorOption
    };

    this.onResize = this.onResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.animate = this.animate.bind(this);

    this.initCamera();
    this.initScene();
    this.initRenderer();
    this.initStars();
    this.bindEvents();
    this.animate();
  }

  getFragmentShader() {
    switch(this.config.colorOption) {
      case 'blue':
        return blueStarsFragment;
      case 'yellow':
        return yellowStarsFragment;
      case 'mixed':
      default:
        return mixedStarsFragment;
    }
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove, false);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(80, this.config.aspectRatio, 0.1, 2000);
    this.camera.position.set(0, 0, 30);
    this.camera.lookAt(0, 0, 0);
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.config.canvas,
      antialias: true,
      alpha: true
    });
    
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.config.winWidth, this.config.winHeight);
    this.renderer.setClearColor(0x000000, 1.0);
  }

  initStars() {
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    const starScales = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      const radius = 100 + Math.random() * 900;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
      
      const baseSize = Math.random();
      starScales[i] = baseSize * baseSize * 3.5 + 0.5;
    }

    this.starGeometry = new THREE.BufferGeometry();
    this.starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    this.starGeometry.setAttribute('scale', new THREE.BufferAttribute(starScales, 1));

    this.starMaterial = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: spaceStarsVertex,
      fragmentShader: this.getFragmentShader(),
      blending: THREE.AdditiveBlending,
      depthTest: false,
      uniforms: {
        uTime: { type: 'f', value: 0 }
      }
    });

    this.stars = new THREE.Points(this.starGeometry, this.starMaterial);
    this.scene.add(this.stars);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this.stars.rotation.y += 0.0001;
    this.stars.rotation.x += 0.00005;
    
    this.starMaterial.uniforms.uTime.value += 0.01;
    
    if (this.config.mouse.x > -1 && this.config.mouse.x < 1) {
      this.camera.position.x = lerp(this.camera.position.x, this.config.mouse.x * 2, 0.01);
      this.camera.position.y = lerp(this.camera.position.y, this.config.mouse.y * 2, 0.01);
      this.camera.lookAt(0, 0, 0);
    }
    
    requestAnimationFrame(this.animate);
    this.render();
  }

  onMouseMove(e) {
    this.config.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.config.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onResize() {
    this.config.winWidth = window.innerWidth;
    this.config.winHeight = window.innerHeight;
    this.camera.aspect = this.config.winWidth / this.config.winHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.config.winWidth, this.config.winHeight);
  }
}

function lerp(start, end, amount) {
  return (1 - amount) * start + amount * end;
}

// =====================================================================
// CHOOSE COLOR OPTION
// =====================================================================
// To use yellow stars:
// new Canvas('yellow');

// To use blue stars:
new Canvas('blue');

// To use mixed colors (default):
// new Canvas('mixed');
