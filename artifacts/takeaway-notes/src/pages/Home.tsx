const IMG = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

const IllustrationBox = ({ src, alt, height = 180 }: { src: string; alt: string; height?: number }) => (
  <div style={{
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "12px 0",
    padding: 0,
  }}>
    <img
      src={src}
      alt={alt}
      style={{
        maxHeight: height,
        maxWidth: "100%",
        objectFit: "contain",
        display: "block",
      }}
    />
  </div>
);

const SectionBand = ({ title }: { title: string }) => (
  <div className="section-band">
    <div className="section-band-title" style={{ fontSize: 17 }}>{title}</div>
  </div>
);

const SubHead = ({ title }: { title: string }) => (
  <div style={{ margin: "6px 0 4px 0" }}>
    <div className="subsection-title">{title}</div>
  </div>
);

export default function Home() {
  return (
    <div className="document-bg">

      {/* ─── PAGE 1: TITLE ONLY ─── */}
      <div className="a4-page" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: 1123, textAlign: "center" }}>
        {/* Decorative corner accents */}
        <div style={{ position: "absolute", top: 28, left: 40, width: 56, height: 56, borderTop: "3px solid #C89B3C", borderLeft: "3px solid #C89B3C", borderRadius: "2px 0 0 0" }} />
        <div style={{ position: "absolute", top: 28, right: 40, width: 56, height: 56, borderTop: "3px solid #C89B3C", borderRight: "3px solid #C89B3C", borderRadius: "0 2px 0 0" }} />
        <div style={{ position: "absolute", bottom: 40, left: 40, width: 56, height: 56, borderBottom: "3px solid #C89B3C", borderLeft: "3px solid #C89B3C", borderRadius: "0 0 0 2px" }} />
        <div style={{ position: "absolute", bottom: 40, right: 40, width: 56, height: 56, borderBottom: "3px solid #C89B3C", borderRight: "3px solid #C89B3C", borderRadius: "0 0 2px 0" }} />

        {/* Hero illustration */}
        <div style={{ width: "80%", marginBottom: 36 }}>
          <img
            src={IMG("image35.png")}
            alt="Should I bring up Jesus — awkward group scene"
            style={{ width: "100%", objectFit: "contain", display: "block" }}
          />
        </div>

        {/* Title */}
        <div style={{ marginBottom: 10 }}>
          <div className="display-title" style={{ fontSize: 52, textAlign: "center" }}>Good News,</div>
          <div className="display-title" style={{ fontSize: 52, color: "#D4622A", textAlign: "center" }}>Bad Approach.</div>
        </div>

        {/* Subtitle */}
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontStyle: "italic", color: "#5C3A1E", lineHeight: 1.5, marginBottom: 36 }}>
          The Do's, Don'ts, and Awkward Moments
        </div>

        {/* Decorative rule */}
        <div style={{ width: 120, height: 1, background: "linear-gradient(90deg, transparent, #C89B3C, transparent)", marginBottom: 24 }} />

        {/* Org + date */}
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#8B6340", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
          Freedom Yuva
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8B6340", letterSpacing: "0.06em" }}>
          14 June 2026
        </div>

        <div className="page-footer-rule" />
      </div>

      {/* ─── PAGE 1: DISCUSSION + GREAT COMMISSION ─── */}
      <div className="a4-page">
        <div style={{ marginBottom: 20 }}>
          <div className="section-num" style={{ marginBottom: 6 }}>Before We Begin</div>
          <div className="section-title" style={{ fontSize: 24 }}>Discussion &amp; Reflection</div>
          <div style={{ width: 48, height: 2, backgroundColor: "#D4622A", marginTop: 8 }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 700, color: "#D4622A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Q1 — Have you ever actually tried sharing the Gospel with someone? How did you go about it?
          </div>
          <div className="reflection-line" />
          <div className="reflection-line" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 700, color: "#D4622A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Q2 — If you're hesitant, what's stopping you? If you have, what challenges did you push through?
          </div>
          <div className="reflection-line" />
          <div className="reflection-line" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 700, color: "#D4622A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Q3 — If someone has ever tried sharing the Gospel with you, what did you like about it, and what totally annoyed or frustrated you?
          </div>
          <div className="reflection-line" />
          <div className="reflection-line" />
        </div>

        <div className="ornament">— ✦ —</div>

        <SectionBand title="The Great Commission: Why We Need to Share the Gospel" />

        <div className="verse-box" style={{ marginBottom: 10 }}>
          <div className="verse-ref">Mark 16:15</div>
          <div className="verse-text">"And then he told them, "Go into all the world and preach the Good News to everyone.""</div>
        </div>

        {/* Crossroads — half-page image, no background */}
        <IllustrationBox src={IMG("image55.png")} alt="The crossroads: Stay Silent or Step Forward" height={210} />

        <div style={{ marginTop: 10 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, color: "#5C3A1E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Common Challenges &amp; Fears</div>
          <div className="fear-chip">
            <div className="fear-chip-title">Fear of Being "That Guy"</div>
            <div className="fear-chip-text">The gut-level fear of being the person who kills the vibe — looking like you're trying too hard or don't know how to act in a normal social setting.</div>
          </div>
          <div className="fear-chip">
            <div className="fear-chip-title">Fear of Being Labeled a Preacher or Priest</div>
            <div className="fear-chip-text">The cringe factor of being put in a box — you share something spiritual and people instantly categorize you, creating distance and turning friendship into something heavy and awkward.</div>
          </div>
          <div className="fear-chip">
            <div className="fear-chip-title">Fear of the Unknown / Unanswerable</div>
            <div className="fear-chip-text">The "what if they ask me something I can't answer?" panic — being stumped by a tough question makes you feel foolish and harms the credibility of your message.</div>
          </div>
          <div className="fear-chip">
            <div className="fear-chip-title">The "Cancel Culture" Fear</div>
            <div className="fear-chip-text">Standing up for your convictions might get you "cancelled." You're afraid holding a firm belief will make you a target, so you stay silent to keep the peace.</div>
          </div>
          <div className="fear-chip">
            <div className="fear-chip-title">The "Hidden Agenda" Worry</div>
            <div className="fear-chip-text">Your friends might think you're only hanging out to "convert" them — that your motives will be questioned and they'll feel like a project rather than a friend.</div>
          </div>
        </div>

        <div className="page-footer-rule" />
        <div className="page-badge">Page 1</div>
      </div>

      {/* ─── PAGE 2: SECTION 2.1 ─── */}
      <div className="a4-page">
        <SectionBand title="Win the Friend, Not the Argument" />
        <SubHead title="Don't Fight the Dark, Just Bring the Light" />

        <div className="verse-box" style={{ marginBottom: 10 }}>
          <div className="verse-ref">Acts 17:22-23</div>
          <div className="verse-text">"So Paul, standing before the council, addressed them as follows: "Men of Athens, I notice that you are very religious in every way, for as I was walking along I saw your many shrines. And one of your altars had this inscription on it: 'To an Unknown God.' This God, whom you worship without knowing, is the one I'm telling you about.""</div>
        </div>

        <div className="dos-donts-grid">
          <div className="donts-box">
            <div className="box-header donts-header"><span>✗</span> Don'ts</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label donts-item-label">The "Wrong vs. Right" Power Play</div>
              <div className="item-note">Avoid leading with how they are wrong and you are right. This shifts the focus to winning an argument rather than sharing a message.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8, marginBottom: 8 }}>
              <div className="item-label donts-item-label">The "Offensive Approach"</div>
              <div className="item-note">Do not be offensive. When you attack someone's current perspective, you build a wall instead of a bridge, causing them to shut down immediately.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8 }}>
              <div className="item-label donts-item-label">The "Superiority Complex"</div>
              <div className="item-note">Your job is not to prove they are bad or inferior. Acting morally superior alienates the very person you are trying to reach.</div>
            </div>
          </div>
          <div className="dos-box">
            <div className="box-header dos-header"><span>✓</span> Do's</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label dos-item-label">Share Your Truth, Don't Defeat Theirs</div>
              <div className="item-note">Your mission is simply to share your truth. Release the need to prove them wrong; focus on what you believe to be true.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8, marginBottom: 8 }}>
              <div className="item-label dos-item-label">Anchor in Common Ground</div>
              <div className="item-note">Find the common ground between your perspectives. Starting from a place where they can relate helps build rapport rather than conflict.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8 }}>
              <div className="item-label dos-item-label">Build Bridges from Known Truths</div>
              <div className="item-note">Identify the truths they already know and accept, then gently use those as stepping stones to lead them toward the whole truth.</div>
            </div>
          </div>
        </div>

        {/* Bad Approach vs Better Approach — transparent background */}
        <IllustrationBox src={IMG("image22.png")} alt="Bad Approach vs Better Approach" height={340} />

        <div className="page-footer-rule" />
        <div className="page-badge">Page 2</div>
      </div>

      {/* ─── PAGE 3: SECTION 2.2 ─── */}
      <div className="a4-page">
        <SubHead title="Listen to Understand, Not to Reply" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">2 Timothy 2:23-24</div>
            <div className="verse-text">"Again I say, don't get involved in foolish, ignorant arguments that only start fights. A servant of the Lord must not quarrel but must be kind to everyone, be able to teach, and be patient with difficult people."</div>
          </div>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">James 1:19</div>
            <div className="verse-text">"Understand this, my dear brothers and sisters: You must all be quick to listen, slow to speak, and slow to get angry."</div>
          </div>
        </div>

        <div className="dos-donts-grid">
          <div className="donts-box">
            <div className="box-header donts-header"><span>✗</span> Don'ts</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label donts-item-label">Listening to Find Holes or Mistakes</div>
              <div className="item-note">Treating their words as ammunition rather than as part of a conversation.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8, marginBottom: 8 }}>
              <div className="item-label donts-item-label">Making Them Feel Inferior</div>
              <div className="item-note">Using what someone shares to highlight their mistakes makes them regret opening up.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8 }}>
              <div className="item-label donts-item-label">Listening to Win an Argument</div>
              <div className="item-note">Listening only to structure a rebuttal ignores the person's humanity entirely.</div>
            </div>
          </div>
          <div className="dos-box">
            <div className="box-header dos-header"><span>✓</span> Do's</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label dos-item-label">Seek to Understand Their Perspective</div>
              <div className="item-note">Listen with the goal of discovering why they believe what they believe.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8, marginBottom: 8 }}>
              <div className="item-label dos-item-label">Focus on the Heart and Situation</div>
              <div className="item-note">Look beyond the surface to understand what they are going through in their current reality.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8 }}>
              <div className="item-label dos-item-label">Prioritize Empathy over Debate</div>
              <div className="item-note">True listening is about building understanding and rapport, not correcting or fighting back.</div>
            </div>
          </div>
        </div>

        {/* Brain vs Heart */}
        <IllustrationBox src={IMG("image72.png")} alt="Brain trying to dismantle vs Heart trying to understand" height={210} />

        <hr className="sub-divider" />
        <SubHead title="Love Your Friends, Lose the Lecture" />

        <div className="verse-box" style={{ marginBottom: 10 }}>
          <div className="verse-ref">1 John 3:16-18</div>
          <div className="verse-text">"...If someone has enough money to live well and sees a brother or sister in need but shows no compassion — how can God's love be in that person? Dear children, let's not merely say that we love each other; let us show the truth by our actions."</div>
        </div>

        <div className="dos-donts-grid">
          <div className="donts-box">
            <div className="box-header donts-header"><span>✗</span> Don'ts</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label donts-item-label">Prioritizing Lectures over Genuine Support</div>
              <div className="item-note">When a friend is in need, immediately lecturing them about faith ignores their reality and creates a barrier.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8, marginBottom: 8 }}>
              <div className="item-label donts-item-label">Words as a Substitute for Action</div>
              <div className="item-note">Filling a need with spiritual talk instead of practical help feels dismissive and insincere.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8 }}>
              <div className="item-label donts-item-label">Missing the Chance to Truly Connect</div>
              <div className="item-note">Lecturing instead of offering a helping hand prevents you from reflecting the love you're trying to share.</div>
            </div>
          </div>
          <div className="dos-box">
            <div className="box-header dos-header"><span>✓</span> Do's</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label dos-item-label">Demonstrate Love Through Action First</div>
              <div className="item-note">Before speaking about God's love, demonstrate it by meeting physical, emotional, or financial needs.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8, marginBottom: 8 }}>
              <div className="item-label dos-item-label">Provide the Support They Actually Need</div>
              <div className="item-note">Be the person who offers a helping hand, a listening ear, or a supportive presence in their specific situation.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8 }}>
              <div className="item-label dos-item-label">Let Your Actions Speak Louder Than Words</div>
              <div className="item-note">Words alone rarely help in crisis. Serving your friend first creates the bridge of trust necessary for your message to be heard.</div>
            </div>
          </div>
        </div>

        {/* Correct words wrong moment vs Love first truth later */}
        <IllustrationBox src={IMG("image67.png")} alt="Correct words, wrong moment vs Love first, truth later" height={190} />

        <div className="page-footer-rule" />
        <div className="page-badge">Page 3</div>
      </div>

      {/* ─── PAGE 4: SECTION 3.1 ─── */}
      <div className="a4-page">
        <SectionBand title="Less Judgment, More Approachability" />
        <SubHead title="Battling Spiritual Pride, Showing Empathy" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">Luke 18:10-14</div>
            <div className="verse-text">"...The Pharisee stood by himself and prayed: 'I thank you, God, that I am not like other people...' But the tax collector stood at a distance... saying, 'O God, be merciful to me, for I am a sinner.' I tell you, this sinner, not the Pharisee, returned home justified before God."</div>
          </div>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">Ephesians 4:2</div>
            <div className="verse-text">"Always be humble and gentle. Be patient with each other, making allowance for each other's faults because of your love."</div>
          </div>
        </div>

        <div className="dos-donts-grid">
          <div className="donts-box">
            <div className="box-header donts-header"><span>✗</span> Don'ts</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label donts-item-label">Thinking You Are Better Than Others</div>
              <div className="item-note">Acting like a modern-day Pharisee creates an immediate barrier that makes you completely unapproachable.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8, marginBottom: 8 }}>
              <div className="item-label donts-item-label">Forgetting That You Are Also a Sinner</div>
              <div className="item-note">When you lose sight of the fact that you're saved by grace, not your own achievement, you become judgmental.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8 }}>
              <div className="item-label donts-item-label">Ignoring Their Circumstances</div>
              <div className="item-note">Failing to acknowledge that without God's protection, you could have easily ended up in a worse situation.</div>
            </div>
          </div>
          <div className="dos-box">
            <div className="box-header dos-header"><span>✓</span> Do's</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label dos-item-label">Cultivate a Humble Heart Condition</div>
              <div className="item-note">Always maintain the awareness that you are no better than anyone else — your standing is a gift, not an achievement.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8, marginBottom: 8 }}>
              <div className="item-label dos-item-label">Practice Empathy by Imagining Yourself in Their Place</div>
              <div className="item-note">Consider how you might have acted if you were in their specific situation — this moves you from judgment to empathy.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8 }}>
              <div className="item-label dos-item-label">Treat Others with the Grace You'd Want</div>
              <div className="item-note">Offer the same patience, kindness, and grace you would hope to receive if you were the one who had made a mistake.</div>
            </div>
          </div>
        </div>

        {/* Pride distances vs Humility brings closer */}
        <IllustrationBox src={IMG("image85.png")} alt="Pride distances us from others vs Humility brings us closer" height={360} />

        <div className="page-footer-rule" />
        <div className="page-badge">Page 4</div>
      </div>

      {/* ─── PAGE 5: SECTIONS 3.2 + 3.3 ─── */}
      <div className="a4-page">
        <SubHead title="High Standards, Low Bridges" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">Jude 1:22-23</div>
            <div className="verse-text">"And you must show mercy to those whose faith is wavering. Rescue others by snatching them from the flames of judgment. Show mercy to still others, but do so with great caution, hating the sins that contaminate their lives."</div>
          </div>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">Galatians 6:1</div>
            <div className="verse-text">"Dear brothers and sisters, if another believer is overcome by some sin, you who are godly should gently and humbly help that person back onto the right path. And be careful not to fall into the same temptation yourself."</div>
          </div>
        </div>

        <div className="dos-donts-grid">
          <div className="donts-box">
            <div className="box-header donts-header"><span>✗</span> Don'ts</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label donts-item-label">Gatekeeping with High Standards</div>
              <div className="item-note">Forcing your personal, high standards onto outsiders or new believers builds an inaccessible wall.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8 }}>
              <div className="item-label donts-item-label">Conditional Mingling</div>
              <div className="item-note">Only hanging out with, helping, or welcoming people if they already measure up to a certain spiritual or moral level.</div>
            </div>
          </div>
          <div className="dos-box">
            <div className="box-header dos-header"><span>✓</span> Do's</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label dos-item-label">Keep Your Standards High, but the Bridge Low</div>
              <div className="item-note">Hold yourself to the highest personal standards of faith and integrity, but make sure the bridge you build outward is flat, wide, and easy for anyone to walk across.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8 }}>
              <div className="item-label dos-item-label">Create a Safe Space for the Vulnerable</div>
              <div className="item-note">Intentionally allow the weak, wavering, and vulnerable to approach you exactly as they are — no pressure to "fake it" or live up to a standard they aren't ready for.</div>
            </div>
          </div>
        </div>

        {/* High Standards High Barriers vs Low Bridges */}
        <IllustrationBox src={IMG("image83.png")} alt="High Standards High Barriers vs High Standards Low Bridges" height={200} />

        <hr className="sub-divider" />
        <SubHead title="Set Apart, Not Pulled Apart" />

        <div className="verse-box" style={{ marginBottom: 10 }}>
          <div className="verse-ref">1 Corinthians 9:20-23</div>
          <div className="verse-text">"...When I am with those who are weak, I share their weakness, for I want to bring the weak to Christ. Yes, I try to find common ground with everyone, doing everything I can to save some. I do everything to spread the Good News and share in its blessings."</div>
        </div>

        <div className="dos-donts-grid">
          <div className="donts-box">
            <div className="box-header donts-header"><span>✗</span> Don'ts</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label donts-item-label">Becoming Unrelatable</div>
              <div className="item-note">Avoid becoming so different or radical in your lifestyle that you become completely unrelatable. When you act like an alien, others feel you can't understand their struggles.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8 }}>
              <div className="item-label donts-item-label">Forcing a Personality Change</div>
              <div className="item-note">Don't make people feel like they have to change their entire personality, vocabulary, or hobbies to hang out with you or become a Christian.</div>
            </div>
          </div>
          <div className="dos-box">
            <div className="box-header dos-header"><span>✓</span> Do's</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label dos-item-label">Mingle with the World, Not with Sin</div>
              <div className="item-note">Be present in the spaces and lives of unbelievers — just draw the line at participating in sin.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8 }}>
              <div className="item-label dos-item-label">Accept the Person, Reject the Sin</div>
              <div className="item-note">Walk the fine line of being deeply loving and accepting of everyone without compromising your convictions.</div>
            </div>
          </div>
        </div>

        {/* Balancing beam: Isolation vs Compromise vs Christ-like Presence */}
        <IllustrationBox src={IMG("image87.png")} alt="Balancing beam: Isolation — Christ-like Presence — Compromise" height={300} />

        <div className="page-footer-rule" />
        <div className="page-badge">Page 5</div>
      </div>

      {/* ─── PAGE 6: SECTION 4.1 ─── */}
      <div className="a4-page">
        <SectionBand title="Drawing People with God's Love, Not the Fear of Hell" />
        <SubHead title="Being the First Gospel Your Friends See" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">Matthew 5:16</div>
            <div className="verse-text">"In the same way, let your good deeds shine out for all to see, so that everyone will praise your heavenly Father."</div>
          </div>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">John 13:35</div>
            <div className="verse-text">"Your love for one another will prove to the world that you are my disciples."</div>
          </div>
        </div>

        <div className="dos-donts-grid">
          <div className="donts-box">
            <div className="box-header donts-header"><span>✗</span> Don'ts</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label donts-item-label">Living Hypocritically</div>
              <div className="item-note">Avoid preaching love, kindness, and grace if your everyday life doesn't reflect those values. When your lifestyle contradicts your message, Christianity looks like hypocrisy to outsiders.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8 }}>
              <div className="item-label donts-item-label">Words Before Witness</div>
              <div className="item-note">Do not rely on vocal preaching before you have established a living testimony. Speaking truth without a matching lifestyle pushes people away.</div>
            </div>
          </div>
          <div className="dos-box">
            <div className="box-header dos-header"><span>✓</span> Do's</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label dos-item-label">Let Your Life Be the First Bible They Read</div>
              <div className="item-note">Before your friends ever open a Bible, they are reading your life. Show them what Christianity looks like through your character, habits, and reactions.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8 }}>
              <div className="item-label dos-item-label">Let Your Lifestyle Create Holy Envy</div>
              <div className="item-note">Live so that the peace, joy, and love in your life naturally attract others to God. When people genuinely want what you have, your faith explanation becomes far more effective.</div>
            </div>
          </div>
        </div>

        {/* Posting Faith but Ignoring Pain vs Sitting in Love Like Christ Did */}
        <IllustrationBox src={IMG("image78.png")} alt="Posting Faith but ignoring pain vs Sitting in love like Christ did" height={340} />

        <div className="page-footer-rule" />
        <div className="page-badge">Page 6</div>
      </div>

      {/* ─── PAGE 7: SECTION 4.2 + 4.3 ─── */}
      <div className="a4-page">
        <SubHead title="Spirit Led, Not Knowledge Driven" />

        <div className="verse-box" style={{ marginBottom: 10 }}>
          <div className="verse-ref">1 Corinthians 2:1-5</div>
          <div className="verse-text">"When I first came to you, dear brothers and sisters, I didn't use lofty words and impressive wisdom to tell you God's secret plan... Rather than using clever and persuasive speeches, I relied only on the power of the Holy Spirit. I did this so you would not trust in human wisdom but in the power of God."</div>
        </div>

        <div className="dos-donts-grid">
          <div className="donts-box">
            <div className="box-header donts-header"><span>✗</span> Don'ts</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label donts-item-label">Relying on Intellectual Arguments</div>
              <div className="item-note">Avoid relying purely on facts, archaeology, or high philosophy to prove God is real. These things appeal to the intellect but rarely change a person's heart or create a longing for Jesus.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8 }}>
              <div className="item-label donts-item-label">Overcomplicating the Simplicity of the Cross</div>
              <div className="item-note">Relying heavily on "clever speeches" distracts people with side arguments rather than keeping focus on Jesus.</div>
            </div>
          </div>
          <div className="dos-box">
            <div className="box-header dos-header"><span>✓</span> Do's</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label dos-item-label">Rely on the Holy Spirit</div>
              <div className="item-note">Make the Holy Spirit your primary reliance when sharing the Gospel. He fully knows and can penetrate the deep secrets of the human heart.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8 }}>
              <div className="item-label dos-item-label">Target the Heart, Not Just the Brain</div>
              <div className="item-note">Trust that the Holy Spirit can stir up a genuine, personal need for Christ in ways human wisdom and clever arguments never could.</div>
            </div>
          </div>
        </div>

        {/* What I think I need vs What God expects to bring */}
        <IllustrationBox src={IMG("image86.png")} alt="What I think I need vs What God expects to bring" height={190} />

        <hr className="sub-divider" />
        <SubHead title="Trusting God's Call and His Timing" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">John 6:44</div>
            <div className="verse-text">"For no one can come to me unless the Father who sent me draws them to me, and at the last day I will raise them up."</div>
          </div>
          <div className="verse-box" style={{ margin: 0 }}>
            <div className="verse-ref">1 Corinthians 3:6-7</div>
            <div className="verse-text">"I planted the seed in your hearts, and Apollos watered it, but it was God who made it grow. It's not important who does the planting or who does the watering. What's important is that God makes it grow."</div>
          </div>
        </div>

        <div className="dos-donts-grid">
          <div className="donts-box">
            <div className="box-header donts-header"><span>✗</span> Don'ts</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label donts-item-label">Trying to Play the Savior in Your Own Strength</div>
              <div className="item-note">Stop thinking that you can bring someone into salvation through your own strength, knowledge, or effort. Only God can save a person — do not try to take on His role or force a spiritual outcome.</div>
            </div>
            <div style={{ borderTop: "1px solid #E8A898", paddingTop: 8 }}>
              <div className="item-label donts-item-label">Overstepping Your Bounds and Pushing People Away</div>
              <div className="item-note">Avoid pushing beyond what God has asked you to do. If you keep forcing the issue out of anxiety, you risk pushing them away from better help later on.</div>
            </div>
          </div>
          <div className="dos-box">
            <div className="box-header dos-header"><span>✓</span> Do's</div>
            <div style={{ marginBottom: 8 }}>
              <div className="item-label dos-item-label">Play Your Part in God's Process</div>
              <div className="item-note">Realize that it might not be your job to walk someone all the way through to salvation. Your assignment may be small — perhaps just one or two conversations or actions.</div>
            </div>
            <div style={{ borderTop: "1px solid #A8D5B5", paddingTop: 8 }}>
              <div className="item-label dos-item-label">Trust God's Timing and Strategy</div>
              <div className="item-note">Do what you can, then intentionally step back and trust God's unique way and timing for that person's life. Leave the ultimate results to Him.</div>
            </div>
          </div>
        </div>

        {/* One plants, another waters, God makes it grow */}
        <IllustrationBox src={IMG("image88.png")} alt="One plants, another waters, God makes it grow" height={340} />

        <div className="page-footer-rule" />
        <div className="page-badge">Page 7</div>
      </div>

      {/* ─── PAGE 8: CONCLUSION ─── */}
      <div className="a4-page">
        <div style={{ marginBottom: 20 }}>
          <div className="section-num" style={{ marginBottom: 6 }}>Wrapping Up</div>
          <div className="section-title" style={{ fontSize: 24 }}>Conclusion</div>
          <div style={{ width: 48, height: 2, backgroundColor: "#D4622A", marginTop: 8 }} />
        </div>

        <IllustrationBox src={IMG("image90.png")} alt="Good News Good Approach — Listen, Serve, Humble" height={560} />

        <div className="page-footer-rule" />
        <div className="page-badge">Page 8</div>
      </div>

    </div>
  );
}
