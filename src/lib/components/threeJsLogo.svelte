<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';

  let canvas;
  let renderer, scene, camera, sphere, octahedron, octahedron2, octahedron3;
  let animationFrameId;

  onMount(() => {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true, // Transparent background
      antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    let viewportSize = new THREE.Vector2();
    renderer.getSize(viewportSize);

    // Custom shader material
    const customShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: viewportSize }
      },
      vertexShader: `
          uniform float time;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          varying float vEdgeSharpness;
          varying vec3 vModelPosition;
          
          void main() {
              vUv = uv;
              
              // Calculate world position for better spatial variation
              vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
              vModelPosition = position;

              // Pass the normal and calculate edge factors
              vNormal = normalize(normalMatrix * normal);
              
              // Enhanced edge detection for octahedron
              vec3 worldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
              vEdgeSharpness = 1.0 - pow(abs(dot(worldNormal, vec3(0.0, 1.0, 0.0))), 0.5);
              
              // static
              vec3 transformed = position + normal * 0.001 * 0.1;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0); 
          }
        `,
      fragmentShader: `
          uniform float time;
          uniform vec2 resolution;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          varying vec3 vModelPosition;
          
          #define ITERS 6
          const float scale = 2.;
          const float scale1 = 1.15;
          
          // Function to create seamless 3D coordinates
          vec2 getSeamlessCoords() {
              // Use a combination of model position and normal to create stable coordinates
              vec3 baseCoord = vModelPosition + vNormal * 0.5;
              
              // Project the position onto a sphere
              vec3 sphereCoord = normalize(baseCoord);
              
              // Convert to UV space while maintaining continuity
              vec2 uv;
              uv.x = atan(sphereCoord.z, sphereCoord.x) / (2.0 * 3.14159) + 0.5;
              uv.y = asin(sphereCoord.y) / 3.14159 + 0.5;
              
              return uv;
          }
          
          void main() {
              vec4 fragColor = vec4(0.0);
              vec3 col = vec3(0.0), col_prev = vec3(0.0);
              
              // Get seamless coordinates
              vec2 baseUV = getSeamlessCoords();
              
              // Scale UV and add time-based movement
              vec2 uv = baseUV * 10.0 / 15.0;
              
              // Add time-based animation that follows the rotation
              float rotationOffset = atan(vWorldPosition.z, vWorldPosition.x) / (2.0 * 3.14159);
              uv.y += time / 25.0 + rotationOffset;
              
              float s1 = scale1 * scale + uv.y + time / 4.0;
              
              for(int c = 0; c < ITERS; c++) {
                  col_prev = col;
                  for(int i = 0; i < ITERS; i++) {
                      uv = -fract(-uv-((vec2(uv.x/scale-uv.y/scale1, uv.y/scale-uv.x/scale1)/(scale))))/scale1;
                      uv.x *= -scale1;
                      uv = fract(uv.yx/s1) * s1;
                      uv.y /= scale1;
                  }
                  col[2] = abs(fract(uv.y)-fract(uv.x));
                  col = ((col + col_prev.yzx)) / 2.125;
              }
              
              // Add normal-based shading for depth
              float ndotl = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0)));
              vec3 finalColor = col * 3.0 * (0.8 + 0.2 * ndotl);
              
              fragColor = vec4(finalColor, 1.0);
              gl_FragColor = fragColor;
          }
        `
    });

    const customShaderMaterial2 = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xc0c0c0) },
        color2: { value: new THREE.Color(0x2ecc71) }
      },
      vertexShader: `
          uniform float time;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vEdgeSharpness;
  
          void main() {
            vUv = uv;
            // pulse effect
            //vec3 transformed = position + normal * sin(time + length(position)) * 0.1;
            //gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  
            // Pass the normal
            vNormal = normalMatrix * normal;
            
            // Pass the vertex position
            vPosition = position;
  
            // Calculate edge sharpness based on normal
            vEdgeSharpness = 1.0 - dot(normalize(normal), vec3(0.0, 1.0, 0.0));
  
            //static
            vec3 transformed = position + normal * 0.001 * 0.1;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);          
          }
        `,
      fragmentShader: `
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying float vEdgeSharpness;
          
          float rand(vec2 p) {
              return fract(sin(dot(p, vec2(12.99, 78.233))) * 25558.545);
          }
          
          float noise(vec2 p) {
              vec2 f = fract(p);
              f = f * f * f * f * (3. - 2. * f) * (3. - 2. * f);
              vec2 i = floor(p);
              return mix(mix(rand(i + vec2(0, 0)), 
                             rand(i + vec2(1, 0)), f.x),
                         mix(rand(i + vec2(0, 1)), 
                             rand(i + vec2(1, 1)), f.x), f.y);
          }
          
          float fbm(vec2 p) {
              float v = 0.;
              float a = 1.;
              for(int i = 0; i < 4; ++i) {
                  p = 1.5 * p + 15.;
                  a *= 0.5;
                  v += a * noise(p);
              }
              return v;
          }
          // -----------------------------------------------
  
          void main() {
            
            // Calculate spherical coordinates from position
            vec2 sphericalCoords = vec2(
                atan(vPosition.x, vPosition.z) / (2.0 * 3.14159) + 0.5,
                asin(normalize(vPosition).y) / 3.14159 + 0.5
            );            
  
            // Use combination of UV and spherical coordinates for better 3D distribution
            vec2 p = sphericalCoords * 10.0;
            
            // Keep your original noise calculations but incorporate normal and position
            float normalEffect = dot(normalize(vNormal), vec3(0.0, 1.0, 0.0));
            vec2 r1 = vec2(fbm(p + vec2(time * 0.5, 0.0)), fbm(p + vec2(0.0, time * 0.3)));
            vec2 r2 = vec2(fbm(p + vec2(time * 0.2) + r1 * 2.0), 
                           fbm(p + vec2(time * 0.4) + r1 * 2.0));
            
            // Your original color calculation
            gl_FragColor = vec4(1.8 * pow(fbm(p + r2), 2.) + 0.03);
          }
        `
    });

    const originalPositions = {
      camera: new THREE.Vector3(0, 0, 5),
      sphere: new THREE.Vector3(0, 0, -1),
      octahedronParent: new THREE.Vector3(0, 0, -1),
      octahedron: new THREE.Vector3(3, 0, 1)
    };

    // Create geometries
    const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
    const octahedronGeometry = new THREE.OctahedronGeometry(0.8);
    //const octahedronGeometry2 = new THREE.OctahedronGeometry(0.4);
    //const octahedronGeometry3 = new THREE.OctahedronGeometry(0.6);

    // Create meshes with custom shader material
    sphere = new THREE.Mesh(sphereGeometry, customShaderMaterial2);
    const octahedronParent = new THREE.Object3D();
    octahedron = new THREE.Mesh(octahedronGeometry, customShaderMaterial);
    //octahedron2 = new THREE.Mesh(octahedronGeometry2, customShaderMaterial.clone());
    //octahedron3 = new THREE.Mesh(octahedronGeometry3, customShaderMaterial.clone());
    octahedronParent.add(octahedron);

    // Positioning
    camera.position.z = 5;
    sphere.position.set(0, 0, -1);
    octahedronParent.position.set(0, 0, -1);
    octahedronParent.rotation.x += 6.5;
    // octahedronParent.rotation.y += 7.0;

    // sphere.rotation.x += -5.0;
    octahedron.position.set(3, 0, 1);
    //octahedron2.position.set(-2, -1, 1);
    // octahedron2.rotation.x += 5.0;
    // octahedron2.rotation.y += 2.0;
    //octahedron3.position.set(-1, 1, 1);
    // octahedron3.rotation.x += 5.0;

    // Add to scene
    scene.add(sphere);
    scene.add(octahedronParent);
    // scene.add(octahedron);
    //scene.add(octahedron2);
    //scene.add(octahedron3);

    // Animation loop
    function animate(time) {
      animationFrameId = requestAnimationFrame(animate);

      customShaderMaterial.uniforms.time.value = time * 0.001;
      customShaderMaterial2.uniforms.time.value = time * 0.001;

      // Rotate objects
      // sphere.rotation.x += 0.005;
      // sphere.rotation.y += 0.005;
      // octahedron.rotation.x -= 0.004;
      // octahedron.rotation.y -= 0.002;
      octahedronParent.rotateY(0.004);
      // octahedron2.rotation.y += 0.004;
      // octahedron3.rotation.y += 0.004;

      // Update shader time uniform
      octahedron.material.uniforms.time.value = time * 0.001;
      //octahedron2.material.uniforms.time.value = time * 0.001;
      //octahedron3.material.uniforms.time.value = time * 0.001;

      renderer.render(scene, camera);
    }

    animate(0);

    // Responsive handling original
    function handleResize() {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    window.addEventListener('resize', handleResize);
  });

  onDestroy(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    // Cleanup resources
    if (renderer) {
      renderer.dispose();
    }
    if (sphere) {
      sphere.geometry.dispose();
      sphere.material.dispose();
    }
    if (octahedron) {
      octahedron.geometry.dispose();
      octahedron.material.dispose();
    }
    // if (octahedron2) {
    //   octahedron2.geometry.dispose();
    //   octahedron2.geometry.dispose();
    // }
    // if (octahedron3) {
    //   octahedron3.geometry.dispose();
    //   octahedron3.geometry.dispose();
    // }
  });
</script>

<div class="logo-parent">
  <canvas bind:this={canvas} class="logo-canvas"></canvas>
</div>

<style>
  .logo-parent {
    width: 100%;
    height: 300px;
    display: block;

    position: relative;
  }

  .logo-canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 100%;
    height: 300px;
    display: block;
  }
</style>
