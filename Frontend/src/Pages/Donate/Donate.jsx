import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Donate.css';
import { API_URL } from '../../Api';
import DonationForm from '../../Components/DonationForm/DonationForm';

const Donate = () => {
  const [showCharityTable, setShowCharityTable] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/donation/all`);
      const sortedDonations = (res.data.donations || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDonations(sortedDonations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
    setLoading(false);
  };

  fetchDonations();
}, []);


  const handleShowTable = () => setShowCharityTable(prev => !prev);
  const handleMakeDonation = () => {
    setShowCharityTable(false);
    document.querySelector('.Donate-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Filter based on search
  const filteredData = donations.filter(item =>
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.paymentNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="Donate-container">
      {/* Title */}
      <h2 className="Donate-title">
        <span>Glory and Inspiration of Donation</span>
      </h2>

      {/* Description */}
      <p className="Donate-description">
        Donating not only paves the way for our spiritual progress, but it also strengthens moral, human values, and goodwill in society. The effect of donation is not limited to this birth only, but its auspicious results also benefit us in the next births, thereby providing higher speed.
      </p>

      {/* Quote */}
      <p className="Donate-quote">
        <span>We all are bound by the bondage of karma in our lives, and with the bondage of karma, we leave this world and then take birth again.</span> In such a situation, if we do good deeds by donating according to our capacity and contribute to the work that benefits the public and the service dedicated to society, then our name can remain immortal for ages.
      </p>

      {/* Request to Rich */}
      <h1 className="Donate-heading"><span>Request to Rich and Virtuous Gentlemen</span></h1>
      <p className="Donate-highlight">
        Religious-loving rich people, philanthropists, and wealthy capitalists are appealed to contribute to this sacred cause. 
        <span className="Donate-text-highlight"> Donate generously for the construction of a grand building of Unique Records of Universe unit under the banner of "Divya Prerak Kahaniya Humanity Research Centre Trust", so that human values can be promoted and the coming generation can get a positive benefit.</span>
      </p>

      {/* Make Voluntary Donation */}
      <h1 className="Donate-heading"><span>Make Voluntary Donation to DPKHRC Charitable Trust</span></h1>
      <p className="Donate-highlight">
        You can participate in this great work by donating to Divya Prerak Kahaniyan Humanity Research Centre Charitable Trust as per your capacity. 
        <span className="Donate-text-highlight"> This donation will be Tax-free under Section 80G of the Income Tax Act, Government of India.</span>
      </p>

      {/* Donate, Earn Merit */}
      <h1 className="Donate-heading"><span>Donate, Earn Merit</span></h1>
      <p className="Donate-highlight">
        Donation makes the life of any person successful, purifies the soul, and brings happiness, prosperity, 
        <span className="Donate-text-highlight"> progress, and peace in your life. Come forward and become a part of this noble work by making a voluntary donation as per your capacity and serve Humanity.</span>
      </p>
      

      {/* Buttons */}
      <div className="Donate-btn-section">
        <button className="Donate-btn" onClick={handleMakeDonation}>Make a Donation</button>
        <button className="Donate-charity-btn" onClick={handleShowTable}>
          {showCharityTable ? 'Hide Charity List' : 'List of Charities'}
        </button>
      </div>

      {/* Charity Table */}
      {showCharityTable && (
        <div className="Charity-table-container">
          <h2>Donation Records</h2>

          <div className="Charity-search">
            <input
              type="text"
              placeholder="Search by donor, payment number, or address..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p style={{ color: 'yellow' }}>Loading donations...</p>
          ) : (
            <table className="Charity-table">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Payment Number</th>
                  <th>Date of Receipt</th>
                  <th>Donor Name</th>
                  <th>Address</th>
                  <th>Amount Received</th>
                  <th>Other Information</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.paymentNumber || 'N/A'}</td>
                      <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>{item.name || 'N/A'}</td>
                      <td>{item.address || 'N/A'}</td>
                      <td>₹{item.amount?.toLocaleString() || 'N/A'}</td>
                      <td className="OtherInfoCell">
                        <span className={`OtherInfoText ${expandedRows.includes(item._id) ? 'expanded' : ''}`}>
                          {item.extra || 'N/A'}
                        </span>
                        {item.extra?.length > 80 && (
                          <button
                            className="ReadMoreBtn"
                            onClick={() => toggleRowExpansion(item._id)}
                          >
                            {expandedRows.includes(item._id) ? 'Read Less' : 'Read More'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'yellow', padding: '15px' }}>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Donation Form */}
      <DonationForm />
    </div>
  );
};

export default Donate;
