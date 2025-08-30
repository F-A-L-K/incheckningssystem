
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface SchoolInfoFormProps {
  onSubmit: (school: string, teacherName: string, studentCount: number) => void;
  initialSchool?: string;
  initialTeacherName?: string;
  initialStudentCount?: number;
}

const SchoolInfoForm = ({ 
  onSubmit, 
  initialSchool = "", 
  initialTeacherName = "",
  initialStudentCount = 1
}: SchoolInfoFormProps) => {
  const [school, setSchool] = useState(initialSchool);
  const [teacherName, setTeacherName] = useState(initialTeacherName);
  const [studentCount, setStudentCount] = useState(initialStudentCount.toString());
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const { t } = useLanguage();

  // Hårdkodade skolor för autocomplete
  const SCHOOLS = [
    "Gnosjöandans kunskapscentrum",
    "GKC", 
    "FiGy",
    "Finnvedens gymnasium"
  ];

  const getSchoolSuggestions = (input: string) => {
    if (input.length < 1) return [];
    return SCHOOLS
      .filter(schoolName => 
        schoolName.toLowerCase().startsWith(input.toLowerCase())
      )
      .map(name => ({ value: name, label: name }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let valid = true;

    if (!school.trim()) {
      newErrors.school = true;
      valid = false;
    }

    if (!teacherName.trim()) {
      newErrors.teacherName = true;
      valid = false;
    }

    const studentCountNum = parseInt(studentCount);
    if (!studentCount.trim() || isNaN(studentCountNum) || studentCountNum < 1) {
      newErrors.studentCount = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(school, teacherName, parseInt(studentCount));
    }
  };

  const handleSchoolChange = (value: string) => {
    setSchool(value);
    if (value) {
      setErrors(prev => ({ ...prev, school: false }));
    }
  };

  const handleTeacherNameChange = (value: string) => {
    setTeacherName(value);
    if (value) {
      setErrors(prev => ({ ...prev, teacherName: false }));
    }
  };

  const handleStudentCountChange = (value: string) => {
    // Only allow numbers
    const numbersOnly = value.replace(/[^0-9]/g, '');
    setStudentCount(numbersOnly);
    if (numbersOnly && parseInt(numbersOnly) >= 1) {
      setErrors(prev => ({ ...prev, studentCount: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-3xl font-medium mb-4">
          {t('schoolInformation')} | {t('schoolVisit')}
        </h3>
        <p className="text-xl text-gray-500 mb-8">{t('pleaseEnterSchoolInfo')}</p>
        
        <div className="space-y-8">
          {/* School Name */}
          <div>
            <Label 
              htmlFor="school" 
              className={`text-xl font-medium mb-3 block ${errors.school ? "text-red-500" : ""}`}
            >
              {t('school')} {errors.school && <span className="text-red-500">*</span>}
            </Label>
            <AutocompleteInput
              id="school"
              value={school}
              onChange={(e) => handleSchoolChange(e.target.value)}
              onOptionSelect={(value) => handleSchoolChange(value)}
              options={getSchoolSuggestions(school)}
              placeholder={t('schoolPlaceholder')}
              className={`h-14 text-2xl ${errors.school ? "border-red-500" : ""}`}
            />
            {errors.school && (
              <p className="text-red-500 text-base mt-2">{t('enterSchoolName')}</p>
            )}
          </div>

          {/* Responsible Teacher Name */}
          <div>
            <Label 
              htmlFor="teacherName" 
              className={`text-xl font-medium mb-3 block ${errors.teacherName ? "text-red-500" : ""}`}
            >
              Ansvarig lärare namn {errors.teacherName && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="teacherName"
              type="text"
              value={teacherName}
              onChange={(e) => handleTeacherNameChange(e.target.value)}
              className={`h-14 text-2xl ${errors.teacherName ? "border-red-500" : ""}`}
              placeholder="Ange ansvarig lärares namn"
            />
            {errors.teacherName && (
              <p className="text-red-500 text-base mt-2">Vänligen ange ansvarig lärares namn</p>
            )}
          </div>

          {/* Number of Students */}
          <div>
            <Label 
              htmlFor="studentCount" 
              className={`text-xl font-medium mb-3 block ${errors.studentCount ? "text-red-500" : ""}`}
            >
              {t('numberOfStudents')} {errors.studentCount && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="studentCount"
              type="text"
              value={studentCount}
              onChange={(e) => handleStudentCountChange(e.target.value)}
              className={`h-14 text-2xl ${errors.studentCount ? "border-red-500" : ""}`}
              placeholder="Ange antal elever"
              inputMode="numeric"
            />
            {errors.studentCount && (
              <p className="text-red-500 text-base mt-2">{t('selectValidNumber')}</p>
            )}
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-[#3B82F6] h-16 text-2xl">
        {t('continue')}
      </Button>
    </form>
  );
};

export default SchoolInfoForm;
