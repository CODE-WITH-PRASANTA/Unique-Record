import React, { useEffect, useState } from "react";
import "./SubscribedNewsletter.css";
import { API_URL } from "../../Api"; 
import Swal from "sweetalert2";


const SubscribedNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/newsletter`);
      const data = await res.json();

      if (data.success) {
        setSubscribers(data.data);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };


// ✅ Delete Subscriber
const handleDelete = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/newsletter/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          setSubscribers((prev) => prev.filter((s) => s._id !== id));

          Swal.fire({
            title: "Deleted!",
            text: "Subscriber has been deleted.",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: data.message || "Delete failed!",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting.",
          icon: "error",
        });
      }
    }
  });
};


  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="subnewsletter-container">
      <h2 className="subnewsletter-title">📩 Subscribed Newsletter</h2>

      {loading ? (
        <p className="subnewsletter-loading">Loading subscribers...</p>
      ) : (
        <div className="subnewsletter-table-wrapper">
          <table className="subnewsletter-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Subscribed Email</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length > 0 ? (
                subscribers.map((subscriber, index) => (
                  <tr key={subscriber._id}>
                    <td>{index + 1}</td>
                    <td>{subscriber.email}</td>
                    <td>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="subnewsletter-delete-btn"
                        onClick={() => handleDelete(subscriber._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubscribedNewsletter;
