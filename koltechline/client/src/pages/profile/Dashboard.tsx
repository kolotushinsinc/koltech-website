import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, DollarSign, Clock, CheckCircle, 
  ThumbsUp, Eye 
} from 'lucide-react';

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div className="glass-effect-dark rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-primary-400" />
          Active Projects
        </h3>
        <div className="bg-dark-800/50 p-4 rounded-xl">
          <h4 className="font-semibold text-white mb-2">E-commerce Platform</h4>
          <div className="flex justify-between items-center mb-2">
            <span className="px-2 py-1 rounded text-xs bg-accent-green/20 text-accent-green">Active</span>
            <span className="text-sm text-gray-400">75%</span>
          </div>
          <div className="w-full bg-dark-600 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      <div className="glass-effect-dark rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-accent-green" />
          Earnings
        </h3>
        <div className="space-y-4">
          <div className="bg-dark-800/50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-accent-green">$12,450</div>
            <div className="text-sm text-gray-400">Total Earned</div>
          </div>
          <div className="bg-dark-800/50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-primary-400">$3,200</div>
            <div className="text-sm text-gray-400">This Month</div>
          </div>
        </div>
      </div>

      <div className="glass-effect-dark rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-accent-purple" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
            <span className="text-gray-300">Project completed</span>
          </div>
          <div className="flex items-center text-sm">
            <ThumbsUp className="w-4 h-4 text-primary-400 mr-2" />
            <span className="text-gray-300">Received 5-star rating</span>
          </div>
          <div className="flex items-center text-sm">
            <Eye className="w-4 h-4 text-accent-orange mr-2" />
            <span className="text-gray-300">Profile viewed 23 times</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;