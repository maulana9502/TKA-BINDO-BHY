import * as THREE from 'three';
import type { AvatarConfig, CompanionType, FaceExpression } from '../types/game';

export interface AvatarRig {
  group: THREE.Group;
  head: THREE.Mesh;
  leftArmPivot: THREE.Group;
  rightArmPivot: THREE.Group;
  leftLegPivot: THREE.Group;
  rightLegPivot: THREE.Group;
  companionPivot: THREE.Group;
  companionWingL?: THREE.Mesh;
  companionWingR?: THREE.Mesh;
  nametagSprite: THREE.Sprite;
  config: AvatarConfig;
  walkPhase: number;
  dispose: () => void;
}

function createFaceTexture(expression: FaceExpression, skinColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = skinColor;
  ctx.fillRect(0, 0, 256, 256);

  // Subtle cheek blush
  ctx.fillStyle = 'rgba(244, 114, 182, 0.22)';
  ctx.beginPath();
  ctx.arc(60, 152, 20, 0, Math.PI * 2);
  ctx.arc(196, 152, 20, 0, Math.PI * 2);
  ctx.fill();

  if (expression === 'cool') {
    // Sunglasses
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(36, 86, 82, 42);
    ctx.fillRect(138, 86, 82, 42);
    ctx.fillRect(114, 96, 28, 12);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.fillRect(44, 92, 26, 14);
    ctx.fillRect(146, 92, 26, 14);
    // Confident smirk
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(128, 168, 34, 0.15 * Math.PI, 0.78 * Math.PI);
    ctx.stroke();
  } else {
    // Eyes
    ctx.fillStyle = '#0f172a';
    if (expression === 'excited') {
      ctx.beginPath();
      ctx.arc(82, 108, 17, 0, Math.PI * 2);
      ctx.arc(174, 108, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(88, 102, 6, 0, Math.PI * 2);
      ctx.arc(180, 102, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(82, 108, 13, 17, 0, 0, Math.PI * 2);
      ctx.ellipse(174, 108, 13, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(86, 102, 5, 0, Math.PI * 2);
      ctx.arc(178, 102, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyebrows
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    if (expression === 'focus') {
      ctx.beginPath();
      ctx.moveTo(60, 82);
      ctx.lineTo(100, 90);
      ctx.moveTo(196, 82);
      ctx.lineTo(156, 90);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(64, 80);
      ctx.quadraticCurveTo(82, 72, 100, 80);
      ctx.moveTo(156, 80);
      ctx.quadraticCurveTo(174, 72, 192, 80);
      ctx.stroke();
    }

    // Mouth
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    ctx.beginPath();
    if (expression === 'excited') {
      ctx.fillStyle = '#be123c';
      ctx.arc(128, 166, 30, 0, Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (expression === 'focus') {
      ctx.moveTo(104, 178);
      ctx.lineTo(152, 175);
      ctx.stroke();
    } else {
      ctx.arc(128, 162, 30, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTorsoTexture(shirtColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = shirtColor;
  ctx.fillRect(0, 0, 256, 256);

  // Collar V & pocket accent
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.beginPath();
  ctx.moveTo(88, 0);
  ctx.lineTo(128, 42);
  ctx.lineTo(168, 0);
  ctx.closePath();
  ctx.fill();

  // School emblem badge
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(156, 72, 34, 40);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4;
  ctx.strokeRect(156, 72, 34, 40);

  // Belt / hoodie hem
  ctx.fillStyle = 'rgba(15,23,42,0.28)';
  ctx.fillRect(0, 224, 256, 32);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createNametagTexture(
  name: string,
  className: string,
  level: number,
  completedCount: number,
  answeredCount: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 144);

  // Crisp dark rounded container
  ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
  ctx.beginPath();
  ctx.roundRect(16, 12, 480, 120, 22);
  ctx.fill();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Line 1: Name & Class
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 34px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  const titleText = `${name.slice(0, 18)} · ${className.slice(0, 10)}`;
  ctx.fillText(titleText, 256, 62);

  // Line 2: Level · Bab · Soal
  ctx.fillStyle = '#fbbf24';
  ctx.font = '600 25px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Lv.${level} · Bab ${completedCount}/11 · ${answeredCount} Soal`, 256, 106);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildCompanionMesh(
  type: CompanionType,
  colorHex: string
): { pivot: THREE.Group; wingL?: THREE.Mesh; wingR?: THREE.Mesh } {
  const pivot = new THREE.Group();
  const mainMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.35,
    metalness: type === 'robot' ? 0.65 : 0.15,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    roughness: 0.25,
    metalness: 0.75,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: type === 'robot' ? '#38bdf8' : '#0f172a',
    emissive: type === 'robot' ? '#0284c7' : '#000000',
    emissiveIntensity: type === 'robot' ? 1.2 : 0,
    roughness: 0.2,
  });

  let wingL: THREE.Mesh | undefined;
  let wingR: THREE.Mesh | undefined;

  if (type === 'garuda') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.48), mainMat);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.34), mainMat);
    head.position.set(0, 0.34, 0.08);
    const crest = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 4), accentMat);
    crest.position.set(0, 0.56, 0.04);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 4), accentMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.32, 0.32);

    wingL = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.28), accentMat);
    wingL.position.set(-0.4, 0.08, 0);
    wingR = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.28), accentMat);
    wingR.position.set(0.4, 0.08, 0);

    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.04), eyeMat);
    eyeL.position.set(-0.1, 0.38, 0.25);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.1;

    pivot.add(body, head, crest, beak, wingL, wingR, eyeL, eyeR);
  } else if (type === 'robot') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.44), mainMat);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.06), eyeMat);
    visor.position.set(0, 0.06, 0.22);
    const antennaStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 8), accentMat);
    antennaStem.position.set(0, 0.35, 0);
    const antennaOrb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), eyeMat);
    antennaOrb.position.set(0, 0.48, 0);
    const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.14, 12), accentMat);
    thruster.position.set(0, -0.3, 0);
    pivot.add(body, visor, antennaStem, antennaOrb, thruster);
  } else if (type === 'cat') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.38, 0.46), mainMat);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.34, 0.36), mainMat);
    head.position.set(0, 0.32, 0.06);
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 4), accentMat);
    earL.position.set(-0.12, 0.56, 0.06);
    const earR = earL.clone();
    earR.position.x = 0.12;
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), eyeMat);
    eyeL.position.set(-0.1, 0.34, 0.24);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.1;
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.34, 0.1), mainMat);
    tail.position.set(0, 0.15, -0.28);
    tail.rotation.x = -0.45;
    pivot.add(body, head, earL, earR, eyeL, eyeR, tail);
  } else {
    // Dragon mascot
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.4, 0.52), mainMat);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.42), mainMat);
    head.position.set(0, 0.34, 0.1);
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 6), accentMat);
    hornL.position.set(-0.11, 0.56, 0.02);
    const hornR = hornL.clone();
    hornR.position.x = 0.11;
    wingL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.3), accentMat);
    wingL.position.set(-0.38, 0.12, -0.02);
    wingR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.3), accentMat);
    wingR.position.set(0.38, 0.12, -0.02);
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.04), eyeMat);
    eyeL.position.set(-0.1, 0.38, 0.31);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.1;
    pivot.add(body, head, hornL, hornR, wingL, wingR, eyeL, eyeR);
  }

  pivot.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = true;
    }
  });
  return { pivot, wingL, wingR };
}

