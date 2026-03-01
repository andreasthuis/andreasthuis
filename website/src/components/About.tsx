import "./About.css";

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <h2>More about me!</h2>

        <h3>Who I Am</h3>
        <p>
          Hi, I'm <strong>Andreas</strong>. I've always been curious about how
          things work, which naturally led me to programming and technology. I
          enjoy <strong>building things</strong>, solving problems, and learning
          something new along the way.
        </p>

        <h3>About AI</h3>
        <p>
          Technology <strong>fascinates</strong> me, but I also believe it comes
          with responsibility. I think tools like <strong>generative AI</strong>{" "}
          should help people create and grow, not replace them or contribute to
          low-quality, mass-produced content. For me, tech should
          <strong> empower humans</strong>, not sideline them.
        </p>

        <h3>My Interests</h3>
        <ul>
          <li>
            I enjoy watching <strong>Ninjago</strong> as it's a part of my
            childhood.
          </li>
          <li>I like to try new ideas and learn new things.</li>
          <li>
            I enjoy <strong>parkour games</strong> that focus on exploration,
            not just speed.
          </li>
          <li>
            I'm interested in science, especially physics, biology, and
            chemistry.
          </li>
        </ul>

        <h3>My Goals</h3>
        <p>
          I want to build <strong>things that actually matter to people</strong>
          . Whether it's a <strong>small tool that makes someone's day easier</strong> or a{" "}
          <strong>bigger project that solves a real problem</strong>, I like the
          idea of <strong>creating something useful</strong>. For me,{" "}
          <strong>programming isn't just about writing code</strong>, it's about <strong>
            building things that people can genuinely benefit from</strong>.
        </p>

        <a href="/">Return to the main page</a>
      </div>
    </section>
  );
}
