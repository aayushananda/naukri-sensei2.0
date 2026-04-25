import React, { useState } from 'react';
import JdMatchPanel from './JdMatchPanel';
import { 
  MapPin, 
  Briefcase, 
  CircleDollarSign, 
  Clock, 
  ExternalLink, 
  Building2, 
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Tag
} from 'lucide-react';

export default function JobCard({ job, isExpanded, onToggle, resumeText, cachedResult, onFetchMatch }) {
  const [showDetails, setShowDetails] = useState(false);

  // Use JSearch generic fields (title, company_name, description etc)
  const title = job.job_title || job.title || 'Unknown Title';
  const company = job.employer_name || job.company || 'Unknown Company';
  const description = job.job_description || job.description || '';
  
  // Enhanced JSearch fields
  const logo = job.employer_logo;
  const website = job.employer_website;
  const isRemote = job.job_is_remote;
  const location = [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', ');
  const employmentType = job.job_employment_type ? job.job_employment_type.replace('_', ' ') : '';
  const hasSalary = job.job_min_salary && job.job_max_salary;
  
  // Advanced JSearch fields
  const publisher = job.job_publisher;
  const applyOptions = job.apply_options || [];
  const benefits = job.job_benefits || [];
  const highlights = job.job_highlights || {};
  const googleLink = job.job_google_link;
  
  let salaryText = '';
  if (hasSalary) {
    salaryText = `${job.job_min_salary.toLocaleString()} - ${job.job_max_salary.toLocaleString()} ${job.job_salary_currency || 'USD'} / ${job.job_salary_period ? job.job_salary_period.toLowerCase() : 'year'}`;
  }

  const formatPostedAt = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    return `${diffDays}d ago`;
  };

  const postedAt = job.job_posted_at || formatPostedAt(job.job_posted_at_timestamp) || formatPostedAt(job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc).getTime() / 1000 : null);
  const primaryApplyLink = job.job_apply_link;

  const jdTextForMatch = description || `${title} at ${company}`;

  const formatLabel = (str) => {
    if (!str) return '';
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div style={{
      border: '1px solid var(--color-border, #2d3748)',
      padding: '1.5rem',
      borderRadius: '8px',
      background: 'var(--color-bg-surface, rgba(255,255,255,0.05))',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {logo ? (
            <img src={logo} alt={`${company} logo`} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '4px', backgroundColor: 'white', padding: '2px' }} />
          ) : (
            <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-base, #111827)', borderRadius: '4px', border: '1px solid var(--color-border, #374151)' }}>
              <Building2 size={24} color="var(--color-text-secondary, #9ca3af)" />
            </div>
          )}
          
          <div>
            <h3 style={{ marginBottom: '0.25rem', fontSize: '1.25rem' }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <p style={{ color: 'var(--color-accent-primary, #60a5fa)', fontWeight: '500', margin: 0 }}>{company}</p>
              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted, #9ca3af)', display: 'flex', alignItems: 'center' }} title="Visit Website">
                  <Globe size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={onToggle}
          style={{
            padding: '0.5rem 1rem',
            background: isExpanded ? 'var(--color-bg-base, #111827)' : 'var(--color-accent-primary, #2563eb)',
            color: 'white',
            borderRadius: '4px',
            border: isExpanded ? '1px solid var(--color-border, #374151)' : 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
            fontWeight: '500',
            flexShrink: 0
          }}
        >
          {isExpanded ? 'Hide Fit' : 'Check My Fit'}
        </button>
      </div>

      {/* Badges / Metadata Area */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem' }}>
        {location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-secondary, #9ca3af)', background: 'var(--color-bg-base, rgba(0,0,0,0.2))', padding: '0.25rem 0.6rem', borderRadius: '12px' }}>
            <MapPin size={14} /> {isRemote ? 'Remote' : location}
          </span>
        )}
        {employmentType && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-secondary, #9ca3af)', background: 'var(--color-bg-base, rgba(0,0,0,0.2))', padding: '0.25rem 0.6rem', borderRadius: '12px', textTransform: 'capitalize' }}>
            <Briefcase size={14} /> {employmentType.toLowerCase()}
          </span>
        )}
        {salaryText && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-success, #34d399)', background: 'var(--color-bg-base, rgba(0,0,0,0.2))', padding: '0.25rem 0.6rem', borderRadius: '12px', fontWeight: '500' }}>
            <CircleDollarSign size={14} /> {salaryText}
          </span>
        )}
        {benefits && benefits.length > 0 && benefits.slice(0, 3).map((benefit, idx) => (
          <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-secondary, #d1d5db)', background: 'rgba(255,255,255,0.08)', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>
            <Tag size={12} /> {formatLabel(benefit)}
          </span>
        ))}
        {benefits && benefits.length > 3 && (
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-muted, #6b7280)', fontSize: '0.8rem', padding: '0.25rem 0' }}>
            +{benefits.length - 3} more
          </span>
        )}
      </div>

      {/* Description Preview (Truncated) */}
      {!showDetails && (
        <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: 'var(--color-text-secondary, #d1d5db)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
          {description}
        </p>
      )}

      {/* Full Details Expansion View */}
      {showDetails && (
        <div style={{
          background: 'rgba(0,0,0,0.15)',
          border: '1px solid var(--color-border, #374151)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Highlights Sections */}
          {highlights && Object.keys(highlights).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {Object.entries(highlights).map(([category, items]) => (
                <div key={category}>
                  <h4 style={{ color: 'var(--color-text-primary, #f3f4f6)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', margin: 0 }}>
                    <CheckCircle2 size={16} color="var(--color-accent-primary, #60a5fa)" />
                    {category}
                  </h4>
                  <ul style={{ listStyleType: 'none', padding: 0, marginTop: '0.5rem', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {items.map((item, idx) => (
                      <li key={idx} style={{ color: 'var(--color-text-secondary, #d1d5db)', fontSize: '0.9rem', lineHeight: '1.4', paddingLeft: '1.5rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.5rem', color: 'var(--color-text-muted, #6b7280)' }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Full Description */}
          {description && (
            <div>
              <h4 style={{ color: 'var(--color-text-primary, #f3f4f6)', marginBottom: '0.75rem', fontSize: '1rem', margin: 0 }}>Full Description</h4>
              <p style={{ color: 'var(--color-text-secondary, #d1d5db)', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 }}>
                {description}
              </p>
            </div>
          )}

          {/* Alternative Apply Options */}
          {applyOptions && applyOptions.length > 0 && (
            <div style={{ borderTop: '1px solid var(--color-border, #374151)', paddingTop: '1.25rem' }}>
              <h4 style={{ color: 'var(--color-text-primary, #f3f4f6)', marginBottom: '1rem', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>Other ways to apply:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {applyOptions.map((opt, idx) => (
                  <a 
                    key={idx}
                    href={opt.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: opt.is_direct ? 'rgba(52, 211, 153, 0.1)' : 'var(--color-bg-base, #111827)',
                      color: opt.is_direct ? 'var(--color-success, #34d399)' : 'var(--color-text-secondary, #e5e7eb)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      border: `1px solid ${opt.is_direct ? 'rgba(52, 211, 153, 0.3)' : 'var(--color-border, #374151)'}`
                    }}
                  >
                    {opt.publisher}
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
              {googleLink && (
                <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                  <a href={googleLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted, #9ca3af)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Globe size={12} /> View on Google Jobs
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Area with Expand Toggle, Apply Link & Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid var(--color-border, #2d3748)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted, #6b7280)', fontSize: '0.85rem' }}>
            <Clock size={14} />
            {postedAt ? postedAt : 'Recently'}
            {publisher && ` via ${publisher}`}
          </div>
          
          {/* Toggle Full Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border, #374151)',
              borderRadius: '4px',
              color: 'var(--color-text-secondary, #9ca3af)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: '0.25rem 0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text-primary, #f3f4f6)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary, #9ca3af)'}
          >
            {showDetails ? (
              <><ChevronUp size={14} /> Show Less</>
            ) : (
              <><ChevronDown size={14} /> View Full Details</>
            )}
          </button>
        </div>

        {primaryApplyLink && (
          <a 
            href={primaryApplyLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-accent-primary, #60a5fa)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Apply Now <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Fit Analysis Modal/Panel */}
      {isExpanded && (
        <JdMatchPanel 
          resumeText={resumeText}
          job={{ ...job, description: jdTextForMatch }} // normalize for panel
          cachedResult={cachedResult}
          onFetchMatch={onFetchMatch}
        />
      )}
    </div>
  );
}