export function buildRobloxAvatar(
  config: AvatarConfig,
  meta: {
    name: string;
    className: string;
    level: number;
    completedCount: number;
    answeredCount: number;
  }
): AvatarRig {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const skinMat = new THREE.MeshStandardMaterial({
    color: config.skinColor,
    roughness: 0.65,
    metalness: 0.05,
  });
  const faceTex = createFaceTexture(config.expression, config.skinColor);
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTex,
    roughness: 0.6,
    metalness: 0.05,
  });
  const torsoTex = createTorsoTexture(config.shirtColor);
  const torsoFrontMat = new THREE.MeshStandardMaterial({
    map: torsoTex,
    roughness: 0.72,
    metalness: 0.05,
  });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: config.shirtColor,
    roughness: 0.72,
    metalness: 0.05,
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: config.pantsColor,
    roughness: 0.8,
    metalness: 0.05,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.45,
    metalness: 0.2,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: config.hairColor,
    roughness: 0.55,
    metalness: 0.1,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    roughness: 0.3,
    metalness: 0.75,
  });

  disposables.push(faceTex, torsoTex, skinMat, faceMat, torsoFrontMat, shirtMat, pantsMat, shoeMat, hairMat, accentMat);

  // Contact shadow disc
  const shadowGeo = new THREE.CircleGeometry(0.62, 20);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: '#000000',
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.025;
  group.add(contactShadow);
  disposables.push(shadowGeo, shadowMat);

  // Legs (hip pivot at y = 0.85)
  const legGeo = new THREE.BoxGeometry(0.36, 0.72, 0.38);
  const shoeGeo = new THREE.BoxGeometry(0.38, 0.16, 0.46);
  disposables.push(legGeo, shoeGeo);

  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.2, 0.85, 0);
  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.y = -0.36;
  leftLeg.castShadow = true;
  const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
  leftShoe.position.set(0, -0.77, 0.04);
  leftShoe.castShadow = true;
  leftLegPivot.add(leftLeg, leftShoe);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.2, 0.85, 0);
  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.y = -0.36;
  rightLeg.castShadow = true;
  const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
  rightShoe.position.set(0, -0.77, 0.04);
  rightShoe.castShadow = true;
  rightLegPivot.add(rightLeg, rightShoe);

  group.add(leftLegPivot, rightLegPivot);

  // Torso (y = 0.85..1.65 -> center 1.25)
  const torsoGeo = new THREE.BoxGeometry(0.84, 0.8, 0.46);
  disposables.push(torsoGeo);
  const torso = new THREE.Mesh(torsoGeo, [
    shirtMat,
    shirtMat,
    shirtMat,
    shirtMat,
    torsoFrontMat,
    shirtMat,
  ]);
  torso.position.y = 1.25;
  torso.castShadow = true;
  group.add(torso);

  // School Backpack
  const packGeo = new THREE.BoxGeometry(0.6, 0.62, 0.24);
  const packMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.7, metalness: 0.15 });
  const pack = new THREE.Mesh(packGeo, packMat);
  pack.position.set(0, 1.24, -0.34);
  pack.castShadow = true;
  const packStrap = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.06), accentMat);
  packStrap.position.set(0, 1.35, -0.45);
  group.add(pack, packStrap);
  disposables.push(packGeo, packMat);

  // Arms (shoulder pivot at y = 1.6)
  const sleeveGeo = new THREE.BoxGeometry(0.32, 0.42, 0.34);
  const handGeo = new THREE.BoxGeometry(0.28, 0.36, 0.3);
  disposables.push(sleeveGeo, handGeo);

  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.6, 1.6, 0);
  const leftSleeve = new THREE.Mesh(sleeveGeo, shirtMat);
  leftSleeve.position.y = -0.21;
  leftSleeve.castShadow = true;
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.y = -0.58;
  leftHand.castShadow = true;
  leftArmPivot.add(leftSleeve, leftHand);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.6, 1.6, 0);
  const rightSleeve = new THREE.Mesh(sleeveGeo, shirtMat);
  rightSleeve.position.y = -0.21;
  rightSleeve.castShadow = true;
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.y = -0.58;
  rightHand.castShadow = true;
  rightArmPivot.add(rightSleeve, rightHand);

  group.add(leftArmPivot, rightArmPivot);

  // Head (y = 1.65..2.31 -> center 1.98)
  const headGeo = new THREE.BoxGeometry(0.68, 0.64, 0.64);
  disposables.push(headGeo);
  const head = new THREE.Mesh(headGeo, [
    skinMat,
    skinMat,
    skinMat,
    skinMat,
    faceMat,
    skinMat,
  ]);
  head.position.y = 1.98;
  head.castShadow = true;
  group.add(head);

  // Hair / Hat accessories attached to head
  if (config.hairStyle === 'cap') {
    const capCrown = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.24, 0.7), hairMat);
    capCrown.position.set(0, 0.32, 0);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.34), accentMat);
    visor.position.set(0, 0.22, 0.42);
    head.add(capCrown, visor);
  } else if (config.hairStyle === 'crown') {
    const baseHair = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.68), hairMat);
    baseHair.position.set(0, 0.28, -0.02);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.18, 8), accentMat);
    ring.position.set(0, 0.45, 0);
    head.add(baseHair, ring);
  } else if (config.hairStyle === 'headset') {
    const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.68), hairMat);
    hairTop.position.set(0, 0.28, -0.02);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.05, 8, 20, Math.PI), accentMat);
    band.position.set(0, 0.16, 0);
    const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.1, 12), accentMat);
    earL.rotation.z = Math.PI / 2;
    earL.position.set(-0.38, 0.02, 0);
    const earR = earL.clone();
    earR.position.x = 0.38;
    head.add(hairTop, band, earL, earR);
  } else if (config.hairStyle === 'peci') {
    const peci = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.28, 0.66), new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.8 }));
    peci.position.set(0, 0.36, 0);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.68), accentMat);
    trim.position.set(0, 0.26, 0);
    head.add(peci, trim);
  } else if (config.hairStyle === 'beanie') {
    const beanie = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.28, 0.68), hairMat);
    beanie.position.set(0, 0.32, 0);
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), accentMat);
    pom.position.set(0, 0.5, 0);
    head.add(beanie, pom);
  } else {
    // neat hair
    const topHair = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.2, 0.68), hairMat);
    topHair.position.set(0, 0.3, -0.02);
    const backHair = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.42, 0.16), hairMat);
    backHair.position.set(0, 0.12, -0.28);
    head.add(topHair, backHair);
  }

  // Companion mascot hovering next to shoulder
  const { pivot: companionPivot, wingL: companionWingL, wingR: companionWingR } = buildCompanionMesh(
    config.companionType,
    config.companionColor
  );
  companionPivot.position.set(1.18, 1.85, -0.25);
  group.add(companionPivot);

  // Floating 3D Nametag
  const nametagTex = createNametagTexture(
    meta.name,
    meta.className,
    meta.level,
    meta.completedCount,
    meta.answeredCount
  );
  const spriteMat = new THREE.SpriteMaterial({
    map: nametagTex,
    transparent: true,
    depthWrite: false,
  });
  const nametagSprite = new THREE.Sprite(spriteMat);
  nametagSprite.position.set(0, 2.95, 0);
  nametagSprite.scale.set(2.9, 0.82, 1);
  group.add(nametagSprite);
  disposables.push(nametagTex, spriteMat);

  return {
    group,
    head,
    leftArmPivot,
    rightArmPivot,
    leftLegPivot,
    rightLegPivot,
    companionPivot,
    companionWingL,
    companionWingR,
    nametagSprite,
    config,
    walkPhase: 0,
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    },
  };
}

