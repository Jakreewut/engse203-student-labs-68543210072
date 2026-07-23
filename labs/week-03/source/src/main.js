import './style.css';

const form = document.querySelector('#request-form');

// TODO 1: query preview/status/list elements
const preview = {
  name: document.querySelector('#preview-name'),
  type: document.querySelector('#preview-type'),
  details: document.querySelector('#preview-details'),
};
const statusElement = document.querySelector('#form-status');
const listElement = document.querySelector('#request-list');
const requests = [];


// TODO 2: readForm()
function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

// TODO 3: renderPreview(data)
function renderPreview(data) {
  preview.name.textContent = data.displayName || 'ยังไม่ระบุชื่อ';
  preview.type.textContent = data.requestType || 'ยังไม่เลือกประเภท';
  preview.details.textContent = data.requestDetails || 'ยังไม่มีรายละเอียด';
}

// TODO 4: validate(data)
function validate(data) {
  const errors = {};
  if (data.displayName.trim().length < 2) {
    errors.displayName = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
  }
  if (!data.requestType) {
    errors.requestType = 'กรุณาเลือกประเภทคำขอ';
  }
  if (data.requestDetails.trim().length < 10) {
    errors.requestDetails = 'กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร';
  }
  return errors;
}

// TODO 5: renderErrors(errors)
function renderErrors(errors) {
  for (const name of ['displayName', 'requestType', 'requestDetails']) {
    const field = form.elements[name];
    const output = document.querySelector(`#${name}-error`);
    const message = errors[name] || '';

    output.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  }
}

function renderStatus(state, message) {
  statusElement.dataset.state = state;
  statusElement.textContent = message;
}

function renderList() {
  listElement.innerHTML = '';
  if (requests.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'ยังไม่มีคำร้องขอ';
    listElement.appendChild(li);
    return;
  }
  requests.forEach(req => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${req.displayName}</strong> (${req.requestType}): <span>${req.requestDetails}</span>`;
    listElement.appendChild(li);
  });
}


// TODO 6: input and submit listeners
form.addEventListener('input', () => {
  const data = readForm();
  renderPreview(data);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readForm();
  const errors = validate(data);
  renderErrors(errors);

  if (Object.keys(errors).length > 0) {
    renderStatus('invalid', 'ยังบันทึกไม่ได้ กรุณาตรวจสอบข้อมูล');
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  requests.push(data);
  renderList();

  renderStatus('success', `ส่งคำร้องขอของ ${data.displayName} เรียบร้อย`);
  form.reset();
});

form.addEventListener('reset', () => {
  // ใช้ queueMicrotask เพื่อให้แน่ใจว่าฟอร์ม reset ตัวเองเสร็จก่อน
  // แล้วจึงอ่านค่าจากฟอร์ม (ที่ว่างเปล่า) เพื่ออัปเดต UI
  queueMicrotask(() => {
    renderPreview(readForm());
    renderErrors({});
    renderStatus('idle', 'กรุณากรอกข้อมูลคำร้องขอ');
  });
});

renderStatus('idle', 'กรุณากรอกข้อมูลคำร้องขอ');
renderList();