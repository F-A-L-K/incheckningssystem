import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface SchoolInfoFormProps {
  onSubmit: (school: string, teacherCount: number, studentCount: number) => void;
  initialSchool?: string;
  initialTeacherCount?: number;
  initialStudentCount?: number;
}

const SchoolInfoForm = ({ 
  onSubmit, 
  initialSchool = "", 
  initialTeacherCount = 1,
  initialStudentCount = 1
}: SchoolInfoFormProps) => {
  const [school, setSchool] = useState(initialSchool);
  const [teacherCount, setTeacherCount] = useState(initialTeacherCount);
  const [studentCount, setStudentCount] = useState(initialStudentCount);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const { t } = useLanguage();

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let valid = true;

    if (!school.trim()) {
      newErrors.school = true;
      valid = false;
    }

    if (teacherCount < 1) {
      newErrors.teacherCount = true;
      valid = false;
    }

    if (studentCount < 1) {
      newErrors.studentCount = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(school, teacherCount, studentCount);
    }
  };

  const handleSchoolChange = (value: string) => {
    setSchool(value);
    if (value) {
      setErrors(prev => ({ ...prev, school: false }));
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
            <Input
              id="school"
              type="text"
              value={school}
              onChange={(e) => handleSchoolChange(e.target.value)}
              className={`h-14 text-2xl ${errors.school ? "border-red-500" : ""}`}
              placeholder={t('schoolPlaceholder')}
            />
            {errors.school && (
              <p className="text-red-500 text-base mt-2">{t('enterSchoolName')}</p>
            )}
          </div>

          {/* Number of Teachers */}
          <div>
            <Label 
              htmlFor="teacherCount" 
              className={`text-xl font-medium mb-3 block ${errors.teacherCount ? "text-red-500" : ""}`}
            >
              {t('numberOfTeachers')} {errors.teacherCount && <span className="text-red-500">*</span>}
            </Label>
            <Select value={teacherCount.toString()} onValueChange={(value) => setTeacherCount(parseInt(value))}>
              <SelectTrigger className={`h-14 text-2xl ${errors.teacherCount ? "border-red-500" : ""}`}>
                <SelectValue placeholder={t('selectNumber')} />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()} className="text-xl">
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacherCount && (
              <p className="text-red-500 text-base mt-2">{t('selectValidNumber')}</p>
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
            <Select value={studentCount.toString()} onValueChange={(value) => setStudentCount(parseInt(value))}>
              <SelectTrigger className={`h-14 text-2xl ${errors.studentCount ? "border-red-500" : ""}`}>
                <SelectValue placeholder={t('selectNumber')} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()} className="text-xl">
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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