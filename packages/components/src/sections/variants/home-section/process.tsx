import { Card } from "@shared/ui/card";

export function HomeProcessSection() {
  return (
    <section
      aria-labelledby="process-title"
      className="home-container home-process"
      id="how-it-works"
    >
      <div className="home-section-intro">
        <p className="home-eyebrow">START WITH WHAT YOU HAVE</p>
        <h2 id="process-title">
          From a blank page
          <br />
          to <span>your own place.</span>
        </h2>
      </div>
      <ol className="home-steps">
        <Card asChild layout="plain" surface="portfolio">
          <li>
            <span>01</span>
            <h3>Open your studio</h3>
            <p>Sign in with Google and start with your own private space.</p>
          </li>
        </Card>
        <Card asChild layout="plain" surface="portfolio">
          <li>
            <span>02</span>
            <h3>Put your story together</h3>
            <p>
              Import and review your CV or add details yourself. Choose sections, a layout, theme
              and languages for a look that feels right.
            </p>
          </li>
        </Card>
        <Card asChild layout="plain" surface="portfolio">
          <li>
            <span>03</span>
            <h3>Share it when you’re ready</h3>
            <p>Choose your username, publish your portfolio and take your CV with you.</p>
          </li>
        </Card>
      </ol>
    </section>
  );
}
