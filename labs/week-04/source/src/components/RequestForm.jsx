import { useState } from 'react';

// TODO LAB4-R05: สร้าง validation function
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

const initialFormData = {
  displayName: '',
  requestType: '',
  requestDetails: '',
};

function RequestForm({ onAddRequest }) {
  // TODO LAB4-R05: สร้าง form/errors state
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');

  // TODO LAB4-R05: สร้าง controlled input handler
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setFeedback('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    // TODO LAB4-R05: validate → onAddRequest / setErrors
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFeedback('ยังส่งคำร้องไม่ได้ กรุณาตรวจสอบข้อมูล');
      return;
    }

    onAddRequest(formData);
    setFeedback(`ส่งคำร้องของคุณ ${formData.displayName} เรียบร้อยแล้ว`);
    setFormData(initialFormData); // Reset form
  }

  return (
    <section className="panel" aria-labelledby="request-form-title">
      <h2 id="request-form-title">ส่งคำร้องใหม่</h2>
      <p>กรอกข้อมูลด้านล่างเพื่อส่งคำร้องให้เจ้าหน้าที่</p>

      <form id="request-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="displayName">ชื่อผู้แจ้ง</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby="displayName-error"
          />
          {errors.displayName && <small id="displayName-error" className="error-message">{errors.displayName}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="requestType">ประเภทคำร้อง</label>
          <select
            id="requestType"
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requestType)}
            aria-describedby="requestType-error"
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="general">เรื่องทั่วไป</option>
            <option value="maintenance">ซ่อมบำรุง</option>
            <option value="it-support">ปัญหา IT</option>
          </select>
          {errors.requestType && <small id="requestType-error" className="error-message">{errors.requestType}</small>}
        </div>

        <div className="form-group full-width">
          <label htmlFor="requestDetails">รายละเอียด</label>
          <textarea
            id="requestDetails"
            name="requestDetails"
            rows="4"
            value={formData.requestDetails}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requestDetails)}
            aria-describedby="requestDetails-error"
          ></textarea>
          {errors.requestDetails && <small id="requestDetails-error" className="error-message">{errors.requestDetails}</small>}
        </div>

        <div className="form-actions full-width">
          <button type="submit">ส่งคำร้อง</button>
          <p className="status" role="status">
            {feedback}
          </p>
        </div>
      </form>
    </section>
  );
}

export default RequestForm;