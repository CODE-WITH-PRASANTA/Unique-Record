import React from 'react';
import './TermandConditionCancelation.css';

const TermandConditionCancelation = () => {
  return (
    <div className="cancellation-wrapper">
      <div className="cancellation-container">
        <h1 className="cancellation-title">Cancellation and Refund Policy</h1>
        <div className="policy-intro">
          <p>
            <strong>DIVYA PRERAK KAHANIYAN HUMANITY RESEARCH CENTRE TRUST</strong> believes in helping its customers as much as possible, and thus has a liberal cancellation policy. The details are as follows:
          </p>
        </div>
        
        <div className="policy-section">
          <h2 className="policy-heading">Cancellation Terms</h2>
          <ul className="policy-list">
            <li>Cancellations will be considered only if the request is made within 7 days of placing the order. However, if the order has been communicated to the vendors/merchants and they have initiated the shipping process, the request may not be entertained.</li>
            <li>We do not accept cancellation requests for perishable items such as flowers, eatables, etc. However, if the quality of the delivered product is not satisfactory, a refund or replacement may be provided.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2 className="policy-heading">Damaged or Defective Items</h2>
          <ul className="policy-list">
            <li>If you receive a damaged or defective item, please report it to our Customer Service team within 7 days of receipt. The claim will be entertained once the merchant verifies the issue.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2 className="policy-heading">Product Not as Expected</h2>
          <ul className="policy-list">
            <li>If the received product does not match the description on our site or your expectations, notify our Customer Service team within 7 days. They will review the complaint and make an appropriate decision.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2 className="policy-heading">Warranty-Related Issues</h2>
          <ul className="policy-list">
            <li>For products that come with a manufacturer’s warranty, please reach out directly to the manufacturer for support and warranty claims.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2 className="policy-heading">Refund Process</h2>
          <ul className="policy-list">
            <li>For any refunds approved by <strong>DIVYA PRERAK KAHANIYAN HUMANITY RESEARCH CENTRE TRUST</strong>, the process will take approximately 6-8 days to be completed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermandConditionCancelation;
