import { useState } from "react";

// Add this helper component before your ApplicationCard component
const ResumeSections = ({ resumeText }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  const extractResumeSections = (text) => {
    if (!text) return null;
    
    const sections = {
      summary: '',
      experience: '',
      education: '',
      skills: ''
    };
    
    // Try to find sections with different possible headings
    const summaryMatch = text.match(/(?:Professional Summary|Summary|Profile|About)[\s\S]*?(?=Experience|Work Experience|Employment|Education|Skills|Projects|$)/i);
    const experienceMatch = text.match(/(?:Experience|Work Experience|Employment|Professional Experience)[\s\S]*?(?=Education|Skills|Projects|Certifications|$)/i);
    const educationMatch = text.match(/(?:Education|Academic Background|Academic)[\s\S]*?(?=Experience|Skills|Projects|Work|$)/i);
    const skillsMatch = text.match(/(?:Skills|Technical Skills|Core Competencies|Technologies)[\s\S]*?(?=Experience|Education|Projects|Work|$)/i);
    
    // Clean up the extracted text
    sections.summary = summaryMatch?.[0]?.replace(/^(Professional Summary|Summary|Profile|About):?\s*/i, '').trim() || '';
    sections.experience = experienceMatch?.[0]?.replace(/^(Experience|Work Experience|Employment|Professional Experience):?\s*/i, '').trim() || '';
    sections.education = educationMatch?.[0]?.replace(/^(Education|Academic Background|Academic):?\s*/i, '').trim() || '';
    sections.skills = skillsMatch?.[0]?.replace(/^(Skills|Technical Skills|Core Competencies|Technologies):?\s*/i, '').trim() || '';
    
    // If no sections found by heading, try to use first 500 chars as summary
    if (!sections.summary && !sections.experience && !sections.education && !sections.skills) {
      sections.summary = text.substring(0, 500);
    }
    
    return sections;
  };
  
  const sections = extractResumeSections(resumeText);
  const hasContent = Object.values(sections).some(content => content);
  
  if (!hasContent) {
    return <div>No parsable resume content</div>;
  }
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  const Section = ({ title, content, sectionKey }) => {
    if (!content) return null;
    
    const isExpanded = expandedSection === sectionKey;
    const previewLength = 200;
    const needsExpand = content.length > previewLength;
    
    return (
      <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.5rem' }}>
        <h4 style={{ 
          margin: '0 0 0.5rem 0', 
          color: '#667eea', 
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          {title}
        </h4>
        <div style={{ 
          fontSize: '0.85rem', 
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap'
        }}>
          {isExpanded || !needsExpand ? content : content.substring(0, previewLength) + '...'}
          {needsExpand && (
            <button
              onClick={() => toggleSection(sectionKey)}
              style={{
                marginLeft: '0.5rem',
                color: '#667eea',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textDecoration: 'underline'
              }}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <Section title=" Professional Summary" content={sections.summary} sectionKey="summary" />
      <Section title=" Experience" content={sections.experience} sectionKey="experience" />
      <Section title=" Education" content={sections.education} sectionKey="education" />
      <Section title=" Skills" content={sections.skills} sectionKey="skills" />
    </div>
  );
};

export default ResumeSections