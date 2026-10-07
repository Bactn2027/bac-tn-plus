import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

const branchVisuals = {
  "sciences-experimentales":["🧬","Sciences expérimentales","green"],
  "mathematiques":["📐","Mathématiques","blue"],
  "sciences-techniques":["⚙️","Sciences techniques","orange"],
  "sciences-informatique":["💻","Sciences de l'informatique","purple"],
  "economie-gestion":["📊","Économie & Gestion","teal"],
  "lettres":["📚","Lettres","rose"],
  "sport":["🏃","Sport","red"]
};

const features = [
 ["🎯","راجع بذكاء","دروس مرتبة وتمارين وQCM باش تعرف وين وصلت ووين يلزمك تخدم."],
 ["⚡","اختبر روحك","اختبارات قصيرة تساعدك تثبّت معلوماتك وتتعلم من أخطائك."],
 ["📈","تابع تقدّمك","شوف تقدّمك، نقاطك وسلسلة المراجعة متاعك في مكان واحد."],
 ["🇹🇳","مصمّم للتلميذ التونسي","محتوى وتنظيم موجهين للبكالوريا التونسية وبطريقة سهلة."]
];

function App() {
 const [branches,setBranches]=useState([]);
 const [subjects,setSubjects]=useState([]);
 const [chapters,setChapters]=useState([]);
 const [lessons,setLessons]=useState([]);
 const [selected,setSelected]=useState(null);
 const [selectedChapter,setSelectedChapter]=useState(null);
 const [selectedLesson,setSelectedLesson]=useState(null);
 const [selectedSubject,setSelectedSubject]=useState(null);
 const [exercises,setExercises]=useState([]);
 const [showExercises,setShowExercises]=useState(false);
 const [openCorrection,setOpenCorrection]=useState(null);
 const [quiz,setQuiz]=useState(null);
 const [quizQuestions,setQuizQuestions]=useState([]);
 const [quizAnswers,setQuizAnswers]=useState({});
 const [quizSubmitted,setQuizSubmitted]=useState(false);
 const [quizScore,setQuizScore]=useState(null);
 const [showQuiz,setShowQuiz]=useState(false);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");

 useEffect(()=>{ loadBranches(); },[]);

 async function loadBranches(){
   setLoading(true); setError("");
   const {data,error}=await supabase.from("branches").select("id,name,slug,description").eq("is_active",true).order("name");
   if(error){setError("ما قدرناش نجيبو الشعب توا. جرّب مرة أخرى.");}
   else setBranches(data||[]);
   setLoading(false);
 }

 async function chooseBranch(branch){
   setSelected(branch); setSubjects([]); setError("");
   const {data,error}=await supabase.from("subjects")
     .select("id,name,slug,is_optional")
     .eq("branch_id",branch.id).eq("is_active",true).order("name");
   if(error){setError("صار مشكل في جلب المواد."); return;}
   setSubjects(data||[]);
 }

 async function chooseSubject(subject){
   setSelectedSubject(subject); setChapters([]); setLessons([]); setSelectedChapter(null); setError("");
   const {data,error}=await supabase.from("chapters")
     .select("id,name,slug,description,position")
     .eq("subject_id",subject.id).eq("is_active",true).order("position");
   if(error){setError("صار مشكل في جلب الفصول."); return;}
   setChapters(data||[]);
 }

 async function chooseChapter(chapter){
   setSelectedChapter(chapter); setLessons([]); setError("");
   const {data,error}=await supabase.from("lessons")
     .select("id,title,slug,short_description,content,position,estimated_minutes,difficulty")
     .eq("chapter_id",chapter.id).eq("is_active",true).order("position");
   if(error){setError("صار مشكل في جلب الدروس."); return;}
   setLessons(data||[]);
 }

 function chooseLesson(lesson){
   setSelectedLesson(lesson);
   setExercises([]);
   setShowExercises(false);
   setOpenCorrection(null);
   setQuiz(null); setQuizQuestions([]); setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(null); setShowQuiz(false);
   setError("");
 }

 async function startExercises(){
   if(!selectedLesson) return;
   setShowExercises(true);
   setExercises([]);
   setOpenCorrection(null);
   setError("");

   const {data,error}=await supabase.from("exercises")
     .select("id,title,statement,correction,explanation,difficulty,position")
     .eq("lesson_id",selectedLesson.id)
     .eq("is_active",true)
     .order("position");

   if(error){setError("صار مشكل في جلب تمارين الدرس."); return;}
   setExercises(data||[]);
 }

 async function startQuiz(){
   if(!selectedLesson) return;
   setShowQuiz(true); setQuiz(null); setQuizQuestions([]); setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(null); setError("");
   const {data:quizData,error:quizError}=await supabase.from("quizzes").select("id,title,description,question_count,time_limit_seconds,difficulty").eq("lesson_id",selectedLesson.id).eq("is_active",true).order("title").limit(1);
   if(quizError){setError("صار مشكل في جلب الـQCM."); return;}
   const currentQuiz=quizData?.[0]; if(!currentQuiz) return; setQuiz(currentQuiz);
   const {data:links,error:linksError}=await supabase.from("quiz_questions").select("question_id,position").eq("quiz_id",currentQuiz.id).order("position");
   if(linksError){setError("صار مشكل في جلب أسئلة الـQCM."); return;}
   const ids=(links||[]).map(x=>x.question_id); if(!ids.length) return;
   const {data:questions,error:questionsError}=await supabase.from("questions").select("id,question_text,explanation,difficulty").in("id",ids);
   if(questionsError){setError("صار مشكل في جلب الأسئلة."); return;}
   const {data:options,error:optionsError}=await supabase.from("question_options").select("id,question_id,option_text,is_correct,position").in("question_id",ids).order("position");
   if(optionsError){setError("صار مشكل في جلب الاختيارات."); return;}
   const qm=Object.fromEntries((questions||[]).map(q=>[q.id,q])); const om={}; (options||[]).forEach(o=>(om[o.question_id]??=[]).push(o));
   setQuizQuestions((links||[]).map(l=>({...qm[l.question_id],position:l.position,options:om[l.question_id]||[]})).filter(q=>q.id));
 }

 function chooseQuizAnswer(questionId,optionId){ if(!quizSubmitted) setQuizAnswers(prev=>({...prev,[questionId]:optionId})); }
 function submitQuiz(){ const score=quizQuestions.reduce((n,q)=>n+(q.options.some(o=>o.id===quizAnswers[q.id]&&o.is_correct)?1:0),0); setQuizScore(score); setQuizSubmitted(true); }

 const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

 return <div className="app">
  <header className="navbar"><div className="nav-inner">
   <button className="brand" onClick={()=>scrollTo("home")}><span className="brand-mark">+</span><span><b>Bac TN</b><strong>+</strong><small>Prépare. Progresse. Réussis.</small></span></button>
   <nav><button onClick={()=>scrollTo("branches")}>الشعب</button><button onClick={()=>scrollTo("features")}>المميزات</button><button onClick={()=>scrollTo("motivation")}>رسالتنا</button></nav>
   <button className="login-btn" onClick={()=>alert("تسجيل الدخول باش نضيفوه في المرحلة الجاية.")}>دخول</button>
  </div></header>

  <main>
   <section id="home" className="hero">
    <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
    <div className="hero-content">
     <div className="eyebrow"><span>🇹🇳</span> منصتك الجديدة للبكالوريا التونسية</div>
     <h1>حضّر للبكالوريا<br/><span>بثقة، خطوة بخطوة.</span></h1>
     <p className="hero-text">دروس، تمارين، QCM واختبارات في مكان واحد.<br/><b>نظّم وقتك، تابع تقدّمك، وقرّب أكثر لهدفك.</b></p>
     <div className="hero-actions"><button className="primary-btn" onClick={()=>scrollTo("branches")}>ابدأ المراجعة <span>←</span></button><button className="secondary-btn" onClick={()=>scrollTo("features")}>اكتشف Bac TN+</button></div>
     <div className="trust-row"><span>✓ مجاني للانطلاق</span><span>✓ سهل الاستعمال</span><span>✓ محتوى منظم</span></div>
    </div>
    <div className="hero-card"><div className="mini-top"><span>منصتك اليوم</span><span className="online-dot">●</span></div><div className="progress-ring"><div><strong>7</strong><small>شعب</small></div></div><div className="mini-stats"><div><b>56</b><span>مادة</span></div><div><b>138</b><span>فصل</span></div><div><b>426</b><span>درس</span></div></div><div className="next-lesson"><span className="lesson-icon">📘</span><div><small>الخطوة الأولى</small><b>اختار شعبتك وابدأ</b></div><span>←</span></div></div>
   </section>

   <section id="branches" className="section branches-section">
    <div className="section-heading"><div><span className="section-kicker">اختر طريقك</span><h2>شنية <span>شعبتك؟</span></h2></div><p>اختار شعبتك باش نوجهوك مباشرة للمواد الموجودة في Bac TN+.</p></div>
    {loading ? <div className="loading-box">نحضّرلك الشعب... ⏳</div> :
    <div className="branch-grid">{branches.map(b=>{const v=branchVisuals[b.slug]||["📘",b.name,"green"];return <button key={b.id} className={`branch-card ${v[2]} ${selected?.id===b.id?"selected":""}`} onClick={()=>chooseBranch(b)}><span className="branch-icon">{v[0]}</span><span className="branch-copy"><b>{b.name}</b><small>{v[1]}</small></span><span className="arrow">←</span></button>})}</div>}
    {error && <div className="error-note">⚠️ {error}</div>}
    {selected && !error && <div className="subjects-panel"><div className="subjects-head"><div><span className="section-kicker">مواد الشعبة</span><h3>{selected.name}</h3></div><span>{subjects.length} مادة</span></div><div className="subject-grid">{subjects.map(s=><button key={s.id} className={`subject-card ${selectedSubject?.id===s.id?"selected":""}`} onClick={()=>chooseSubject(s)}><span>📚</span><div><b>{s.name}</b>{s.is_optional&&<small>اختيارية</small>}</div><i>←</i></button>)}</div>
    {selectedSubject && !error && <div className="chapters-panel"><div className="subjects-head"><div><span className="section-kicker">فصول المادة</span><h3>{selectedSubject.name}</h3></div><span>{chapters.length} فصل</span></div>{chapters.length ? <div className="chapter-list">{chapters.map((c,index)=><button key={c.id} className={`chapter-card ${selectedChapter?.id===c.id?"selected":""}`} onClick={()=>chooseChapter(c)}><span className="chapter-number">{String(c.position ?? index+1).padStart(2,"0")}</span><div><b>{c.name}</b>{c.description&&<small>{c.description}</small>}</div><i>←</i></button>)}</div> : <div className="empty-box">ما فماش فصول متاحة للمادة هاذي توا.</div>}{selectedChapter && !error && <div className="lessons-panel"><div className="subjects-head"><div><span className="section-kicker">دروس الفصل</span><h3>{selectedChapter.name}</h3></div><span>{lessons.length} درس</span></div>{lessons.length ? <div className="lesson-list">{lessons.map((l,index)=><button key={l.id} className={`lesson-card ${selectedLesson?.id===l.id?"selected":""}`} onClick={()=>chooseLesson(l)}><span className="lesson-number">{String(l.position ?? index+1).padStart(2,"0")}</span><div className="lesson-copy"><b>{l.title}</b>{l.short_description&&<small>{l.short_description}</small>}<span className="lesson-meta">{l.estimated_minutes ? `⏱ ${l.estimated_minutes} دق` : ""}{l.difficulty ? ` • ${l.difficulty}` : ""}</span></div><i>←</i></button>)}</div> : <div className="empty-box">ما فماش دروس متاحة للفصل هذا توا.</div>}
{selectedLesson && <article className="lesson-reader">
  <div className="lesson-reader-head">
    <div>
      <span className="section-kicker">الدرس {String(selectedLesson.position ?? "").padStart(2,"0")}</span>
      <h3>{selectedLesson.title}</h3>
      {selectedLesson.short_description && <p>{selectedLesson.short_description}</p>}
    </div>
    <div className="lesson-reader-meta">
      {selectedLesson.estimated_minutes ? <span>⏱ {selectedLesson.estimated_minutes} دقيقة</span> : null}
      {selectedLesson.difficulty ? <span>• {selectedLesson.difficulty}</span> : null}
    </div>
  </div>
  <div className="lesson-content">
    {selectedLesson.content ? selectedLesson.content.split(/\n+/).map((paragraph,index)=>
      paragraph.trim() ? <p key={index}>{paragraph}</p> : null
    ) : <div className="empty-box">محتوى الدرس موش متوفر توا.</div>}
  </div>
  <button className="primary-btn lesson-exercises-btn" onClick={startExercises}>
    ابدأ التمارين ←
  </button>
  {showExercises && <section className="exercises-panel">
    <div className="subjects-head">
      <div>
        <span className="section-kicker">تطبيق ومراجعة</span>
        <h3>تمارين الدرس</h3>
      </div>
      <span>{exercises.length} تمرين</span>
    </div>

    {exercises.length ? <div className="exercise-list">
      {exercises.map((e,index)=><article className="exercise-card" key={e.id}>
        <div className="exercise-top">
          <span className="exercise-number">{String(e.position ?? index+1).padStart(2,"0")}</span>
          <div>
            <h4>{e.title || `تمرين ${index+1}`}</h4>
            {e.difficulty && <span className="exercise-difficulty">{e.difficulty}</span>}
          </div>
        </div>
        <div className="exercise-statement">{e.statement}</div>
        <button className="secondary-btn correction-btn" onClick={()=>setOpenCorrection(openCorrection===e.id?null:e.id)}>
          {openCorrection===e.id ? "إخفاء التصحيح ↑" : "إظهار التصحيح ↓"}
        </button>
        {openCorrection===e.id && <div className="exercise-correction">
          <div><b>التصحيح</b><p>{e.correction}</p></div>
          {e.explanation && <div><b>الشرح</b><p>{e.explanation}</p></div>}
        </div>}
      </article>)}
    </div> : <div className="empty-box">ما فماش تمارين متاحة للدرس هذا توا.</div>}
    <div className="quiz-cta"><div><span className="section-kicker">المرحلة الموالية</span><h4>اختبر روحك بالـQCM</h4><p>جاوب على أسئلة الدرس وشوف نتيجتك والتصحيح.</p></div><button className="primary-btn" onClick={startQuiz}>ابدأ الـQCM ←</button></div>
  </section>}
  {showQuiz && <section className="quiz-panel">
    <div className="subjects-head"><div><span className="section-kicker">اختبار الدرس</span><h3>{quiz?.title || "QCM الدرس"}</h3>{quiz?.description&&<p className="quiz-description">{quiz.description}</p>}</div><span>{quizQuestions.length} سؤال</span></div>
    {quizQuestions.length ? <div className="quiz-list">{quizQuestions.map((q,index)=><article className="quiz-question" key={q.id}>
      <div className="quiz-question-head"><span className="exercise-number">{String(q.position ?? index+1).padStart(2,"0")}</span><div><h4>{q.question_text}</h4>{q.difficulty&&<span className="exercise-difficulty">{q.difficulty}</span>}</div></div>
      <div className="quiz-options">{q.options.map((o,oi)=><button key={o.id} className={`quiz-option ${quizAnswers[q.id]===o.id?"selected":""} ${quizSubmitted&&o.is_correct?"correct":""} ${quizSubmitted&&quizAnswers[q.id]===o.id&&!o.is_correct?"wrong":""}`} onClick={()=>chooseQuizAnswer(q.id,o.id)} disabled={quizSubmitted}><span>{String.fromCharCode(65+oi)}</span>{o.option_text}</button>)}</div>
      {quizSubmitted&&<div className="quiz-feedback">{q.options.some(o=>o.id===quizAnswers[q.id]&&o.is_correct)?"✅ إجابة صحيحة":"❌ إجابة غالطة"}{q.explanation&&<p>{q.explanation}</p>}</div>}
    </article>)}
    {!quizSubmitted?<button className="primary-btn quiz-submit" onClick={submitQuiz}>صحّح الـQCM ✓</button>:<div className="quiz-result"><strong>{quizScore} / {quizQuestions.length}</strong><span>{quizScore===quizQuestions.length?"ممتاز! 🔥":quizScore>=quizQuestions.length/2?"باهي، واصل المراجعة 💪":"راجع الدرس وحاول مرة أخرى 📚"}</span><button className="secondary-btn" onClick={()=>{setQuizSubmitted(false);setQuizAnswers({});setQuizScore(null);}}>عاود الـQCM</button></div>}
    </div> : <div className="empty-box">ما فماش QCM مربوط بالدرس هذا توا.</div>}
  </section>}
</article>}
</div>}</div>}
   </div>}
   </section>

   <section id="features" className="section features-section"><div className="section-heading centered"><span className="section-kicker">كل شيء في بلاصة وحدة</span><h2>علاش <span>Bac TN+؟</span></h2><p>بسيط في الاستعمال، قوي في المراجعة، ومبني على احتياجات التلميذ.</p></div><div className="feature-grid">{features.map(([icon,title,text])=><article className="feature-card" key={title}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

   <section id="motivation" className="motivation"><div className="motivation-inner"><span className="heart">🤲</span><div><span className="section-kicker">كلمة من Bac TN+</span><h2>ربي ينجّح كل تلميذ ويحققلكم تعبكم ❤️</h2><p>الباك موش ساهل، أما خطوة صغيرة كل نهار تعمل فرق كبير.<br/><b>ما تستسلمش — مستقبلك يستاهل.</b></p></div><button className="primary-btn" onClick={()=>scrollTo("branches")}>نبدأ توا ←</button></div></section>
  </main>
  <footer><div className="footer-inner"><div><b>Bac TN<span>+</span></b><small>منصة تونسية للتحضير للبكالوريا 🇹🇳</small></div><span>© 2026 Bac TN+ — بالتوفيق لكل التلامذة ❤️</span></div></footer>
 </div>
}
export default App;