export function animateAvatarRig(
  rig: AvatarRig,
  speed: number,
  dt: number,
  elapsed: number
): void {
  const isMoving = speed > 0.2;
  if (isMoving) {
    rig.walkPhase += dt * Math.min(14, 5 + speed * 0.9);
    const swing = Math.sin(rig.walkPhase) * 0.72;
    rig.leftLegPivot.rotation.x = swing;
    rig.rightLegPivot.rotation.x = -swing;
    rig.leftArmPivot.rotation.x = -swing * 0.8;
    rig.rightArmPivot.rotation.x = swing * 0.8;
    rig.head.position.y = 1.98 + Math.abs(Math.sin(rig.walkPhase)) * 0.04;
  } else {
    rig.leftLegPivot.rotation.x = THREE.MathUtils.damp(rig.leftLegPivot.rotation.x, 0, 10, dt);
    rig.rightLegPivot.rotation.x = THREE.MathUtils.damp(rig.rightLegPivot.rotation.x, 0, 10, dt);
    rig.leftArmPivot.rotation.x = THREE.MathUtils.damp(rig.leftArmPivot.rotation.x, 0, 10, dt);
    rig.rightArmPivot.rotation.x = THREE.MathUtils.damp(rig.rightArmPivot.rotation.x, 0, 10, dt);
    rig.head.position.y = 1.98 + Math.sin(elapsed * 2.2) * 0.015;
  }

  // Hovering companion bob & wing flap
  rig.companionPivot.position.y = 1.85 + Math.sin(elapsed * 3.1) * 0.16;
  rig.companionPivot.rotation.y = Math.sin(elapsed * 1.4) * 0.2;
  if (rig.companionWingL && rig.companionWingR) {
    const flap = Math.sin(elapsed * 10) * 0.35;
    rig.companionWingL.rotation.z = flap;
    rig.companionWingR.rotation.z = -flap;
  }
}
