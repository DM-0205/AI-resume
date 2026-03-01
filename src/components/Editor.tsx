import React, { useRef } from 'react';
import { ResumeData } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updatePersonalInfo('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
  };

  const addSectionItem = (section: 'education' | 'workExperience' | 'projects' | 'skills' | 'certifications' | 'languages' | 'awards') => {
    let newItem: any;
    switch (section) {
      case 'skills':
        newItem = { category: '', items: '' };
        break;
      case 'education':
        newItem = { school: '', degree: '', date: '', description: '' };
        break;
      case 'certifications':
        newItem = { name: '', issuer: '', date: '' };
        break;
      case 'languages':
        newItem = { language: '', proficiency: '' };
        break;
      case 'awards':
        newItem = { name: '', date: '', description: '' };
        break;
      default:
        newItem = { company: '', role: '', date: '', description: '' };
    }
    
    onChange({
      ...data,
      [section]: [...data[section], newItem],
    });
  };

  const removeSectionItem = (section: 'education' | 'workExperience' | 'projects' | 'skills' | 'certifications' | 'languages' | 'awards', index: number) => {
    const newList = [...data[section]];
    newList.splice(index, 1);
    onChange({ ...data, [section]: newList });
  };

  const updateSectionItem = (section: 'education' | 'workExperience' | 'projects' | 'skills' | 'certifications' | 'languages' | 'awards', index: number, field: string, value: string) => {
    const newList = [...data[section]];
    newList[index] = { ...newList[index], [field]: value };
    onChange({ ...data, [section]: newList });
  };

  const moveSectionItem = (section: 'education' | 'workExperience' | 'projects' | 'skills' | 'certifications' | 'languages' | 'awards', index: number, direction: 'up' | 'down') => {
    const newList = [...data[section]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newList.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    onChange({ ...data, [section]: newList });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...(data.sectionOrder || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newOrder.length) return;
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    onChange({ ...data, sectionOrder: newOrder });
  };

  const removeSection = (index: number) => {
    if (!window.confirm('确定要删除这个模块吗？')) return;
    const newOrder = [...(data.sectionOrder || [])];
    newOrder.splice(index, 1);
    onChange({ ...data, sectionOrder: newOrder });
  };

  const addSection = (sectionKey: string) => {
    if (data.sectionOrder?.includes(sectionKey)) return;
    onChange({
      ...data,
      sectionOrder: [...(data.sectionOrder || []), sectionKey]
    });
  };

  const sectionLabels: Record<string, string> = {
    summary: '个人总结',
    workExperience: '工作经历',
    projects: '项目经验',
    education: '教育背景',
    skills: '技能特长',
    certifications: '证书奖项',
    languages: '语言能力',
    awards: '荣誉奖励'
  };

  const sectionColors: Record<string, string> = {
    summary: 'bg-indigo-600',
    workExperience: 'bg-emerald-600',
    projects: 'bg-orange-600',
    education: 'bg-blue-600',
    skills: 'bg-purple-600',
    certifications: 'bg-rose-600',
    languages: 'bg-cyan-600',
    awards: 'bg-amber-600'
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Basic Info (Fixed at top) */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-zinc-800 rounded-full" />
          基本信息
        </h3>
        
        <div className="flex gap-6 mb-6">
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-32 bg-zinc-100 border-2 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all overflow-hidden relative group"
            >
              {data.personalInfo.photo ? (
                <>
                  <img src={data.personalInfo.photo} className="w-full h-full object-cover" alt="Profile" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="text-white" size={20} />
                  </div>
                </>
              ) : (
                <>
                  <Camera className="text-zinc-400 mb-1" size={24} />
                  <span className="text-[10px] text-zinc-500 font-medium">上传照片</span>
                </>
              )}
            </div>
            {data.personalInfo.photo && (
              <button 
                onClick={removePhoto}
                className="text-[10px] text-red-500 font-medium hover:underline flex items-center gap-1"
              >
                <X size={10} /> 移除照片
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">姓名</label>
              <input
                type="text"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="张三"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">邮箱</label>
              <input
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="zhangsan@example.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">电话</label>
              <input
                type="text"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="138-0000-0000"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500">地点</label>
              <input
                type="text"
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="北京"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs font-medium text-zinc-500">个人网站/GitHub</label>
            <input
              type="text"
              value={data.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="https://github.com/zhangsan"
            />
          </div>
        </div>
      </section>

      {/* Dynamic Sections */}
      {(data.sectionOrder || []).map((sectionKey, index) => {
        const isFirst = index === 0;
        const isLast = index === (data.sectionOrder || []).length - 1;
        const color = sectionColors[sectionKey] || 'bg-zinc-600';
        const title = sectionLabels[sectionKey] || sectionKey;

        const header = (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className={`w-2 h-6 ${color} rounded-full`} />
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                <button 
                  onClick={() => moveSection(index, 'up')}
                  disabled={isFirst}
                  className="p-1.5 hover:bg-white text-zinc-500 disabled:opacity-30 transition-colors border-r border-zinc-200"
                  title="上移模块"
                >
                  <ChevronUp size={16} />
                </button>
                <button 
                  onClick={() => moveSection(index, 'down')}
                  disabled={isLast}
                  className="p-1.5 hover:bg-white text-zinc-500 disabled:opacity-30 transition-colors"
                  title="下移模块"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              {['workExperience', 'projects', 'education', 'skills', 'certifications', 'languages', 'awards'].includes(sectionKey) && (
                <button
                  onClick={() => addSectionItem(sectionKey as any)}
                  className={`p-1 hover:bg-zinc-100 rounded-full transition-colors ${color.replace('bg-', 'text-')}`}
                  title="添加条目"
                >
                  <Plus size={24} />
                </button>
              )}
              <button
                onClick={() => removeSection(index)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="删除模块"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        );

        switch (sectionKey) {
          case 'summary':
            return (
              <section key="summary" className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
                {header}
                <textarea
                  value={data.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]"
                  placeholder="简短介绍您的职业背景和核心优势..."
                />
              </section>
            );
          case 'workExperience':
            return (
              <section key="workExperience" className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
                {header}
                <div className="flex flex-col gap-6">
                  <AnimatePresence>
                    {(data.workExperience || []).map((work, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={i}
                        className="p-4 border rounded-xl bg-zinc-50 relative group"
                      >
                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-col bg-white border rounded-lg shadow-sm overflow-hidden">
                            <button 
                              onClick={() => moveSectionItem('workExperience', i, 'up')}
                              className="p-1 hover:bg-zinc-100 text-zinc-500 border-b"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button 
                              onClick={() => moveSectionItem('workExperience', i, 'down')}
                              className="p-1 hover:bg-zinc-100 text-zinc-500"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeSectionItem('workExperience', i)}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-500">公司名称</label>
                            <input
                              type="text"
                              value={work.company}
                              onChange={(e) => updateSectionItem('workExperience', i, 'company', e.target.value)}
                              className="p-2 border rounded-lg bg-white outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-500">职位</label>
                            <input
                              type="text"
                              value={work.role}
                              onChange={(e) => updateSectionItem('workExperience', i, 'role', e.target.value)}
                              className="p-2 border rounded-lg bg-white outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-xs font-medium text-zinc-500">时间范围</label>
                            <input
                              type="text"
                              value={work.date}
                              onChange={(e) => updateSectionItem('workExperience', i, 'date', e.target.value)}
                              className="p-2 border rounded-lg bg-white outline-none"
                              placeholder="2020.01 - 至今"
                            />
                          </div>
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-xs font-medium text-zinc-500">工作描述</label>
                            <textarea
                              value={work.description}
                              onChange={(e) => updateSectionItem('workExperience', i, 'description', e.target.value)}
                              className="p-2 border rounded-lg bg-white outline-none min-h-[120px]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            );
          case 'projects':
            return (
              <section key="projects" className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
                {header}
                <div className="flex flex-col gap-6">
                  {(data.projects || []).map((proj, i) => (
                    <div key={i} className="p-4 border rounded-xl bg-zinc-50 relative group">
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col bg-white border rounded-lg shadow-sm overflow-hidden">
                          <button 
                            onClick={() => moveSectionItem('projects', i, 'up')}
                            className="p-1 hover:bg-zinc-100 text-zinc-500 border-b"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button 
                            onClick={() => moveSectionItem('projects', i, 'down')}
                            className="p-1 hover:bg-zinc-100 text-zinc-500"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeSectionItem('projects', i)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-zinc-500">项目名称</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => updateSectionItem('projects', i, 'name', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-zinc-500">角色</label>
                          <input
                            type="text"
                            value={proj.role}
                            onChange={(e) => updateSectionItem('projects', i, 'role', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                          <label className="text-xs font-medium text-zinc-500">时间范围</label>
                          <input
                            type="text"
                            value={proj.date}
                            onChange={(e) => updateSectionItem('projects', i, 'date', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                          <label className="text-xs font-medium text-zinc-500">项目描述</label>
                          <textarea
                            value={proj.description}
                            onChange={(e) => updateSectionItem('projects', i, 'description', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none min-h-[100px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          case 'education':
            return (
              <section key="education" className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
                {header}
                <div className="flex flex-col gap-6">
                  {(data.education || []).map((edu, i) => (
                    <div key={i} className="p-4 border rounded-xl bg-zinc-50 relative group">
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col bg-white border rounded-lg shadow-sm overflow-hidden">
                          <button 
                            onClick={() => moveSectionItem('education', i, 'up')}
                            className="p-1 hover:bg-zinc-100 text-zinc-500 border-b"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button 
                            onClick={() => moveSectionItem('education', i, 'down')}
                            className="p-1 hover:bg-zinc-100 text-zinc-500"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeSectionItem('education', i)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-zinc-500">学校</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateSectionItem('education', i, 'school', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-zinc-500">学位/专业</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateSectionItem('education', i, 'degree', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-zinc-500">时间范围</label>
                          <input
                            type="text"
                            value={edu.date}
                            onChange={(e) => updateSectionItem('education', i, 'date', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-zinc-500">GPA (可选)</label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => updateSectionItem('education', i, 'gpa', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          case 'skills':
            return (
              <section key="skills" className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
                {header}
                <div className="flex flex-col gap-4">
                  {(data.skills || []).map((skill, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={skill.category}
                          onChange={(e) => updateSectionItem('skills', i, 'category', e.target.value)}
                          className="p-2 border rounded-lg outline-none text-sm font-bold"
                          placeholder="类别 (如: 编程语言)"
                        />
                        <input
                          type="text"
                          value={skill.items}
                          onChange={(e) => updateSectionItem('skills', i, 'items', e.target.value)}
                          className="p-2 border rounded-lg outline-none text-sm col-span-2"
                          placeholder="具体技能 (如: Java, Python, C++)"
                        />
                      </div>
                      <div className="flex flex-col bg-white border rounded-lg shadow-sm overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => moveSectionItem('skills', i, 'up')}
                          className="p-1 hover:bg-zinc-100 text-zinc-500 border-b"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button 
                          onClick={() => moveSectionItem('skills', i, 'down')}
                          className="p-1 hover:bg-zinc-100 text-zinc-500"
                        >
                          <ChevronDown size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeSectionItem('skills', i)}
                        className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            );
          case 'certifications':
            return (
              <section key="certifications" className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
                {header}
                <div className="flex flex-col gap-4">
                  {(data.certifications || []).map((cert, i) => (
                    <div key={i} className="p-4 border rounded-xl bg-zinc-50 relative group">
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeSectionItem('certifications', i)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1 col-span-2">
                          <label className="text-xs font-medium text-zinc-500">证书名称</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateSectionItem('certifications', i, 'name', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-zinc-500">日期</label>
                          <input
                            type="text"
                            value={cert.date}
                            onChange={(e) => updateSectionItem('certifications', i, 'date', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1 col-span-3">
                          <label className="text-xs font-medium text-zinc-500">颁发机构</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateSectionItem('certifications', i, 'issuer', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          case 'languages':
            return (
              <section key="languages" className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
                {header}
                <div className="flex flex-col gap-4">
                  {(data.languages || []).map((lang, i) => (
                    <div key={i} className="flex gap-4 items-center group">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={lang.language}
                          onChange={(e) => updateSectionItem('languages', i, 'language', e.target.value)}
                          className="p-2 border rounded-lg outline-none text-sm font-bold"
                          placeholder="语言 (如: 英语)"
                        />
                        <input
                          type="text"
                          value={lang.proficiency}
                          onChange={(e) => updateSectionItem('languages', i, 'proficiency', e.target.value)}
                          className="p-2 border rounded-lg outline-none text-sm"
                          placeholder="熟练程度 (如: 专业八级)"
                        />
                      </div>
                      <button
                        onClick={() => removeSectionItem('languages', i)}
                        className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            );
          case 'awards':
            return (
              <section key="awards" className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
                {header}
                <div className="flex flex-col gap-4">
                  {(data.awards || []).map((award, i) => (
                    <div key={i} className="p-4 border rounded-xl bg-zinc-50 relative group">
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeSectionItem('awards', i)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1 col-span-2">
                          <label className="text-xs font-medium text-zinc-500">奖项名称</label>
                          <input
                            type="text"
                            value={award.name}
                            onChange={(e) => updateSectionItem('awards', i, 'name', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-zinc-500">日期</label>
                          <input
                            type="text"
                            value={award.date}
                            onChange={(e) => updateSectionItem('awards', i, 'date', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1 col-span-3">
                          <label className="text-xs font-medium text-zinc-500">描述</label>
                          <textarea
                            value={award.description}
                            onChange={(e) => updateSectionItem('awards', i, 'description', e.target.value)}
                            className="p-2 border rounded-lg bg-white outline-none min-h-[60px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          default:
            return null;
        }
      })}

      {/* Add Section Button */}
      {Object.keys(sectionLabels).some(key => !data.sectionOrder?.includes(key)) && (
        <div className="flex flex-col gap-4 p-6 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
          <h4 className="text-sm font-bold text-zinc-500 flex items-center gap-2">
            <Plus size={16} /> 添加模块
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(sectionLabels).map(([key, label]) => {
              if (data.sectionOrder?.includes(key)) return null;
              return (
                <button
                  key={key}
                  onClick={() => addSection(key)}
                  className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
                >
                  + {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
