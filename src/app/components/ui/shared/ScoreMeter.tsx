export interface ScoreMeterProps {
  score: number;
  label: string;
  description: string;
}

export default function ScoreMeter({
  score,
  label,
  description,
}: ScoreMeterProps) {
  return (
    <div className="flex items-center">
      <div className="relative">
        <svg className="w-32 h-32" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{score}</span>
        </div>
      </div>
      <div className="ml-4">
        <div className="flex items-center mb-2">
          <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
          <span className="text-sm">{label}</span>
        </div>
        <div className="text-xs opacity-80">{description}</div>
      </div>
    </div>
  );
}
