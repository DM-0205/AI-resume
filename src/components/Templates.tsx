import React from 'react';
import { ResumeData } from '../types';

interface TemplateProps {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, education, workExperience, projects, skills, certifications, languages, awards } = data;
  return (
    <div className="flex flex-col gap-6 text-[11pt] leading-relaxed font-sans">
      <header className="flex justify-between items-start border-b pb-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || '您的姓名'}</h1>
          <div className="flex gap-3 text-sm text-zinc-600 flex-wrap">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-24 h-32 ml-4 shrink-0">
            <img src={personalInfo.photo} className="w-full h-full object-cover rounded shadow-sm" alt="Profile" referrerPolicy="no-referrer" />
          </div>
        )}
      </header>

      {(data.sectionOrder || ['summary', 'workExperience', 'projects', 'education', 'skills', 'certifications', 'languages', 'awards']).map((sectionKey) => {
        if (sectionKey === 'summary' && personalInfo.summary) {
          return (
            <section key="summary">
              <h2 className="text-lg font-bold border-l-4 border-zinc-800 pl-2 mb-2">个人总结</h2>
              <p className="text-zinc-700 whitespace-pre-wrap">{personalInfo.summary}</p>
            </section>
          );
        }
        if (sectionKey === 'workExperience' && (workExperience || []).length > 0) {
          return (
            <section key="workExperience">
              <h2 className="text-lg font-bold border-l-4 border-zinc-800 pl-2 mb-3">工作经历</h2>
              <div className="flex flex-col gap-4">
                {workExperience.map((work, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold">
                      <span>{work.company}</span>
                      <span>{work.date}</span>
                    </div>
                    <div className="italic text-zinc-700 mb-1">{work.role}</div>
                    <p className="text-zinc-600 whitespace-pre-wrap text-sm">{work.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'projects' && (projects || []).length > 0) {
          return (
            <section key="projects">
              <h2 className="text-lg font-bold border-l-4 border-zinc-800 pl-2 mb-3">项目经验</h2>
              <div className="flex flex-col gap-4">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold">
                      <span>{proj.name}</span>
                      <span>{proj.date}</span>
                    </div>
                    <div className="italic text-zinc-700 mb-1">{proj.role}</div>
                    <p className="text-zinc-600 whitespace-pre-wrap text-sm">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'education' && (education || []).length > 0) {
          return (
            <section key="education">
              <h2 className="text-lg font-bold border-l-4 border-zinc-800 pl-2 mb-3">教育背景</h2>
              <div className="flex flex-col gap-3">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold">
                      <span>{edu.school}</span>
                      <span>{edu.date}</span>
                    </div>
                    <div className="text-zinc-700">{edu.degree} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                    {edu.description && <p className="text-zinc-600 text-sm mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'skills' && (skills || []).length > 0) {
          return (
            <section key="skills">
              <h2 className="text-lg font-bold border-l-4 border-zinc-800 pl-2 mb-2">技能特长</h2>
              <div className="flex flex-col gap-1">
                {skills.map((skill, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-bold">{skill.category}: </span>
                    <span className="text-zinc-700">{skill.items}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'certifications' && (certifications || []).length > 0) {
          return (
            <section key="certifications">
              <h2 className="text-lg font-bold border-l-4 border-zinc-800 pl-2 mb-3">证书奖项</h2>
              <div className="flex flex-col gap-2">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>
                      <span className="font-bold">{cert.name}</span>
                      <span className="text-zinc-600 ml-2">({cert.issuer})</span>
                    </div>
                    <span className="text-zinc-500">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'languages' && (languages || []).length > 0) {
          return (
            <section key="languages">
              <h2 className="text-lg font-bold border-l-4 border-zinc-800 pl-2 mb-2">语言能力</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {languages.map((lang, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-bold">{lang.language}: </span>
                    <span className="text-zinc-700">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'awards' && (awards || []).length > 0) {
          return (
            <section key="awards">
              <h2 className="text-lg font-bold border-l-4 border-zinc-800 pl-2 mb-3">荣誉奖励</h2>
              <div className="flex flex-col gap-2">
                {awards.map((award, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex justify-between font-bold">
                      <span>{award.name}</span>
                      <span>{award.date}</span>
                    </div>
                    {award.description && <p className="text-zinc-600 mt-0.5">{award.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        }
        return null;
      })}
    </div>
  );
};

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, education, workExperience, projects, skills, certifications, languages, awards } = data;
  return (
    <div className="flex flex-col gap-6 text-[10.5pt] leading-relaxed font-sans">
      <header className="bg-indigo-600 text-white p-8 -m-[20mm] mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">{personalInfo.fullName || '您的姓名'}</h1>
          <div className="flex gap-4 text-indigo-100 text-sm flex-wrap">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-24 h-32 shrink-0 border-2 border-white/20 rounded-lg overflow-hidden shadow-xl">
            <img src={personalInfo.photo} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
          </div>
        )}
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 flex flex-col gap-6">
          {(data.sectionOrder || ['summary', 'workExperience', 'projects', 'awards']).map((sectionKey) => {
            if (sectionKey === 'summary' && personalInfo.summary) {
              return (
                <section key="summary">
                  <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-2">关于我</h2>
                  <p className="text-zinc-700 whitespace-pre-wrap">{personalInfo.summary}</p>
                </section>
              );
            }
            if (sectionKey === 'workExperience' && (workExperience || []).length > 0) {
              return (
                <section key="workExperience">
                  <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">工作经历</h2>
                  <div className="flex flex-col gap-5">
                    {(workExperience || []).map((work, i) => (
                      <div key={i} className="relative pl-4 border-l-2 border-indigo-100">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white" />
                        <div className="flex justify-between font-bold text-zinc-900">
                          <span>{work.company}</span>
                          <span className="text-zinc-500 font-normal text-xs">{work.date}</span>
                        </div>
                        <div className="text-indigo-600 text-sm font-medium mb-1">{work.role}</div>
                        <p className="text-zinc-600 whitespace-pre-wrap text-sm">{work.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            if (sectionKey === 'projects' && (projects || []).length > 0) {
              return (
                <section key="projects">
                  <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">项目经验</h2>
                  <div className="flex flex-col gap-5">
                    {(projects || []).map((proj, i) => (
                      <div key={i} className="relative pl-4 border-l-2 border-indigo-100">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white" />
                        <div className="flex justify-between font-bold text-zinc-900">
                          <span>{proj.name}</span>
                          <span className="text-zinc-500 font-normal text-xs">{proj.date}</span>
                        </div>
                        <div className="text-indigo-600 text-sm font-medium mb-1">{proj.role}</div>
                        <p className="text-zinc-600 whitespace-pre-wrap text-sm">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            if (sectionKey === 'awards' && (awards || []).length > 0) {
              return (
                <section key="awards">
                  <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">荣誉奖励</h2>
                  <div className="flex flex-col gap-4">
                    {awards.map((award, i) => (
                      <div key={i}>
                        <div className="flex justify-between font-bold text-zinc-900 text-sm">
                          <span>{award.name}</span>
                          <span className="text-zinc-400 text-xs">{award.date}</span>
                        </div>
                        {award.description && <p className="text-zinc-600 text-xs mt-1">{award.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          {(data.sectionOrder || ['education', 'skills', 'certifications', 'languages']).map((sectionKey) => {
            if (sectionKey === 'education' && (education || []).length > 0) {
              return (
                <section key="education">
                  <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">教育背景</h2>
                  <div className="flex flex-col gap-4">
                    {(education || []).map((edu, i) => (
                      <div key={i}>
                        <div className="font-bold text-zinc-900 text-sm">{edu.school}</div>
                        <div className="text-zinc-600 text-xs">{edu.degree}</div>
                        <div className="text-zinc-400 text-[10px]">{edu.date}</div>
                        {edu.gpa && <div className="text-zinc-500 text-xs mt-1">GPA: {edu.gpa}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            if (sectionKey === 'skills' && (skills || []).length > 0) {
              return (
                <section key="skills">
                  <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">专业技能</h2>
                  <div className="flex flex-col gap-3">
                    {(skills || []).map((skill, i) => (
                      <div key={i}>
                        <div className="font-bold text-zinc-900 text-xs mb-1">{skill.category}</div>
                        <div className="text-zinc-600 text-xs">{skill.items}</div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            if (sectionKey === 'certifications' && (certifications || []).length > 0) {
              return (
                <section key="certifications">
                  <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">证书奖项</h2>
                  <div className="flex flex-col gap-3">
                    {certifications.map((cert, i) => (
                      <div key={i}>
                        <div className="font-bold text-zinc-900 text-xs">{cert.name}</div>
                        <div className="text-zinc-500 text-[10px]">{cert.issuer} | {cert.date}</div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            if (sectionKey === 'languages' && (languages || []).length > 0) {
              return (
                <section key="languages">
                  <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">语言能力</h2>
                  <div className="flex flex-col gap-2">
                    {languages.map((lang, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-bold text-zinc-900">{lang.language}: </span>
                        <span className="text-zinc-600">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, education, workExperience, projects, skills, certifications, languages, awards } = data;
  return (
    <div className="flex flex-col gap-5 text-[10.5pt] leading-snug font-sans">
      <header className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">{personalInfo.fullName || '您的姓名'}</h1>
          <div className="flex gap-2 text-xs text-zinc-700">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.website && <span>• {personalInfo.website}</span>}
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-20 h-28 ml-4 shrink-0 border border-zinc-200">
            <img src={personalInfo.photo} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
          </div>
        )}
      </header>

      {personalInfo.summary && (
        <section>
          <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-900 mb-2">个人简介</h2>
          <p className="text-zinc-800 whitespace-pre-wrap">{personalInfo.summary}</p>
        </section>
      )}

      {(data.sectionOrder || ['workExperience', 'projects', 'education', 'skills', 'certifications', 'languages', 'awards']).map((sectionKey) => {
        if (sectionKey === 'education' && (education || []).length > 0) {
          return (
            <section key="education">
              <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-900 mb-2">教育背景</h2>
              {(education || []).map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between font-bold">
                    <span>{edu.school}</span>
                    <span>{edu.date}</span>
                  </div>
                  <div className="flex justify-between italic">
                    <span>{edu.degree}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                  {edu.description && <p className="text-zinc-700 mt-1">{edu.description}</p>}
                </div>
              ))}
            </section>
          );
        }
        if (sectionKey === 'workExperience' && (workExperience || []).length > 0) {
          return (
            <section key="workExperience">
              <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-900 mb-2">工作经历</h2>
              {(workExperience || []).map((work, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between font-bold">
                    <span>{work.company}</span>
                    <span>{work.date}</span>
                  </div>
                  <div className="italic mb-1">{work.role}</div>
                  <p className="text-zinc-800 whitespace-pre-wrap text-sm">{work.description}</p>
                </div>
              ))}
            </section>
          );
        }
        if (sectionKey === 'projects' && (projects || []).length > 0) {
          return (
            <section key="projects">
              <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-900 mb-2">项目经验</h2>
              {(projects || []).map((proj, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between font-bold">
                    <span>{proj.name}</span>
                    <span>{proj.date}</span>
                  </div>
                  <div className="italic mb-1">{proj.role}</div>
                  <p className="text-zinc-800 whitespace-pre-wrap text-sm">{proj.description}</p>
                </div>
              ))}
            </section>
          );
        }
        if (sectionKey === 'skills' && (skills || []).length > 0) {
          return (
            <section key="skills">
              <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-900 mb-2">技能特长</h2>
              <div className="flex flex-col gap-1">
                {(skills || []).map((skill, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-bold">{skill.category}: </span>
                    <span>{skill.items}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'certifications' && (certifications || []).length > 0) {
          return (
            <section key="certifications">
              <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-900 mb-2">证书奖项</h2>
              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span><span className="font-bold">{cert.name}</span> ({cert.issuer})</span>
                  <span>{cert.date}</span>
                </div>
              ))}
            </section>
          );
        }
        if (sectionKey === 'languages' && (languages || []).length > 0) {
          return (
            <section key="languages">
              <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-900 mb-2">语言能力</h2>
              <div className="flex gap-x-4 flex-wrap">
                {languages.map((lang, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-bold">{lang.language}: </span>
                    <span>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'awards' && (awards || []).length > 0) {
          return (
            <section key="awards">
              <h2 className="text-sm font-bold uppercase border-b-2 border-zinc-900 mb-2">荣誉奖励</h2>
              {awards.map((award, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between font-bold text-sm">
                    <span>{award.name}</span>
                    <span>{award.date}</span>
                  </div>
                  {award.description && <p className="text-zinc-700 text-sm">{award.description}</p>}
                </div>
              ))}
            </section>
          );
        }
        return null;
      })}
    </div>
  );
};

export const ATSTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, education, workExperience, projects, skills, certifications, languages, awards } = data;
  return (
    <div className="flex flex-col gap-4 text-[11pt] leading-tight font-sans text-black">
      <header className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{personalInfo.fullName || '您的姓名'}</h1>
          <div className="text-sm">
            {personalInfo.location} | {personalInfo.phone} | {personalInfo.email}
            {personalInfo.website && ` | ${personalInfo.website}`}
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-20 h-28 ml-4 shrink-0 border border-black p-0.5">
            <img src={personalInfo.photo} className="w-full h-full object-cover grayscale" alt="Profile" referrerPolicy="no-referrer" />
          </div>
        )}
      </header>

      {personalInfo.summary && (
        <section>
          <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Summary</h2>
          <p className="whitespace-pre-wrap">{personalInfo.summary}</p>
        </section>
      )}

      {(data.sectionOrder || ['education', 'workExperience', 'projects', 'skills', 'certifications', 'languages', 'awards']).map((sectionKey) => {
        if (sectionKey === 'education' && (education || []).length > 0) {
          return (
            <section key="education">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Education</h2>
              {(education || []).map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between font-bold">
                    <span>{edu.school}</span>
                    <span>{edu.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{edu.degree}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </section>
          );
        }
        if (sectionKey === 'workExperience' && (workExperience || []).length > 0) {
          return (
            <section key="workExperience">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Experience</h2>
              {(workExperience || []).map((work, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between font-bold">
                    <span>{work.company}</span>
                    <span>{work.date}</span>
                  </div>
                  <div className="font-bold italic">{work.role}</div>
                  <p className="whitespace-pre-wrap pl-4">{work.description}</p>
                </div>
              ))}
            </section>
          );
        }
        if (sectionKey === 'projects' && (projects || []).length > 0) {
          return (
            <section key="projects">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Projects</h2>
              {(projects || []).map((proj, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between font-bold">
                    <span>{proj.name}</span>
                    <span>{proj.date}</span>
                  </div>
                  <div className="font-bold italic">{proj.role}</div>
                  <p className="whitespace-pre-wrap pl-4">{proj.description}</p>
                </div>
              ))}
            </section>
          );
        }
        if (sectionKey === 'skills' && (skills || []).length > 0) {
          return (
            <section key="skills">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Skills</h2>
              <div className="flex flex-col gap-1">
                {(skills || []).map((skill, i) => (
                  <div key={i}>
                    <span className="font-bold">{skill.category}: </span>
                    <span>{skill.items}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'certifications' && (certifications || []).length > 0) {
          return (
            <section key="certifications">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Certifications</h2>
              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between">
                  <span><span className="font-bold">{cert.name}</span> ({cert.issuer})</span>
                  <span>{cert.date}</span>
                </div>
              ))}
            </section>
          );
        }
        if (sectionKey === 'languages' && (languages || []).length > 0) {
          return (
            <section key="languages">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Languages</h2>
              <div className="flex gap-x-6 flex-wrap">
                {languages.map((lang, i) => (
                  <div key={i}>
                    <span className="font-bold">{lang.language}: </span>
                    <span>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sectionKey === 'awards' && (awards || []).length > 0) {
          return (
            <section key="awards">
              <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Awards</h2>
              {awards.map((award, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between font-bold">
                    <span>{award.name}</span>
                    <span>{award.date}</span>
                  </div>
                  {award.description && <p className="pl-4">{award.description}</p>}
                </div>
              ))}
            </section>
          );
        }
        return null;
      })}
    </div>
  );
};

export const TwoColumnTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, education, workExperience, projects, skills, certifications, languages, awards } = data;
  return (
    <div className="flex h-full -m-[20mm] text-[10pt] leading-relaxed font-sans">
      <aside className="w-1/3 bg-zinc-800 text-white p-8 flex flex-col gap-8">
        <div>
          {personalInfo.photo && (
            <div className="w-full aspect-[3/4] mb-6 rounded-lg overflow-hidden border-2 border-zinc-700 shadow-lg">
              <img src={personalInfo.photo} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
            </div>
          )}
          <h1 className="text-2xl font-bold mb-4">{personalInfo.fullName || '您的姓名'}</h1>
          <div className="flex flex-col gap-2 text-xs text-zinc-300">
            {personalInfo.email && <div className="break-all">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.website && <div className="break-all">{personalInfo.website}</div>}
          </div>
        </div>

        {(data.sectionOrder || ['education', 'skills', 'languages', 'certifications']).map((sectionKey) => {
          if (sectionKey === 'education' && (education || []).length > 0) {
            return (
              <section key="education">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-700 pb-1">教育背景</h2>
                <div className="flex flex-col gap-4">
                  {(education || []).map((edu, i) => (
                    <div key={i}>
                      <div className="font-bold text-sm">{edu.school}</div>
                      <div className="text-zinc-400 text-xs">{edu.degree}</div>
                      <div className="text-zinc-500 text-[10px]">{edu.date}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          if (sectionKey === 'skills' && (skills || []).length > 0) {
            return (
              <section key="skills">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-700 pb-1">专业技能</h2>
                <div className="flex flex-col gap-4">
                  {(skills || []).map((skill, i) => (
                    <div key={i}>
                      <div className="font-bold text-xs mb-1">{skill.category}</div>
                      <div className="text-zinc-400 text-xs">{skill.items}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          if (sectionKey === 'languages' && (languages || []).length > 0) {
            return (
              <section key="languages">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-700 pb-1">语言能力</h2>
                <div className="flex flex-col gap-2">
                  {languages.map((lang, i) => (
                    <div key={i} className="text-xs">
                      <div className="font-bold text-zinc-200">{lang.language}</div>
                      <div className="text-zinc-400">{lang.proficiency}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          if (sectionKey === 'certifications' && (certifications || []).length > 0) {
            return (
              <section key="certifications">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-700 pb-1">证书奖项</h2>
                <div className="flex flex-col gap-3">
                  {certifications.map((cert, i) => (
                    <div key={i} className="text-xs">
                      <div className="font-bold text-zinc-200">{cert.name}</div>
                      <div className="text-zinc-500">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          return null;
        })}
      </aside>

      <main className="w-2/3 p-10 bg-white flex flex-col gap-8">
        {(data.sectionOrder || ['summary', 'workExperience', 'projects', 'awards']).map((sectionKey) => {
          if (sectionKey === 'summary' && personalInfo.summary) {
            return (
              <section key="summary">
                <h2 className="text-lg font-bold text-zinc-800 mb-3 border-b-2 border-zinc-100 pb-1">个人简介</h2>
                <p className="text-zinc-600 whitespace-pre-wrap">{personalInfo.summary}</p>
              </section>
            );
          }
          if (sectionKey === 'workExperience' && (workExperience || []).length > 0) {
            return (
              <section key="workExperience">
                <h2 className="text-lg font-bold text-zinc-800 mb-4 border-b-2 border-zinc-100 pb-1">工作经历</h2>
                <div className="flex flex-col gap-6">
                  {(workExperience || []).map((work, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-zinc-900">{work.company}</h3>
                        <span className="text-zinc-400 text-xs">{work.date}</span>
                      </div>
                      <div className="text-zinc-500 text-sm italic mb-2">{work.role}</div>
                      <p className="text-zinc-600 whitespace-pre-wrap text-sm">{work.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          if (sectionKey === 'projects' && (projects || []).length > 0) {
            return (
              <section key="projects">
                <h2 className="text-lg font-bold text-zinc-800 mb-4 border-b-2 border-zinc-100 pb-1">项目经验</h2>
                <div className="flex flex-col gap-6">
                  {(projects || []).map((proj, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-zinc-900">{proj.name}</h3>
                        <span className="text-zinc-400 text-xs">{proj.date}</span>
                      </div>
                      <div className="text-zinc-500 text-sm italic mb-2">{proj.role}</div>
                      <p className="text-zinc-600 whitespace-pre-wrap text-sm">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          if (sectionKey === 'awards' && (awards || []).length > 0) {
            return (
              <section key="awards">
                <h2 className="text-lg font-bold text-zinc-800 mb-4 border-b-2 border-zinc-100 pb-1">荣誉奖励</h2>
                <div className="flex flex-col gap-4">
                  {awards.map((award, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-zinc-900">{award.name}</h3>
                        <span className="text-zinc-400 text-xs">{award.date}</span>
                      </div>
                      {award.description && <p className="text-zinc-600 text-sm">{award.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          return null;
        })}
      </main>
    </div>
  );
};
