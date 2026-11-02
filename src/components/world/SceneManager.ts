import * as THREE from "three";
import { CHARACTERS, LOCATIONS } from "@/data/scenarios";
import { CharacterProfile, LocationInfo } from "@/types/game";

export interface ProjectedAnchor {
  id: string;
  type: "npc" | "beacon";
  name: string;
  role?: string;
  x: number;
  y: number;
  visible: boolean;
  distance: number;
  offscreen: boolean;
}

const addDetailedHumanoid = (
  group: THREE.Group,
  clothingColor: string,
  skinColor: string,
  hairColor: string,
  accentColor: string,
  withBackpack = false
) => {
  const clothing = new THREE.MeshStandardMaterial({ color: clothingColor, roughness: 0.72 });
  const skin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.82 });
  const hair = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.92 });
  const trousers = new THREE.MeshStandardMaterial({ color: "#35404A", roughness: 0.88 });
  const shoes = new THREE.MeshStandardMaterial({ color: "#302C2A", roughness: 0.8 });
  const accent = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.7 });
  const eyeWhite = new THREE.MeshStandardMaterial({ color: "#FFFDF7", roughness: 0.5 });
  const eyeDark = new THREE.MeshStandardMaterial({ color: "#292421", roughness: 0.5 });

  const addMesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: [number, number, number],
    scale?: [number, number, number]
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    if (scale) mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  addMesh(new THREE.CapsuleGeometry(0.36, 0.62, 4, 10), clothing, [0, 1.33, 0]);
  addMesh(new THREE.CylinderGeometry(0.105, 0.11, 0.22, 10), skin, [0, 1.84, 0]);
  addMesh(new THREE.SphereGeometry(0.31, 16, 12), skin, [0, 2.17, 0.015], [1, 1.1, 0.92]);
  addMesh(
    new THREE.SphereGeometry(0.33, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58),
    hair,
    [0, 2.34, -0.015],
    [1.03, 1, 1.02]
  );
  addMesh(new THREE.SphereGeometry(0.105, 10, 8), hair, [-0.27, 2.22, 0], [1, 1.2, 0.9]);
  addMesh(new THREE.SphereGeometry(0.105, 10, 8), hair, [0.27, 2.22, 0], [1, 1.2, 0.9]);

  [-1, 1].forEach((side) => {
    addMesh(new THREE.SphereGeometry(0.055, 8, 8), skin, [side * 0.31, 2.17, 0.01]);
    addMesh(new THREE.SphereGeometry(0.047, 8, 8), eyeWhite, [side * 0.115, 2.19, 0.278]);
    addMesh(new THREE.SphereGeometry(0.022, 8, 8), eyeDark, [side * 0.115, 2.19, 0.318]);
    addMesh(new THREE.BoxGeometry(0.095, 0.025, 0.025), hair, [side * 0.115, 2.27, 0.285]);
    const leg = addMesh(new THREE.CapsuleGeometry(0.14, 0.48, 3, 8), trousers, [side * 0.17, 0.48, 0]);
    leg.rotation.z = side * -0.035;
    addMesh(new THREE.BoxGeometry(0.25, 0.14, 0.39), shoes, [side * 0.17, 0.11, 0.06]);

    const arm = addMesh(new THREE.CapsuleGeometry(0.105, 0.48, 3, 8), clothing, [side * 0.46, 1.35, 0.015]);
    arm.rotation.z = side * -0.12;
    addMesh(new THREE.SphereGeometry(0.105, 8, 8), skin, [side * 0.5, 0.98, 0.05]);
  });

  addMesh(new THREE.BoxGeometry(0.22, 0.12, 0.1), accent, [0, 1.83, 0.11]);
  addMesh(new THREE.SphereGeometry(0.045, 8, 8), skin, [0, 2.11, 0.3]);
  addMesh(new THREE.BoxGeometry(0.11, 0.022, 0.018), eyeDark, [0, 2.035, 0.294]);

  if (withBackpack) {
    addMesh(
      new THREE.BoxGeometry(0.48, 0.58, 0.26),
      new THREE.MeshStandardMaterial({ color: "#14707A", roughness: 0.85 }),
      [0, 1.35, -0.39]
    );
    [-1, 1].forEach((side) => {
      addMesh(new THREE.BoxGeometry(0.07, 0.55, 0.07), accent, [side * 0.29, 1.37, -0.16]);
    });
  }
};

const createPavingTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create the town paving texture.");

  context.fillStyle = "#877D6D";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const stones = ["#D4C5AC", "#C9B99E", "#D9CBB4", "#C4B49A", "#CEBFA6"];
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const offset = row % 2 === 0 ? 0 : 16;
      const x = column * 32 - offset + 2;
      const y = row * 32 + 2;
      context.fillStyle = stones[Math.floor(Math.random() * stones.length)];
      context.fillRect(x, y, 28, 28);
      context.fillStyle = "rgba(255,255,255,0.12)";
      context.fillRect(x + 2, y + 2, 24, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(30, 30);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;

  // Player & Movement
  public playerMesh!: THREE.Group;
  public playerPosition = new THREE.Vector3(-18.4, 0, 13.2);
  public playerRotation = -Math.PI * 0.75;
  private targetPosition: THREE.Vector3 | null = null;
  private moveSpeed = 6.5; // units per second
  private isWalking = false;
  private walkClock = 0;
  private directionalInputs = new Map<string, THREE.Vector2>();
  private playerSaveElapsed = 0;
  private lastReportedPlayerPosition: THREE.Vector3 | null = null;
  private lastNearNpcId: string | null | undefined;
  private lastProjectedAnchors: ProjectedAnchor[] = [];
  private proximityUpdateElapsed = 0;
  private anchorUpdateElapsed = 0;

  // Camera rigs
  public cameraMode: "follow" | "conversation" = "follow";
  public activeNpcTarget: CharacterProfile | null = null;
  private cameraOffset = new THREE.Vector3(11, 15, 17);
  private currentCameraPos = new THREE.Vector3(-17.5, 6.5, 25.0);
  private currentLookAt = new THREE.Vector3(-20.0, 1.2, 18.8);

  // Lighting & Day variations
  private sunLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;
  private stringLightsGroup!: THREE.Group;

  // Environment elements
  private treesGroup!: THREE.Group;
  private dustParticles!: THREE.Points;
  private clickIndicator!: THREE.Mesh;
  private groundPlane!: THREE.Mesh;
  private npcMeshes: Map<string, THREE.Group> = new Map();
  private npcRingMeshes: Map<string, THREE.Mesh> = new Map();
  private apartmentExteriorGroup!: THREE.Group;
  private apartmentInteriorGroup!: THREE.Group;
  private ambientPedestrians: Array<{
    mesh: THREE.Group;
    route: THREE.Vector3[];
    waypoint: number;
    speed: number;
    phase: number;
  }> = [];
  private buildingBounds: Array<{ minX: number; maxX: number; minZ: number; maxZ: number }> = [];
  private apartmentBounds = { minX: -26.5, maxX: -13.5, minZ: 6.5, maxZ: 17.5 };

  // Raycaster
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Callbacks
  private onNpcNearCallback?: (npc: CharacterProfile | null) => void;
  private onAnchorUpdateCallback?: (anchors: ProjectedAnchor[]) => void;
  private onPlayerMoveCallback?: (coords: [number, number, number], rot: number) => void;

  private handlePointerDown = (event: PointerEvent) => {
    if (this.cameraMode === "conversation" || (event.button !== 0 && event.pointerType === "mouse")) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObject(this.groundPlane);
    if (intersects.length === 0) return;

    const point = intersects[0].point;
    const destination = new THREE.Vector3(point.x, 0, point.z);
    if (this.canOccupy(destination.x, destination.z)) this.targetPosition = destination;

    this.clickIndicator.position.set(point.x, 0.06, point.z);
    (this.clickIndicator.material as THREE.MeshBasicMaterial).opacity = 0.85;
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.cameraMode === "conversation" || this.isEditableTarget(event.target)) return;

    const key = event.key.toLowerCase();
    const directions: Record<string, [number, number]> = {
      w: [0, -1],
      arrowup: [0, -1],
      s: [0, 1],
      arrowdown: [0, 1],
      a: [-1, 0],
      arrowleft: [-1, 0],
      d: [1, 0],
      arrowright: [1, 0],
    };
    const direction = directions[key];
    if (!direction) return;

    event.preventDefault();
    this.setDirectionalInput(`keyboard:${key}`, direction[0], direction[1], true);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    this.setDirectionalInput(`keyboard:${key}`, 0, 0, false);
  };

  private handleWindowBlur = () => {
    this.directionalInputs.clear();
    this.targetPosition = null;
    this.notifyPlayerPosition(true);
  };

  private isEditableTarget(target: EventTarget | null) {
    return target instanceof HTMLElement &&
      (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
  }

  constructor(
    private container: HTMLElement,
    private dayNumber: number = 1
  ) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#A9C7DD"); // Soft warm sky

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(width < 640 ? 52 : 45, width / height, 0.1, 150);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    this.initLighting();
    this.initWorld();
    this.initCharacters();
    this.initAmbientPedestrians();
    this.initPlayer();
    this.initClickIndicator();
    this.initParticles();

    this.setupEventListeners();
    this.setDayLighting(dayNumber);
    this.startLoop();
  }

  private initLighting() {
    // Ambient fill
    this.ambientLight = new THREE.AmbientLight("#B8A9D9", 1.2);
    this.scene.add(this.ambientLight);

    // Warm Golden-Hour Sun
    this.sunLight = new THREE.DirectionalLight("#FFD9A0", 1.8);
    this.sunLight.position.set(25, 35, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 100;
    const d = 40;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.scene.add(this.sunLight);

    // String lights for Day 6 community gathering
    this.stringLightsGroup = new THREE.Group();
    const stringColors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#FFE66D"];
    for (let i = 0; i < 18; i++) {
      const pLight = new THREE.PointLight(stringColors[i % stringColors.length], 0.6, 8);
      const angle = (i / 18) * Math.PI * 2;
      pLight.position.set(15 + Math.cos(angle) * 7, 3.8 + Math.sin(i * 1.5) * 0.4, -23 + Math.sin(angle) * 7);
      this.stringLightsGroup.add(pLight);

      // Small glowing bulb mesh
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: stringColors[i % stringColors.length] })
      );
      bulb.position.copy(pLight.position);
      this.stringLightsGroup.add(bulb);
    }
    this.scene.add(this.stringLightsGroup);
  }

  public setDayLighting(day: number) {
    this.dayNumber = day;
    this.cameraOffset.set(11, 15, day === 2 ? -17 : 17);
    const apartmentInteriorActive = day === 1 || day === 5;
    this.apartmentInteriorGroup.visible = apartmentInteriorActive;
    this.apartmentExteriorGroup.visible = !apartmentInteriorActive;
    const landlady = CHARACTERS.find((character) => character.id === "mme_laurent");
    if (landlady) {
      const position = this.getCharacterPosition(landlady);
      this.npcMeshes.get(landlady.id)?.position.copy(position);
      this.npcRingMeshes.get(landlady.id)?.position.set(position.x, 0.05, position.z);
    }

    if (day === 6) {
      // Day 6: Dusk party
      this.scene.background = new THREE.Color("#2C2440");
      this.ambientLight.color.set("#5C4B77");
      this.ambientLight.intensity = 0.8;
      this.sunLight.color.set("#FF8E53");
      this.sunLight.intensity = 0.9;
      this.stringLightsGroup.visible = true;
    } else if (day === 7) {
      // Day 7: Crisp bright morning
      this.scene.background = new THREE.Color("#BFE3F7");
      this.ambientLight.color.set("#D8E8F5");
      this.ambientLight.intensity = 1.3;
      this.sunLight.color.set("#FFF5D6");
      this.sunLight.intensity = 2.0;
      this.stringLightsGroup.visible = false;
    } else {
      // Standard warm golden-hour
      this.scene.background = new THREE.Color("#A9C7DD");
      this.ambientLight.color.set("#B8A9D9");
      this.ambientLight.intensity = 1.2;
      this.sunLight.color.set("#FFD9A0");
      this.sunLight.intensity = 1.8;
      this.stringLightsGroup.visible = false;
    }
  }

  private initWorld() {
    // 1. Cobblestone ground
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      map: createPavingTexture(),
      roughness: 0.85,
      metalness: 0.05,
    });
    this.groundPlane = new THREE.Mesh(groundGeo, groundMat);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);

    // 2. Central stone plaza & pathways
    const pathGeo = new THREE.BoxGeometry(10, 0.08, 65);
    const pathMat = new THREE.MeshStandardMaterial({ color: "#626967", roughness: 0.96 });
    const mainPath = new THREE.Mesh(pathGeo, pathMat);
    mainPath.position.set(0, 0.04, -2);
    mainPath.receiveShadow = true;
    this.scene.add(mainPath);

    const crossPathGeo = new THREE.BoxGeometry(60, 0.08, 9);
    const crossPath = new THREE.Mesh(crossPathGeo, pathMat);
    crossPath.position.set(0, 0.04, 3);
    crossPath.receiveShadow = true;
    this.scene.add(crossPath);

    // Central Fountain
    const fountainBase = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.8, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: "#B8A385" })
    );
    fountainBase.position.set(0, 0.3, 3);
    fountainBase.receiveShadow = true;
    this.scene.add(fountainBase);

    const fountainWater = new THREE.Mesh(
      new THREE.CylinderGeometry(3.1, 3.1, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: "#4ECDC4", roughness: 0.2 })
    );
    fountainWater.position.set(0, 0.45, 3);
    this.scene.add(fountainWater);

    const fountainPillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.0, 2.2, 12),
      new THREE.MeshStandardMaterial({ color: "#B8A385" })
    );
    fountainPillar.position.set(0, 1.4, 3);
    fountainPillar.castShadow = true;
    this.scene.add(fountainPillar);

    // Build the 5 distinct location structures
    this.buildApartment();
    this.buildGroceryStore();
    this.buildTransitStop();
    this.buildCafe();
    this.buildCommunityHall();
    this.buildTownhouses();

    // Trees & foliage
    this.initTrees();
    this.initStreetDetails();
  }

  private buildTownhouses() {
    const homes: Array<{ x: number; z: number; wall: string; roof: string }> = [
      { x: -34, z: 10, wall: "#E5D3B7", roof: "#815746" },
      { x: 35, z: 17, wall: "#D8C1A3", roof: "#744D45" },
      { x: -31, z: -25, wall: "#E9DCC7", roof: "#8B5C4D" },
      { x: 35, z: -25, wall: "#D5D5C9", roof: "#6A5147" },
      { x: 3, z: 34, wall: "#E4C8AB", roof: "#845845" },
    ];

    homes.forEach(({ x, z, wall, roof }) => {
      const house = new THREE.Group();
      house.position.set(x, 0, z);
      const wallMat = new THREE.MeshStandardMaterial({ color: wall, roughness: 0.88 });
      const roofMat = new THREE.MeshStandardMaterial({ color: roof, roughness: 0.9 });
      const trimMat = new THREE.MeshStandardMaterial({ color: "#F1E7D5", roughness: 0.8 });
      const windowMat = new THREE.MeshStandardMaterial({ color: "#55717C", roughness: 0.36, metalness: 0.08 });

      const facade = new THREE.Mesh(new THREE.BoxGeometry(8, 6.4, 7), wallMat);
      facade.position.y = 3.2;
      facade.castShadow = true;
      facade.receiveShadow = true;
      house.add(facade);

      const roofMesh = new THREE.Mesh(new THREE.ConeGeometry(6.7, 2.8, 4), roofMat);
      roofMesh.position.y = 7.8;
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.castShadow = true;
      house.add(roofMesh);

      [-2.2, 2.2].forEach((windowX) => {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.65, 0.16), trimMat);
        frame.position.set(windowX, 4.25, 3.58);
        house.add(frame);
        const glass = new THREE.Mesh(new THREE.BoxGeometry(1.42, 1.36, 0.18), windowMat);
        glass.position.set(windowX, 4.25, 3.68);
        house.add(glass);
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.04), trimMat);
        mullion.position.set(windowX, 4.25, 3.79);
        house.add(mullion);
      });

      const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.7, 0.18), trimMat);
      doorFrame.position.set(0, 1.35, 3.58);
      house.add(doorFrame);
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 2.45, 0.2),
        new THREE.MeshStandardMaterial({ color: "#674633", roughness: 0.8 })
      );
      door.position.set(0, 1.25, 3.7);
      house.add(door);
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.22, 0.75),
        new THREE.MeshStandardMaterial({ color: "#B8A997", roughness: 0.94 })
      );
      step.position.set(0, 0.11, 4.05);
      house.add(step);

      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.85), roofMat);
      chimney.position.set(2.2, 8.25, -1.5);
      chimney.castShadow = true;
      house.add(chimney);
      this.scene.add(house);
      this.buildingBounds.push({ minX: x - 4.6, maxX: x + 4.6, minZ: z - 4.1, maxZ: z + 4.1 });
    });
  }

  private initStreetDetails() {
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: "#B7B0A4", roughness: 0.94 });
    const curbMat = new THREE.MeshStandardMaterial({ color: "#797B79", roughness: 0.9 });
    const metalMat = new THREE.MeshStandardMaterial({ color: "#39454A", metalness: 0.42, roughness: 0.56 });
    const lampMat = new THREE.MeshStandardMaterial({ color: "#FFF1C2", emissive: "#E6B75A", emissiveIntensity: 0.45 });
    const roadMarkingMat = new THREE.MeshStandardMaterial({ color: "#F1EBDD", roughness: 0.75 });

    const addBox = (
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      x: number,
      y: number,
      z: number,
      rotationY = 0
    ) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotationY;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      return mesh;
    };

    // Paved pavements and raised kerbs give the central streets a town-street profile.
    [-1, 1].forEach((side) => {
      addBox(new THREE.BoxGeometry(2.1, 0.14, 63), sidewalkMat, side * 6.2, 0.07, -2);
      addBox(new THREE.BoxGeometry(0.18, 0.2, 63), curbMat, side * 5.12, 0.1, -2);
      addBox(new THREE.BoxGeometry(57, 0.14, 1.8), sidewalkMat, 0, 0.07, 3 + side * 5.35);
      addBox(new THREE.BoxGeometry(57, 0.2, 0.18), curbMat, 0, 0.1, 3 + side * 4.45);
    });

    [-28, -24, -20, -16, -12, 14, 18, 22, 26].forEach((z) => {
      addBox(new THREE.BoxGeometry(0.13, 0.035, 2.2), roadMarkingMat, 0, 0.085, z);
    });
    [-27, -23, -19, -15, 15, 19, 23, 27].forEach((x) => {
      addBox(new THREE.BoxGeometry(2.2, 0.035, 0.13), roadMarkingMat, x, 0.085, 3);
    });
    [-1, 1].forEach((side) => {
      for (let stripe = 0; stripe < 6; stripe += 1) {
        addBox(
          new THREE.BoxGeometry(0.82, 0.04, 0.25),
          roadMarkingMat,
          -2.35 + stripe * 0.94,
          0.09,
          3 + side * 4.1
        );
      }
    });

    const lampPositions: Array<[number, number]> = [
      [-7.3, -18], [7.3, -18], [-7.3, 17], [7.3, 17], [-25, -2], [25, 8],
    ];
    lampPositions.forEach(([x, z]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 4.5, 8), metalMat);
      pole.position.set(x, 2.25, z);
      pole.castShadow = true;
      this.scene.add(pole);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.85, 8), metalMat);
      arm.position.set(x + (x < 0 ? 0.32 : -0.32), 4.3, z);
      arm.rotation.z = x < 0 ? -Math.PI / 2 : Math.PI / 2;
      this.scene.add(arm);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), lampMat);
      lamp.position.set(x + (x < 0 ? 0.68 : -0.68), 4.18, z);
      this.scene.add(lamp);
    });

    // Benches and planted street trees make the plaza feel lived in.
    [-13, 13].forEach((x) => {
      const bench = new THREE.Group();
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.16, 0.55),
        new THREE.MeshStandardMaterial({ color: "#805B42", roughness: 0.86 })
      );
      seat.position.y = 0.58;
      seat.castShadow = true;
      bench.add(seat);
      const back = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.72, 0.12),
        new THREE.MeshStandardMaterial({ color: "#805B42", roughness: 0.86 })
      );
      back.position.set(0, 0.98, -0.22);
      back.castShadow = true;
      bench.add(back);
      [-0.85, 0.85].forEach((legX) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.45), metalMat);
        leg.position.set(legX, 0.3, 0);
        bench.add(leg);
      });
      bench.position.set(x, 0, 10);
      this.scene.add(bench);
    });

    // A small parked car adds familiar street scale and a stronger everyday-town cue.
    const car = new THREE.Group();
    const carBody = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.85, 1.8),
      new THREE.MeshStandardMaterial({ color: "#557B87", roughness: 0.55, metalness: 0.12 })
    );
    carBody.position.y = 0.72;
    carBody.castShadow = true;
    car.add(carBody);
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(2.15, 0.75, 1.52),
      new THREE.MeshStandardMaterial({ color: "#AFC5CB", roughness: 0.35, metalness: 0.1 })
    );
    cabin.position.set(-0.15, 1.43, 0);
    cabin.castShadow = true;
    car.add(cabin);
    const wheelMat = new THREE.MeshStandardMaterial({ color: "#242729", roughness: 0.96 });
    [-1.15, 1.15].forEach((x) => [-0.83, 0.83].forEach((z) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.2, 12), wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.38, z);
      wheel.castShadow = true;
      car.add(wheel);
    }));
    car.position.set(-3.3, 0, -16);
    car.rotation.y = Math.PI / 2;
    this.scene.add(car);
  }

  private buildApartment() {
    const group = new THREE.Group();
    group.position.set(-20, 0, 12);
    this.apartmentExteriorGroup = group;

    // Main building stucco block
    const main = new THREE.Mesh(
      new THREE.BoxGeometry(12, 10, 10),
      new THREE.MeshStandardMaterial({ color: "#EDC39B", roughness: 0.7 })
    );
    main.position.y = 5;
    main.castShadow = true;
    main.receiveShadow = true;
    group.add(main);

    // Terracotta roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(9.5, 3.5, 4),
      new THREE.MeshStandardMaterial({ color: "#C4674A", roughness: 0.6 })
    );
    roof.position.y = 11.75;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Arched entrance door
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 3.2, 0.4),
      new THREE.MeshStandardMaterial({ color: "#543825" })
    );
    door.position.set(0, 1.6, 5.1);
    group.add(door);

    // Windows & teal shutters
    const shutterMat = new THREE.MeshStandardMaterial({ color: "#2F8F8A" });
    const windowMat = new THREE.MeshStandardMaterial({ color: "#4A6B82" });
    [-3, 3].forEach((x) => {
      [3.5, 7.5].forEach((y) => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.2), windowMat);
        win.position.set(x, y, 5.1);
        group.add(win);

        const leftShutter = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.15), shutterMat);
        leftShutter.position.set(x - 1.1, y, 5.15);
        group.add(leftShutter);

        const rightShutter = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.15), shutterMat);
        rightShutter.position.set(x + 1.1, y, 5.15);
        group.add(rightShutter);
      });
    });

    // Courtyard flower pots
    const potMat = new THREE.MeshStandardMaterial({ color: "#C4674A" });
    const leafMat = new THREE.MeshStandardMaterial({ color: "#6E9A5B" });
    [-2, 2].forEach((x) => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.7, 8), potMat);
      pot.position.set(x, 0.35, 5.8);
      group.add(pot);

      const plant = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), leafMat);
      plant.position.set(x, 0.9, 5.8);
      group.add(plant);
    });

    this.scene.add(group);
    this.buildingBounds.push(this.apartmentBounds);

    const room = new THREE.Group();
    room.position.set(-20, 0, 12);
    this.apartmentInteriorGroup = room;
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.18, 8),
      new THREE.MeshStandardMaterial({ color: "#B98D68", roughness: 0.88 })
    );
    floor.position.set(0, 0.05, 0);
    floor.receiveShadow = true;
    room.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: "#F1DCC2", roughness: 0.92 });
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.4, 8), wallMaterial);
    sideWall.position.set(-3.9, 1.75, 0);
    sideWall.castShadow = true;
    room.add(sideWall);
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 3.4, 0.25), wallMaterial);
    backWall.position.set(0, 1.75, -3.9);
    backWall.castShadow = true;
    room.add(backWall);
    const trim = new THREE.MeshStandardMaterial({ color: "#8F5C42", roughness: 0.8 });
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.06, 2.3),
      new THREE.MeshStandardMaterial({ color: "#A9574C", roughness: 0.95 })
    );
    rug.position.set(0, 0.17, 0.25);
    room.add(rug);

    const table = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.16, 0.85), trim);
    table.position.set(1.8, 0.95, -1.3);
    table.castShadow = true;
    room.add(table);
    [-0.65, 0.65].forEach((x) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.12), trim);
      leg.position.set(1.8 + x, 0.48, -1.3);
      room.add(leg);
    });

    const sofa = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.72, 0.9),
      new THREE.MeshStandardMaterial({ color: "#4F7770", roughness: 0.9 })
    );
    sofa.position.set(-1.5, 0.48, -2.35);
    sofa.castShadow = true;
    room.add(sofa);
    const sofaBack = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.8, 0.22),
      new THREE.MeshStandardMaterial({ color: "#416960", roughness: 0.9 })
    );
    sofaBack.position.set(-1.5, 1.05, -2.7);
    room.add(sofaBack);

    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.1, 1.45, 8),
      trim
    );
    lamp.position.set(3.1, 0.82, -2.7);
    room.add(lamp);
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.42, 0.52, 8, 1, true),
      new THREE.MeshStandardMaterial({ color: "#E6C98D", side: THREE.DoubleSide })
    );
    lampShade.position.set(3.1, 1.75, -2.7);
    room.add(lampShade);

    this.scene.add(room);
  }

  private buildGroceryStore() {
    const group = new THREE.Group();
    group.position.set(14, 0, 18);

    // Building body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(11, 7.5, 9),
      new THREE.MeshStandardMaterial({ color: "#F6E6C6", roughness: 0.7 })
    );
    body.position.y = 3.75;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Striped Awning (Coral & Cream)
    const awning = new THREE.Mesh(
      new THREE.BoxGeometry(9.5, 0.3, 3.2),
      new THREE.MeshStandardMaterial({ color: "#C9472F", roughness: 0.5 })
    );
    awning.position.set(0, 4.2, -4.8);
    awning.rotation.x = 0.25;
    awning.castShadow = true;
    group.add(awning);

    // Glass display window & store sign
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(7, 1.1, 0.3),
      new THREE.MeshStandardMaterial({ color: "#1C2A39" })
    );
    sign.position.set(0, 5.2, -4.6);
    group.add(sign);

    // Fruit crates (apples & oranges)
    const crateMat = new THREE.MeshStandardMaterial({ color: "#A07855" });
    const appleMat = new THREE.MeshStandardMaterial({ color: "#E74C3C" });
    const orangeMat = new THREE.MeshStandardMaterial({ color: "#E67E22" });

    [-2.2, 0, 2.2].forEach((x, i) => {
      const crate = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 1.2), crateMat);
      crate.position.set(x, 0.35, -5.2);
      crate.castShadow = true;
      group.add(crate);

      // Produce spheres inside crate
      for (let px = -0.4; px <= 0.4; px += 0.4) {
        for (let pz = -0.3; pz <= 0.3; pz += 0.3) {
          const fruit = new THREE.Mesh(
            new THREE.SphereGeometry(0.16, 6, 6),
            i % 2 === 0 ? appleMat : orangeMat
          );
          fruit.position.set(x + px, 0.78, -5.2 + pz);
          group.add(fruit);
        }
      }
    });

    this.scene.add(group);
    this.buildingBounds.push({ minX: 8, maxX: 20, minZ: 12.5, maxZ: 23.5 });
  }

  private buildTransitStop() {
    const group = new THREE.Group();
    group.position.set(28, 0, -8);

    // Bus shelter platform
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.2, 5),
      new THREE.MeshStandardMaterial({ color: "#95A5A6" })
    );
    platform.position.y = 0.1;
    platform.receiveShadow = true;
    group.add(platform);

    // Steel shelter frame
    const frameMat = new THREE.MeshStandardMaterial({ color: "#34495E", metalness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: "#BDC3C7",
      transparent: true,
      opacity: 0.45,
    });

    // Back glass wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.2, 3.2, 0.15), glassMat);
    backWall.position.set(0, 1.7, -2);
    group.add(backWall);

    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.2, 4.5), frameMat);
    roof.position.set(0, 3.4, 0);
    roof.castShadow = true;
    group.add(roof);

    // Bench
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.45, 0.9),
      new THREE.MeshStandardMaterial({ color: "#7F8C8D" })
    );
    bench.position.set(0, 0.5, -1.2);
    bench.castShadow = true;
    group.add(bench);

    // Route map sign pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.5, 8), frameMat);
    pole.position.set(3.5, 1.75, 1.8);
    group.add(pole);

    const busBoard = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.6, 0.15),
      new THREE.MeshStandardMaterial({ color: "#F2B544" })
    );
    busBoard.position.set(3.5, 2.5, 1.8);
    group.add(busBoard);

    this.scene.add(group);
  }

  private buildCafe() {
    const group = new THREE.Group();
    group.position.set(-10, 0, -20);

    // Café building
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(12, 8, 9),
      new THREE.MeshStandardMaterial({ color: "#EEC7BC", roughness: 0.7 })
    );
    building.position.y = 4;
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);

    // Dark wood trim and door
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(12.2, 0.8, 9.2),
      new THREE.MeshStandardMaterial({ color: "#2C3E50" })
    );
    trim.position.y = 4.2;
    group.add(trim);

    // Outdoor terrace wooden deck
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.15, 6),
      new THREE.MeshStandardMaterial({ color: "#8E735B" })
    );
    deck.position.set(0, 0.08, 6.5);
    deck.receiveShadow = true;
    group.add(deck);

    // Bistro tables & chairs
    const tableMat = new THREE.MeshStandardMaterial({ color: "#BDC3C7", metalness: 0.4 });
    const parasolMat = new THREE.MeshStandardMaterial({ color: "#4C7A4F" });

    [-3.2, 3.2].forEach((x) => {
      // Table
      const table = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.08, 12), tableMat);
      table.position.set(x, 1.1, 6.5);
      table.castShadow = true;
      group.add(table);

      const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8), tableMat);
      tableLeg.position.set(x, 0.6, 6.5);
      group.add(tableLeg);

      // Chairs
      [-0.9, 0.9].forEach((cz) => {
        const chair = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.6, 0.08),
          new THREE.MeshStandardMaterial({ color: "#C0392B" })
        );
        chair.position.set(x, 0.6, 6.5 + cz);
        chair.rotation.x = cz > 0 ? -0.2 : 0.2;
        group.add(chair);
      });

      // Green Parasol umbrella
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8), tableMat);
      pole.position.set(x, 1.6, 6.5);
      group.add(pole);

      const umbrella = new THREE.Mesh(new THREE.ConeGeometry(2.2, 0.9, 8), parasolMat);
      umbrella.position.set(x, 3.2, 6.5);
      umbrella.castShadow = true;
      group.add(umbrella);
    });

    this.scene.add(group);
    this.buildingBounds.push({ minX: -16.5, maxX: -3.5, minZ: -27, maxZ: -12 });
  }

  private buildCommunityHall() {
    const group = new THREE.Group();
    group.position.set(16, 0, -25);

    // Large social hall
    const hall = new THREE.Mesh(
      new THREE.BoxGeometry(14, 9, 12),
      new THREE.MeshStandardMaterial({ color: "#DFD7C7", roughness: 0.8 })
    );
    hall.position.y = 4.5;
    hall.castShadow = true;
    hall.receiveShadow = true;
    group.add(hall);

    // High pitched roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(12, 4.5, 4),
      new THREE.MeshStandardMaterial({ color: "#7F4F42", roughness: 0.6 })
    );
    roof.position.y = 10.8;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Timber portico columns
    const woodMat = new THREE.MeshStandardMaterial({ color: "#6A4A3A" });
    [-4, 4].forEach((x) => {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 4.5, 8), woodMat);
      column.position.set(x, 2.25, 7.5);
      column.castShadow = true;
      group.add(column);
    });

    this.scene.add(group);
    this.buildingBounds.push({ minX: 9, maxX: 23, minZ: -34, maxZ: -17 });
  }

  private initTrees() {
    this.treesGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: "#6D4C41", roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: "#6E9A5B", roughness: 0.6 });

    const treePositions: [number, number][] = [
      [-5, 12],
      [-26, 2],
      [-16, -10],
      [6, -12],
      [22, 6],
      [8, 26],
      [2, -28],
      [-24, -28],
    ];

    treePositions.forEach(([x, z]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 3.5, 8), trunkMat);
      trunk.position.set(x, 1.75, z);
      trunk.castShadow = true;
      this.treesGroup.add(trunk);

      // Stylized foliage clusters
      const foliage1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 0), leafMat);
      foliage1.position.set(x, 4.5, z);
      foliage1.castShadow = true;
      this.treesGroup.add(foliage1);

      const foliage2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 0), leafMat);
      foliage2.position.set(x + 0.3, 5.8, z + 0.2);
      foliage2.castShadow = true;
      this.treesGroup.add(foliage2);
    });

    this.scene.add(this.treesGroup);
  }

  private initCharacters() {
    const skinTones = ["#F1C7A5", "#D7A17A", "#E6B891", "#C98F6D", "#F2D1AE"];
    const hairTones = ["#4B3027", "#302821", "#6A4836", "#3A3430", "#5B382B"];
    CHARACTERS.forEach((char, index) => {
      const npcGroup = new THREE.Group();
      npcGroup.position.copy(this.getCharacterPosition(char));
      npcGroup.rotation.y = char.rotation;
      addDetailedHumanoid(
        npcGroup,
        char.avatarColor,
        skinTones[index % skinTones.length],
        hairTones[index % hairTones.length],
        index % 2 === 0 ? "#E3B95C" : "#E8D9C6"
      );
      if (char.id === "etienne" || char.id === "camille") {
        const apron = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 0.58, 0.035),
          new THREE.MeshStandardMaterial({ color: char.id === "etienne" ? "#E9D7B5" : "#B2C7A2", roughness: 0.86 })
        );
        apron.position.set(0, 1.24, 0.355);
        apron.castShadow = true;
        npcGroup.add(apron);
      }
      if (char.id === "lucas") {
        const glassesMaterial = new THREE.MeshStandardMaterial({ color: "#28373C", metalness: 0.4 });
        [-0.115, 0.115].forEach((x) => {
          const lens = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 5, 12), glassesMaterial);
          lens.position.set(x, 2.19, 0.31);
          npcGroup.add(lens);
        });
      }

      this.scene.add(npcGroup);
      this.npcMeshes.set(char.id, npcGroup);

      // Sun floor ring (appears when close)
      const ringGeo = new THREE.RingGeometry(1.2, 1.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: "#F2B544",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      const position = this.getCharacterPosition(char);
      ring.position.set(position.x, 0.05, position.z);
      this.scene.add(ring);
      this.npcRingMeshes.set(char.id, ring);

      if (char.id === "mme_laurent") {
        const keyMaterial = new THREE.MeshStandardMaterial({
          color: "#D8B65F",
          metalness: 0.75,
          roughness: 0.32,
        });
        const keyRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 6, 12), keyMaterial);
        keyRing.position.set(0.51, 1.02, 0.13);
        npcGroup.add(keyRing);
        const key = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.28, 0.045), keyMaterial);
        key.position.set(0.62, 0.9, 0.13);
        npcGroup.add(key);
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.045), keyMaterial);
        tooth.position.set(0.67, 0.82, 0.13);
        npcGroup.add(tooth);
      }
    });
  }

  private getCharacterPosition(character: CharacterProfile) {
    if (character.id === "mme_laurent" && (this.dayNumber === 1 || this.dayNumber === 5)) {
      return new THREE.Vector3(-21.2, 0, 13.2);
    }
    return new THREE.Vector3(...character.coords);
  }

  private initAmbientPedestrians() {
    const outfits = [
      ["#3E6678", "#D7A17A", "#302821", "#D9B66E"],
      ["#A85742", "#E6B891", "#6A4836", "#E8D9C6"],
      ["#70804B", "#C98F6D", "#3A3430", "#D5B875"],
      ["#7C5A83", "#F2D1AE", "#5B382B", "#B6C7A0"],
      ["#C69B45", "#F1C7A5", "#4B3027", "#E3B95C"],
      ["#527A76", "#D7A17A", "#302821", "#E8D9C6"],
    ];
    const routes = [
      [new THREE.Vector3(-2.8, 0, -31), new THREE.Vector3(-2.8, 0, -12), new THREE.Vector3(-4.8, 0, -10), new THREE.Vector3(-4.8, 0, 31), new THREE.Vector3(-4.8, 0, -10), new THREE.Vector3(-2.8, 0, -12)],
      [new THREE.Vector3(4.8, 0, 31), new THREE.Vector3(4.8, 0, -31)],
      [new THREE.Vector3(-2.8, 0, -27), new THREE.Vector3(-2.8, 0, -12), new THREE.Vector3(-4.8, 0, -10), new THREE.Vector3(-4.8, 0, 27), new THREE.Vector3(-4.8, 0, -10), new THREE.Vector3(-2.8, 0, -12)],
      [new THREE.Vector3(4.8, 0, 27), new THREE.Vector3(4.8, 0, -27)],
      [new THREE.Vector3(-2.8, 0, 30), new THREE.Vector3(-2.8, 0, -12), new THREE.Vector3(-4.8, 0, -10), new THREE.Vector3(-4.8, 0, 30), new THREE.Vector3(-4.8, 0, -10), new THREE.Vector3(-2.8, 0, -12)],
      [new THREE.Vector3(4.8, 0, -30), new THREE.Vector3(4.8, 0, 30)],
    ];

    outfits.forEach((outfit, index) => {
      const mesh = new THREE.Group();
      addDetailedHumanoid(mesh, outfit[0], outfit[1], outfit[2], outfit[3]);
      mesh.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = false;
          object.receiveShadow = false;
        }
      });
      const route = routes[index];
      mesh.position.copy(route[0]);
      mesh.position.z += index % 2 === 0 ? -index * 1.6 : index * 1.6;
      this.scene.add(mesh);
      this.ambientPedestrians.push({
        mesh,
        route,
        waypoint: 1,
        speed: 1.1 + (index % 3) * 0.18,
        phase: index * 1.7,
      });
    });
  }

  private initPlayer() {
    this.playerMesh = new THREE.Group();
    this.playerMesh.position.copy(this.playerPosition);
    addDetailedHumanoid(this.playerMesh, "#C9472F", "#E6B891", "#3A3430", "#E8D9C6", true);
    this.scene.add(this.playerMesh);
  }

  private initClickIndicator() {
    const geo = new THREE.RingGeometry(0.4, 0.75, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: "#F2B544",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    this.clickIndicator = new THREE.Mesh(geo, mat);
    this.clickIndicator.rotation.x = -Math.PI / 2;
    this.clickIndicator.position.y = 0.05;
    this.scene.add(this.clickIndicator);
  }

  private initParticles() {
    // Warm sun dust particles
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = Math.random() * 12 + 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: "#FFEB99",
      size: 0.18,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    this.dustParticles = new THREE.Points(geometry, material);
    this.scene.add(this.dustParticles);
  }

  private setupEventListeners() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", this.handlePointerDown);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("blur", this.handleWindowBlur);

    // Resize
    window.addEventListener("resize", this.handleResize);
  }

  private handleResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.fov = width < 640 ? 52 : 45;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public setCallbacks(
    onNpcNear: (npc: CharacterProfile | null) => void,
    onAnchorUpdate: (anchors: ProjectedAnchor[]) => void,
    onPlayerMove: (coords: [number, number, number], rot: number) => void
  ) {
    this.onNpcNearCallback = onNpcNear;
    this.onAnchorUpdateCallback = onAnchorUpdate;
    this.onPlayerMoveCallback = onPlayerMove;
  }

  public setCameraMode(mode: "follow" | "conversation", targetNpc?: CharacterProfile | null) {
    this.cameraMode = mode;
    this.activeNpcTarget = targetNpc || null;
    if (mode === "conversation" && targetNpc) {
      this.directionalInputs.clear();
      this.targetPosition = null; // stop player walking

      // Ensure player stands together with the NPC facing each other
      const npcPos = this.getCharacterPosition(targetNpc);
      const dist = this.playerPosition.distanceTo(npcPos);
      if (dist > 2.2 || dist < 0.9) {
        // Conversational stance ~1.6m away
        const conversationOffset = new THREE.Vector3(1.1, 0, 1.1);
        this.playerPosition.copy(npcPos).add(conversationOffset);
        this.playerMesh.position.copy(this.playerPosition);
        this.notifyPlayerPosition(true);
      }
      // Rotate player to face NPC directly
      const toNpc = npcPos.clone().sub(this.playerPosition).normalize();
      this.playerRotation = Math.atan2(toNpc.x, toNpc.z);
      this.playerMesh.rotation.y = this.playerRotation;
    }
  }

  public teleportPlayer(x: number, z: number) {
    const resolved = this.resolvePosition(x, z);
    this.playerPosition.set(resolved.x, 0, resolved.z);
    this.targetPosition = null;
    this.playerMesh.position.copy(this.playerPosition);
    this.lastReportedPlayerPosition = this.playerPosition.clone();
  }

  public movePlayerBy(dx: number, dz: number) {
    if (this.cameraMode === "conversation") return;
    const length = Math.hypot(dx, dz) || 1;
    this.targetPosition = new THREE.Vector3(
      this.playerPosition.x + (dx / length) * 2.4,
      0,
      this.playerPosition.z + (dz / length) * 2.4
    );
  }

  public setDirectionalInput(inputId: string, dx: number, dz: number, active: boolean) {
    if (this.cameraMode === "conversation") return;
    if (active) {
      this.directionalInputs.set(inputId, new THREE.Vector2(dx, dz));
      this.targetPosition = null;
    } else {
      this.directionalInputs.delete(inputId);
      if (this.directionalInputs.size === 0) this.notifyPlayerPosition(true);
    }
  }

  private canOccupy(x: number, z: number) {
    if (Math.abs(x) > 56 || Math.abs(z) > 56) return false;
    const apartmentInteriorActive = this.dayNumber === 1 || this.dayNumber === 5;
    return !this.buildingBounds.some((bounds) => {
      if (apartmentInteriorActive && bounds === this.apartmentBounds && this.isApartmentInteriorAccessible(x, z)) {
        return false;
      }
      return x > bounds.minX - 0.45 && x < bounds.maxX + 0.45 &&
        z > bounds.minZ - 0.45 && z < bounds.maxZ + 0.45;
    });
  }

  private isApartmentInteriorAccessible(x: number, z: number) {
    const insideRoom = x >= -23.45 && x <= -16.55 && z >= 8.55 && z <= 15.45;
    const inDoorway = x >= -21.1 && x <= -18.9 && z > 15.45 && z < this.apartmentBounds.maxZ + 0.45;
    return insideRoom || inDoorway;
  }

  private resolvePosition(x: number, z: number) {
    if (this.canOccupy(x, z)) return new THREE.Vector3(x, 0, z);
    const safeX = THREE.MathUtils.clamp(x, -55, 55);
    const safeZ = THREE.MathUtils.clamp(z, -55, 55);
    let resolvedX = safeX;
    let resolvedZ = safeZ;
    for (const bounds of this.buildingBounds) {
      if ((this.dayNumber === 1 || this.dayNumber === 5) &&
        bounds === this.apartmentBounds &&
        this.isApartmentInteriorAccessible(resolvedX, resolvedZ)) continue;
      if (resolvedX > bounds.minX - 0.45 && resolvedX < bounds.maxX + 0.45 &&
          resolvedZ > bounds.minZ - 0.45 && resolvedZ < bounds.maxZ + 0.45) {
        const edges = [
          { x: bounds.minX - 0.46, z: resolvedZ },
          { x: bounds.maxX + 0.46, z: resolvedZ },
          { x: resolvedX, z: bounds.minZ - 0.46 },
          { x: resolvedX, z: bounds.maxZ + 0.46 },
        ];
        const nearest = edges.reduce((best, edge) =>
          Math.hypot(edge.x - x, edge.z - z) < Math.hypot(best.x - x, best.z - z) ? edge : best
        );
        resolvedX = nearest.x;
        resolvedZ = nearest.z;
      }
    }
    return new THREE.Vector3(resolvedX, 0, resolvedZ);
  }

  private updateMovement(delta: number) {
    this.playerSaveElapsed += delta;
    const heldDirection = new THREE.Vector2();
    this.directionalInputs.forEach((direction) => heldDirection.add(direction));

    if (heldDirection.lengthSq() > 0) {
      heldDirection.normalize();
      this.targetPosition = null;
      this.advancePlayer(heldDirection.x, heldDirection.y, delta);
    } else if (this.targetPosition) {
      const direction = this.targetPosition.clone().sub(this.playerPosition);
      const distance = direction.length();
      if (distance > 0.15) {
        direction.normalize();
        this.advancePlayer(direction.x, direction.z, delta, distance);
      } else {
        this.playerPosition.copy(this.targetPosition);
        this.playerMesh.position.copy(this.playerPosition);
        this.targetPosition = null;
        this.isWalking = false;
        this.notifyPlayerPosition(true);
      }
    } else {
      this.isWalking = false;
      this.playerMesh.position.y = 0;
    }

    this.updateAmbientPedestrians(delta);

    // Fade click indicator
    const clickMat = this.clickIndicator.material as THREE.MeshBasicMaterial;
    if (clickMat.opacity > 0) {
      clickMat.opacity -= delta * 2.5;
      this.clickIndicator.scale.multiplyScalar(1 + delta * 0.8);
      if (clickMat.opacity <= 0) {
        this.clickIndicator.scale.set(1, 1, 1);
      }
    }
  }

  private advancePlayer(dx: number, dz: number, delta: number, maxDistance = Number.POSITIVE_INFINITY) {
    const length = Math.hypot(dx, dz);
    if (length === 0) return;
    const directionX = dx / length;
    const directionZ = dz / length;
    const stepDistance = Math.min(this.moveSpeed * delta, maxDistance);
    const nextX = this.playerPosition.x + directionX * stepDistance;
    const nextZ = this.playerPosition.z + directionZ * stepDistance;
    const currentX = this.playerPosition.x;
    const currentZ = this.playerPosition.z;

    if (this.canOccupy(nextX, nextZ)) {
      this.playerPosition.set(nextX, 0, nextZ);
    } else {
      if (this.canOccupy(nextX, this.playerPosition.z)) this.playerPosition.x = nextX;
      if (this.canOccupy(this.playerPosition.x, nextZ)) this.playerPosition.z = nextZ;
      if (this.playerPosition.x === currentX && this.playerPosition.z === currentZ) {
        this.targetPosition = null;
        if (this.directionalInputs.size === 0) this.notifyPlayerPosition(true);
        return;
      }
    }

    const actualX = this.playerPosition.x - currentX;
    const actualZ = this.playerPosition.z - currentZ;
    this.isWalking = true;
    this.walkClock += delta * 12;
    this.playerRotation = Math.atan2(actualX, actualZ);
    this.playerMesh.rotation.y = this.playerRotation;
    this.playerMesh.position.set(
      this.playerPosition.x,
      Math.sin(this.walkClock) * 0.08,
      this.playerPosition.z
    );
    this.notifyPlayerPosition();
  }

  private notifyPlayerPosition(force = false) {
    if (!this.onPlayerMoveCallback) return;
    const distanceSinceReport = this.lastReportedPlayerPosition
      ? this.lastReportedPlayerPosition.distanceTo(this.playerPosition)
      : Number.POSITIVE_INFINITY;
    if (distanceSinceReport < 0.01) return;
    if (!force && this.playerSaveElapsed < 0.5 && distanceSinceReport < 0.5) return;

    this.onPlayerMoveCallback(
      [this.playerPosition.x, 0, this.playerPosition.z],
      this.playerRotation
    );
    this.lastReportedPlayerPosition = this.playerPosition.clone();
    this.playerSaveElapsed = 0;
  }

  private updateAmbientPedestrians(delta: number) {
    this.ambientPedestrians.forEach((pedestrian) => {
      const destination = pedestrian.route[pedestrian.waypoint];
      const direction = destination.clone().sub(pedestrian.mesh.position);
      const distance = direction.length();
      if (distance < 0.35) {
        pedestrian.waypoint = (pedestrian.waypoint + 1) % pedestrian.route.length;
        return;
      }

      direction.normalize();
      pedestrian.mesh.position.addScaledVector(direction, Math.min(pedestrian.speed * delta, distance));
      pedestrian.mesh.rotation.y = Math.atan2(direction.x, direction.z);
      pedestrian.phase += delta * 7;
      pedestrian.mesh.position.y = Math.abs(Math.sin(pedestrian.phase)) * 0.045;
    });
  }

  private updateCamera(delta: number) {
    if (this.cameraMode === "conversation" && this.activeNpcTarget) {
      // Frame both characters from the visible side of their current location.
      const npcPos = this.getCharacterPosition(this.activeNpcTarget);
      const midpoint = this.playerPosition.clone().add(npcPos).multiplyScalar(0.5);

      // Elevated camera offset to the right so characters are centered in visible viewport area
      const cameraSide = this.activeNpcTarget.id === "etienne" ? -5.5 : 5.5;
      const camTargetPos = midpoint.clone().add(new THREE.Vector3(2.0, 4.8, cameraSide));
      const lookTarget = midpoint.clone().add(new THREE.Vector3(-0.3, 1.1, 0));

      this.currentCameraPos.lerp(camTargetPos, delta * 3.5);
      this.currentLookAt.lerp(lookTarget, delta * 3.5);
    } else {
      // Follow cam: comfortably elevated, behind player
      const desiredPos = this.playerPosition.clone().add(this.cameraOffset);
      const desiredLookAt = this.playerPosition.clone().add(new THREE.Vector3(0, 1.0, 0));

      this.currentCameraPos.lerp(desiredPos, delta * 3.5);
      this.currentLookAt.lerp(desiredLookAt, delta * 3.5);
    }

    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentLookAt);
  }

  private updateNpcProximity() {
    let closestNpc: CharacterProfile | null = null;
    let minDistance = 3.8;

    for (let index = 0; index < CHARACTERS.length; index += 1) {
      const char = CHARACTERS[index];
      const charPos = this.getCharacterPosition(char);
      const dist = this.playerPosition.distanceTo(charPos);
      const ringMesh = this.npcRingMeshes.get(char.id);

      if (dist < minDistance) {
        closestNpc = char;
        // Fade in floor ring
        if (ringMesh) {
          (ringMesh.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(
            (ringMesh.material as THREE.MeshBasicMaterial).opacity,
            0.8,
            0.15
          );
        }
      } else {
        // Fade out floor ring
        if (ringMesh) {
          (ringMesh.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(
            (ringMesh.material as THREE.MeshBasicMaterial).opacity,
            0,
            0.15
          );
        }
      }
    }

    if (closestNpc?.id !== this.lastNearNpcId) {
      this.lastNearNpcId = closestNpc?.id ?? null;
      this.onNpcNearCallback?.(closestNpc);
    }
  }

  private updateProjectedAnchors() {
    const anchors: ProjectedAnchor[] = [];
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // NPC NameTags & Prompts
    CHARACTERS.forEach((char) => {
      const charPos = this.getCharacterPosition(char).add(new THREE.Vector3(0, 2.75, 0));
      const dist = this.playerPosition.distanceTo(charPos);
      const screenPos = charPos.project(this.camera);
      let normalizedX = screenPos.x;
      let normalizedY = screenPos.y;
      if (screenPos.z > 1) {
        normalizedX *= -1;
        normalizedY *= -1;
      }
      const offscreen =
        screenPos.z < -1 ||
        screenPos.z > 1 ||
        normalizedX < -0.78 ||
        normalizedX > 0.78 ||
        normalizedY < -0.78 ||
        normalizedY > 0.78;
      const edgeX = THREE.MathUtils.clamp(normalizedX, -0.78, 0.78);
      const edgeY = THREE.MathUtils.clamp(normalizedY, -0.78, 0.78);
      const horizontalPadding = Math.min(130, width / 2);
      const safeX = THREE.MathUtils.clamp(
        (edgeX * 0.5 + 0.5) * width,
        horizontalPadding,
        Math.max(horizontalPadding, width - horizontalPadding)
      );
      const safeY = THREE.MathUtils.clamp((-(edgeY * 0.5) + 0.5) * height, 54, Math.max(54, height - 60));

      anchors.push({
        id: char.id,
        type: "npc",
        name: char.displayName,
        role: char.role,
        x: safeX,
        y: safeY,
        visible: true,
        distance: Math.round(dist),
        offscreen,
      });
    });

    const changed = anchors.length !== this.lastProjectedAnchors.length ||
      anchors.some((anchor, index) => {
        const previous = this.lastProjectedAnchors[index];
        return !previous || previous.id !== anchor.id ||
          previous.offscreen !== anchor.offscreen ||
          previous.distance !== anchor.distance ||
          Math.abs(previous.x - anchor.x) > 2 ||
          Math.abs(previous.y - anchor.y) > 2;
      });
    if (changed) {
      this.lastProjectedAnchors = anchors;
      this.onAnchorUpdateCallback?.(anchors);
    }
  }

  private startLoop() {
    let lastTime = performance.now();

    const loop = () => {
      this.animFrameId = requestAnimationFrame(loop);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      this.updateMovement(delta);
      this.updateCamera(delta);
      this.proximityUpdateElapsed += delta;
      this.anchorUpdateElapsed += delta;
      if (this.proximityUpdateElapsed >= 0.1) {
        this.updateNpcProximity();
        this.proximityUpdateElapsed = 0;
      }
      if (this.anchorUpdateElapsed >= 0.075) {
        this.updateProjectedAnchors();
        this.anchorUpdateElapsed = 0;
      }

      // Subtle tree sway & particles drift
      if (this.treesGroup) {
        this.treesGroup.children.forEach((child, i) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.DodecahedronGeometry) {
            child.rotation.y = Math.sin(now * 0.001 + i) * 0.05;
          }
        });
      }

      this.renderer.render(this.scene, this.camera);
    };

    loop();
  }

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.renderer.domElement.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("blur", this.handleWindowBlur);
    window.removeEventListener("resize", this.handleResize);
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
