import { homeFaq } from "@shared/content";

export function Faq() {
  return (
    <section aria-labelledby="questions-title" className="home-container home-faq" id="questions">
      <div className="home-section-intro">
        <p className="home-eyebrow">A FEW THINGS TO KNOW</p>
        <h2 id="questions-title">
          Make yourself
          <br />
          <span>at home.</span>
        </h2>
      </div>
      <div className="home-faq-list">
        {homeFaq.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
