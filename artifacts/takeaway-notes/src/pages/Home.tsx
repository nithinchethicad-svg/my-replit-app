const IMG = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

const Illus = ({ src, alt, h, m = 14 }: { src: string; alt: string; h: number; m?: number }) => (
  <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: `${m}px 0` }}>
    <img src={src} alt={alt} style={{ maxHeight: h, maxWidth: "100%", objectFit: "contain", display: "block" }} />
  </div>
);

const Band = ({ title }: { title: string }) => (
  <div className="section-band" style={{ marginBottom: 12 }}>
    <div className="section-band-title" style={{ fontSize: 20 }}>{title}</div>
  </div>
);

const Sub = ({ title }: { title: string }) => (
  <div style={{
    fontFamily: "'Playfair Display', serif", fontSize: 18, fontStyle: "italic",
    fontWeight: 600, color: "#5C3A1E", margin: "6px 0 10px 0",
    borderLeft: "3px solid #C89B3C", paddingLeft: 10,
  }}>{title}</div>
);

const DosBox = ({ items }: { items: { t: string; n: string }[] }) => (
  <div className="dos-box">
    <div className="box-header dos-header"><span>✓</span> Do&apos;s</div>
    {items.map((it, i) => (
      <div key={i} style={i > 0 ? { borderTop: "1px solid #A8D5B5", paddingTop: 8, marginTop: 8 } : {}}>
        <div className="item-label dos-item-label">{it.t}</div>
        <div className="item-note">{it.n}</div>
      </div>
    ))}
  </div>
);

const DontsBox = ({ items }: { items: { t: string; n: string }[] }) => (
  <div className="donts-box">
    <div className="box-header donts-header"><span>✗</span> Don&apos;ts</div>
    {items.map((it, i) => (
      <div key={i} style={i > 0 ? { borderTop: "1px solid #E8A898", paddingTop: 8, marginTop: 8 } : {}}>
        <div className="item-label donts-item-label">{it.t}</div>
        <div className="item-note">{it.n}</div>
      </div>
    ))}
  </div>
);

interface VerseProps { vref: string; children: React.ReactNode }
const Verse = ({ vref, children }: VerseProps) => (
  <div className="verse-box" style={{ marginBottom: 10 }}>
    <div className="verse-ref">{vref}</div>
    <div className="verse-text">{children}</div>
  </div>
);

const ReflLine = () => <div className="reflection-line" />;
const Q = ({ q }: { q: string }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, color: "#D4622A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{q}</div>
    <ReflLine /><ReflLine /><ReflLine />
  </div>
);

const PageFooter = ({ n }: { n?: number }) => (
  <>
    <div className="page-footer-rule" />
    {n !== undefined && <div className="page-badge">Page {n}</div>}
  </>
);

