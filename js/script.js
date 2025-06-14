let scene, camera, renderer, codeBlocks = [], particleSystem;
let mouseX = 0, mouseY = 0;

window.onload = () => {
  initMatrixRain();
  initThreeJS();
  loadCertificates();
  loadProjects();
};

function initThreeJS() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 10, 100);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0.1);

  scene.add(new THREE.AmbientLight(0x404040, 0.4));

  const pointLight = new THREE.PointLight(0x00ff88, 1, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  createCodeBlocks();
  createTerminalWindows();
  createCircuitBoard();
  createParticleSystem();
  createFloatingShapes();

  animate();
}

function createCodeBlocks() {
  const codeTexts = ['function()', 'if(true)', 'for(i=0)', 'while()', 'class', 'return', '{data}', '[array]', 'var x=0', 'console.log', 'async', 'await'];
  for (let i = 0; i < 100; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#00ff00';
    ctx.font = '20px Courier';
    ctx.fillText(codeTexts[Math.floor(Math.random() * codeTexts.length)], 10, 60);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.8 });
    const block = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), material);

    block.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    block.rotation.x = Math.random() * Math.PI;
    block.rotation.y = Math.random() * Math.PI;
    block.floatSpeed = Math.random() * 0.02 + 0.01;

    codeBlocks.push(block);
    scene.add(block);
  }
}

function createTerminalWindows() {
  for (let i = 0; i < 20; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 384);
    ctx.strokeStyle = '#00ff00';
    ctx.strokeRect(0, 0, 512, 384);
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px Courier';
    ctx.fillText('root@matrix:~$ ls -la', 10, 30);
    ctx.fillText('drwxr-xr-x barath users', 10, 60);
    ctx.fillText('-rw-r--r-- portfolio.js', 10, 90);
    ctx.fillText('> executing...', 10, 120);

    const material = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, opacity: 0.7 });
    const terminal = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), material);
    terminal.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40);
    scene.add(terminal);
  }
}

function createCircuitBoard() {
  const geometry = new THREE.PlaneGeometry(200, 200, 20, 20);
  const material = new THREE.MeshBasicMaterial({ color: 0x003300, wireframe: true, transparent: true, opacity: 0.2 });
  const circuit = new THREE.Mesh(geometry, material);
  circuit.rotation.x = -Math.PI / 2;
  circuit.position.y = -50;
  scene.add(circuit);
}

function createParticleSystem() {
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(1000 * 3);
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = (Math.random() - 0.5) * 100;
    positions[i + 2] = (Math.random() - 0.5) * 100;
  }
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ color: 0x00ff88, size: 0.5, transparent: true, opacity: 0.8 });
  particleSystem = new THREE.Points(particles, material);
  scene.add(particleSystem);
}

function createFloatingShapes() {
  const torus = new THREE.Mesh(new THREE.TorusGeometry(2, 0.5, 16, 100), new THREE.MeshPhongMaterial({ color: 0x0099ff, transparent: true, opacity: 0.7 }));
  torus.position.set(-15, 5, -10);
  scene.add(torus);

  const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(3), new THREE.MeshPhongMaterial({ color: 0x00ff88, transparent: true, opacity: 0.6 }));
  octahedron.position.set(15, -5, -15);
  scene.add(octahedron);

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshPhongMaterial({ color: 0xff6600, transparent: true, opacity: 0.5 }));
  sphere.position.set(0, 10, -20);
  scene.add(sphere);
}

function animate() {
  requestAnimationFrame(animate);

  codeBlocks.forEach((block, index) => {
    block.rotation.x += 0.005;
    block.rotation.y += 0.01;
    block.position.y += Math.sin(Date.now() * block.floatSpeed + index) * 0.1;
    if (Math.random() < 0.001) block.material.opacity = Math.random() * 0.5 + 0.5;
  });

  if (particleSystem) {
    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.x += 0.0005;
  }

  scene.children.forEach((child, index) => {
    if (child.type === 'Mesh' && !codeBlocks.includes(child)) {
      child.rotation.x += 0.01;
      child.rotation.y += 0.01;
      child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
    }
  });

  camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 0.1 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = '01アカサタナハマヤラワンABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const drops = Array(Math.floor(canvas.width / 14)).fill(0);

  setInterval(() => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px Courier';
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y);
      drops[i] = (y > canvas.height && Math.random() > 0.975) ? 0 : y + 14;
    });
  }, 35);
}

// Function to load project cards
function loadProjects() {
  fetch('/static/data/pro.json')
    .then(response => response.json())
    .then(data => {
      const grid = document.getElementById('projectsGrid');
      grid.innerHTML = ''; // Clear existing projects
      data.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <h3>${project.title}</h3><br>
          <p>${project.description}</p><br>
          <p><strong>Tech:</strong> ${project.tech}</p>
          <div class="project-buttons">
            <a href="${project.github}" target="_blank">GitHub</a>
            <a href="${project.demo}" target="_blank">Live Demo</a>
          </div>
        `;
        grid.appendChild(card);
      });
    })
    .catch(error => {
      console.log('Projects data not found:', error);
    });
}

// Function to load certificate cards
function loadCertificates() {
  fetch('/static/data/cert.json')
    .then(response => response.json())
    .then(data => {
      const grid = document.getElementById('certificatesGrid');
      grid.innerHTML = ''; // Clear existing certificates
      data.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'certificate-card';
        card.innerHTML = `
          <h3>${cert.title}</h3>
          <p>${cert.organization} - ${cert.year}</p>
          <a href="${cert.link}" target="_blank">View Certificate</a>
        `;
        grid.appendChild(card);
      });
    })
    .catch(error => {
      console.log('Certificates data not found:', error);
    });
}

document.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const canvas = document.getElementById('matrix-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Mobile Sidebar Class
class SimpleMobileSidebar {
    constructor() {
        this.menuBtn = document.getElementById('menuBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('sidebarOverlay');
        this.body = document.body;
        
        this.init();
    }
    
    init() {
        // Menu button click
        this.menuBtn.addEventListener('click', () => this.openSidebar());
        
        // Close button click
        this.closeBtn.addEventListener('click', () => this.closeSidebar());
        
        // Overlay click
        this.overlay.addEventListener('click', () => this.closeSidebar());
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });
        
        // Close sidebar when clicking menu links
        const menuLinks = this.sidebar.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => this.closeSidebar());
        });
        
        // Close sidebar on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });
    }
    
     openSidebar() {
        this.sidebar.classList.add('active');
        this.overlay.classList.add('active');
        this.body.classList.add('no-scroll');
        this.menuBtn.style.display = 'none';
        console.log('Sidebar opened'); 
    }
    
    closeSidebar() {
        this.sidebar.classList.remove('active');
        this.overlay.classList.remove('active');
        this.body.classList.remove('no-scroll');
        this.menuBtn.style.display = 'flex';
        console.log('Sidebar closed'); 
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing sidebar'); 
    new SimpleMobileSidebar();
});