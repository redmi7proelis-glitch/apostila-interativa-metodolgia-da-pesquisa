export interface UserProjectDrafts {
  // Week 2
  theme: string;
  population: string;
  object: string;
  context: string;
  delimitedTheme: string;
  
  // Week 3
  researchProblem: string;
  
  // Week 4
  generalObjective: string;
  specificObjective1: string;
  specificObjective2: string;
  specificObjective3: string;
  hypotheses: string;
  
  // Week 4: I Congresso Integrado dos Cursos da Saúde Exercise
  congressLectureTitle: string;
  congressProblem: string;
  congressObjective: string;
  congressHypothesis: string;
  
  // Week 5
  justificationSocial: string;
  justificationScientific: string;
  justificationPractical: string;
  justificationViability: string;
  
  // Week 6
  researchType: string; // Exploratória, Descritiva, etc.
  researchApproach: string; // Qualitativa, Quantitativa, Mista
  sampleCriteria: string;
  
  // Week 7
  dataCollectionTool: string;
  dataAnalysisMethod: string;
  ethicsApprovalNeeded: boolean;
  
  // Week 8
  expectedResultsText: string;
}

export interface TimelinePhase {
  id: string;
  label: string;
  startMonth: number; // 1 to 5
  durationMonths: number; // 1 to 5
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SprintStructure {
  num: number;
  dates: string;
  title: string;
  pages: string;
  summary: string;
  contentMarkdown: string;
}
