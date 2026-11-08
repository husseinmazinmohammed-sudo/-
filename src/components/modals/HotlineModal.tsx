import React from 'react';
import { X, Phone, AlertTriangle, Zap, Radiation, Building2 } from 'lucide-react';

interface HotlineModalProps {
  onClose: () => void;
}

export const HotlineModal: React.FC<HotlineModalProps> = ({ onClose }) => {
  const fieldOfficers = [
    {
      title: 'مسؤول الوقاية الإشعاعية الميداني (RSO)',
      number: '07801234567',
      role: 'مكتب الرقابة الإشعاعية الميداني — جامعة المستقبل / صحة بابل',
      description: 'طوارئ تسرب الإشعاع، أعطال أجهزة القسطرة والأشعة، وبلاغات التعرض المهني المعتمدة لدى مديرية الوقاية من الإشعاع العراقية.',
      icon: Radiation,
      color: 'text-amber-800 bg-amber-50 border-amber-200'
    },
    {
      title: 'مسؤول السلامة السريرية وهندسة الأجهزة',
      number: '07712345678',
      role: 'شعبة الهندسة الطبية الإكلينيكية',
      description: 'استجابة فورية لأعطال أنظمة الطاقة المعزولة IPS، إنذار أجهزة مراقبة العزل LIM، وفحوصات تيارات التسريب الحرجة.',
      icon: Zap,
      color: 'text-sky-800 bg-sky-50 border-sky-200'
    },
    {
      title: 'مسؤول السلامة البيئية والمستشفيات الخضراء',
      number: '07501234567',
      role: 'وحدة إدارة النفايات الطبية الحيوية',
      description: 'طوارئ الانسكابات الكيميائية، استبدال وتسرب الزئبق، وإدارة النفايات المعدية وفق تعليمات وزارة الصحة والبيئة العراقية.',
      icon: Building2,
      color: 'text-teal-800 bg-teal-50 border-teal-200'
    }
  ];

  const nationalEmergencies = [
    { name: 'الإسعاف الفوري العراقي', number: '122' },
    { name: 'الدفاع المدني العراقي', number: '115' },
    { name: 'طوارئ جامعة المستقبل (العيادة)', number: '07809988776' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-l from-teal-50 via-emerald-50/60 to-sky-50 border-b border-teal-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 block">
                أرقام مسؤولي الوقاية الإشعاعية والسلامة السريرية الميدانية (العراق)
              </span>
              <span className="text-[10px] text-teal-800 font-light">
                جامعة المستقبل — كلية التقنيات الهندسية / قسم هندسة تقنيات الأجهزة الطبية
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hotlines List */}
        <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto">
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-600 block">
              مسؤولو السلامة الميدانيون المعتمدون:
            </span>
            {fieldOfficers.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-right space-y-1.5 ${item.color}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 block">{item.role}</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${item.number}`}
                      className="font-mono text-xs font-semibold text-white bg-slate-900 px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-slate-800 transition-colors shrink-0"
                      dir="ltr"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{item.number}</span>
                    </a>
                  </div>
                  <p className="text-[11px] font-light text-slate-600 leading-relaxed pt-0.5">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* National Iraqi Emergency Lines */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold text-slate-600 block">
              خطوط الطوارئ الوطنية العراقية:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {nationalEmergencies.map((em, eIdx) => (
                <a
                  key={eIdx}
                  href={`tel:${em.number}`}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center transition-colors cursor-pointer group"
                >
                  <span className="text-[10px] text-slate-500 font-light block">{em.name}</span>
                  <span className="text-sm font-semibold font-mono text-teal-800 group-hover:text-teal-900 mt-0.5" dir="ltr">
                    {em.number}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium py-2 rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
