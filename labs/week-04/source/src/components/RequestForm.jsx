import { useState } from 'react';

const initialFormState = {
  requesterName: '',
  requestType: '',
  location: '',
  details: '',
  priority: 'normal',
};

function RequestForm({ onAddRequest }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    // TODO LAB4-R05–R07: validate controlled state แล้วเรียก onAddRequest
    const newErrors = {};
    if (!formData.requesterName.trim()) {
      newErrors.requesterName = 'กรุณากรอกชื่อผู้แจ้ง';
    }
    if (!formData.requestType) {
      newErrors.requestType = 'กรุณาเลือกประเภทคำร้อง';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onAddRequest(formData);
      setFormData(initialFormState);
      setStatusMessage('เพิ่มคำร้องสำเร็จ');
      setTimeout(() => setStatusMessage(''), 3000);
    } else {
      setStatusMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  return (
    <section className="panel" aria-labelledby="request-form-title">
      <p className="eyebrow dark">CONTROLLED FORM</p>
      <h2 id="request-form-title">สร้างคำร้องใหม่</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>
          <input
            id="requesterName"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
            aria-invalid={!!errors.requesterName}
          />
          {errors.requesterName && <small className="error">{errors.requesterName}</small>}
        </div>

        <div className="field">
          <label htmlFor="requestType">ประเภทคำร้อง</label>
          <select
            id="requestType"
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            aria-invalid={!!errors.requestType}
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="แจ้งซ่อม">แจ้งซ่อม</option>
            <option value="ขอใช้ห้อง">ขอใช้ห้อง</option>
            <option value="บริการบัญชีผู้ใช้">บริการบัญชีผู้ใช้</option>
          </select>
          {errors.requestType && <small className="error">{errors.requestType}</small>}
        </div>

        <div className="field">
          <label htmlFor="location">สถานที่</label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="details">รายละเอียด</label>
          <textarea
            id="details"
            name="details"
            rows="4"
            value={formData.details}
            onChange={handleChange}
          ></textarea>
        </div>

        <fieldset className="field">
          <legend>ความเร่งด่วน</legend>
          <label>
            <input
              type="radio"
              name="priority"
              value="normal"
              checked={formData.priority === 'normal'}
              onChange={handleChange}
            />{' '}
            ปกติ
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="urgent"
              checked={formData.priority === 'urgent'}
              onChange={handleChange}
            />{' '}
            เร่งด่วน
          </label>
        </fieldset>

        <button type="submit">เพิ่มคำร้อง</button>
        {statusMessage && <p className="status" role="status">{statusMessage}</p>}
      </form>
    </section>
  );
}

export default RequestForm;
