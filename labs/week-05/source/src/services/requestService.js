// TODO 5B-1: เปิดใช้งาน Storage
import { clearStoredRequests, readStoredRequests, writeStoredRequests } from './requestStorage.js';

const LAB_DELAY_MS = 420;

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForLabDelay() {
  await delay(globalThis.__ENGSE203_SKIP_DELAY__ ? 0 : LAB_DELAY_MS);
}

/**
 * TODO 5A-1 · อ่านข้อมูลตัวอย่าง
 */
async function fetchSeedRequests() {
  const baseUrl = import.meta.env?.BASE_URL ?? '/';
  const response = await fetch(`${baseUrl}data/initialRequests.json`);
  if (!response.ok) throw new Error('ไม่สามารถโหลดข้อมูลตัวอย่างได้');
  return structuredClone(await response.json());
}

/**
 * TODO 5A-2 และ TODO 5B-3 · คืนข้อมูลได้ / สลับไปใช้การโหลดปกติ
 */
export async function getRequests(options = {}) {
  await waitForLabDelay();

  if (options.scenario === 'error') {
    throw new Error('LAB scenario: จำลองการโหลดข้อมูลไม่สำเร็จ');
  }
  if (options.scenario === 'empty') {
    return [];
  }

  return loadNormalRequests(options.onRecovery);
}

/**
 * TODO 5A-3 · หาคำร้องใบเดียว
 */
export async function getRequestById(requestId) {
  const requests = await getRequests();
  return requests.find((request) => request.id === requestId) ?? null;
}

/**
 * TODO 5B-2 · อ่านจากที่เก็บก่อน
 */
async function loadNormalRequests(onRecovery) {
  const stored = readStoredRequests();
  if (stored.status === 'valid') return stored.requests;

  const seedRequests = await fetchSeedRequests();
  writeStoredRequests(seedRequests);

  if (stored.status === 'invalid') {
    onRecovery?.('พบข้อมูลเดิมที่อ่านไม่ได้ ระบบจึงกู้ข้อมูลตัวอย่างให้แล้ว');
  }
  return seedRequests;
}

/**
 * TODO 5B-4 · เพิ่มคำร้องใหม่
 */
export async function addRequest(requestInput) {
  validateRequestInput(requestInput);
  const requests = await getRequests();
  const newRequest = {
    id: createRequestId(requests),
    requesterName: requestInput.requesterName.trim(),
    requestType: requestInput.requestType,
    location: requestInput.location.trim(),
    details: requestInput.details.trim(),
    priority: requestInput.priority,
    status: 'pending',
  };
  writeStoredRequests([...requests, newRequest]);
  return structuredClone(newRequest);
}

/**
 * TODO 5B-5 · ลบคำร้องตามรหัส
 */
export async function deleteRequest(requestId) {
  const requests = await getRequests();
  const nextRequests = requests.filter((request) => request.id !== requestId);
  writeStoredRequests(nextRequests);
  return structuredClone(nextRequests);
}

/**
 * TODO 5B-6 · คืนค่าข้อมูลตัวอย่างเริ่มต้น
 */
export async function resetRequests() {
  clearStoredRequests();    
  const seedRequests = await fetchSeedRequests();
  writeStoredRequests(seedRequests);
  return structuredClone(seedRequests);
}

function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateRequestInput(input) {
  if (!input) throw new Error('ข้อมูลคำร้องไม่ถูกต้อง');
  if (readText(input.requesterName).length < 2) throw new Error('ชื่อผู้แจ้งไม่ถูกต้อง');
  if (!readText(input.requestType)) throw new Error('กรุณาเลือกประเภทคำร้อง');
  if (!readText(input.location)) throw new Error('กรุณาระบุสถานที่');
  if (readText(input.details).length < 10) throw new Error('รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร');
  if (!['normal', 'urgent'].includes(input.priority)) throw new Error('ความเร่งด่วนไม่ถูกต้อง');
}

function createRequestId(requests) {
  let id;
  do {
    const time = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    id = `REQ-${time}-${random}`; // แก้ไขบั๊ก String Literal บรรทัดนี้
  } while (requests.some((request) => request.id === id));
  return id;
}