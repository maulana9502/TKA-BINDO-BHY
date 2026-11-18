import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CHAPTERS } from '../data/curriculum';
import type {
  AvatarConfig,
  ChapterData,
  LocalWeatherState,
  RemotePlayer,
  TimeOfDayMode,
} from '../types/game';
import { animateAvatarRig, buildRobloxAvatar, createNametagTexture, type AvatarRig } from './AvatarBuilder';

export const VERSUS_BUILDING_POS = { x: 0, z: 106, rotY: Math.PI };

export interface WorldCallbacks {
  onNearbyBuildingChange: (chapter: ChapterData | null) => void;
  onEnterBuilding: (chapter: ChapterData) => void;
  onNearbyVersusChange: (near: boolean) => void;
  onEnterVersus: () => void;
  onInteriorStationInteract: (station: 'video' | 'quiz' | 'archive' | 'exit') => void;
  onPlayerMove: (pos: { x: number; y: number; z: number; rotY: number; isMoving: boolean }) => void;
}

interface BuildingVisual {
  chapter: ChapterData;
  group: THREE.Group;
  beaconGroup: THREE.Group;
  starMesh: THREE.Mesh;
  portalRing: THREE.Mesh;
  windowMats: THREE.MeshStandardMaterial[];
}

interface TrafficCar {
  group: THREE.Group;
  wheels: THREE.Mesh[];
  axis: 'z' | 'x';
  laneCoord: number;
  dir: 1 | -1;
  pos: number;
  speed: number;
  maxSpeed: number;
}

interface TrafficLightVisual {
  redMat: THREE.MeshStandardMaterial;
  yellowMat: THREE.MeshStandardMaterial;
  greenMat: THREE.MeshStandardMaterial;
  axis: 'z' | 'x';
}

interface InteriorStation {
  type: 'video' | 'quiz' | 'archive' | 'exit';
  pos: THREE.Vector3;
  mesh: THREE.Object3D;
  label: string;
}

// Pre-allocated math objects to avoid GC in animation loop
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _moveVec = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _camDesired = new THREE.Vector3();
const _skyMorning = new THREE.Color('#93c5fd');
const _skyDay = new THREE.Color('#7dd3fc');
const _skyAfternoon = new THREE.Color('#fb923c');
const _skyNight = new THREE.Color('#0b1120');
const _skyCloudy = new THREE.Color('#94a3b8');
const _skyRain = new THREE.Color('#475569');
const _skyHot = new THREE.Color('#bae6fd');
const _fogColor = new THREE.Color();
const _hemiSkyDay = new THREE.Color('#e0f2fe');
const _hemiSkyAfternoon = new THREE.Color('#fed7aa');
const _hemiSkyNight = new THREE.Color('#1e293b');
const _sunColorMorning = new THREE.Color('#fef3c7');
const _sunColorDay = new THREE.Color('#fffbeb');
const _sunColorAfternoon = new THREE.Color('#fdba74');
const _sunColorNight = new THREE.Color('#93c5fd');

