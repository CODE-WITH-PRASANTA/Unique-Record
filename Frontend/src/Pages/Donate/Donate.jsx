import React from 'react';
import './Donate.css';
import DonationForm from '../../Components/DonationForm/DonationForm';

const Donate = () => {
  return (
    <div className="Donate-container">
      <h2 className="Donate-title">
        <span>Glory and Inspiration of Donation</span>
      </h2>

      <p className="Donate-description">
        Donating not only paves the way for our spiritual progress, but it also strengthens moral, human values, and goodwill in society. The effect of donation is not limited to this birth only, but its auspicious results also benefit us in the next births, thereby providing higher speed.
      </p>

      <p className="Donate-quote">
        <span>We all are bound by the bondage of karma in our lives, and with the bondage of karma, we leave this world and then take birth again.</span> In such a situation, if we do good deeds by donating according to our capacity and contribute to the work that benefits the public and the service dedicated to society, then our name can remain immortal for ages.
      </p>

      <h1 className="Donate-heading"><span>Request to Rich and Virtuous Gentlemen</span></h1>
      <p className="Donate-highlight">
        Religious-loving rich people, philanthropists, and wealthy capitalists are appealed to contribute to this sacred cause. 
        <span className="Donate-text-highlight"> Donate generously for the construction of a grand building of Unique Records of Universe unit under the banner of "Divya Prerak Kahaniya Humanity Research Centre Trust", so that human values can be promoted and the coming generation can get a positive benefit.</span>
      </p>

      <h1 className="Donate-heading"><span>Make Voluntary Donation to DPKHRC Charitable Trust</span></h1>
      <p className="Donate-highlight">
        You can participate in this great work by donating to Divya Prerak Kahaniyan Humanity Research Centre Charitable Trust as per your capacity. 
        <span className="Donate-text-highlight"> This donation will be Tax-free under Section 80G of the Income Tax Act, Government of India.</span>
      </p>

      <h1 className="Donate-heading"><span>Donate, Earn Merit</span></h1>
      <p className="Donate-highlight">
        Donation makes the life of any person successful, purifies the soul, and brings happiness, prosperity, 
        <span className="Donate-text-highlight"> progress, and peace in your life. Come forward and become a part of this noble work by making a voluntary donation as per your capacity and serve Humanity.</span>
      </p>

      <div className="Donate-btn-section">
        <button className="Donate-btn">Make a Donation</button>
        <button className="Donate-charity-btn">List of Charities</button>
      </div>

      <DonationForm />
    </div>
  );
};

export default Donate;
