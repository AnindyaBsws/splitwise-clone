import { useParams } from "react-router-dom";

function GroupDetail() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Group Detail</h1>

      <p className="text-gray-600">
        Viewing details for group ID: {id}
      </p>
    </div>
  );
}

export default GroupDetail;