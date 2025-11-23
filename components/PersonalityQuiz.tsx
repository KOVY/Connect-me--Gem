import React, { useState, useCallback, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { useTranslations } from '../hooks/useTranslations';
import { QuizQuestion, QuizAnswer, calculateLieScore, PROGRESS_MILESTONES } from '../lib/quizTypes';
import { QUIZ_SECTIONS, ALL_QUIZ_QUESTIONS, TOTAL_QUESTIONS } from '../lib/quizQuestions';

interface PersonalityQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: QuizAnswer[], lieScore: number) => void;
}

export const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({ isOpen, onClose, onComplete }) => {
  const { t } = useTranslations();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, QuizAnswer>>(new Map());
  const [showMilestone, setShowMilestone] = useState<number | null>(null);

  const currentQuestion = ALL_QUIZ_QUESTIONS[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100);
  const currentSection = QUIZ_SECTIONS.find(s => s.id === currentQuestion?.section);

  // Check if we hit a milestone
  const checkMilestone = useCallback((newIndex: number) => {
    const newProgress = Math.round(((newIndex + 1) / TOTAL_QUESTIONS) * 100);
    if (newProgress >= PROGRESS_MILESTONES.first_third &&
        Math.round(((newIndex) / TOTAL_QUESTIONS) * 100) < PROGRESS_MILESTONES.first_third) {
      setShowMilestone(33);
      setTimeout(() => setShowMilestone(null), 3000);
    } else if (newProgress >= PROGRESS_MILESTONES.two_thirds &&
               Math.round(((newIndex) / TOTAL_QUESTIONS) * 100) < PROGRESS_MILESTONES.two_thirds) {
      setShowMilestone(66);
      setTimeout(() => setShowMilestone(null), 3000);
    }
  }, []);

  const handleAnswer = useCallback((value: string | number | string[]) => {
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      value,
      timestamp: new Date()
    };
    setAnswers(prev => new Map(prev).set(currentQuestion.id, answer));
  }, [currentQuestion]);

  const getCurrentAnswer = useMemo(() => {
    return answers.get(currentQuestion?.id)?.value;
  }, [answers, currentQuestion]);

  const canProceed = useMemo(() => {
    if (!currentQuestion?.required) return true;
    const answer = getCurrentAnswer;
    if (answer === undefined || answer === null) return false;
    if (Array.isArray(answer)) {
      const minSelect = currentQuestion.minSelect || 1;
      return answer.length >= minSelect;
    }
    return true;
  }, [currentQuestion, getCurrentAnswer]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      const newIndex = currentQuestionIndex + 1;
      checkMilestone(newIndex);
      setCurrentQuestionIndex(newIndex);
    } else {
      // Complete quiz
      const answersArray = Array.from(answers.values());
      const lieScore = calculateLieScore(answersArray);
      onComplete(answersArray, lieScore);
    }
  }, [currentQuestionIndex, answers, checkMilestone, onComplete]);

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const handleMultiSelect = useCallback((optionValue: string) => {
    const current = (getCurrentAnswer as string[]) || [];
    const maxSelect = currentQuestion.maxSelect || 5;

    if (current.includes(optionValue)) {
      handleAnswer(current.filter(v => v !== optionValue));
    } else if (current.length < maxSelect) {
      handleAnswer([...current, optionValue]);
    }
  }, [getCurrentAnswer, currentQuestion, handleAnswer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1 mx-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-xs mt-1 text-center">
            {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
          </p>
        </div>
        <div className="w-10" /> {/* Spacer for balance */}
      </div>

      {/* Milestone Toast */}
      {showMilestone && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-60 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">{t(showMilestone === 33 ? 'quiz_milestone_33' : 'quiz_milestone_66')}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-20 pb-24">
        {/* Section indicator */}
        <div className="mb-4">
          <span className="text-pink-300/80 text-sm font-medium uppercase tracking-wider">
            {t(currentSection?.titleKey || '')}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2 max-w-lg">
          {t(currentQuestion?.titleKey || '')}
        </h2>
        {currentQuestion?.descriptionKey && (
          <p className="text-white/60 text-center mb-8 max-w-md">
            {t(currentQuestion.descriptionKey)}
          </p>
        )}

        {/* Answer Options */}
        <div className="w-full max-w-md space-y-3">
          {currentQuestion?.type === 'single' && currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.value)}
              className={`w-full p-4 rounded-2xl text-left transition-all duration-200 ${
                getCurrentAnswer === option.value
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-[1.02]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="font-medium">{t(option.labelKey)}</span>
            </button>
          ))}

          {currentQuestion?.type === 'multi' && (
            <>
              <p className="text-white/50 text-sm text-center mb-2">
                {t('quiz_select_multiple', { min: currentQuestion.minSelect || 1, max: currentQuestion.maxSelect || 5 })}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentQuestion.options.map((option) => {
                  const isSelected = ((getCurrentAnswer as string[]) || []).includes(option.value as string);
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleMultiSelect(option.value as string)}
                      className={`px-4 py-2 rounded-full transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {t(option.labelKey)}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {currentQuestion?.type === 'scale' && (
            <div className="space-y-4">
              <div className="flex justify-between text-white/60 text-sm">
                <span>{t(currentQuestion.scaleMinLabel || '')}</span>
                <span>{t(currentQuestion.scaleMaxLabel || '')}</span>
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`w-14 h-14 rounded-full text-lg font-bold transition-all duration-200 ${
                      getCurrentAnswer === value
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-110'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
            currentQuestionIndex === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          {t('quiz_back')}
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
            !canProceed
              ? 'bg-white/20 opacity-50 cursor-not-allowed text-white/60'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          {currentQuestionIndex === TOTAL_QUESTIONS - 1 ? (
            <>
              <Check className="w-5 h-5" />
              {t('quiz_finish')}
            </>
          ) : (
            <>
              {t('quiz_next')}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
