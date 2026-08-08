import { useState } from 'react';

// LAB4-R05: Validation function ตรงตามข้อกำหนดของ Lab
function validate(data) {
  const errors = {};
  if (data.requesterName.trim().length < 2) {
    errors.requesterName = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
  }
  if (!data.requestType) {
    errors.requestType = 'กรุณาเลือกประเภทคำขอ';
  }
  if (!data.location.trim()) {
    errors.location = 'กรุณากรอกสถานที่';
  }
  if (data.details.trim().length < 10) {
    errors.details = 'กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร';
  }
  return errors;
}

const initialFormData = {
  requesterName: '',
  requestType: '',
  location: '',
  details: '',
  priority: 'normal',
};

function RequestForm({ onAddRequest }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setFeedback('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFeedback('ยังส่งคำร้องไม่ได้ กรุณาตรวจสอบข้อมูล');
      return;
    }

    // ส่งข้อมูลที่มี key ตรงกับ Data Contract (requesterName, requestType, location, details, priority)
    onAddRequest(formData);
    setFeedback(`ส่งคำร้องของคุณ ${formData.requesterName} เรียบร้อยแล้ว`);
    setFormData(initialFormData);
  }

  return (
    <section className="panel" aria-labelledby="request-form-title">
      <h2 id="request-form-title">ส่งคำร้องใหม่</h2>
      <p>กรอกข้อมูลด้านล่างเพื่อส่งคำร้องให้เจ้าหน้าที่</p>

      <form id="request-form" className="form-grid" onSubmit={handleSubmit}>
        {/* ชื่อผู้แจ้ง */}
        <div className="form-group">
          <label htmlFor="requesterName">ชื่อผู้แจ้ง</label>
          <input
            type="text"
            id="requesterName"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.requesterName)}
            aria-describedby="requesterName-error"
          />
          {errors.requesterName && <small id="requesterName-error" className="error-message">{errors.requesterName}</small>}
        </div>

        {/* ประเภทคำร้อง */}
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
            <option value="แจ้งซ่อม">แจ้งซ่อม</option>
            <option value="ร้องเรียน">ร้องเรียน</option>
            <option value="สอบถาม">สอบถาม</option>
          </select>
          {errors.requestType && <small id="requestType-error" className="error-message">{errors.requestType}</small>}
        </div>

        {/* สถานที่ */}
        <div className="form-group">
          <label htmlFor="location">สถานที่</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            aria-invalid={Boolean(errors.location)}
            aria-describedby="location-error"
          />
          {errors.location && <small id="location-error" className="error-message">{errors.location}</small>}
        </div>

        {/* ความสำคัญ */}
        <div className="form-group">
          <label htmlFor="priority">ความสำคัญ</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="normal">ปรกติ (normal)</option>
            <option value="urgent">เร่งด่วน (urgent)</option>
          </select>
        </div>

        {/* รายละเอียด */}
        <div className="form-group full-width">
          <label htmlFor="details">รายละเอียด</label>
          <textarea
            id="details"
            name="details"
            rows="4"
            value={formData.details}
            onChange={handleChange}
            aria-invalid={Boolean(errors.details)}
            aria-describedby="details-error"
          ></textarea>
          {errors.details && <small id="details-error" className="error-message">{errors.details}</small>}
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