export class WorldEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private isSoftwareGl = false;
  private frameId = 0;
  private disposed = false;

  // Scene groups
  private cityGroup = new THREE.Group();
  private interiorGroup = new THREE.Group();
  private currentInteriorChapter: ChapterData | null = null;
  private interiorStations: InteriorStation[] = [];
  private interiorPlayerPos = new THREE.Vector3(0, 0, 7);
  private interiorPlayerRot = Math.PI;

  // Lighting, Sky & Weather
  private sunLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  private sunOrb!: THREE.Mesh;
  private starsPoints!: THREE.Points;
  private streetlampBulbs: THREE.MeshStandardMaterial[] = [];
  private roadMats: THREE.MeshStandardMaterial[] = [];
  private rainLines!: THREE.LineSegments;
  private rainPositions!: Float32Array;
  private rainCount = 420;
  private timeMode: TimeOfDayMode = 'real';
  private weatherState: LocalWeatherState = {
    condition: 'clear',
    temperatureC: 29,
    label: 'Cerah',
    locationLabel: 'Cuaca Lokal',
    timePeriod: 'Siang',
    localHour: new Date().getHours() + new Date().getMinutes() / 60,
  };

  // World entities
  private buildings: BuildingVisual[] = [];
  private buildingColliders: { minX: number; maxX: number; minZ: number; maxZ: number }[] = [];
  private cars: TrafficCar[] = [];
  private trafficLights: TrafficLightVisual[] = [];
  private fountainWater!: THREE.Mesh;
  private versusCrownMesh?: THREE.Mesh;
  private versusPortalRing?: THREE.Mesh;
  private versusWindowMats: THREE.MeshStandardMaterial[] = [];

  // Local player
  private localRig!: AvatarRig;
  private localPos = new THREE.Vector3(0, 0, 12);
  private localRotY = Math.PI;
  private localMeta = {
    name: 'Siswa',
    className: 'VIII-A',
    level: 1,
    completedCount: 0,
    answeredCount: 0,
  };
  private completedSet = new Set<number>();

  // Remote multiplayer rigs
  private remoteRigs = new Map<string, { rig: AvatarRig; targetPos: THREE.Vector3; targetRotY: number; lastMoving: boolean }>();

  // Controls & Camera orbit
  private keys: Record<string, boolean> = {};
  private joystickVec = { x: 0, y: 0 };
  private cameraYaw = 0;
  private cameraPitch = 0.42;
  private cameraDistance = 12.5;
  private isDragging = false;
  private activePointerId: number | null = null;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private pointerDownX = 0;
  private pointerDownY = 0;

  // Raycasting for 3D building / station tap
  private raycaster = new THREE.Raycaster();
  private pointerNdc = new THREE.Vector2();
  private callbacks: WorldCallbacks;
  private lastNearbyId: number | null = null;
  private lastNearbyVersus = false;
  private lastSyncSentAt = 0;

  constructor(
    container: HTMLElement,
    initialAvatar: AvatarConfig,
    initialMeta: { name: string; className: string; level: number; completedCount: number; answeredCount: number },
    callbacks: WorldCallbacks
  ) {
    this.container = container;
    this.localMeta = { ...initialMeta };
    this.callbacks = callbacks;

    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#7dd3fc');
    this.scene.fog = new THREE.FogExp2('#7dd3fc', 0.0042);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(
      58,
      (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight),
      0.2,
      450
    );

    this.setupLighting();
    this.buildSkyAndPerimeter();
    this.buildRoadNetworkAndSidewalks();
    this.buildCentralFountain();
    this.buildParkAndTrees();
    this.buildTrafficLightsAndCars();
    this.buildChapterBuildings();
    this.buildVersusBuilding();
    this.buildRainSystem();
    this.buildInteriorTemplate();

    this.scene.add(this.cityGroup);
    this.interiorGroup.visible = false;
    this.scene.add(this.interiorGroup);

    this.localRig = buildRobloxAvatar(initialAvatar, this.localMeta);
    this.localRig.group.position.copy(this.localPos);
    this.localRig.group.rotation.y = this.localRotY;
    this.scene.add(this.localRig.group);

    this.bindEvents();

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.tick();
  }

  private setupLighting(): void {
    this.hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.78);
    this.hemiLight.position.set(0, 80, 0);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.65);
    this.sunLight.position.set(60, 90, 45);
    this.sunLight.castShadow = !this.isSoftwareGl;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    const d = 110;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.camera.near = 5;
    this.sunLight.shadow.camera.far = 260;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);
  }

  private buildSkyAndPerimeter(): void {
    // Sun / Moon orb
    this.sunOrb = new THREE.Mesh(
      new THREE.SphereGeometry(7, 20, 20),
      new THREE.MeshBasicMaterial({ color: '#fef08a' })
    );
    this.sunOrb.position.set(80, 120, -140);
    this.scene.add(this.sunOrb);

    // Night starfield
    const starCount = 320;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.42;
      const r = 210;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 25 + r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.starsPoints = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: '#ffffff', size: 1.4, transparent: true, opacity: 0 })
    );
    this.scene.add(this.starsPoints);

    // Extended terrain base (no empty void)
    const grassTex = this.createGrassTexture();
    const groundMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.92,
      metalness: 0.02,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(520, 520), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.cityGroup.add(ground);

    // Rolling perimeter hills & distant city skyline silhouettes
    const hillMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.9, metalness: 0.02 });
    const skylineMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.75, metalness: 0.15 });
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const dist = 175 + (i % 3) * 18;
      const hill = new THREE.Mesh(new THREE.ConeGeometry(28 + (i % 4) * 8, 16 + (i % 3) * 6, 7), hillMat);
      hill.position.set(Math.cos(angle) * dist, 7, Math.sin(angle) * dist);
      this.cityGroup.add(hill);

      if (i % 2 === 0) {
        const tower = new THREE.Mesh(
          new THREE.BoxGeometry(14 + (i % 3) * 4, 28 + (i % 5) * 9, 14),
          skylineMat
        );
        tower.position.set(Math.cos(angle + 0.12) * (dist - 18), 14 + (i % 5) * 4, Math.sin(angle + 0.12) * (dist - 18));
        this.cityGroup.add(tower);
      }
    }
  }

  private createGrassTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(21,128,61,0.22)' : 'rgba(134,239,172,0.16)';
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 4, 4);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(42, 42);
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  private createAsphaltTexture(horizontal: boolean): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle aggregate grain
    for (let i = 0; i < 650; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.08)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
    }

    // Yellow double center divider & white lane edges
    if (horizontal) {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, 248, 512, 5);
      ctx.fillRect(0, 259, 512, 5);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 22, 512, 6);
      ctx.fillRect(0, 484, 512, 6);
    } else {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(248, 0, 5, 512);
      ctx.fillRect(259, 0, 5, 512);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(22, 0, 6, 512);
      ctx.fillRect(484, 0, 6, 512);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  private buildRoadNetworkAndSidewalks(): void {
    const roadMatNS = new THREE.MeshStandardMaterial({
      map: this.createAsphaltTexture(false),
      roughness: 0.85,
      metalness: 0.05,
    });
    (roadMatNS.map as THREE.CanvasTexture).repeat.set(1, 14);

    const roadMatEW = new THREE.MeshStandardMaterial({
      map: this.createAsphaltTexture(true),
      roughness: 0.85,
      metalness: 0.05,
    });
    (roadMatEW.map as THREE.CanvasTexture).repeat.set(12, 1);
    this.roadMats.push(roadMatNS, roadMatEW);

    // Main N-S Boulevard
    const mainRoad = new THREE.Mesh(new THREE.BoxGeometry(16, 0.06, 260), roadMatNS);
    mainRoad.position.set(0, 0.03, 0);
    mainRoad.receiveShadow = true;
    this.cityGroup.add(mainRoad);

    // E-W Cross Avenues at z = -40, 0, 40, 80
    const crossZ = [-40, 0, 40, 80];
    for (const z of crossZ) {
      const road = new THREE.Mesh(new THREE.BoxGeometry(220, 0.055, 14), roadMatEW);
      road.position.set(0, 0.028, z);
      road.receiveShadow = true;
      this.cityGroup.add(road);
    }

    // Zebra Crosswalks near intersections (offset y=0.065 to avoid Z-fighting)
    const stripeMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.7 });
    for (const z of crossZ) {
      for (let s = -5; s <= 5; s += 2) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.015, 3.2), stripeMat);
        stripe.position.set(s, 0.065, z - 8.5);
        this.cityGroup.add(stripe);
        const stripe2 = stripe.clone();
        stripe2.position.z = z + 8.5;
        this.cityGroup.add(stripe2);
      }
    }

    // Raised Sidewalks (y = 0.12)
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.82, metalness: 0.05 });
    const leftSidewalk = new THREE.Mesh(new THREE.BoxGeometry(6, 0.12, 240), sidewalkMat);
    leftSidewalk.position.set(-11, 0.06, 0);
    leftSidewalk.receiveShadow = true;
    const rightSidewalk = leftSidewalk.clone();
    rightSidewalk.position.x = 11;
    this.cityGroup.add(leftSidewalk, rightSidewalk);

    // Sidewalk pads along building fronts
    const outerSidewalkL = new THREE.Mesh(new THREE.BoxGeometry(12, 0.12, 240), sidewalkMat);
    outerSidewalkL.position.set(-34, 0.06, 15);
    outerSidewalkL.receiveShadow = true;
    const outerSidewalkR = outerSidewalkL.clone();
    outerSidewalkR.position.x = 34;
    this.cityGroup.add(outerSidewalkL, outerSidewalkR);

    // Streetlamps along main boulevard
    const poleMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.75 });
    for (let z = -95; z <= 95; z += 30) {
      if (Math.abs(z) < 12) continue;
      for (const side of [-1, 1]) {
        const lampGroup = new THREE.Group();
        lampGroup.position.set(side * 9.5, 0.12, z);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 5.2, 8), poleMat);
        pole.position.y = 2.6;
        pole.castShadow = true;
        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.1), poleMat);
        arm.position.set(-side * 0.65, 5.1, 0);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: '#fef08a',
          emissive: '#f59e0b',
          emissiveIntensity: 0.1,
          roughness: 0.2,
        });
        this.streetlampBulbs.push(bulbMat);
        const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.16, 0.28), bulbMat);
        bulb.position.set(-side * 1.15, 4.98, 0);
        lampGroup.add(pole, arm, bulb);
        this.cityGroup.add(lampGroup);
      }
    }
  }

  private buildCentralFountain(): void {
    const plaza = new THREE.Group();
    plaza.position.set(0, 0.12, 16);

    // Plaza stone circle
    const stoneMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.75 });
    const trimMat = new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.6, metalness: 0.2 });
    const waterMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      roughness: 0.1,
      metalness: 0.35,
      transparent: true,
      opacity: 0.85,
    });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 7, 0.2, 24), stoneMat);
    base.position.y = 0.1;
    base.receiveShadow = true;

    // Monument plaza placed slightly off-road in park square at (24, 0, -40)? Wait: (0,16) is on main road!
    // Let's place the Park & Fountain Plaza safely in the east park block at (26, 0, -2) so cars on main road never drive through it!
    plaza.position.set(24, 0.1, 0);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.35, 10, 24), trimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.45;
    this.fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 0.3, 24), waterMat);
    this.fountainWater.position.y = 0.36;

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.75, 2.6, 12), stoneMat);
    pillar.position.y = 1.4;
    pillar.castShadow = true;
    const topBowl = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 0.6, 0.45, 16), trimMat);
    topBowl.position.y = 2.6;
    const crown = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.85, roughness: 0.2 }));
    crown.position.y = 3.45;

    plaza.add(base, rim, this.fountainWater, pillar, topBowl, crown);
    this.cityGroup.add(plaza);
  }

  private buildParkAndTrees(): void {
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });
    const leafMat1 = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.75 });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.72 });
    const benchMat = new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.75 });
    const metalMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.4, metalness: 0.7 });

    const treePositions = [
      [-22, -78], [-22, -48], [-22, -14], [-22, 22], [-22, 58], [-22, 92],
      [22, -78], [22, -48], [22, -16], [22, 16], [22, 58], [22, 92],
      [-64, -75], [-64, -30], [-64, 15], [-64, 65],
      [64, -75], [64, -30], [64, 15], [64, 65],
      [-26, -108], [26, -108], [17, -7], [31, -7], [17, 7], [31, 7],
    ];

    for (let i = 0; i < treePositions.length; i++) {
      const [tx, tz] = treePositions[i];
      const tree = new THREE.Group();
      const s = 0.85 + (i % 4) * 0.12;
      tree.position.set(tx, 0, tz);
      tree.scale.setScalar(s);

      // Composite 4-part tree
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 2.4, 8), trunkMat);
      trunk.position.y = 1.2;
      trunk.castShadow = true;
      const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.55, 1), leafMat1);
      c1.position.set(0, 3.1, 0);
      c1.castShadow = true;
      const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.15, 1), leafMat2);
      c2.position.set(0.6, 3.9, 0.3);
      c2.castShadow = true;
      const c3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 1), leafMat2);
      c3.position.set(-0.5, 3.7, -0.35);
      c3.castShadow = true;

      tree.add(trunk, c1, c2, c3);
      this.cityGroup.add(tree);
    }

    // Park benches around central plaza
    const benchCoords = [
      { x: 18, z: 0, r: Math.PI / 2 },
      { x: 30, z: 0, r: -Math.PI / 2 },
      { x: 24, z: -6.5, r: 0 },
      { x: 24, z: 6.5, r: Math.PI },
    ];
    for (const b of benchCoords) {
      const bench = new THREE.Group();
      bench.position.set(b.x, 0.1, b.z);
      bench.rotation.y = b.r;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.14, 0.7), benchMat);
      seat.position.y = 0.5;
      const back = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.12), benchMat);
      back.position.set(0, 0.82, -0.28);
      const legL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.5, 0.6), metalMat);
      legL.position.set(-0.85, 0.25, 0);
      const legR = legL.clone();
      legR.position.x = 0.85;
      bench.add(seat, back, legL, legR);
      this.cityGroup.add(bench);
    }
  }

  private buildTrafficLightsAndCars(): void {
    const poleMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.75 });
    const housingMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.5, metalness: 0.5 });

    const lightSpots: { x: number; z: number; rotY: number; axis: 'z' | 'x' }[] = [
      { x: -9.2, z: -48.5, rotY: 0, axis: 'z' },
      { x: 9.2, z: -31.5, rotY: Math.PI, axis: 'z' },
      { x: -9.2, z: 31.5, rotY: 0, axis: 'z' },
      { x: 9.2, z: 48.5, rotY: Math.PI, axis: 'z' },
      { x: -10.5, z: -32, rotY: Math.PI / 2, axis: 'x' },
      { x: 10.5, z: 47.5, rotY: -Math.PI / 2, axis: 'x' },
    ];

    for (const spot of lightSpots) {
      const g = new THREE.Group();
      g.position.set(spot.x, 0.12, spot.z);
      g.rotation.y = spot.rotY;

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.4, 8), poleMat);
      pole.position.y = 2.2;
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.55, 0.48), housingMat);
      box.position.y = 4.6;

      const redMat = new THREE.MeshStandardMaterial({ color: '#7f1d1d', emissive: '#ef4444', emissiveIntensity: 0 });
      const yellowMat = new THREE.MeshStandardMaterial({ color: '#78350f', emissive: '#f59e0b', emissiveIntensity: 0 });
      const greenMat = new THREE.MeshStandardMaterial({ color: '#14532d', emissive: '#22c55e', emissiveIntensity: 0 });

      const redBulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), redMat);
      redBulb.position.set(0, 5.05, 0.22);
      const yellowBulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), yellowMat);
      yellowBulb.position.set(0, 4.6, 0.22);
      const greenBulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), greenMat);
      greenBulb.position.set(0, 4.15, 0.22);

      g.add(pole, box, redBulb, yellowBulb, greenBulb);
      this.cityGroup.add(g);
      this.trafficLights.push({ redMat, yellowMat, greenMat, axis: spot.axis });
    }

    // 8 Composite Moving Cars
    const carColors = ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#f97316', '#8b5cf6', '#06b6d4', '#ec4899'];
    const carConfigs: { axis: 'z' | 'x'; lane: number; dir: 1 | -1; start: number; speed: number }[] = [
      { axis: 'z', lane: -3.8, dir: 1, start: -80, speed: 12 },
      { axis: 'z', lane: -3.8, dir: 1, start: 10, speed: 11 },
      { axis: 'z', lane: 3.8, dir: -1, start: 78, speed: 13 },
      { axis: 'z', lane: 3.8, dir: -1, start: -15, speed: 11.5 },
      { axis: 'x', lane: -43.2, dir: 1, start: -80, speed: 10.5 },
      { axis: 'x', lane: -36.8, dir: -1, start: 70, speed: 11 },
      { axis: 'x', lane: 36.8, dir: 1, start: -65, speed: 12 },
      { axis: 'x', lane: 43.2, dir: -1, start: 85, speed: 10 },
    ];

    for (let i = 0; i < carConfigs.length; i++) {
      const cfg = carConfigs[i];
      const car = this.createCarMesh(carColors[i % carColors.length]);
      if (cfg.axis === 'z') {
        car.group.position.set(cfg.lane, 0.06, cfg.start);
        car.group.rotation.y = cfg.dir === 1 ? 0 : Math.PI;
      } else {
        car.group.position.set(cfg.start, 0.06, cfg.lane);
        car.group.rotation.y = cfg.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      }
      this.cityGroup.add(car.group);
      this.cars.push({
        group: car.group,
        wheels: car.wheels,
        axis: cfg.axis,
        laneCoord: cfg.lane,
        dir: cfg.dir,
        pos: cfg.start,
        speed: cfg.speed,
        maxSpeed: cfg.speed,
      });
    }
  }

  private createCarMesh(colorHex: string): { group: THREE.Group; wheels: THREE.Mesh[] } {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.25, metalness: 0.65 });
    const glassMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.1, metalness: 0.85 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.85, metalness: 0.1 });
    const headMat = new THREE.MeshStandardMaterial({ color: '#fef08a', emissive: '#fde047', emissiveIntensity: 0.8 });
    const tailMat = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 0.7 });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.72, 4.3), bodyMat);
    chassis.position.y = 0.62;
    chassis.castShadow = true;

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.68, 2.2), bodyMat);
    cabin.position.set(0, 1.25, -0.2);
    cabin.castShadow = true;

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.5, 2.26), glassMat);
    windshield.position.set(0, 1.25, -0.2);

    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.2, 0.08), headMat);
    hlL.position.set(-0.68, 0.64, 2.15);
    const hlR = hlL.clone();
    hlR.position.x = 0.68;

    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.08), tailMat);
    tlL.position.set(-0.66, 0.66, -2.15);
    const tlR = tlL.clone();
    tlR.position.x = 0.66;

    const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.26, 14);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelPositions = [
      [-1.05, 0.36, 1.3],
      [1.05, 0.36, 1.3],
      [-1.05, 0.36, -1.3],
      [1.05, 0.36, -1.3],
    ];
    const wheels: THREE.Mesh[] = [];
    for (const [wx, wy, wz] of wheelPositions) {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(wx, wy, wz);
      w.castShadow = true;
      wheels.push(w);
      g.add(w);
    }

    g.add(chassis, cabin, windshield, hlL, hlR, tlL, tlR);
    return { group: g, wheels };
  }

  private createSignboardTexture(chapter: ChapterData, completed: boolean): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 192;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 192);

    ctx.strokeStyle = completed ? '#fbbf24' : chapter.accentColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, 496, 176);

    ctx.fillStyle = completed ? '#fbbf24' : chapter.accentColor;
    ctx.font = 'bold 42px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`BAB ${chapter.id}${completed ? ' · SELESAI' : ''}`, 256, 68);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(chapter.shortTitle, 256, 122);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(chapter.competency.slice(0, 34), 256, 160);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  private buildChapterBuildings(): void {
    const plinthMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.8 });
    const trimMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.45, metalness: 0.1 });
    const doorMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: '#0284c7',
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0.7,
    });

    for (const ch of CHAPTERS) {
      const g = new THREE.Group();
      g.position.set(ch.buildingPos.x, 0, ch.buildingPos.z);
      g.rotation.y = ch.buildingPos.rotY;

      const facadeMat = new THREE.MeshStandardMaterial({
        color: ch.accentColor,
        roughness: 0.55,
        metalness: 0.12,
      });
      const roofMat = new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.4,
        metalness: 0.5,
      });

      // Plinth
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(15, 0.5, 13), plinthMat);
      plinth.position.y = 0.25;
      plinth.receiveShadow = true;

      // Main architectural body
      const body = new THREE.Mesh(new THREE.BoxGeometry(13.6, 8.6, 11.4), facadeMat);
      body.position.y = 4.8;
      body.castShadow = true;
      body.receiveShadow = true;

      // Stepped Roof & Parapet
      const roof = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.75, 12.2), roofMat);
      roof.position.y = 9.45;
      roof.castShadow = true;

      // Columns flanking entrance
      const colL = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 5.4, 10), trimMat);
      colL.position.set(-2.6, 3.2, 6.1);
      colL.castShadow = true;
      const colR = colL.clone();
      colR.position.x = 2.6;

      // Entrance canopy
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.4, 2.2), roofMat);
      canopy.position.set(0, 5.9, 6.4);

      // Glowing Glass Entrance Door
      const door = new THREE.Mesh(new THREE.BoxGeometry(3.4, 4.2, 0.3), doorMat);
      door.position.set(0, 2.6, 5.75);
      door.userData.chapterId = ch.id;

      // Glowing Windows (left/right + upper floor)
      const windowMats: THREE.MeshStandardMaterial[] = [];
      for (const wx of [-4.2, 4.2]) {
        for (const wy of [3.2, 6.6]) {
          const wMat = new THREE.MeshStandardMaterial({
            color: '#bae6fd',
            emissive: '#fef08a',
            emissiveIntensity: 0.12,
            roughness: 0.15,
            metalness: 0.65,
          });
          windowMats.push(wMat);
          const win = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.7, 0.22), wMat);
          win.position.set(wx, wy, 5.72);
          g.add(win);
        }
      }

      // 3D Signboard above canopy
      const signTex = this.createSignboardTexture(ch, false);
      const signMesh = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 2.6, 0.32),
        [
          roofMat,
          roofMat,
          roofMat,
          roofMat,
          new THREE.MeshBasicMaterial({ map: signTex }),
          roofMat,
        ]
      );
      signMesh.position.set(0, 7.6, 6.0);
      signMesh.userData.chapterId = ch.id;

      // Interactive Portal Ring on sidewalk in front of door
      const portalMat = new THREE.MeshStandardMaterial({
        color: ch.accentColor,
        emissive: ch.accentColor,
        emissiveIntensity: 0.85,
        roughness: 0.2,
      });
      const portalRing = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.14, 10, 28), portalMat);
      portalRing.rotation.x = Math.PI / 2;
      portalRing.position.set(0, 0.22, 8.2);
      portalRing.userData.chapterId = ch.id;

      // Golden Completion Beacon (hidden until chapter completed)
      const beaconGroup = new THREE.Group();
      beaconGroup.position.set(0, 9.8, 0);
      beaconGroup.visible = false;

      const beamMat = new THREE.MeshBasicMaterial({
        color: '#fbbf24',
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.5, 28, 16, 1, true), beamMat);
      beam.position.y = 14;

      const starMat = new THREE.MeshStandardMaterial({
        color: '#fde047',
        emissive: '#f59e0b',
        emissiveIntensity: 0.9,
        metalness: 0.85,
        roughness: 0.15,
      });
      const starMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.35, 0), starMat);
      starMesh.position.y = 2.4;

      beaconGroup.add(beam, starMesh);
      g.add(plinth, body, roof, colL, colR, canopy, door, signMesh, portalRing, beaconGroup);
      this.cityGroup.add(g);

      // Collider box in world space
      const cos = Math.abs(Math.cos(ch.buildingPos.rotY));
      const sin = Math.abs(Math.sin(ch.buildingPos.rotY));
      const halfW = 7.6 * cos + 6.4 * sin;
      const halfD = 7.6 * sin + 6.4 * cos;
      this.buildingColliders.push({
        minX: ch.buildingPos.x - halfW,
        maxX: ch.buildingPos.x + halfW,
        minZ: ch.buildingPos.z - halfD,
        maxZ: ch.buildingPos.z + halfD,
      });

      this.buildings.push({
        chapter: ch,
        group: g,
        beaconGroup,
        starMesh,
        portalRing,
        windowMats,
      });
    }
  }

  private buildVersusBuilding(): void {
    const g = new THREE.Group();
    g.position.set(VERSUS_BUILDING_POS.x, 0, VERSUS_BUILDING_POS.z);
    g.rotation.y = VERSUS_BUILDING_POS.rotY;

    const plinthMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.7 });
    const facadeMat = new THREE.MeshStandardMaterial({ color: '#be123c', roughness: 0.45, metalness: 0.18 });
    const goldMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.85, roughness: 0.2 });
    const roofMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.35, metalness: 0.5 });

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.6, 13.6), plinthMat);
    plinth.position.y = 0.3;
    plinth.receiveShadow = true;

    const body = new THREE.Mesh(new THREE.BoxGeometry(15.6, 9.2, 11.6), facadeMat);
    body.position.y = 5.2;
    body.castShadow = true;
    body.receiveShadow = true;

    const roof = new THREE.Mesh(new THREE.BoxGeometry(16.6, 0.85, 12.6), roofMat);
    roof.position.y = 10.2;
    roof.castShadow = true;

    // Gold Arena Columns
    for (const cx of [-4.6, -2.5, 2.5, 4.6]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 6.2, 12), goldMat);
      col.position.set(cx, 3.6, 6.1);
      col.castShadow = true;
      g.add(col);
    }

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.48, 2.6), roofMat);
    canopy.position.set(0, 6.8, 6.4);

    const doorMat = new THREE.MeshStandardMaterial({
      color: '#fbbf24',
      emissive: '#f59e0b',
      emissiveIntensity: 0.65,
      roughness: 0.15,
      metalness: 0.75,
    });
    const door = new THREE.Mesh(new THREE.BoxGeometry(4.0, 4.5, 0.35), doorMat);
    door.position.set(0, 2.8, 5.85);
    door.userData.isVersus = true;

    for (const wx of [-5.2, 5.2]) {
      for (const wy of [3.5, 7.0]) {
        const wm = new THREE.MeshStandardMaterial({
          color: '#fde68a',
          emissive: '#f59e0b',
          emissiveIntensity: 0.25,
          roughness: 0.15,
          metalness: 0.6,
        });
        this.versusWindowMats.push(wm);
        const win = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.7, 0.22), wm);
        win.position.set(wx, wy, 5.82);
        g.add(win);
      }
    }

    // 3D Signboard
    const sc = document.createElement('canvas');
    sc.width = 512;
    sc.height = 192;
    const sctx = sc.getContext('2d')!;
    sctx.fillStyle = '#0f172a';
    sctx.fillRect(0, 0, 512, 192);
    sctx.strokeStyle = '#fbbf24';
    sctx.lineWidth = 10;
    sctx.strokeRect(8, 8, 496, 176);
    sctx.fillStyle = '#fbbf24';
    sctx.font = 'bold 42px "Outfit", sans-serif';
    sctx.textAlign = 'center';
    sctx.fillText('GEDUNG VERSUS', 256, 68);
    sctx.fillStyle = '#ffffff';
    sctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    sctx.fillText('ARENA ADU TKA 1 vs 1', 256, 118);
    sctx.fillStyle = '#fda4af';
    sctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    sctx.fillText('125+ Soal Teks Bacaan Acak', 256, 158);
    const signTex = new THREE.CanvasTexture(sc);
    signTex.colorSpace = THREE.SRGBColorSpace;

    const signMesh = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 2.8, 0.35),
      [roofMat, roofMat, roofMat, roofMat, new THREE.MeshBasicMaterial({ map: signTex }), roofMat]
    );
    signMesh.position.set(0, 8.6, 6.05);
    signMesh.userData.isVersus = true;

    // Animated Floating Golden Crown / Trophy above roof
    this.versusCrownMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.65, 0), goldMat);
    this.versusCrownMesh.position.set(0, 12.8, 0);

    // Portal Ring in front of Gedung Versus
    this.versusPortalRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.9, 0.16, 10, 28),
      new THREE.MeshStandardMaterial({
        color: '#fbbf24',
        emissive: '#f43f5e',
        emissiveIntensity: 0.95,
        roughness: 0.2,
      })
    );
    this.versusPortalRing.rotation.x = Math.PI / 2;
    this.versusPortalRing.position.set(0, 0.22, 8.5);
    this.versusPortalRing.userData.isVersus = true;

    g.traverse((o) => {
      o.userData.isVersus = true;
    });
    g.add(plinth, body, roof, canopy, door, signMesh, this.versusCrownMesh, this.versusPortalRing);
    this.cityGroup.add(g);

    this.buildingColliders.push({
      minX: VERSUS_BUILDING_POS.x - 8.5,
      maxX: VERSUS_BUILDING_POS.x + 8.5,
      minZ: VERSUS_BUILDING_POS.z - 6.6,
      maxZ: VERSUS_BUILDING_POS.z + 6.6,
    });
  }

  private buildRainSystem(): void {
    this.rainPositions = new Float32Array(this.rainCount * 6);
    for (let i = 0; i < this.rainCount; i++) {
      const rx = (Math.random() - 0.5) * 65;
      const ry = Math.random() * 26 + 1;
      const rz = (Math.random() - 0.5) * 65;
      const idx = i * 6;
      this.rainPositions[idx] = rx;
      this.rainPositions[idx + 1] = ry;
      this.rainPositions[idx + 2] = rz;
      this.rainPositions[idx + 3] = rx - 0.14;
      this.rainPositions[idx + 4] = ry - 0.95;
      this.rainPositions[idx + 5] = rz - 0.08;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.rainPositions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#bae6fd',
      transparent: true,
      opacity: 0.58,
    });
    this.rainLines = new THREE.LineSegments(geo, mat);
    this.rainLines.visible = false;
    this.rainLines.frustumCulled = false;
    this.scene.add(this.rainLines);
  }

  private buildInteriorTemplate(): void {
    // Detailed 3D Interior Learning Hall
    const floorMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.5, metalness: 0.1 });
    const wallMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.85 });
    const trimMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5, metalness: 0.3 });

    const floor = new THREE.Mesh(new THREE.BoxGeometry(24, 0.3, 22), floorMat);
    floor.position.y = -0.15;
    floor.receiveShadow = true;

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(24, 8, 0.5), wallMat);
    backWall.position.set(0, 4, -11);
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8, 22), wallMat);
    leftWall.position.set(-12, 4, 0);
    const rightWall = leftWall.clone();
    rightWall.position.x = 12;

    // Bookshelves on left/right walls
    const shelfMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.7 });
    const bookColors = ['#ef4444', '#3b82f6', '#10b981', '#eab308'];
    for (const sx of [-11.1, 11.1]) {
      for (const sz of [-5, 2]) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.1, 4.2, 3.6), shelfMat);
        shelf.position.set(sx, 2.1, sz);
        this.interiorGroup.add(shelf);
        for (let b = 0; b < 4; b++) {
          const bookRow = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.45, 3.1),
            new THREE.MeshStandardMaterial({ color: bookColors[(b + (sx > 0 ? 1 : 0)) % 4], roughness: 0.6 })
          );
          bookRow.position.set(sx > 0 ? sx - 0.25 : sx + 0.25, 0.8 + b * 0.95, sz);
          this.interiorGroup.add(bookRow);
        }
      }
    }

    // Station 1: Layar Video Materi (Front Left)
    const videoStation = new THREE.Group();
    videoStation.position.set(-6, 0, -6.5);
    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.2, 0.3), trimMat);
    screenFrame.position.y = 2.6;
    const screenSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(4.7, 2.7),
      new THREE.MeshStandardMaterial({ color: '#0ea5e9', emissive: '#0284c7', emissiveIntensity: 0.7 })
    );
    screenSurface.position.set(0, 2.6, 0.17);
    const videoRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.1, 8, 24),
      new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#0ea5e9', emissiveIntensity: 0.9 })
    );
    videoRing.rotation.x = Math.PI / 2;
    videoRing.position.set(0, 0.08, 2.2);
    videoStation.add(screenFrame, screenSurface, videoRing);
    videoStation.traverse((o) => {
      o.userData.station = 'video';
    });

    // Station 2: Meja Kuis & Uraian (Front Center)
    const quizStation = new THREE.Group();
    quizStation.position.set(0, 0, -5.5);
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 1.8), shelfMat);
    desk.position.y = 0.55;
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.18, 0.85),
      new THREE.MeshStandardMaterial({ color: '#fef3c7', emissive: '#f59e0b', emissiveIntensity: 0.35 })
    );
    book.position.set(0, 1.2, 0);
    const quizRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.1, 8, 24),
      new THREE.MeshStandardMaterial({ color: '#fbbf24', emissive: '#f59e0b', emissiveIntensity: 0.95 })
    );
    quizRing.rotation.x = Math.PI / 2;
    quizRing.position.set(0, 0.08, 2.1);
    quizStation.add(desk, book, quizRing);
    quizStation.traverse((o) => {
      o.userData.station = 'quiz';
    });

    // Station 3: Terminal Arsip Google (Front Right)
    const archiveStation = new THREE.Group();
    archiveStation.position.set(6, 0, -6.5);
    const kiosk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 1.2), trimMat);
    kiosk.position.y = 1.25;
    const monitor = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 1.1),
      new THREE.MeshStandardMaterial({ color: '#34d399', emissive: '#10b981', emissiveIntensity: 0.85 })
    );
    monitor.position.set(0, 1.75, 0.62);
    const archiveRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.1, 8, 24),
      new THREE.MeshStandardMaterial({ color: '#34d399', emissive: '#10b981', emissiveIntensity: 0.9 })
    );
    archiveRing.rotation.x = Math.PI / 2;
    archiveRing.position.set(0, 0.08, 2.2);
    archiveStation.add(kiosk, monitor, archiveRing);
    archiveStation.traverse((o) => {
      o.userData.station = 'archive';
    });

    // Station 4: Exit Portal (Back Center)
    const exitStation = new THREE.Group();
    exitStation.position.set(0, 0, 9.5);
    const exitArch = new THREE.Mesh(new THREE.BoxGeometry(3.8, 4.2, 0.4), trimMat);
    exitArch.position.y = 2.1;
    const exitGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 3.6),
      new THREE.MeshStandardMaterial({ color: '#f87171', emissive: '#ef4444', emissiveIntensity: 0.85, side: THREE.DoubleSide })
    );
    exitGlow.position.set(0, 1.9, -0.22);
    exitStation.add(exitArch, exitGlow);
    exitStation.traverse((o) => {
      o.userData.station = 'exit';
    });

    const interiorLight = new THREE.PointLight(0xfffbeb, 2.2, 45, 0.6);
    interiorLight.position.set(0, 6.5, 0);

    this.interiorGroup.add(floor, backWall, leftWall, rightWall, videoStation, quizStation, archiveStation, exitStation, interiorLight);

    this.interiorStations = [
      { type: 'video', pos: new THREE.Vector3(-6, 0, -4.3), mesh: videoStation, label: 'Layar Video Pembahasan' },
      { type: 'quiz', pos: new THREE.Vector3(0, 0, -3.4), mesh: quizStation, label: 'Meja Soal & Uraian' },
      { type: 'archive', pos: new THREE.Vector3(6, 0, -4.3), mesh: archiveStation, label: 'Terminal Simpan ke Google' },
      { type: 'exit', pos: new THREE.Vector3(0, 0, 9.2), mesh: exitStation, label: 'Pintu Keluar Kota' },
    ];
  }

  public enterBuilding(chapter: ChapterData): void {
    this.currentInteriorChapter = chapter;
    this.cityGroup.visible = false;
    this.interiorGroup.visible = true;
    this.interiorPlayerPos.set(0, 0, 5.5);
    this.interiorPlayerRot = Math.PI;
    this.localRig.group.position.copy(this.interiorPlayerPos);
    this.localRig.group.rotation.y = this.interiorPlayerRot;
    this.cameraDistance = 8.5;
    this.callbacks.onEnterBuilding(chapter);
  }

  public exitBuilding(): void {
    if (!this.currentInteriorChapter) return;
    this.currentInteriorChapter = null;
    this.interiorGroup.visible = false;
    this.cityGroup.visible = true;
    this.localRig.group.position.copy(this.localPos);
    this.localRig.group.rotation.y = this.localRotY;
    this.cameraDistance = 12.5;
  }

  public isInsideBuilding(): boolean {
    return this.currentInteriorChapter !== null;
  }

  public setTimeOfDayMode(mode: TimeOfDayMode): void {
    this.timeMode = mode;
  }

  public setWeatherState(weather: LocalWeatherState): void {
    this.weatherState = weather;
  }

  public setJoystickVector(x: number, y: number): void {
    this.joystickVec.x = x;
    this.joystickVec.y = y;
  }

  public teleportNear(x: number, z: number): void {
    if (this.currentInteriorChapter) {
      this.exitBuilding();
    }
    this.localPos.set(x, 0, z);
    this.localRig.group.position.copy(this.localPos);
  }

  public updateLocalAvatar(
    avatar: AvatarConfig,
    meta: { name: string; className: string; level: number; completedCount: number; answeredCount: number }
  ): void {
    this.localMeta = { ...meta };
    const prevPos = this.localRig.group.position.clone();
    const prevRot = this.localRig.group.rotation.y;
    this.scene.remove(this.localRig.group);
    this.localRig.dispose();
    this.localRig = buildRobloxAvatar(avatar, this.localMeta);
    this.localRig.group.position.copy(prevPos);
    this.localRig.group.rotation.y = prevRot;
    this.scene.add(this.localRig.group);
  }

  public updateCompletedChapters(completedIds: number[]): void {
    this.completedSet = new Set(completedIds);
    for (const b of this.buildings) {
      const done = this.completedSet.has(b.chapter.id);
      b.beaconGroup.visible = done;
      // Refresh signboard if state changed
      const sign = b.group.children.find((c) => c instanceof THREE.Mesh && (c.geometry as THREE.BoxGeometry)?.parameters?.width === 7.2) as THREE.Mesh | undefined;
      if (sign && Array.isArray(sign.material)) {
        const mat = sign.material[4] as THREE.MeshBasicMaterial;
        const oldMap = mat.map;
        mat.map = this.createSignboardTexture(b.chapter, done);
        mat.needsUpdate = true;
        oldMap?.dispose();
      }
    }
  }

  public syncRemotePlayers(players: RemotePlayer[]): void {
    const activeIds = new Set(players.map((p) => p.id));

    for (const [id, entry] of this.remoteRigs.entries()) {
      if (!activeIds.has(id)) {
        this.cityGroup.remove(entry.rig.group);
        entry.rig.dispose();
        this.remoteRigs.delete(id);
      }
    }

    for (const p of players) {
      const existing = this.remoteRigs.get(p.id);
      if (!existing) {
        const rig = buildRobloxAvatar(p.avatar, {
          name: p.name,
          className: p.className,
          level: p.level,
          completedCount: p.completedCount,
          answeredCount: p.answeredCount,
        });
        rig.group.position.set(p.x, p.y, p.z);
        rig.group.rotation.y = p.rotY;
        this.cityGroup.add(rig.group);
        this.remoteRigs.set(p.id, {
          rig,
          targetPos: new THREE.Vector3(p.x, p.y, p.z),
          targetRotY: p.rotY,
          lastMoving: !!p.isMoving,
        });
      } else {
        existing.targetPos.set(p.x, p.y, p.z);
        existing.targetRotY = p.rotY;
        existing.lastMoving = !!p.isMoving;
        // Refresh nametag periodically when counts change
        const sprMat = existing.rig.nametagSprite.material as THREE.SpriteMaterial;
        if (
          existing.rig.nametagSprite.userData.lastKey !==
          `${p.name}|${p.level}|${p.completedCount}|${p.answeredCount}`
        ) {
          existing.rig.nametagSprite.userData.lastKey = `${p.name}|${p.level}|${p.completedCount}|${p.answeredCount}`;
          const newTex = createNametagTexture(p.name, p.className, p.level, p.completedCount, p.answeredCount);
          sprMat.map?.dispose();
          sprMat.map = newTex;
          sprMat.needsUpdate = true;
        }
      }
    }
  }

  public getPlayerPosition(): { x: number; z: number; rotY: number } {
    return { x: this.localPos.x, z: this.localPos.z, rotY: this.localRotY };
  }

  private bindEvents(): void {
    const canvas = this.renderer.domElement;

    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName || '')) return;
      this.keys[e.code] = true;
      if ((e.code === 'KeyE' || e.code === 'Enter') && !this.currentInteriorChapter) {
        if (this.lastNearbyVersus) {
          this.callbacks.onEnterVersus();
          return;
        }
        if (this.lastNearbyId !== null) {
          const found = CHAPTERS.find((c) => c.id === this.lastNearbyId);
          if (found) this.enterBuilding(found);
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      this.keys[e.code] = false;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (this.activePointerId !== null) return;
      this.activePointerId = e.pointerId;
      this.isDragging = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      this.pointerDownX = e.clientX;
      this.pointerDownY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging || e.pointerId !== this.activePointerId) return;
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      const sensitivity = e.pointerType === 'touch' ? 0.0095 : 0.0065;
      this.cameraYaw -= dx * sensitivity;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch + dy * sensitivity, 0.14, 1.28);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerId !== this.activePointerId) return;
      const moved = Math.hypot(e.clientX - this.pointerDownX, e.clientY - this.pointerDownY);
      this.isDragging = false;
      this.activePointerId = null;

      if (moved < 9) {
        this.handleCanvasTap(e.clientX, e.clientY);
      }
    };

    const onWheel = (e: WheelEvent) => {
      this.cameraDistance = THREE.MathUtils.clamp(
        this.cameraDistance + e.deltaY * 0.01,
        this.currentInteriorChapter ? 5 : 6.5,
        this.currentInteriorChapter ? 13 : 25
      );
    };

    const onResize = () => {
      if (this.disposed) return;
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: true });

    this.cleanupEvents = () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }

  private cleanupEvents: () => void = () => {};

  private handleCanvasTap(clientX: number, clientY: number): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);

    if (this.currentInteriorChapter) {
      const hits = this.raycaster.intersectObjects(this.interiorGroup.children, true);
      for (const hit of hits) {
        const st = hit.object.userData?.station as 'video' | 'quiz' | 'archive' | 'exit' | undefined;
        if (st) {
          if (st === 'exit') {
            this.exitBuilding();
          }
          this.callbacks.onInteriorStationInteract(st);
          return;
        }
      }
      return;
    }

    const hits = this.raycaster.intersectObjects(this.cityGroup.children, true);
    for (const hit of hits) {
      let cur: THREE.Object3D | null = hit.object;
      while (cur) {
        if (cur.userData?.isVersus) {
          const dist = Math.hypot(
            this.localPos.x - VERSUS_BUILDING_POS.x,
            this.localPos.z - VERSUS_BUILDING_POS.z
          );
          if (dist < 24) {
            this.callbacks.onEnterVersus();
          } else {
            this.teleportNear(0, 96);
          }
          return;
        }
        if (cur.userData?.chapterId) {
          const ch = CHAPTERS.find((c) => c.id === cur!.userData.chapterId);
          if (ch) {
            const dist = Math.hypot(
              this.localPos.x - ch.buildingPos.x,
              this.localPos.z - ch.buildingPos.z
            );
            if (dist < 24) {
              this.enterBuilding(ch);
            } else {
              const frontX = ch.buildingPos.x + Math.sin(ch.buildingPos.rotY) * 9.5;
              const frontZ = ch.buildingPos.z + Math.cos(ch.buildingPos.rotY) * 9.5;
              this.localPos.set(frontX, 0, frontZ);
              this.localRig.group.position.copy(this.localPos);
            }
            return;
          }
        }
        cur = cur.parent;
      }
    }
  }

  private updateDayNightCycle(dt: number, elapsed: number): void {
    const realHour = this.timeMode === 'real' ? new Date().getHours() + new Date().getMinutes() / 60 : 12;
    let period: 'Pagi' | 'Siang' | 'Sore' | 'Malam' = 'Siang';

    if (this.timeMode === 'morning') period = 'Pagi';
    else if (this.timeMode === 'day') period = 'Siang';
    else if (this.timeMode === 'afternoon') period = 'Sore';
    else if (this.timeMode === 'night') period = 'Malam';
    else {
      if (realHour >= 5 && realHour < 10) period = 'Pagi';
      else if (realHour >= 10 && realHour < 15.5) period = 'Siang';
      else if (realHour >= 15.5 && realHour < 18.25) period = 'Sore';
      else period = 'Malam';
    }

    const cond = this.weatherState.condition;
    const isRaining = cond === 'rain' || cond === 'storm';
    let nightMix = 0;

    if (period === 'Pagi') {
      _fogColor.copy(_skyMorning);
      this.sunLight.color.copy(_sunColorMorning);
      this.hemiLight.color.copy(_hemiSkyDay);
      this.sunLight.intensity = 1.38;
      this.hemiLight.intensity = 0.78;
      nightMix = 0.08;
    } else if (period === 'Siang') {
      _fogColor.copy(cond === 'hot' ? _skyHot : _skyDay);
      this.sunLight.color.copy(_sunColorDay);
      this.hemiLight.color.copy(_hemiSkyDay);
      this.sunLight.intensity = cond === 'hot' ? 1.92 : 1.65;
      this.hemiLight.intensity = cond === 'hot' ? 0.9 : 0.8;
    } else if (period === 'Sore') {
      _fogColor.copy(_skyAfternoon);
      this.sunLight.color.copy(_sunColorAfternoon);
      this.hemiLight.color.copy(_hemiSkyAfternoon);
      this.sunLight.intensity = 1.08;
      this.hemiLight.intensity = 0.58;
      nightMix = 0.36;
    } else {
      _fogColor.copy(_skyNight);
      this.sunLight.color.copy(_sunColorNight);
      this.hemiLight.color.copy(_hemiSkyNight);
      this.sunLight.intensity = 0.45;
      this.hemiLight.intensity = 0.42;
      nightMix = 1;
    }

    // Weather atmosphere adjustments
    if (cond === 'cloudy' && period !== 'Malam') {
      _fogColor.lerp(_skyCloudy, 0.58);
      this.sunLight.intensity *= 0.65;
    } else if (isRaining) {
      _fogColor.lerp(_skyRain, period === 'Malam' ? 0.3 : 0.72);
      this.sunLight.intensity *= 0.45;
      this.hemiLight.intensity *= 0.78;
      if (cond === 'storm' && Math.sin(elapsed * 19.7) > 0.985) {
        this.hemiLight.intensity = 1.9;
      }
    }

    if (this.currentInteriorChapter) {
      this.scene.background = new THREE.Color('#1e293b');
      (this.scene.fog as THREE.FogExp2).color.set('#1e293b');
      (this.scene.fog as THREE.FogExp2).density = 0.01;
      this.rainLines.visible = false;
    } else {
      (this.scene.background as THREE.Color).copy(_fogColor);
      (this.scene.fog as THREE.FogExp2).color.copy(_fogColor);
      (this.scene.fog as THREE.FogExp2).density = isRaining ? 0.0082 : cond === 'cloudy' ? 0.0055 : 0.0042;
      this.rainLines.visible = isRaining;
    }

    // Wet reflective asphalt when raining
    for (const rm of this.roadMats) {
      rm.roughness = isRaining ? 0.2 : 0.85;
      rm.metalness = isRaining ? 0.28 : 0.05;
    }

    // Animate 3D falling rain around local player
    if (this.rainLines.visible) {
      const posAttr = this.rainLines.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const px = this.localPos.x;
      const pz = this.localPos.z;
      const fall = dt * (cond === 'storm' ? 34 : 24);
      for (let i = 0; i < this.rainCount; i++) {
        const idx = i * 6;
        arr[idx + 1] -= fall;
        arr[idx + 4] -= fall;
        if (arr[idx + 1] < 0.3) {
          const nx = px + (Math.random() - 0.5) * 65;
          const ny = 24 + Math.random() * 6;
          const nz = pz + (Math.random() - 0.5) * 65;
          arr[idx] = nx;
          arr[idx + 1] = ny;
          arr[idx + 2] = nz;
          arr[idx + 3] = nx - 0.14;
          arr[idx + 4] = ny - 0.95;
          arr[idx + 5] = nz - 0.08;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Sun / Moon arc
    const sunAngle = period === 'Pagi' ? 0.65 : period === 'Siang' ? 1.55 : period === 'Sore' ? 2.55 : 4.5;
    this.sunOrb.position.set(Math.cos(sunAngle) * 120, Math.abs(Math.sin(sunAngle)) * 100 + 18, -135);
    this.sunOrb.visible = !isRaining;
    (this.sunOrb.material as THREE.MeshBasicMaterial).color.set(
      nightMix > 0.5 ? '#e2e8f0' : period === 'Sore' ? '#fb923c' : '#fef08a'
    );
    (this.starsPoints.material as THREE.PointsMaterial).opacity = nightMix > 0.5 && !isRaining ? 0.85 : 0;

    // Streetlamps & building windows glow at dusk/night or heavy rain
    const lampEmissive = nightMix > 0.3 || isRaining ? 1.85 : 0.12;
    for (const m of this.streetlampBulbs) {
      m.emissiveIntensity = lampEmissive;
    }
    for (const wm of this.versusWindowMats) {
      wm.emissiveIntensity = nightMix > 0.3 || isRaining ? 0.95 : 0.25;
    }
    if (this.versusCrownMesh) {
      this.versusCrownMesh.rotation.y += dt * 1.5;
      this.versusCrownMesh.position.y = 12.8 + Math.sin(elapsed * 2.4) * 0.35;
    }
    if (this.versusPortalRing) {
      this.versusPortalRing.scale.setScalar(1 + Math.sin(elapsed * 3.5) * 0.07);
    }

    for (const b of this.buildings) {
      for (const wm of b.windowMats) {
        wm.emissiveIntensity = nightMix > 0.3 || isRaining ? 0.85 : 0.12;
      }
      if (b.beaconGroup.visible) {
        b.starMesh.rotation.y += dt * 1.8;
        b.starMesh.position.y = 2.4 + Math.sin(elapsed * 2.5) * 0.35;
      }
      b.portalRing.scale.setScalar(1 + Math.sin(elapsed * 3.2) * 0.06);
    }
  }

  private updateTraffic(dt: number, elapsed: number): void {
    // 14s traffic cycle: 0-6s Z green, 6-7s Z yellow, 7-13s X green, 13-14s X yellow
    const cycle = elapsed % 14;
    const zState = cycle < 6 ? 'green' : cycle < 7 ? 'yellow' : 'red';
    const xState = cycle >= 7 && cycle < 13 ? 'green' : cycle >= 13 ? 'yellow' : 'red';

    for (const tl of this.trafficLights) {
      const state = tl.axis === 'z' ? zState : xState;
      tl.redMat.emissiveIntensity = state === 'red' ? 2.2 : 0;
      tl.yellowMat.emissiveIntensity = state === 'yellow' ? 2.2 : 0;
      tl.greenMat.emissiveIntensity = state === 'green' ? 2.2 : 0;
    }

    const intersectionsZ = [-40, 0, 40, 80];
    for (const car of this.cars) {
      let mustStop = false;
      if (car.axis === 'z' && zState !== 'green') {
        for (const iz of intersectionsZ) {
          const distToStopLine = (iz - car.dir * 10 - car.pos) * car.dir;
          if (distToStopLine > 0 && distToStopLine < 8) {
            mustStop = true;
          }
        }
      } else if (car.axis === 'x' && xState !== 'green') {
        const distToStopLine = (-car.dir * 11 - car.pos) * car.dir;
        if (distToStopLine > 0 && distToStopLine < 8) {
          mustStop = true;
        }
      }

      const targetSpeed = mustStop ? 0 : car.maxSpeed;
      car.speed = THREE.MathUtils.damp(car.speed, targetSpeed, 6, dt);
      car.pos += car.dir * car.speed * dt;
      const maxRange = car.axis === 'z' ? 88 : 112;
      if (car.pos > maxRange) car.pos = -maxRange;
      if (car.pos < -maxRange) car.pos = maxRange;

      if (car.axis === 'z') {
        car.group.position.z = car.pos;
      } else {
        car.group.position.x = car.pos;
      }
      for (const w of car.wheels) {
        w.rotation.x += car.speed * dt * 1.4;
      }
    }
  }

  private updateLocalPlayer(dt: number, elapsed: number): void {
    let inputX = this.joystickVec.x;
    let inputY = this.joystickVec.y;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) inputY += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) inputY -= 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) inputX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) inputX += 1;

    const mag = Math.hypot(inputX, inputY);
    if (mag > 1) {
      inputX /= mag;
      inputY /= mag;
    }

    const sprint = this.keys['ShiftLeft'] || this.keys['ShiftRight'] ? 1.45 : 1;
    const speed = (this.currentInteriorChapter ? 7.5 : 11.5) * sprint;

    let moveSpeed = 0;
    if (mag > 0.06) {
      _forward.set(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw)).normalize();
      _right.set(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw)).normalize();
      _moveVec
        .set(0, 0, 0)
        .addScaledVector(_forward, inputY)
        .addScaledVector(_right, inputX);

      if (_moveVec.lengthSq() > 0.001) {
        _moveVec.normalize();
        const targetRot = Math.atan2(_moveVec.x, _moveVec.z);

        if (this.currentInteriorChapter) {
          const nx = THREE.MathUtils.clamp(this.interiorPlayerPos.x + _moveVec.x * speed * dt, -10.2, 10.2);
          const nz = THREE.MathUtils.clamp(this.interiorPlayerPos.z + _moveVec.z * speed * dt, -9.2, 9.5);
          this.interiorPlayerPos.set(nx, 0, nz);
          let diff = targetRot - this.interiorPlayerRot;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          this.interiorPlayerRot += diff * Math.min(1, dt * 12);
          this.localRig.group.position.copy(this.interiorPlayerPos);
          this.localRig.group.rotation.y = this.interiorPlayerRot;
        } else {
          const nextX = THREE.MathUtils.clamp(this.localPos.x + _moveVec.x * speed * dt, -110, 110);
          const nextZ = THREE.MathUtils.clamp(this.localPos.z + _moveVec.z * speed * dt, -118, 118);

          // Building collision sliding
          let blockedX = false;
          let blockedZ = false;
          for (const col of this.buildingColliders) {
            if (nextX > col.minX && nextX < col.maxX && this.localPos.z > col.minZ && this.localPos.z < col.maxZ) {
              blockedX = true;
            }
            if (this.localPos.x > col.minX && this.localPos.x < col.maxX && nextZ > col.minZ && nextZ < col.maxZ) {
              blockedZ = true;
            }
          }
          if (!blockedX) this.localPos.x = nextX;
          if (!blockedZ) this.localPos.z = nextZ;

          let diff = targetRot - this.localRotY;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          this.localRotY += diff * Math.min(1, dt * 12);

          this.localRig.group.position.copy(this.localPos);
          this.localRig.group.rotation.y = this.localRotY;
        }
        moveSpeed = speed * Math.min(1, mag);
      }
    }

    animateAvatarRig(this.localRig, moveSpeed, dt, elapsed);

    // Nearby building detection or interior station auto-trigger
    if (this.currentInteriorChapter) {
      if (this.interiorPlayerPos.z > 8.6) {
        this.exitBuilding();
        this.callbacks.onInteriorStationInteract('exit');
      }
    } else {
      let nearest: ChapterData | null = null;
      let nearestDist = 9.5;
      for (const ch of CHAPTERS) {
        const frontX = ch.buildingPos.x + Math.sin(ch.buildingPos.rotY) * 8.2;
        const frontZ = ch.buildingPos.z + Math.cos(ch.buildingPos.rotY) * 8.2;
        const d = Math.hypot(this.localPos.x - frontX, this.localPos.z - frontZ);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = ch;
        }
      }
      if ((nearest?.id ?? null) !== this.lastNearbyId) {
        this.lastNearbyId = nearest?.id ?? null;
        this.callbacks.onNearbyBuildingChange(nearest);
      }

      const vsDist = Math.hypot(this.localPos.x - VERSUS_BUILDING_POS.x, this.localPos.z - 97.5);
      const nearVersus = vsDist < 9.5;
      if (nearVersus !== this.lastNearbyVersus) {
        this.lastNearbyVersus = nearVersus;
        this.callbacks.onNearbyVersusChange(nearVersus);
      }

      // Broadcast movement every 110ms
      const now = performance.now();
      if (now - this.lastSyncSentAt > 110) {
        this.lastSyncSentAt = now;
        this.callbacks.onPlayerMove({
          x: this.localPos.x,
          y: 0,
          z: this.localPos.z,
          rotY: this.localRotY,
          isMoving: moveSpeed > 0.2,
        });
      }
    }
  }

  private updateCamera(dt: number): void {
    const focusPos = this.currentInteriorChapter ? this.interiorPlayerPos : this.localPos;
    _camTarget.set(focusPos.x, focusPos.y + 1.9, focusPos.z);

    const horizDist = Math.cos(this.cameraPitch) * this.cameraDistance;
    const vertDist = Math.sin(this.cameraPitch) * this.cameraDistance;
    _camDesired.set(
      _camTarget.x + Math.sin(this.cameraYaw) * horizDist,
      _camTarget.y + vertDist,
      _camTarget.z + Math.cos(this.cameraYaw) * horizDist
    );

    if (this.camera.position.lengthSq() === 0) {
      this.camera.position.copy(_camDesired);
    } else {
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _camDesired.x, 12, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _camDesired.y, 12, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _camDesired.z, 12, dt);
    }
    this.camera.lookAt(_camTarget);
  }

  private updateRemotePlayers(dt: number, elapsed: number): void {
    for (const entry of this.remoteRigs.values()) {
      const g = entry.rig.group;
      const dist = g.position.distanceTo(entry.targetPos);
      g.position.x = THREE.MathUtils.damp(g.position.x, entry.targetPos.x, 9, dt);
      g.position.y = THREE.MathUtils.damp(g.position.y, entry.targetPos.y, 9, dt);
      g.position.z = THREE.MathUtils.damp(g.position.z, entry.targetPos.z, 9, dt);

      let diff = entry.targetRotY - g.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      g.rotation.y += diff * Math.min(1, dt * 10);

      animateAvatarRig(entry.rig, dist > 0.08 || entry.lastMoving ? 8 : 0, dt, elapsed);
    }
  }

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private tick = (): void => {
    if (this.disposed) return;
    const dt = Math.min(0.05, this.clock.getDelta());
    const elapsed = this.clock.elapsedTime;

    this.updateDayNightCycle(dt, elapsed);
    if (!this.currentInteriorChapter) {
      this.updateTraffic(dt, elapsed);
      this.updateRemotePlayers(dt, elapsed);
    }
    this.updateLocalPlayer(dt, elapsed);
    this.updateCamera(dt);

    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.cleanupEvents();
    this.localRig.dispose();
    for (const entry of this.remoteRigs.values()) {
      entry.rig.dispose();
    }
    this.remoteRigs.clear();
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
