import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Activity,
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  AlertCircle,
  FileText,
  CheckCircle2,
  Printer,
  ArrowLeft,
  X,
  Stethoscope,
  Info
} from 'lucide-react';
import { BiomedicalDevice } from '../../types';
import {
  BIOMEDICAL_DEVICES,
  COMMON_SYMPTOM_QUICK_FILTERS,
  CLINICAL_SYMPTOM_SUGGESTIONS,
  SymptomSuggestion
} from '../../data/biomedicalDevicesData';

interface BiomedicalDevicesTabProps {
  onSelectDeviceForConsultation: (deviceName: string, defaultTopic: string) => void;
}

export const BiomedicalDevicesTab: React.FC<BiomedicalDevicesTabProps> = ({
  onSelectDeviceForConsultation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null);
  const [selectedDeviceModal, setSelectedDeviceModal] = useState<BiomedicalDevice | null>(null);

  // Autocomplete state
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { id: 'all', label: 'كافة الأجهزة الطبية' },
    { id: 'radiology', label: 'الأشعة والرنين والمفراس' },
    { id: 'cardiovascular', label: 'القلب والقسطرة والأوعية' },
    { id: 'ultrasound', label: 'الموجات فوق الصوتية والدوبلر' },
    { id: 'neurology', label: 'الدماغ والأعصاب والعضلات' },
    { id: 'endoscopy', label: 'المناظير الهضمية والجراحية' },
    { id: 'respiratory', label: 'وظائف الرئة والتنفس' },
    { id: 'specialized', label: 'فحوصات العظام والعيون' }
  ];

  // Dynamic Autocomplete suggestions based on input
  const autocompleteSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    return CLINICAL_SYMPTOM_SUGGESTIONS.filter(
      (item) =>
        item.symptom.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.suggestedDevices.some((d) => d.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery]);

  // Filter devices based on query matching name, targeted diseases, common symptoms, or organs
  const filteredDevices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return BIOMEDICAL_DEVICES.filter((device) => {
      // Category match
      if (selectedCategory !== 'all' && device.category !== selectedCategory) {
        return false;
      }

      if (!q) return true;

      const inName = device.name.toLowerCase().includes(q) || device.englishName.toLowerCase().includes(q);
      const inDiseases = device.targetedDiseases.some((d) => d.toLowerCase().includes(q));
      const inSymptoms = device.commonSymptoms.some((s) => s.toLowerCase().includes(q));
      const inOrgans = device.applicableOrgans.some((o) => o.toLowerCase().includes(q));
      const inFunction = device.clinicalFunction.toLowerCase().includes(q);
      const inPrinciple = device.engineeringPhysicsPrinciple.toLowerCase().includes(q);

      return inName || inDiseases || inSymptoms || inOrgans || inFunction || inPrinciple;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpandDevice = (id: string) => {
    setExpandedDeviceId((prev) => (prev === id ? null : id));
  };

  const handleSelectSuggestion = (suggestion: SymptomSuggestion) => {
    setSearchQuery(suggestion.symptom);
    setIsAutocompleteOpen(false);
  };

  const handlePrintDeviceGuide = (device: BiomedicalDevice) => {
    setSelectedDeviceModal(device);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6 text-slate-700" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-teal-50/90 via-white to-sky-50/80 border border-teal-200/80 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-teal-800 mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span>جامعة المستقبل — قسم هندسة تقنيات الأجهزة الطبية الحيوية</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Cpu className="w-6 h-6 text-teal-700" />
              <span>استشارة هندسة الأجهزة الطبية الحيوية واختيار الفحص المناسب</span>
            </h1>
            <p className="text-xs sm:text-sm font-light text-slate-600 mt-1 max-w-3xl leading-relaxed">
              اكتب اسم العرض الصحي أو المرض، ليعرض لك محرك البحث الذكي اقتراحات تلقائية فورية (Autocomplete) ويحدد الأجهزة الطبية المناسبة لتشخيص حالتك، مع تنبيهات أمان سريرية وإشعاعية لحظية لكل جهاز.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs bg-white text-teal-900 font-mono font-semibold px-3 py-1.5 rounded-xl border border-teal-200/80 shadow-2xs">
              {filteredDevices.length} أجهزة متطابقة
            </span>
          </div>
        </div>

        {/* Search Bar Input with Autocomplete Dropdown */}
        <div ref={searchContainerRef} className="relative z-20">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-teal-700">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onFocus={() => {
                if (autocompleteSuggestions.length > 0) setIsAutocompleteOpen(true);
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsAutocompleteOpen(true);
                setActiveSuggestionIndex(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActiveSuggestionIndex((prev) =>
                    prev < autocompleteSuggestions.length - 1 ? prev + 1 : prev
                  );
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
                } else if (e.key === 'Enter') {
                  if (activeSuggestionIndex >= 0 && autocompleteSuggestions[activeSuggestionIndex]) {
                    handleSelectSuggestion(autocompleteSuggestions[activeSuggestionIndex]);
                  } else {
                    setIsAutocompleteOpen(false);
                  }
                } else if (e.key === 'Escape') {
                  setIsAutocompleteOpen(false);
                }
              }}
              placeholder="اكتب العرض الصحي أو اسم المرض (مثال: ألم ظهر، صداع وانفجار، خفقان، ضيق تنفس، كسر، تنميل، جلطة)..."
              className="w-full bg-white border border-teal-300/80 focus:border-teal-500 rounded-2xl py-3.5 pr-12 pl-10 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsAutocompleteOpen(false);
                }}
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Panel */}
          {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl border border-teal-200/90 shadow-xl overflow-hidden divide-y divide-slate-100 z-30 animate-fadeIn">
              <div className="bg-slate-50/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 font-medium border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-teal-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>اقتراحات الأعراض الصحية السريرية (Autocomplete):</span>
                </span>
                <span className="font-mono text-slate-400">اضغط للاختيار المباشر</span>
              </div>
              {autocompleteSuggestions.map((item, idx) => {
                const isSelected = activeSuggestionIndex === idx;
                const urgencyBadge = {
                  routine: 'bg-slate-100 text-slate-700 border-slate-200',
                  urgent: 'bg-amber-50 text-amber-800 border-amber-200',
                  critical: 'bg-rose-50 text-rose-800 border-rose-200'
                }[item.recommendedUrgency];

                const urgencyLabel = {
                  routine: 'حالة اعتيادية',
                  urgent: 'عاجلة خلال 24 ساعة',
                  critical: 'حالة طارئة حرجة'
                }[item.recommendedUrgency];

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    onMouseEnter={() => setActiveSuggestionIndex(idx)}
                    className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors text-right ${
                      isSelected ? 'bg-teal-50/80' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {item.symptom}
                        </span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-teal-800 font-light pr-5">
                        <span className="text-slate-400 text-[11px]">الأجهزة الموصى بها:</span>
                        <span className="font-medium">{item.suggestedDevices.join(' · ')}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border shrink-0 ${urgencyBadge}`}>
                      {urgencyLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Symptom Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>أكثر الحالات والأعراض بحثاً (اختر للبحث الفوري):</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {COMMON_SYMPTOM_QUICK_FILTERS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSearchQuery(item.query);
                  setIsAutocompleteOpen(false);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                  searchQuery === item.query
                    ? 'bg-teal-700 text-white border-teal-700 shadow-2xs font-medium'
                    : 'bg-white hover:bg-teal-50 border-slate-200 hover:border-teal-300 text-slate-700 font-light'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white font-medium shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80 font-light'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">
            لم نجد جهازاً مطابقاً لبحثك: "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-light leading-relaxed">
            يمكنك كتابة كلمة أساسية عامة مثل (قلب، عظام، رئة، بطن، دماغ، أعصاب) أو حجز استشارة مباشرة مع مهندسي الأجهزة الطبية.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-medium cursor-pointer"
          >
            عرض كافة الأجهزة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredDevices.map((device) => {
            const isExpanded = expandedDeviceId === device.id;
            const alert = device.instantSafetyAlert;

            return (
              <div
                key={device.id}
                className="bg-white border border-slate-200/90 hover:border-teal-300 rounded-3xl p-5 sm:p-6 shadow-2xs transition-all space-y-4"
              >
                {/* Device Title & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {device.name}
                      </h2>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        {device.deviceTag}
                      </span>
                      <span className="text-[11px] font-medium text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/70">
                        {device.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500" dir="ltr">
                      {device.englishName}
                    </p>
                  </div>

                  {/* Safety & Radiation Level Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${device.safetyAndRadiationLevel.color}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{device.safetyAndRadiationLevel.label}</span>
                    </span>
                  </div>
                </div>

                {/* Instant Real-Time Safety Alert Banner (تنبيه أمان لحظي بارز للجهاز المختار) */}
                {alert && (
                  <div
                    className={`rounded-2xl p-4 border space-y-2 text-right ${
                      alert.level === 'critical_danger'
                        ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                        : alert.level === 'warning_strict'
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                        : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-black/5 pb-2">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        {alert.level === 'critical_danger' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                        ) : alert.level === 'warning_strict' ? (
                          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                        )}
                        <span>{alert.title}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${
                          alert.level === 'critical_danger'
                            ? 'bg-rose-200/60 text-rose-900 border-rose-300'
                            : alert.level === 'warning_strict'
                            ? 'bg-amber-200/60 text-amber-900 border-amber-300'
                            : 'bg-emerald-200/60 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {alert.level === 'critical_danger'
                          ? 'تنبيه أمان حرج فوري'
                          : alert.level === 'warning_strict'
                          ? 'تحذير إشعاعي وسريري'
                          : 'إشعار أمان حيوي'}
                      </span>
                    </div>

                    <ul className="space-y-1 pr-1 text-xs font-light leading-relaxed">
                      {alert.keyPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="font-bold text-[11px] mt-0.5 shrink-0">◀</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-black/5 text-[11px] flex items-center gap-1.5 font-medium">
                      <span className="font-bold">الإجراء الفوري المطلوب:</span>
                      <span className="font-light">{alert.immediateAction}</span>
                    </div>
                  </div>
                )}

                {/* Clinical Function Synopsis */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-800 block">
                    الوظيفة السريرية ودور الجهاز في التشخيص:
                  </span>
                  <p className="text-xs sm:text-sm font-light text-slate-600 leading-relaxed">
                    {device.clinicalFunction}
                  </p>
                </div>

                {/* Targeted Diseases Tags */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-800 block">
                    الأمراض والحالات السريرية التي يشخصها هذا الجهاز:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {device.targetedDiseases.map((dis, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-50 border border-slate-200/80 text-slate-700 px-2.5 py-1 rounded-lg"
                      >
                        ✓ {dis}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Common Symptoms Matching */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-800 block">
                    أعراض شائعة تدل على حاجة المريض لهذا الفحص:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {device.commonSymptoms.map((sym, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs bg-sky-50/70 border border-sky-200/80 text-sky-900 px-2.5 py-0.5 rounded-lg"
                      >
                        • {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Collapsible Deep Dive: Engineering Principle & Patient Preparation */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-100 space-y-4 animate-fadeIn">
                    {/* Engineering & Physics Principle */}
                    <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-teal-900">
                        <Cpu className="w-4 h-4 text-teal-700" />
                        <span>المبدأ الهندسي والفيزيائي لعمل الجهاز (Biomedical Engineering):</span>
                      </div>
                      <p className="text-xs font-light text-slate-700 leading-relaxed">
                        {device.engineeringPhysicsPrinciple}
                      </p>
                    </div>

                    {/* Patient Preparations & Safety */}
                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                        <span>إرشادات وتحضيرات المريض الإلزامية قبل الخضوع للفحص:</span>
                      </div>
                      <ul className="space-y-1.5 pr-2">
                        {device.patientPreparations.map((prep, pIdx) => (
                          <li key={pIdx} className="text-xs font-light text-slate-700 flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-600 font-bold shrink-0 mt-0.5">●</span>
                            <span>{prep}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-amber-950 font-medium">
                        <span>مدة الفحص التقديرية: {device.typicalExamDuration}</span>
                        <span>الأعضاء المستهدفة: {device.applicableOrgans.join(' · ')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => toggleExpandDevice(device.id)}
                    className="text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1.5 cursor-pointer py-1.5"
                  >
                    <span>
                      {isExpanded ? 'طي التفاصيل الهندسية والتحضيرات' : 'عرض المبدأ الفيزيائي وتحضيرات المريض الكاملة'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintDeviceGuide(device)}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="طباعة إرشادات الفحص والتحضير للمريض"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>طباعة الإرشادات</span>
                    </button>

                    <button
                      onClick={() =>
                        onSelectDeviceForConsultation(
                          device.name,
                          `استشارة هندسية طبية حول فحص (${device.name} - ${device.englishName}) وتدقيق ملاءمته لتشخيص الحالة`
                        )
                      }
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 active:scale-98 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>حجز استشاره هندسيه طبيه</span>
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Modal for Patient Guide */}
      {selectedDeviceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-200 text-right space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  دليل تحضير المريض وإرشادات الفحص الطبي
                </h3>
                <span className="text-xs text-teal-800 font-light">
                  جامعة المستقبل — قسم هندسة تقنيات الأجهزة الطبية الحيوية
                </span>
              </div>
              <button
                onClick={() => setSelectedDeviceModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-light">اسم الجهاز المعتمد:</span>
                <h4 className="text-sm font-bold text-slate-900">{selectedDeviceModal.name}</h4>
                <p className="text-xs font-mono text-slate-600" dir="ltr">{selectedDeviceModal.englishName}</p>
              </div>

              {selectedDeviceModal.instantSafetyAlert && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                    selectedDeviceModal.instantSafetyAlert.level === 'critical_danger'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : selectedDeviceModal.instantSafetyAlert.level === 'warning_strict'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  }`}
                >
                  <span className="font-bold block">{selectedDeviceModal.instantSafetyAlert.title}</span>
                  <p className="text-[11px] font-light leading-relaxed">
                    {selectedDeviceModal.instantSafetyAlert.immediateAction}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-800 block">الدور التشخيصي:</span>
                <p className="text-xs font-light text-slate-600 leading-relaxed">{selectedDeviceModal.clinicalFunction}</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <span className="text-xs font-semibold text-amber-900 block">تعليمات وتحضيرات المريض:</span>
                <ul className="space-y-1 pr-2">
                  {selectedDeviceModal.patientPreparations.map((p, idx) => (
                    <li key={idx} className="text-xs font-light text-slate-700 flex items-start gap-2">
                      <span className="text-amber-700 font-bold">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">مستوى الأمان:</span>
                  <span className="font-medium text-slate-800">{selectedDeviceModal.safetyAndRadiationLevel.label}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">مدة الفحص المتوقعة:</span>
                  <span className="font-medium text-slate-800">{selectedDeviceModal.typicalExamDuration}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 no-print">
              <button
                onClick={() => setSelectedDeviceModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs rounded-xl cursor-pointer"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الورقة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
