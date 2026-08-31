import RequestCard from './RequestCard.jsx';

function RequestList({ requests, onDeleteRequest, onMarkDone }) {
  if (requests.length === 0) return <p className="subtle-empty">ไม่พบคำร้องที่ตรงกับการค้นหา</p>;
  return (
    <div className="request-list" data-testid="request-list">
      {requests.map((request) => (

        <RequestCard key={request.id} onDeleteRequest={onDeleteRequest} onMarkDone={onMarkDone} request={request}/>
      ))}
    </div>
  );
}

export default RequestList;