export default function Home() {
  return (
    <div className="document-bg">

      {/* ═══ TITLE PAGE (unnumbered) ═══ */}
      <div className="a4-page" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 28, left: 40, width: 56, height: 56, borderTop: "3px solid #C89B3C", borderLeft: "3px solid #C89B3C" }} />
        <div style={{ position: "absolute", top: 28, right: 40, width: 56, height: 56, borderTop: "3px solid #C89B3C", borderRight: "3px solid #C89B3C" }} />
        <div style={{ position: "absolute", bottom: 40, left: 40, width: 56, height: 56, borderBottom: "3px solid #C89B3C", borderLeft: "3px solid #C89B3C" }} />
        <div style={{ position: "absolute", bottom: 40, right: 40, width: 56, height: 56, borderBottom: "3px solid #C89B3C", borderRight: "3px solid #C89B3C" }} />
        <div style={{ width: "78%", marginBottom: 32 }}>
          <img src={IMG("title.png")} alt="Awkward group scene" style={{ width: "100%", objectFit: "contain", display: "block" }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <div className="display-title" style={{ fontSize: 52 }}>Good News,</div>
          <div className="display-title" style={{ fontSize: 52, color: "#D4622A" }}>Bad Approach.</div>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontStyle: "italic", color: "#5C3A1E", marginBottom: 32 }}>
          The Do&apos;s, Don&apos;ts, and Awkward Moments
        </div>
        <div style={{ width: 120, height: 1, background: "linear-gradient(90deg, transparent, #C89B3C, transparent)", marginBottom: 20 }} />
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#8B6340", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Freedom Yuva</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8B6340" }}>14 June 2026</div>
        <PageFooter />
      </div>

      {/* ═══ PAGE 1: DISCUSSION & REFLECTION ═══ */}
      <div className="a4-page">
        <div style={{ marginBottom: 20 }}>
          <div className="section-num" style={{ marginBottom: 6 }}>Before We Begin</div>
          <div className="section-title" style={{ fontSize: 30 }}>Discussion &amp; Reflection</div>
          <div style={{ width: 48, height: 2, backgroundColor: "#D4622A", marginTop: 8 }} />
        </div>
        <Q q="Q1 — Have you ever actually tried sharing the Gospel with someone? How did you go about it?" />
        <Q q="Q2 — If you're hesitant, what's stopping you? If you have, what challenges did you push through?" />
        <Q q="Q3 — If someone has ever tried sharing the Gospel with you, what did you like about it, and what totally annoyed or frustrated you?" />
        <div className="ornament">— ✦ —</div>
        <PageFooter n={1} />
      </div>

      {/* ═══ PAGE 2: GREAT COMMISSION + FEARS ═══ */}
      <div className="a4-page">
        <Band title="The Great Commission: Why We Need to Share the Gospel" />
        <Verse vref="Mark 16:15">
          &ldquo;And then he told them, &lsquo;Go into all the world and preach the Good News to everyone.&rsquo;&rdquo;
        </Verse>
        <Illus src={IMG("page2.png")} alt="Crossroads: Stay Silent or Step Forward" h={400} />
        <div style={{ marginTop: 10, marginBottom: 8 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 700, color: "#5C3A1E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Common Challenges &amp; Fears</div>
          {[
            { t: "Fear of Being \"That Guy\"", b: "The gut-level fear of being the person who kills the vibe — looking like you're trying too hard or don't know how to act in a normal social setting." },
            { t: "Fear of Being Labeled a Preacher or Priest", b: "The cringe factor of being put in a box — you share something spiritual and people instantly categorize you, creating distance and turning friendship into something heavy and awkward." },
            { t: "Fear of the Unknown / Unanswerable", b: "The \"what if they ask me something I can't answer?\" panic — being stumped by a tough question makes you feel foolish and harms the credibility of your message." },
            { t: "The \"Cancel Culture\" Fear", b: "Standing up for your convictions might get you cancelled. You're afraid holding a firm belief will make you a target, so you stay silent to keep the peace." },
            { t: "The \"Hidden Agenda\" Worry", b: "Your friends might think you're only hanging out to convert them — that your motives will be questioned and they'll feel like a project rather than a friend." },
          ].map((f, i) => (
            <div key={i} className="fear-chip">
              <div className="fear-chip-title">{f.t}</div>
              <div className="fear-chip-text">{f.b}</div>
            </div>
          ))}
        </div>
        <PageFooter n={2} />
      </div>

      {/* ═══ PAGE 3: §2.1 ═══ */}
      <div className="a4-page">
        <Band title="Win the Friend, Not the Argument" />
        <Sub title="Don't Fight the Dark, Just Bring the Light" />
        <Verse vref="Acts 17:22-23">
          &ldquo;Men of Athens, I notice that you are very religious in every way, for as I was walking along I saw your many shrines. And one of your altars had this inscription on it: &lsquo;To an Unknown God.&rsquo; This God, whom you worship without knowing, is the one I&apos;m telling you about.&rdquo;
        </Verse>
        <div className="dos-donts-grid">
          <DontsBox items={[
            { t: "The \"Wrong vs. Right\" Power Play", n: "Avoid leading with how they are wrong and you are right. This shifts the focus to winning an argument rather than sharing a message." },
            { t: "The \"Offensive Approach\"", n: "Do not be offensive. When you attack someone's current perspective, you build a wall instead of a bridge, causing them to shut down immediately." },
            { t: "The \"Superiority Complex\"", n: "Your job is not to prove they are bad or inferior. Acting morally superior alienates the very person you are trying to reach." },
          ]} />
          <DosBox items={[
            { t: "Share Your Truth, Don't Defeat Theirs", n: "Your mission is simply to share your truth. Release the need to prove them wrong; focus on what you believe to be true." },
            { t: "Anchor in Common Ground", n: "Find the common ground between your perspectives. Starting from a place where they can relate helps build rapport rather than conflict." },
            { t: "Build Bridges from Known Truths", n: "Identify the truths they already know and accept, then gently use those as stepping stones to lead them toward the whole truth." },
          ]} />
        </div>
        <Illus src={IMG("page3.png")} alt="Bad Approach vs Better Approach" h={370} />
        <hr className="sub-divider" />
        <Illus src={IMG("forpage3.png")} alt="Pathway 1: Win the Argument vs Pathway 2: Win the Friend" h={260} />
        <PageFooter n={3} />
      </div>

      {/* ═══ PAGE 4: §2.2 ═══ */}
      <div className="a4-page">
        <Sub title="Listen to Understand, Not to Reply" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Verse vref="2 Timothy 2:23-24">
            &ldquo;Again I say, don&apos;t get involved in foolish, ignorant arguments that only start fights. A servant of the Lord must not quarrel but must be kind to everyone, be able to teach, and be patient with difficult people.&rdquo;
          </Verse>
          <Verse vref="James 1:19">
            &ldquo;Understand this, my dear brothers and sisters: You must all be quick to listen, slow to speak, and slow to get angry.&rdquo;
          </Verse>
        </div>
        <div className="dos-donts-grid">
          <DontsBox items={[
            { t: "Listening to Find Holes or Mistakes", n: "Treating their words as ammunition rather than as part of a conversation." },
            { t: "Making Them Feel Inferior", n: "Using what someone shares to highlight their mistakes makes them regret opening up." },
            { t: "Listening to Win an Argument", n: "Listening only to structure a rebuttal ignores the person's humanity entirely." },
          ]} />
          <DosBox items={[
            { t: "Seek to Understand Their Perspective", n: "Listen with the goal of discovering why they believe what they believe." },
            { t: "Focus on the Heart and Situation", n: "Look beyond the surface to understand what they are going through in their current reality." },
            { t: "Prioritize Empathy over Debate", n: "True listening is about building understanding and rapport, not correcting or fighting back." },
          ]} />
        </div>
        <Illus src={IMG("image72.png")} alt="Brain trying to dismantle vs Heart trying to understand" h={240} />
        <hr className="sub-divider" />
        <Illus src={IMG("forpage4.png")} alt="Reply Mode (Defensive) vs Understand Mode (Empathetic)" h={250} />
        <PageFooter n={4} />
      </div>

      {/* ═══ PAGE 5: §2.3 ═══ */}
      <div className="a4-page">
        <Sub title="Love Your Friends, Lose the Lecture" />
        <Verse vref="1 John 3:16-18">
          &ldquo;If someone has enough money to live well and sees a brother or sister in need but shows no compassion — how can God&apos;s love be in that person? Dear children, let&apos;s not merely say that we love each other; let us show the truth by our actions.&rdquo;
        </Verse>
        <div className="dos-donts-grid">
          <DontsBox items={[
            { t: "Prioritizing Lectures over Genuine Support", n: "When a friend is in need, immediately lecturing them about faith ignores their reality and creates a barrier." },
            { t: "Words as a Substitute for Action", n: "Filling a need with spiritual talk instead of practical help feels dismissive and insincere." },
            { t: "Missing the Chance to Truly Connect", n: "Lecturing instead of offering a helping hand prevents you from reflecting the love you're trying to share." },
          ]} />
          <DosBox items={[
            { t: "Demonstrate Love Through Action First", n: "Before speaking about God's love, demonstrate it by meeting physical, emotional, or financial needs." },
            { t: "Provide the Support They Actually Need", n: "Be the person who offers a helping hand, a listening ear, or a supportive presence in their specific situation." },
            { t: "Let Your Actions Speak Louder Than Words", n: "Words alone rarely help in crisis. Serving your friend first creates the bridge of trust necessary for your message to be heard." },
          ]} />
        </div>
        <Illus src={IMG("image67.png")} alt="Correct words wrong moment vs Love first truth later" h={310} />
        <PageFooter n={5} />
      </div>

      {/* ═══ PAGE 6: §3.1 ═══ */}
      <div className="a4-page">
        <Band title="Less Judgment, More Approachability" />
        <Sub title="Battling Spiritual Pride, Showing Empathy" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Verse vref="Luke 18:10-14">
            &ldquo;The Pharisee stood by himself and prayed: &lsquo;I thank you, God, that I am not like other people...&rsquo; But the tax collector stood at a distance saying, &lsquo;O God, be merciful to me, for I am a sinner.&rsquo; I tell you, this sinner, not the Pharisee, returned home justified before God.&rdquo;
          </Verse>
          <Verse vref="Ephesians 4:2">
            &ldquo;Always be humble and gentle. Be patient with each other, making allowance for each other&apos;s faults because of your love.&rdquo;
          </Verse>
        </div>
        <div className="dos-donts-grid">
          <DontsBox items={[
            { t: "Thinking You Are Better Than Others", n: "Acting like a modern-day Pharisee creates an immediate barrier that makes you completely unapproachable." },
            { t: "Forgetting That You Are Also a Sinner", n: "When you lose sight of the fact that you're saved by grace, not your own achievement, you become judgmental." },
            { t: "Ignoring Their Circumstances", n: "Failing to acknowledge that without God's protection, you could have easily ended up in a worse situation." },
          ]} />
          <DosBox items={[
            { t: "Cultivate a Humble Heart Condition", n: "Always maintain the awareness that you are no better than anyone else — your standing is a gift, not an achievement." },
            { t: "Practice Empathy — Imagine Yourself in Their Place", n: "Consider how you might have acted if you were in their specific situation — this moves you from judgment to empathy." },
            { t: "Treat Others with the Grace You'd Want", n: "Offer the same patience, kindness, and grace you would hope to receive if you were the one who had made a mistake." },
          ]} />
        </div>
        <Illus src={IMG("forpage6.png")} alt="Guardian filters who goes in vs Guide leads everyone into church" h={250} m={6} />
        <div style={{ borderTop: "1px dashed #E8C87A", margin: "4px 0" }} />
        <Illus src={IMG("image85.png")} alt="Pride distances vs Humility brings closer" h={185} m={6} />
        <PageFooter n={6} />
      </div>

      {/* ═══ PAGE 7: §3.2 ═══ */}
      <div className="a4-page">
        <Sub title="High Standards, Low Bridges" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Verse vref="Jude 1:22-23">
            &ldquo;And you must show mercy to those whose faith is wavering. Rescue others by snatching them from the flames of judgment. Show mercy to still others, but do so with great caution, hating the sins that contaminate their lives.&rdquo;
          </Verse>
          <Verse vref="Galatians 6:1">
            &ldquo;Dear brothers and sisters, if another believer is overcome by some sin, you who are godly should gently and humbly help that person back onto the right path. And be careful not to fall into the same temptation yourself.&rdquo;
          </Verse>
        </div>
        <div className="dos-donts-grid">
          <DontsBox items={[
            { t: "Gatekeeping with High Standards", n: "Forcing your personal, high standards onto outsiders or new believers — when you expect people to completely change before they can relate to you, you build an inaccessible wall." },
            { t: "Conditional Mingling", n: "Only hanging out with, helping, or welcoming people if they already measure up to a certain spiritual or moral level." },
          ]} />
          <DosBox items={[
            { t: "Keep Your Standards High, but the Bridge Low", n: "Hold yourself to the highest personal standards of faith and integrity, but make sure the bridge you build outward is flat, wide, and easy for anyone to walk across." },
            { t: "Create a Safe Space for the Vulnerable", n: "Intentionally allow the weak, wavering, and vulnerable to approach you exactly as they are — no pressure to live up to a standard they aren't ready for." },
          ]} />
        </div>
        <Illus src={IMG("image83.png")} alt="High Standards High Barriers vs Low Bridges" h={390} />
        <PageFooter n={7} />
      </div>

      {/* ═══ PAGE 8: §3.3 ═══ */}
      <div className="a4-page">
        <Sub title="Set Apart, Not Pulled Apart" />
        <Verse vref="1 Corinthians 9:20-23">
          &ldquo;When I am with those who are weak, I share their weakness, for I want to bring the weak to Christ. Yes, I try to find common ground with everyone, doing everything I can to save some. I do everything to spread the Good News and share in its blessings.&rdquo;
        </Verse>
        <div className="dos-donts-grid">
          <DontsBox items={[
            { t: "Becoming Unrelatable", n: "Avoid becoming so different or radical in your lifestyle that you become completely unrelatable. When you act like an alien, others feel you can't understand their struggles." },
            { t: "Forcing a Personality Change", n: "Don't make people feel like they have to change their entire personality, vocabulary, or hobbies to hang out with you or become a Christian." },
          ]} />
          <DosBox items={[
            { t: "Mingle with the World, Not with Sin", n: "Be present in the spaces and lives of unbelievers — just draw the line at participating in sin." },
            { t: "Accept the Person, Reject the Sin", n: "Walk the fine line of being deeply loving and accepting of everyone without compromising your convictions." },
          ]} />
        </div>
        <Illus src={IMG("image87.png")} alt="Balancing beam: Isolation — Christ-like Presence — Compromise" h={410} />
        <PageFooter n={8} />
      </div>

      {/* ═══ PAGE 9: §4.1 ═══ */}
      <div className="a4-page">
        <Band title="Drawing People with God's Love, Not the Fear of Hell" />
        <Sub title="Being the First Gospel Your Friends See" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Verse vref="Matthew 5:16">
            &ldquo;In the same way, let your good deeds shine out for all to see, so that everyone will praise your heavenly Father.&rdquo;
          </Verse>
          <Verse vref="John 13:35">
            &ldquo;Your love for one another will prove to the world that you are my disciples.&rdquo;
          </Verse>
        </div>
        <div className="dos-donts-grid">
          <DontsBox items={[
            { t: "Living Hypocritically", n: "Avoid preaching love, kindness, and grace if your everyday life doesn't reflect those values. When your lifestyle contradicts your message, Christianity looks like hypocrisy to outsiders." },
            { t: "Words Before Witness", n: "Do not rely on vocal preaching before you have established a living testimony. Speaking truth without a matching lifestyle pushes people away." },
          ]} />
          <DosBox items={[
            { t: "Let Your Life Be the First Bible They Read", n: "Before your friends ever open a Bible, they are reading your life. Show them what Christianity looks like through your character, habits, and reactions." },
            { t: "Let Your Lifestyle Create Holy Envy", n: "Live so that the peace, joy, and love in your life naturally attract others to God. When people genuinely want what you have, your faith explanation becomes far more effective." },
          ]} />
        </div>
        <Illus src={IMG("image78.png")} alt="Posting Faith but ignoring pain vs Sitting in love like Christ did" h={390} />
        <PageFooter n={9} />
      </div>

      {/* ═══ PAGE 10: §4.2 ═══ */}
      <div className="a4-page">
        <Sub title="Spirit Led, Not Knowledge Driven" />
        <Verse vref="1 Corinthians 2:1-5">
          &ldquo;When I first came to you, dear brothers and sisters, I didn&apos;t use lofty words and impressive wisdom to tell you God&apos;s secret plan... Rather than using clever and persuasive speeches, I relied only on the power of the Holy Spirit. I did this so you would not trust in human wisdom but in the power of God.&rdquo;
        </Verse>
        <div className="dos-donts-grid">
          <DontsBox items={[
            { t: "Relying on Intellectual Arguments", n: "Avoid relying purely on facts, archaeology, or high philosophy to prove God is real. These things appeal to the intellect but rarely change a person's heart or create a longing for Jesus." },
            { t: "Overcomplicating the Simplicity of the Cross", n: "Relying heavily on clever speeches distracts people with side arguments rather than keeping focus on Jesus." },
          ]} />
          <DosBox items={[
            { t: "Rely on the Holy Spirit", n: "Make the Holy Spirit your primary reliance when sharing the Gospel. He fully knows and can penetrate the deep secrets of the human heart." },
            { t: "Target the Heart, Not Just the Brain", n: "Trust that the Holy Spirit can stir up a genuine, personal need for Christ in ways human wisdom and clever arguments never could." },
          ]} />
        </div>
        <Illus src={IMG("image86.png")} alt="What I think I need vs What God expects to bring" h={390} />
        <PageFooter n={10} />
      </div>

      {/* ═══ PAGE 11: §4.3 ═══ */}
      <div className="a4-page">
        <Sub title="Trusting God's Call and His Timing" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Verse vref="John 6:44">
            &ldquo;For no one can come to me unless the Father who sent me draws them to me, and at the last day I will raise them up.&rdquo;
          </Verse>
          <Verse vref="1 Corinthians 3:6-7">
            &ldquo;I planted the seed in your hearts, and Apollos watered it, but it was God who made it grow. It&apos;s not important who does the planting or who does the watering. What&apos;s important is that God makes it grow.&rdquo;
          </Verse>
        </div>
        <div className="dos-donts-grid">
          <DontsBox items={[
            { t: "Trying to Play the Savior in Your Own Strength", n: "Stop thinking that you can bring someone into salvation through your own strength, knowledge, or effort. Only God can save a person — do not try to take on His role or force a spiritual outcome." },
            { t: "Overstepping Your Bounds and Pushing People Away", n: "Avoid pushing beyond what God has asked you to do. If you keep forcing the issue out of anxiety, you risk pushing them away from better help later on." },
          ]} />
          <DosBox items={[
            { t: "Play Your Part in God's Process", n: "Realize that it might not be your job to walk someone all the way through to salvation. Your assignment may be small — perhaps just one or two conversations or actions." },
            { t: "Trust God's Timing and Strategy", n: "Do what you can, then intentionally step back and trust God's unique way and timing for that person's life. Leave the ultimate results to Him." },
          ]} />
        </div>
        <Illus src={IMG("image88.png")} alt="One plants, another waters, God makes it grow" h={390} />
        <PageFooter n={11} />
      </div>

      {/* ═══ PAGE 12: CONCLUSION ═══ */}
      <div className="a4-page">
        <div style={{ marginBottom: 20 }}>
          <div className="section-num" style={{ marginBottom: 6 }}>Wrapping Up</div>
          <div className="section-title" style={{ fontSize: 30 }}>Conclusion</div>
          <div style={{ width: 48, height: 2, backgroundColor: "#D4622A", marginTop: 8 }} />
        </div>
        <Illus src={IMG("image90.png")} alt="Good News Good Approach summary" h={650} />
        <PageFooter n={12} />
      </div>

    </div>
  );
}
