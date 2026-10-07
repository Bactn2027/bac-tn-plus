import React, { useState } from "react";

const branches = [
  { name: "علوم تجريبية", fr: "Sciences expérimentales", icon: "🧬", tone: "green" },
  { name: "رياضيات", fr: "Mathématiques", icon: "📐", tone: "blue" },
  { name: "علوم تقنية", fr: "Sciences techniques", icon: "⚙️", tone: "orange" },
  { name: "إعلامية", fr: "Informatique", icon: "💻", tone: "purple" },
  { name: "اقتصاد وتصرف", fr: "Économie & gestion", icon: "📊", tone: "teal" },
  { name: "آداب", fr: "Lettres", icon: "📚", tone: "rose" }
];

const features = [
  ["🎯", "راجع بذكاء", "دروس مرتبة وتمارين وQCM باش تعرف وين وصلت ووين يلزمك تخدم."],
  ["⚡", "اختبر روحك", "اختبارات قصيرة تساعدك تثبّت معلوماتك وتتعلم من أخطائك."],
  ["📈", "تابع تقدّمك", "شوف تقدّمك، نقاطك وسلسلة المراجعة متاعك في مكان واحد."],
  ["🇹🇳", "مصمّم للتلميذ التونسي", "محتوى وتنظيم موجهين للبكالوريا التونسية وبطريقة سهلة."],
];

function App() {
  const [selected, setSelected] = useState(null);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-inner">
          <button className="brand" onClick={() => scrollTo("home")} aria-label="Bac TN+">
            <span className="brand-mark">+</span>
            <span>
              <b>Bac TN</b><strong>+</strong>
              <small>Prépare. Progresse. Réussis.</small>
            </span>
          </button>

          <nav>
            <button onClick={() => scrollTo("branches")}>الشعب</button>
            <button onClick={() => scrollTo("features")}>المميزات</button>
            <button onClick={() => scrollTo("motivation")}>رسالتنا</button>
          </nav>

          <button className="login-btn" onClick={() => alert("تسجيل الدخول سيكون متاحًا مع نظام الحسابات.")}>
            دخول
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />

          <div className="hero-content">
            <div className="eyebrow"><span>🇹🇳</span> منصتك الجديدة للبكالوريا التونسية</div>
            <h1>حضّر للبكالوريا<br /><span>بثقة، خطوة بخطوة.</span></h1>
            <p className="hero-text">
              دروس، تمارين، QCM واختبارات في مكان واحد.
              <br />
              <b>نظّم وقتك، تابع تقدّمك، وقرّب أكثر لهدفك.</b>
            </p>

            <div className="hero-actions">
              <button className="primary-btn" onClick={() => scrollTo("branches")}>
                ابدأ المراجعة <span>←</span>
              </button>
              <button className="secondary-btn" onClick={() => scrollTo("features")}>
                اكتشف Bac TN+
              </button>
            </div>

            <div className="trust-row">
              <span>✓ مجاني للانطلاق</span>
              <span>✓ سهل الاستعمال</span>
              <span>✓ موجه للبكالوريا التونسية</span>
            </div>
          </div>

          <div className="hero-card">
            <div className="mini-top">
              <span>مراجعتك اليوم</span>
              <span className="online-dot">●</span>
            </div>
            <div className="progress-ring">
              <div>
                <strong>75%</strong>
                <small>تقدّم</small>
              </div>
            </div>
            <div className="mini-stats">
              <div><b>12</b><span>درس</span></div>
              <div><b>48</b><span>تمرين</span></div>
              <div><b>7</b><span>أيام 🔥</span></div>
            </div>
            <div className="next-lesson">
              <span className="lesson-icon">📘</span>
              <div><small>الدرس القادم</small><b>ابدأ من حيث توقفت</b></div>
              <span>←</span>
            </div>
          </div>
        </section>

        <section id="branches" className="section branches-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">اختر طريقك</span>
              <h2>شنية <span>شعبتك؟</span></h2>
            </div>
            <p>اختار شعبتك باش نوجهوك مباشرة للمحتوى المناسب ليك.</p>
          </div>

          <div className="branch-grid">
            {branches.map((branch) => (
              <button
                key={branch.name}
                className={`branch-card ${branch.tone} ${selected === branch.name ? "selected" : ""}`}
                onClick={() => setSelected(branch.name)}
              >
                <span className="branch-icon">{branch.icon}</span>
                <span className="branch-copy">
                  <b>{branch.name}</b>
                  <small>{branch.fr}</small>
                </span>
                <span className="arrow">←</span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="selection-note">
              <span>✨</span>
              اخترت <b>{selected}</b> — الخطوة الجاية: المواد ثم الفصول والدروس.
            </div>
          )}
        </section>

        <section id="features" className="section features-section">
          <div className="section-heading centered">
            <span className="section-kicker">كل شيء في بلاصة وحدة</span>
            <h2>علاش <span>Bac TN+؟</span></h2>
            <p>بسيط في الاستعمال، قوي في المراجعة، ومبني على احتياجات التلميذ.</p>
          </div>

          <div className="feature-grid">
            {features.map(([icon, title, text]) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="motivation" className="motivation">
          <div className="motivation-inner">
            <span className="heart">🤲</span>
            <div>
              <span className="section-kicker">كلمة من Bac TN+</span>
              <h2>ربي ينجّح كل تلميذ ويحققلكم تعبكم ❤️</h2>
              <p>
                الباك موش ساهل، أما خطوة صغيرة كل نهار تعمل فرق كبير.
                <br />
                <b>ما تستسلمش — مستقبلك يستاهل.</b>
              </p>
            </div>
            <button className="primary-btn" onClick={() => scrollTo("branches")}>نبدأ توا ←</button>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <div><b>Bac TN<span>+</span></b><small>منصة تونسية للتحضير للبكالوريا 🇹🇳</small></div>
          <span>© 2026 Bac TN+ — بالتوفيق لكل التلامذة ❤️</span>
        </div>
      </footer>
    </div>
  );
}

export default App;