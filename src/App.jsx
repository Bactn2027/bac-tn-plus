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
 const [selectedSubject,setSelectedSubject]=useState(null);
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
     .select("id,title,slug,short_description,position,estimated_minutes,difficulty")
     .eq("chapter_id",chapter.id).eq("is_active",true).order("position");
   if(error){setError("صار مشكل في جلب الدروس."); return;}
   setLessons(data||[]);
 }

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
    {selectedSubject && !error && <div className="chapters-panel"><div className="subjects-head"><div><span className="section-kicker">فصول المادة</span><h3>{selectedSubject.name}</h3></div><span>{chapters.length} فصل</span></div>{chapters.length ? <div className="chapter-list">{chapters.map((c,index)=><button key={c.id} className={`chapter-card ${selectedChapter?.id===c.id?"selected":""}`} onClick={()=>chooseChapter(c)}><span className="chapter-number">{String(c.position ?? index+1).padStart(2,"0")}</span><div><b>{c.name}</b>{c.description&&<small>{c.description}</small>}</div><i>←</i></button>)}</div> : <div className="empty-box">ما فماش فصول متاحة للمادة هاذي توا.</div>}{selectedChapter && !error && <div className="lessons-panel"><div className="subjects-head"><div><span className="section-kicker">دروس الفصل</span><h3>{selectedChapter.name}</h3></div><span>{lessons.length} درس</span></div>{lessons.length ? <div className="lesson-list">{lessons.map((l,index)=><button key={l.id} className="lesson-card"><span className="lesson-number">{String(l.position ?? index+1).padStart(2,"0")}</span><div className="lesson-copy"><b>{l.title}</b>{l.short_description&&<small>{l.short_description}</small>}<span className="lesson-meta">{l.estimated_minutes ? `⏱ ${l.estimated_minutes} دق` : ""}{l.difficulty ? ` • ${l.difficulty}` : ""}</span></div><i>←</i></button>)}</div> : <div className="empty-box">ما فماش دروس متاحة للفصل هذا توا.</div>}</div>}</div>}
   </div>}
   </section>

   <section id="features" className="section features-section"><div className="section-heading centered"><span className="section-kicker">كل شيء في بلاصة وحدة</span><h2>علاش <span>Bac TN+؟</span></h2><p>بسيط في الاستعمال، قوي في المراجعة، ومبني على احتياجات التلميذ.</p></div><div className="feature-grid">{features.map(([icon,title,text])=><article className="feature-card" key={title}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

   <section id="motivation" className="motivation"><div className="motivation-inner"><span className="heart">🤲</span><div><span className="section-kicker">كلمة من Bac TN+</span><h2>ربي ينجّح كل تلميذ ويحققلكم تعبكم ❤️</h2><p>الباك موش ساهل، أما خطوة صغيرة كل نهار تعمل فرق كبير.<br/><b>ما تستسلمش — مستقبلك يستاهل.</b></p></div><button className="primary-btn" onClick={()=>scrollTo("branches")}>نبدأ توا ←</button></div></section>
  </main>
  <footer><div className="footer-inner"><div><b>Bac TN<span>+</span></b><small>منصة تونسية للتحضير للبكالوريا 🇹🇳</small></div><span>© 2026 Bac TN+ — بالتوفيق لكل التلامذة ❤️</span></div></footer>
 </div>
}
export default App;
