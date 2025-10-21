import { useState } from 'react';
import { Users, Plus, Mail, Phone, X, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockEmployees, type Employee } from '../../data/mockData';

export function Employees() {
  const navigate = useNavigate();
  const [employees] = useState<Employee[]>(mockEmployees);
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Сотрудники</h1>
          <p className="text-slate-400">Управление командой KolTech</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить сотрудника
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            onClick={() => navigate(`/pro-employees/${employee.id}`)}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{employee.name[0]}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/50">
                Активен
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{employee.name}</h3>
            <p className="text-blue-400 text-sm mb-4">{employee.position}</p>

            <div className="space-y-2">
              <div className="flex items-center text-slate-400 text-sm">
                <Briefcase className="w-4 h-4 mr-2" />
                {employee.department}
              </div>
              <div className="flex items-center text-slate-400 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                {employee.email}
              </div>
              <div className="flex items-center text-slate-400 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                {employee.phone}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <CreateEmployeeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function CreateEmployeeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Новый сотрудник</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Полное имя</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Иван Иванов"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ivan@koltech.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Должность</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Frontend Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Отдел</label>
            <select className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Разработка</option>
              <option>Дизайн</option>
              <option>Управление</option>
              <option>Инфраструктура</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Телефон</label>
            <input
              type="tel"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition"
          >
            Создать сотрудника
          </button>
        </form>
      </div>
    </div>
  );
}
