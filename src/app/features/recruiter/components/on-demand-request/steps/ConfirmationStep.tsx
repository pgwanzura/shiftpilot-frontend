import {
  useWatch,
  Control,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
} from 'react-hook-form';
import { Icon } from '@/app/components/ui';
import { useEffect, useState } from 'react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  position: string;
  team: string;
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  references: {
    completed: number;
    total: number;
    status: string;
  };
  echoTrust: {
    score: number | string;
    ranking: string;
  };
  lastUpdated: string;
  skills?: string[];
  experience?: string;
}

interface Referee {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  relationship: string;
}

interface ConfirmationFormValues {
  referees: Referee[];
  questions: string[];
  referenceType: 'professional' | 'academic' | 'character' | 'skill-specific';
  urgency: string;
  referenceCount: number;
  deadline?: string;
  candidateId?: string;
}

interface ConfirmationStepProps {
  form: {
    control: Control<ConfirmationFormValues>;
    watch: UseFormWatch<ConfirmationFormValues>;
    setValue: UseFormSetValue<ConfirmationFormValues>;
    getValues: UseFormGetValues<ConfirmationFormValues>;
  };
  selectedCandidate: Candidate | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function ConfirmationStep({
  form,
  selectedCandidate,
}: ConfirmationStepProps) {
  const [isIconVisible, setIsIconVisible] = useState(false);
  const [hasPulsed, setHasPulsed] = useState(false);

  const referees = useWatch({ control: form.control, name: 'referees' });
  const questions = useWatch({ control: form.control, name: 'questions' });
  const referenceType = useWatch({
    control: form.control,
    name: 'referenceType',
  });
  const urgency = useWatch({ control: form.control, name: 'urgency' });
  const referenceCount = useWatch({
    control: form.control,
    name: 'referenceCount',
  });
  const deadline = useWatch({ control: form.control, name: 'deadline' });

  useEffect(() => {
    const timer = setTimeout(() => setIsIconVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isIconVisible && !hasPulsed) {
      const timer = setTimeout(() => setHasPulsed(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isIconVisible, hasPulsed]);

  return (
    <div className="bg-white shadow-sm rounded-xl p-8 animate-fade-in">
      <div className="text-center mb-10">
        <div className="mx-auto flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-green-100 to-green-200 mb-4 relative">
          <Icon
            name="check"
            className={`h-4 w-4 text-green-600 transition-all duration-700 ease-out ${
              isIconVisible
                ? 'opacity-100 scale-100 rotate-0'
                : 'opacity-0 scale-50 rotate-45'
            }`}
          />
          {isIconVisible && !hasPulsed && (
            <span className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping" />
          )}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
          Review & Submit Your Request
        </h3>
        <p className="text-gray-600">
          Please review all details before submitting your reference request
        </p>
      </div>

      <div className="border-t border-gray-200 pt-8 mt-8">
        <h4 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-indigo-500 pl-3 tracking-tight">
          Request Summary
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg hover:shadow-sm transition-shadow">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Candidate
            </p>
            <p className="text-gray-900 font-medium">
              {selectedCandidate?.name}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg hover:shadow-sm transition-shadow">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Reference Type
            </p>
            <p className="text-gray-900 font-medium capitalize">
              {referenceType}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg hover:shadow-sm transition-shadow">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Number of References
            </p>
            <p className="text-gray-900 font-medium">{referenceCount}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg hover:shadow-sm transition-shadow">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Urgency
            </p>
            <p className="text-gray-900 font-medium capitalize">{urgency}</p>
          </div>
          {deadline && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg hover:shadow-sm transition-shadow">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Deadline
              </p>
              <p className="text-gray-900 font-medium">
                {new Date(deadline).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="mb-10">
          <h5 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-indigo-500 pl-3">
            Referees
          </h5>
          <div className="grid gap-4">
            {referees?.map((referee: Referee, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <h6 className="flex items-center text-md font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full mr-2">
                    #{index + 1}
                  </span>
                  Referee
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Name
                    </p>
                    <p className="text-gray-900">
                      {referee.firstName} {referee.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Email
                    </p>
                    <p className="text-gray-900">{referee.email}</p>
                  </div>
                  {referee.phone && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Phone
                      </p>
                      <p className="text-gray-900">{referee.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Relationship
                    </p>
                    <p className="text-gray-900">{referee.relationship}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h5 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-indigo-500 pl-3">
            Questions
          </h5>
          <div className="bg-gray-50 rounded-xl p-6">
            <ul className="space-y-3">
              {questions?.map((question: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500 text-white text-xs font-bold mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
