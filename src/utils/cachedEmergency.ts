import fs from "fs";

const cacheDir = "cached";
const emergencyPath = `${cacheDir}/emergency-latest.json`;

function ensureDir() {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }
}

export function loadLastEmergency(): any | null {
  ensureDir();

  if (fs.existsSync(emergencyPath)) {
    try {
      const content = fs.readFileSync(emergencyPath, "utf8");
      return JSON.parse(content);
    } catch {}
  }

  return null;
}

export function saveLastEmergency(emergency: any) {
  ensureDir();
  fs.writeFileSync(emergencyPath, JSON.stringify(emergency, null, 2));
}

export function hasEmergencyChanged(newEmergency: any): boolean {
  const last = loadLastEmergency();

  if (!last) return true;

  return (
    last.title !== newEmergency.title ||
    last.body !== newEmergency.body ||
    last.hidden !== newEmergency.hidden
  );
}
