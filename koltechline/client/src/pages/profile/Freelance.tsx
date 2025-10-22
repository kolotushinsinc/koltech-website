import React from 'react';

const Freelance = () => {
  return (
    <div className="space-y-6">
      <div className="glass-effect-dark rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Freelance Dashboard</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-dark-800/50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-accent-green">$85/hr</div>
            <div className="text-sm text-gray-400">Hourly Rate</div>
          </div>
          <div className="bg-dark-800/50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-primary-400">12</div>
            <div className="text-sm text-gray-400">Completed Projects</div>
          </div>
          <div className="bg-dark-800/50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-accent-purple">4.9★</div>
            <div className="text-sm text-gray-400">Client Rating</div>
          </div>
        </div>
      </div>

      <div className="glass-effect-dark rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Available Opportunities</h3>
        <div className="space-y-4">
          <div className="bg-dark-800/50 p-4 rounded-xl">
            <h4 className="font-semibold text-white mb-2">React Developer Needed</h4>
            <p className="text-gray-300 text-sm mb-3">Build responsive web application with modern React stack</p>
            <div className="flex justify-between items-center">
              <span className="text-accent-green font-bold">$4,000 - $6,000</span>
              <button className="btn-primary text-sm">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Freelance;