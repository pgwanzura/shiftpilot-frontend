export interface Candidate {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface CandidateProfile {
  id: string;
  candidate_id: string;
  bio?: string;
  linkedin_url?: string;
  website_url?: string;
  skills?: string[];
  experience?: string;
}

export interface Reference {
  id: string;
  candidate_id: string;
  referee_name: string;
  referee_email: string;
  referee_phone?: string;
  relationship: string;
  company: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface CreateReferenceData {
  referee_name: string;
  referee_email: string;
  referee_phone?: string;
  relationship: string;
  company: string;
  questions?: string[];
}
