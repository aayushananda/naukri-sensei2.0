const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analyzeResume(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/analyze-resume`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to analyze resume');
  }

  return res.json();
}

export async function searchJobs(resumeText) {
  const formData = new FormData();
  formData.append('resume_text', resumeText);

  const res = await fetch(`${API_URL}/search-jobs`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to search jobs');
  }

  return res.json();
}

export async function matchResume({ resumeText, jdText, file }) {
  const formData = new FormData();
  formData.append('jd_text', jdText);

  // Precedence rule: If file is provided, send file only. If not, send resume_text. Never both.
  if (file) {
    formData.append('file', file);
  } else if (resumeText) {
    formData.append('resume_text', resumeText);
  } else {
    throw new Error('Either file or resume_text must be provided');
  }

  const res = await fetch(`${API_URL}/match-resume`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to match resume');
  }

  return res.json();
}
