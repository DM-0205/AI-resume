import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FileUp, 
  Download, 
  Sparkles, 
  Layout, 
  ChevronRight, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2pdf from 'html2pdf.js';
import { ResumeData, TemplateType, INITIAL_RESUME_DATA } from './types';
import { parseResume, optimizeResume } from './services/geminiService';
import { Editor } from './components/Editor';
import { 
  MinimalTemplate, 
  ModernTemplate, 
  ProfessionalTemplate, 
  TwoColumnTemplate, 
  ATSTemplate 
} from './components/Templates';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [originalData, setOriginalData] = useState<ResumeData | null>(null);
  const [template, setTemplate] = useState<TemplateType>('minimal');
  const [isParsing, setIsParsing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.8);
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scale preview to fit
  useEffect(() => {
    const handleResize = () => {
      if (previewRef.current?.parentElement) {
        const parentWidth = previewRef.current.parentElement.clientWidth;
        const scale = (parentWidth - 64) / 794; // 794px is approx 210mm
        setPreviewScale(Math.min(scale, 1));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const parsedData = await parseResume(base64, file.type);
        setResumeData(parsedData);
        setOriginalData(parsedData);
        setIsOptimized(false);
        setIsParsing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert('解析失败，请重试或手动输入。');
      setIsParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  } as any);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const optimized = await optimizeResume(resumeData);
      setResumeData(optimized);
      setIsOptimized(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRevert = () => {
    if (originalData) {
      setResumeData(originalData);
      setIsOptimized(false);
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    
    // Ensure fonts are loaded before capturing
    await document.fonts.ready;

    const element = previewRef.current;
    const opt = {
      margin: 0,
      filename: `${resumeData.personalInfo.fullName || 'resume'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    // Use html2pdf to generate the PDF
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF export error:', error);
      alert('导出 PDF 失败，请重试。');
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case 'minimal': return <MinimalTemplate data={resumeData} />;
      case 'modern': return <ModernTemplate data={resumeData} />;
      case 'professional': return <ProfessionalTemplate data={resumeData} />;
      case 'two-column': return <TwoColumnTemplate data={resumeData} />;
      case 'ats': return <ATSTemplate data={resumeData} />;
      default: return <MinimalTemplate data={resumeData} />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">AI 简历匠</h1>
            <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase mt-1">AI Resume Crafter</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center bg-zinc-100 p-1 rounded-lg gap-1">
            {(['minimal', 'modern', 'professional', 'two-column', 'ats'] as TemplateType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  template === t ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
                )}
              >
                {t === 'minimal' && '简约'}
                {t === 'modern' && '现代'}
                {t === 'professional' && '商务'}
                {t === 'two-column' && '双栏'}
                {t === 'ats' && 'ATS'}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-zinc-200" />

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Download size={18} />
            导出 PDF
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="w-[45%] border-r border-zinc-200 bg-zinc-50/50 overflow-y-auto no-scrollbar p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div 
                {...getRootProps()} 
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group",
                  isDragActive ? "border-indigo-500 bg-indigo-50" : "border-zinc-200 hover:border-indigo-400 hover:bg-white"
                )}
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="text-zinc-400 group-hover:text-indigo-500" />
                </div>
                <h3 className="font-bold text-zinc-700 mb-1">上传已有简历</h3>
                <p className="text-sm text-zinc-400">支持 PDF, Word 或 图片，AI 自动识别内容</p>
                {isParsing && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-indigo-600 font-medium">
                    <Loader2 className="animate-spin" size={18} />
                    AI 正在解析中...
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-zinc-800">简历内容</h2>
                {isOptimized ? (
                  <button 
                    onClick={handleRevert}
                    className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 hover:bg-indigo-200 transition-colors"
                  >
                    <Sparkles size={10} />
                    AI 已优化 (点击还原)
                  </button>
                ) : (
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    原始内容
                  </span>
                )}
              </div>
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="flex items-center gap-2 text-indigo-600 font-medium hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isOptimizing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                AI 一键优化
              </button>
            </div>

            <Editor data={resumeData} onChange={setResumeData} />
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 bg-zinc-200 overflow-hidden flex flex-col">
          {/* Preview Toolbar */}
          <div className="h-12 bg-zinc-300/30 border-b border-zinc-300 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">A4 实时预览</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">缩放比例</span>
                <input 
                  type="range" 
                  min="0.4" 
                  max="1.2" 
                  step="0.05" 
                  value={previewScale} 
                  onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                  className="w-32 accent-indigo-600 h-1 cursor-pointer"
                />
                <span className="text-[10px] font-bold text-zinc-600 w-10 text-right">{Math.round(previewScale * 100)}%</span>
              </div>
              
              <div className="h-4 w-[1px] bg-zinc-300" />
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">同步中</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-12 flex justify-center items-start no-scrollbar" ref={scrollRef}>
            <div 
              style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center' }}
              className="transition-transform duration-200 ease-out"
            >
              <div 
                ref={previewRef}
                className="resume-page"
                id="resume-preview"
              >
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Status */}
      <footer className="h-8 bg-white border-t border-zinc-200 px-6 flex items-center justify-between text-[10px] text-zinc-400 font-medium uppercase tracking-widest shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            系统就绪
          </div>
          <div>当前模板: {template}</div>
        </div>
        <div className="flex items-center gap-4">
          <div>简历完整度: {Math.min(100, (Object.values(resumeData.personalInfo).filter(Boolean).length * 10 + resumeData.workExperience.length * 20))} %</div>
          <div className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            自动保存中
          </div>
        </div>
      </footer>
    </div>
  );
}
