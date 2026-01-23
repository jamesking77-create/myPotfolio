function createLanyardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1024;

  const ctx = canvas.getContext("2d");

  // Fabric base
  ctx.fillStyle = "#1f2933";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle fabric noise
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      1,
      1
    );
  }

  // Text
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 42px Inter, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let y = -600; y <= 600; y += 160) {
    ctx.fillText("JAMES_KING", 0, y);
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 6);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}
