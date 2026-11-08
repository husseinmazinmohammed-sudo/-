import React from 'react';
import { X, AlertTriangle, Zap, Radiation, Building2, ShieldAlert, ArrowLeft, Send } from 'lucide-react';

interface HotlineModalProps {
  onClose: () => void;
  onOpenEmergencyReport?: () => void;
}

export const HotlineModal: React.FC<HotlineModalProps> = ({ onClose, onOpenEmergencyReport }) => {
  const emergencyProtocols = [
    {
      title: 'بروتوكول طوارئ الوقاية الإشعاعية (ALARA & RSO)',
      category: 'الحوادث والتعرض الإشعاعي',
      icon: Radiation,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      color: 'bg-amber-50/60 border-amber-200/90 text-amber-950',
      steps: [
        'الضغط الفوري على زر التوقف الطارئ للأنبوب (Emergency Stop) عند أي عطل غير منضبط في جهاز الأشعة أو القسطرة.',
        'إخلاء نطاق غرفة الفحص فوراً والتأكد من إحكام إغلاق الأبواب المرصصة وتفعيل إضاءة التحذير الحمراء.',
        'توثيق مؤشرات التعرض والجرعة DAP على نظام PACS وتدوين شارات القياس الشخصي (TLD) للكوادر المرافقة.',
        'رفع بلاغ عاجل لمسؤول الوقاية الإشعاعية (RSO) لتدقيق الحيز السريري وإجراء القياسات الميدانية قبل استئناف العمل.'
      ]
    },
    {
      title: 'بروتوكول طوارئ الأمان الكهربائي وأنظمة الطاقة المعزولة (IPS / LIM)',
      category: 'إنذار العزل وتيار التسريب',
      icon: Zap,
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      color: 'bg-sky-50/60 border-sky-200/90 text-sky-950',
      steps: [
        'عند انطلاق إنذار جهاز مراقبة العزل (LIM Alarm)، يتم فوراً تحديد وفصل آخر جهاز طبي غير حيوي تم وصله بالمريض.',
        'عدم إطفاء الأجهزة الداعمة للحياة نهائياً، والتحقق من انتقالها التلقائي للتغذية ببطاريتها الداخلية الاحتياطية.',
        'فحص سلامة مقابس الطاقة الطبية وسلك التأريض الوقائي للأجهزة المحيطة بسرير المريض في غرف العمليات والعناية.',
        'استدعاء مهندس الأجهزة الطبية الإكلينيكي فوراً لإجراء قياس تيار التسريب وتحديد مسار العطل بمحلل السلامة.'
      ]
    },
    {
      title: 'بروتوكول طوارئ الانسكابات الخطرة والنفايات الحيوية',
      category: 'السلامة البيئية والمستشفيات الخضراء',
      icon: Building2,
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      color: 'bg-teal-50/60 border-teal-200/90 text-teal-950',
      steps: [
        'تطويق حيز الانسكاب فوراً ومنع مرور المرضى والمرافقين، وارتداء معدات الحماية الشخصية المزدوجة (PPE).',
        'استخدام أطقم امتصاص الانسكاب المتخصصة (Spill Kit) وعدم استخدام المياه الجارية التي قد توسع نطاق التلوث.',
        'جمع المخلفات والمحاقن المتناثرة بحذر باستخدام ملاقط ووضعها حصراً في صناديق الأمان المقواة (Safety Boxes).',
        'عزل الأكياس الصفراء الحيوية وإحكام إغلاقها عند مستوى 75% ونقلها لوحدة التعقيم والمعالجة البيئية.'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 no-print" dir="rtl">
      <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-teal-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-l from-teal-50 via-emerald-50/60 to-sky-50 border-b border-teal-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                دليل بروتوكولات الاستجابة السريعة وبلاغات الطوارئ السريرية
              </h3>
              <p className="text-[11px] text-teal-800 font-light">
                جامعة المستقبل — قسم هندسة تقنيات الأجهزة الطبية (معايير ICRP و IEC 60601-1)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Organized Clinical Action Protocols */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-right">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs text-slate-700 font-light leading-relaxed">
                خطوات التصرف الميداني الفوري المعتمدة في المستشفيات والمراكز التخصصية لضمان سلامة المرضى والكوادر دون تأخير.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {emergencyProtocols.map((protocol, idx) => {
              const Icon = protocol.icon;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border space-y-2.5 ${protocol.color}`}
                >
                  <div className="flex items-center justify-between border-b border-black/5 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/90 border border-black/10 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900">
                        {protocol.title}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${protocol.badgeColor}`}>
                      {protocol.category}
                    </span>
                  </div>

                  <ul className="space-y-1.5 pr-1">
                    {protocol.steps.map((step, sIdx) => (
                      <li key={sIdx} className="text-xs font-light text-slate-700 flex items-start gap-2 leading-relaxed">
                        <span className="font-mono font-semibold text-teal-800 shrink-0 mt-0.5 text-[11px]">
                          0{sIdx + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-light">
            عند حدوث أي طارئ سريري، قم برفع بلاغ فوري لربطه بفريق الاستشاريين مباشرة.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium cursor-pointer transition-colors"
            >
              إغلاق الدليل
            </button>

            {onOpenEmergencyReport && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEmergencyReport();
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 -scale-x-100" />
                <span>رفع بلاغ طارئ فوري</span>
                <ArrowLeft className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
