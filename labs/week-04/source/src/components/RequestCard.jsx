function RequestCard({ request, onDeleteRequest }) {
  return (
    <article className="request-card">
      <div>
        <p className="request-id">{request.id}</p>
        <h3>{request.requestType || request.category || request.type}</h3>
        
        {/* ชื่อผู้แจ้ง */}
        {(request.requesterName || request.name) && (
          <p className="request-user">
            <strong>ผู้แจ้ง:</strong> {request.requesterName || request.name}
          </p>
        )}

        {/* สถานที่ (ถ้ามี) */}
        {request.location && <p className="request-location">{request.location}</p>}

        {/* รายละเอียดคำร้อง */}
        <p className="request-details">
          {request.details || request.description || 'ไม่มีรายละเอียด'}
        </p>
      </div>

      <button type="button" onClick={() => onDeleteRequest(request.id)}>
        ลบ
      </button>
    </article>
  );
}

export default RequestCard;