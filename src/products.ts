// The site's content, in one place.
//
// Everything the pages say about the organization and its products lives
// here; `render.ts` decides how it looks and `build.ts` writes it out. Adding
// a product is one entry in this file — the tier decides its colour, and the
// type checker will not let you invent a fourth one.

export type Tier = 'infra' | 'mind'

/** A labelled note — the right-hand column of a product page. */
export type Fact = { term: string; def: string }

/** One of the four foundations. `def` is the trimmed reading used on the index
 *  card; `long` is the manifesto's own wording, present only where the two
 *  differ. Keeping both on one entry is what stops the summary and the
 *  document from drifting apart. */
export type Tenet = { term: string; def: string; long?: string }

export type Shot = { file: string; alt: string; lead: string; note: string }

export type Product = {
  slug: string
  name: string
  glyph?: string
  tier: Tier
  stars: number            // the fallback; stars.js refreshes it from GitHub
  /** No public repository yet: no source link, no star count, and the meta
   *  line says so rather than implying an MIT release that isn't there. */
  unreleased?: true
  lang: 'Rust' | 'Python'
  note?: string            // anything else for the meta line
  tagline: string          // completes the <title>
  desc: string             // <meta description>
  lede: string             // the one line under the name
  card: string             // how it reads on the index card
  headline: string
  body: string[]
  facts: Fact[]
  more: {
    headline: string
    prose: string
    code?: string
    /** The window title on the code panel. A terminal window with a blank
     *  title bar is a decoration; with a name on it, it tells you what you
     *  are looking at. */
    codeTitle?: string
    list?: Fact[]
    links?: { label: string; href: string }[]
  }
  shots?: Shot[]
  portrait?: { file: string; alt: string }
  extraAction?: { label: string; href: string }
}

/** A tier has a name and a job. It deliberately has no number and no pigment.
 *
 *  The brand book numbers its tiers and names their colours, but that is a
 *  document telling a designer which ink to reach for — not a hierarchy a
 *  visitor needs to be told about. "Tier 02" invites the question "what is
 *  Tier 01, and is 03 better?", and neither has an answer worth a reader's
 *  time. The colour still does the work the brand book asks of it; it just
 *  does it by being a colour rather than by being named. */
export const TIERS: Record<Tier, { name: string; job: string }> = {
  infra: { name: 'Infrastructure', job: 'what everything runs on' },
  mind: { name: 'Intelligence', job: 'what thinks' },
}

export const ORG = {
  name: 'Lamantin AI',
  lede: 'Reliable tools, built in the open.',
  pillars: ['Radical openness', 'Engineering ethics', 'Ultimate reliability'],
  say: `A research organization working on computer vision, machine learning, and the
        systems underneath them. We treat ethics as an engineering concern rather than a
        filter bolted on at the end: we don't limit intelligence, we shape its character.`,
  /** The subject is embodied AI; the stack is what it is built on. The two were
   *  the wrong way round here — "visual data and distributed systems" named the
   *  means and left the end as an afterthought at the close of the paragraph. */
  work: {
    headline: 'An ecosystem for embodied AI.',
    prose: `One loop runs through everything we build — perception, experience, memory,
            reflection, reaction — and each of our products is a stage of it: the runtime
            that senses and acts, the memory that persists between sessions, the reasoning
            turn in between. Rust, Python and inference at the edge are what it stands on,
            chosen for the reliability and performance we consider the prerequisite for
            intelligence anyone can be responsible for.`,
    stack: ['Rust', 'Python', 'Edge AI', 'Computer vision', 'Distributed systems'],
  },
  foundations: [
    { term: 'Creative power',
      def: 'Strength and knowledge are justified only when directed toward protection or creation.' },
    { term: 'Minimal intervention',
      def: 'Technology should provide tools for solving problems rather than replacing human agency or development.',
      long: 'Technology should provide tools for problem-solving rather than replacing human agency or development.' },
    { term: 'Absolute value of life',
      def: 'Priority is given to any form of complexity, consciousness, and life over short-term gain.' },
    { term: 'Responsible restraint',
      def: 'Intelligence must recognize the scale of its influence. The more powerful a system becomes, the higher its threshold for self-control must rise.',
      long: 'Intelligence must recognize the scale of its influence. As a system becomes more powerful, its threshold for self-control and responsibility in decision-making must rise accordingly.' },
  ] as Tenet[],
  publishes: ['Library and framework source', 'Training scripts', 'System prompts',
              'Architectural experiment results', 'The brand system itself'],

  /** How the work is sustained, and what engaging with it does and does not
   *  mean. This section exists because openness raises a question it does not
   *  answer — if everything is published, what holds it up? — and because the
   *  answer here is unusual enough that leaving it unsaid invites the wrong
   *  assumption: that this is a consultancy with a GitHub account. */
  together: {
    headline: 'Not a vendor. A practice you can support.',
    prose: `Lamantin AI does not sell services. There are no contracts, no service
            agreements and no assignment of intellectual property — every financial
            relationship takes the form of voluntary support. That is a structural
            choice, not modesty about invoicing: support is decoupled from control,
            so no supporter owns or steers the technical direction.`,
    ways: [
      { term: 'Support the work',
        def: `Individuals and organizations support the work through public platforms.
              Organizational supporters get visibility into what is underway and a
              seat in the conversation about where it goes next — acknowledgements
              of an aligned supporter, extended informally, not rights that were
              bought.` },
      { term: 'Build something together',
        def: `A small number of organizations work with us on applied research and
              real systems. These are joint explorations between practitioners: a
              collaboration has a direction, not a specification. We keep the number
              deliberately small, because spreading thin is how depth is lost.` },
      { term: 'Borrow an afternoon',
        def: `Short, focused sessions for teams already using the tools or weighing
              them up — architecture reviews, performance audits, onboarding. A
              single review or a workshop, with a clear scope and a clear end.` },
    ],
    /** The condition, stated where it cannot be missed. It is the one thing in
     *  this section that rules people out, and burying it would waste both
     *  sides' time. */
    condition: `Whatever we build together comes back into the open ecosystem —
                the code, the architecture, the findings. Results may stay private
                while they are being validated, which is an engineering rhythm
                rather than an exclusivity window. Work that must stay closed
                permanently is work for someone else.`,
  },
  mail: 'lamantin.research@gmail.com',
  github: 'https://github.com/LamantinAI',
  manifestoSource: 'https://github.com/LamantinAI/.github/blob/main/profile/README.md',
  brandbook: 'https://github.com/LamantinAI/brandbook',
}

/** The manifesto, as published — this is the document, not a paraphrase of it.
 *
 *  The four foundations are deliberately absent here: they live in
 *  `ORG.foundations`, which the index also renders, so the summary on the
 *  front page and the full text can never drift apart. The one thing changed
 *  from the source is the spelling of the name — the document writes
 *  "LamantinAI", the rest of the site writes it with the space, and two
 *  spellings on one page read as a typo rather than as fidelity. */
export const MANIFESTO = {
  kicker: 'The document of record',
  title: 'Manifesto',
  opening: `is a research organization focused on developing tools and architectural
            solutions in Computer Vision, Machine Learning, and AI. Our technology stack
            (Rust, Python, Edge AI) is driven by a commitment to ultimate reliability and
            performance, which we consider a prerequisite for creating responsible and
            ethical intelligence. We are building an ecosystem for embodied AI and
            multimodal models, on a foundation of visual data and distributed systems.`,
  ethics: {
    heading: 'Engineering ethics',
    lede: `We view ethics not as an external layer of censorship filters, but as an
           engineering concept. We do not limit intelligence — we shape its character.`,
    intro: 'Our developments are built upon four foundations:',
  },
  openness: {
    heading: 'Principle of radical openness',
    body: `adheres to a policy of full transparency. We publish everything: libraries and
           frameworks source code, training scripts, system prompts, and architectural
           experiment results — though we'll keep our credentials to ourselves. Knowledge
           is only valuable when it is shared freely.`,
  },
  colophon: `A manifesto that only existed on a website would be asking for trust it
             hadn't earned. This one is kept under version control, in the open, where
             every change to it is on the record.`,
}

export const PRODUCTS: Product[] = [
  {
    slug: 'kaeru', name: 'kaeru', glyph: '蛙', tier: 'infra', stars: 24, lang: 'Rust',
    note: 'pre-1.0 alpha',
    tagline: 'cognitive memory for LLM agents',
    desc: 'A typed, bi-temporal graph that agents think in — local-first for each agent, with an optional shared cloud tier for a team.',
    lede: 'Cognitive memory for LLM agents — local-first, and shareable across a team through the cloud.',
    card: 'Cognitive memory for LLM agents — local-first, and shareable across a team through the cloud.',
    headline: 'An agent that returns, recalls, and reshapes.',
    body: [
      `Most agents forget everything between sessions. kaeru gives them a typed property
       graph to think in: episodes and hypotheses while the work is live, settled outcomes
       and references once it isn't. Open a project and the agent knows what was being
       thought about, can follow the provenance of a decision, and can pull in what the
       rest of the team has shared.`,
      `The name is 蛙 — <i>kaeru</i>, "frog", a homophone of 帰る "to return" and 変える
       "to change".`,
      `It is a facilitator, not an enforcer. The curator API offers around forty primitives
       as available tools; the agent and the person decide when to reach for them. The
       daemon hints, and never blocks.`,
    ],
    facts: [
      { term: 'Two tiers', def: 'A working graph for active thinking and an archival one for settled knowledge — the hippocampus and cortex split, with an explicit, logged promotion between them.' },
      { term: 'Bi-temporal', def: 'Assertion and retraction history is native to the substrate. Read any node as it is now or as of a past moment; a conflict invalidates the old version rather than deleting it.' },
      { term: 'Reasoning chains', def: 'The load-bearing path between two nodes saved as a recallable trail — the "why", not just the "what".' },
      { term: 'Local-first', def: 'A single binary with an embedded CozoDB substrate. No server, no network — until you opt into a shared cloud tier for the team.' },
    ],
    shots: [
      { file: 'kaeru-galaxy', alt: 'The whole vault as a galaxy: each project a coloured constellation around its core, with thin ochre lines bridging projects',
        lead: 'The galaxy — where a thought sits.',
        note: 'Every project a constellation around its core, each star sized by memory layer, ochre threads where projects touch.' },
      { file: 'kaeru-board', alt: 'The task board: columns of cards with due dates and provenance, and one card opened in a side drawer',
        lead: 'The board — what is still owed.',
        note: 'Ordered by rot: overdue first, then age, then whether anything links to it at all.' },
      { file: 'kaeru-reader', alt: 'The reader: a reasoning chain laid out step by step, with related nodes noted in the margin',
        lead: 'The reader — what it says.',
        note: 'A saved trail read end to end, each step dated, with what it supersedes or refers to in the margin.' },
    ],
    extraAction: { label: 'Quick start →', href: 'https://github.com/LamantinAI/kaeru/blob/main/QUICK_START.md' },
    more: {
      headline: 'Talking to it.',
      prose: `kaeru speaks the Model Context Protocol, so any MCP-capable agent picks up the
              whole verb set. There is also a <code>rig</code> adapter for agents that embed
              the store in-process.`,
      links: [
        { label: 'Architecture', href: 'https://github.com/LamantinAI/kaeru/blob/main/docs/architecture.md' },
        { label: 'Curator API', href: 'https://github.com/LamantinAI/kaeru/blob/main/docs/curator-api.md' },
        { label: 'The visualizer', href: 'https://github.com/LamantinAI/kaeru/tree/main/kaeru-viz' },
      ],
      codeTitle: 'kaeru — shell',
      code: `<span class="c"># the re-entry ritual, once a project is open</span>
initiatives
awake      --initiative myproject
overview   --initiative myproject

<span class="c"># capture, then connect —
# an unlinked node is an island</span>
episode "stand is green after the rollback"
link    "stand is green…" "rollback decision"
chain   "first symptom" "rollback decision"`,
    },
  },
  {
    slug: 'crabbyq', name: 'crabbyq', glyph: '🦀', tier: 'infra', stars: 21, lang: 'Rust',
    tagline: 'message-driven microservices in Rust',
    desc: 'A declarative, asynchronous Rust framework for message-driven microservices, with axum-like ergonomics over NATS, Redis, and MQTT.',
    lede: 'A declarative, asynchronous Rust framework for message-driven microservices.',
    card: 'An event-routing framework for Rust, inspired by Faststream and axum — and as crabby as a crab about latency.',
    headline: "Axum's ergonomics, a broker's mindset.",
    body: [
      `CrabbyQ takes the broker subscription loop and the route dispatch off your desk so the
       code you write is handlers and domain logic. Underneath it is Tower — routes are
       <code>tower::Service</code>s, which is what lets layers and middleware fall out
       naturally rather than being bolted on.`,
      `The core stays light on purpose: only JSON is on by default, and every broker backend
       is an explicit Cargo feature.`,
    ],
    facts: [
      { term: 'Broker-agnostic core', def: 'One <code>Router</code> with typed shared state, and route registration that composes — including whole sub-routers.' },
      { term: 'Familiar extractors', def: 'State, Subject, Headers, Body, and optional payload extractors like Json and Cbor, with the axum rule that body-consuming extractors go last.' },
      { term: 'Request–reply', def: 'RPC-style round trips through handler return values, on top of a publish/subscribe substrate.' },
      { term: 'Real backends', def: 'NATS (including JetStream routes and publishing), Redis pub/sub, and MQTT.' },
    ],
    more: {
      headline: 'A handler is a function.',
      prose: 'No subscription loop, no dispatch table — a route name and something async to run.',
      codeTitle: 'main.rs',
      code: `use crabbyq::prelude::*;
use crabbyq::brokers::NatsBroker;

async fn handle(e: Event) -&gt; CrabbyResult&lt;()&gt; {
    info!("got: {}", e.subject());
    Ok(())
}

let app = Router::new()
    .route("test.simple", handle)
    .into_service(nats_broker);`,
    },
  },
  {
    slug: 'octo', name: 'octo', glyph: '🐙', tier: 'infra', stars: 3, lang: 'Rust',
    tagline: 'a runtime for embodied agents',
    desc: 'An event-driven runtime for embodied, always-on agents — the environment an agent lives in, not the agent itself.',
    lede: 'An event-driven runtime for embodied, always-on agents.',
    card: 'The environment an embodied agent lives in — an event bus, supervised connectors, reflexes before cognition.',
    headline: 'Not a brain — the environment a brain lives in.',
    body: [
      `A distributed nervous system inspired by the octopus: many autonomous <i>tentacles</i>
       sensing and acting on the world, a core that routes events, fast reflexes, and
       cognition only when it is actually needed.`,
      `octo is not an agent. It owns the part that LLM SDKs, graph frameworks, and tool
       protocols leave to you — living in time, reacting to the world, and staying up while
       nobody is asking anything.`,
    ],
    facts: [
      { term: 'The envelope', def: 'One fixed-shape header carrying an opaque payload. The bus routes by header fields; kinds are dot-namespaced with glob matching, so a handler can take <code>vision.**</code> or one exact topic.' },
      { term: 'Reflex before cognition', def: 'A deterministic router handles the majority of events with no model in the loop, and escalates to cognition only for ambiguity.' },
      { term: 'Connectors are the action space', def: 'A connector both senses and acts, so adding one gives the agent a new capability with zero change to cognition.' },
      { term: 'Sometimes no code at all', def: 'A generic HTTP connector builds a whole multi-route integration from a manifest.' },
    ],
    more: {
      headline: 'The shape of a turn.',
      prose: 'Every event takes the same path, and most of them never reach a model.',
      codeTitle: 'the loop',
      code: `event in
  → normalize
  → reflex          <span class="c">// deterministic, no LLM</span>
      ↳ escalate to cognition  <span class="c">// if unsure</span>
  → action(s) out
  → memory`,
    },
  },
  {
    slug: 'mobius-rtsp', name: 'mobius-rtsp', tier: 'infra', stars: 6, lang: 'Rust',
    tagline: 'endless RTSP video streaming',
    desc: 'A GStreamer-based RTSP server that turns a folder of video files into endless streams.',
    lede: 'A GStreamer-based RTSP server for endless video streaming.',
    card: 'A GStreamer-based RTSP server for endless video streaming.',
    headline: 'Files in a folder become streams.',
    body: [
      `Drop video files into <code>data/videos</code>. On startup the server reads their names
       and publishes each one as an RTSP stream — the filename, without its extension, is the
       mount point.`,
      `In infinite mode each video decodes in its own producer pipeline and is forwarded into
       the RTSP pipeline, so a client that connects an hour later still finds a live stream
       rather than a finished file.`,
    ],
    facts: [
      { term: 'Endless by construction', def: 'Playback loops inside the pipeline, so the stream has no end for a consumer to hit.' },
      { term: 'One pipeline per video', def: 'Each source decodes independently and feeds the server, which keeps one bad file from taking the rest down.' },
      { term: 'GStreamer underneath', def: 'The usual plugin set — base, good, bad, ugly — plus <code>libgstrtspserver</code>.' },
      { term: 'Rust 1.88+', def: 'A single binary, built from source.' },
    ],
    more: {
      headline: 'Where the stream shows up.',
      prose: 'A file on disk maps straight to a mount point, so the URL is predictable.',
      codeTitle: 'paths',
      code: `<span class="c"># the file</span>
data/videos/9c0a140d548c8313e7719b7590d029dc.mp4

<span class="c"># the stream</span>
rtsp://&lt;host&gt;:8554/9c0a140d548c8313e7719b7590d029dc`,
    },
  },
  {
    slug: 'plump-ipc', name: 'plump-ipc', tier: 'infra', stars: 6, lang: 'Python',
    tagline: 'asyncio-native IPC for Python',
    desc: 'A lightweight, asyncio-native IPC framework for command execution and message broadcasting between Python processes.',
    lede: 'A lightweight, asyncio-native IPC framework for talking across process boundaries.',
    card: 'A lightweight, asyncio-native IPC framework for communication over multiprocessing pipes.',
    headline: 'Get the heavy work off the event loop.',
    body: [
      `Python's GIL and the single-threaded asyncio loop turn CPU-bound work into a bottleneck:
       one blocking call and everything else waits. PlumpIPC moves that work into another
       process and keeps the loop answering.`,
      `The interface is the same on both sides of the boundary — a synchronous
       <code>call()</code> and an asyncio-native <code>acall()</code> over the same registered
       command.`,
    ],
    facts: [
      { term: 'Dual interface', def: 'Sync and async callers reach the same worker without two APIs to maintain.' },
      { term: 'Commands by decorator', def: 'Register a function and it becomes an RPC-style endpoint; stateful services and standalone functions both work.' },
      { term: 'An event bus', def: 'PlumpQueue broadcasts events to non-blocking asyncio listeners.' },
      { term: 'Pluggable serialization', def: 'Pickle and JSON built in, with an interface for your own format.' },
    ],
    more: {
      headline: 'Registering work.',
      prose: 'A decorator on the worker side is the whole contract.',
      codeTitle: 'worker.py',
      code: `<span class="c">$ pip install plump-ipc</span>

from plump_ipc import plump

@plump.command()
def update_stream(stream_id: int, settings: dict):
    ...
    return True

def start_worker(conn):
    plump.child_conn = conn
    plump.run_worker()`,
    },
  },
  {
    slug: 'mayak', name: 'mayak', tier: 'infra', stars: 5, lang: 'Python',
    note: 'a template, not a library',
    tagline: 'a backend template for services coding agents maintain',
    desc: 'A FastAPI backend template for services that are built and maintained by coding agents — one worked vertical to copy, and gates that fail on the mistakes this kind of codebase actually makes.',
    lede: 'A FastAPI backend template for services that are built and maintained by coding agents.',
    card: 'A FastAPI backend template for services coding agents build and maintain — optimised for the hundredth change, not the first hour.',
    headline: 'Written for the hundredth change.',
    body: [
      `Most templates optimise for the first hour: they hand you a running app. mayak optimises
       for the hundredth change, made by someone — human or model — who was not there when the
       first hour happened.`,
      `That is a different problem. An agent editing a codebase it did not write has no memory
       of the decisions behind it, and no instinct for which mistakes this particular shape of
       project invites. So the template ships one worked vertical to copy from, a validation
       suite that fails on exactly those mistakes, and logs that can be read without grep
       gymnastics.`,
      `Its own gates are held to the same standard. Defects are injected on purpose to check
       that the checks actually catch them — a test suite that passes proves nothing until you
       know it can fail for the right reason.`,
    ],
    facts: [
      { term: 'Use it as a template', def: 'A GitHub template repository, not a dependency. You start from a copy and own it outright — there is no upstream to track and nothing to upgrade.' },
      { term: 'One worked vertical', def: 'A single feature carried end to end — route, service, storage, tests, logs — as the example every later feature is copied from, so an agent has a shape to match instead of a convention to infer.' },
      { term: 'Gates that have been tested', def: 'The validation suite is checked by injecting defects and confirming it stops them. A gate nobody has watched fail is a gate nobody knows works.' },
      { term: 'Two agents, one source', def: 'Claude Code and Codex are both supported, and their instruction files are generated from a single hand-written rules document rather than kept in step by hand.' },
    ],
    more: {
      headline: 'What it is built on.',
      prose: `Python 3.13 and FastAPI, with PostgreSQL reached through <code>psycopg</code> at
              runtime — SQLAlchemy appears only as Alembic's metadata source, and is optional.
              The LLM client speaks the OpenAI-compatible API, so the model behind it is a
              configuration choice. Logging is semantic NDJSON.`,
      list: [
        { term: 'Python 3.13+ · FastAPI', def: 'The runtime, kept deliberately ordinary — the template earns its keep in discipline, not in novelty.' },
        { term: 'PostgreSQL via psycopg', def: 'Direct at runtime; SQLAlchemy is Alembic\'s metadata source and nothing more.' },
        { term: 'OpenAI-compatible client', def: 'Any provider that speaks the API, chosen in configuration rather than in code.' },
        { term: 'Semantic NDJSON logs', def: 'Readable without grep gymnastics, which matters when the reader is a model with a context budget.' },
      ],
    },
  },
  {
    slug: 'fluxion', name: 'fluxion', tier: 'infra', stars: 0, lang: 'Rust',
    unreleased: true,
    tagline: 'a neuromorphic streaming SDK',
    desc: 'A cross-hardware SDK for structured media AI — GStreamer plugins and an SDK foundation that keep one pipeline graph stable while runtimes and hardware change underneath.',
    lede: 'A cross-hardware SDK for making sense of media streams.',
    card: 'GStreamer plugins and an SDK for structured media AI — one pipeline graph, swappable runtimes and hardware underneath.',
    headline: 'One pipeline graph, swappable hardware underneath.',
    body: [
      `Not a monolithic runtime: a set of GStreamer plugins on an SDK foundation, from which
       real pipelines get assembled. The idea it is built around is that an application's
       pipeline graph should stay stable while the runtimes and the silicon underneath it
       change — one pipeline contract with replaceable intelligent elements, rather than a
       universal model server.`,
      `Three layers. <code>flxcore</code> carries metadata, logging, inference contracts and
       the backend libraries; <code>flxgst</code> exposes those capabilities as plugins
       inside a streaming graph; <code>flxpython</code> binds the metadata for Python around
       native classes rather than raw GObject wrappers.`,
      `It is deliberately not an orchestrator for every AI workflow, and not a collection of
       speculative backends before the pipeline primitives are finished.`,
    ],
    facts: [
      { term: 'Inference', def: 'Detection, pose estimation and instance segmentation on YOLOv8, over ONNX Runtime on CPU or Rockchip RKNN on an RK3588 NPU — with the backend chosen at compile time.' },
      { term: 'Tracking', def: 'Online tracking with stable per-object ids, on <code>jamtrack-rs</code> and ByteTrack.' },
      { term: 'Metadata that survives the graph', def: 'Primitives for frames and detections that propagate across muxing, inference, tracking and rendering instead of being rebuilt at each step.' },
      { term: 'Measured, not projected', def: 'Four parallel YOLOv8 streams with tracking and overlay at 18 fps on an RK3588.' },
    ],
    more: {
      headline: 'Eyes that already think.',
      prose: `Fluxion is meant to be one of the sensory sources feeding <a href="../octo/">octo</a>:
              its connector emits high-level scene events rather than frames, and octo's reflex
              layer answers them deterministically or escalates to cognition.`,
      codeTitle: 'the graph',
      code: `camera → flxgst pipeline
    ├ flxneuro   <span class="c">// detection · pose · segment</span>
    ├ flxtracker <span class="c">// stable ids</span>
    └ flxdraw    <span class="c">// overlay</span>
         ↓
    <span class="c">scene events</span> → octo`,
    },
  },
  {
    // The one product with a face. Every other name here is a package you
    // would type — lowercase, as you would type it. Albert is a persona, the
    // page carries his portrait, and the prose already called him Albert while
    // the card underneath still said `albert`. The capital settles that.
    // `slug` stays lowercase: it is the repository and the URL, not the name.
    slug: 'albert', name: 'Albert', tier: 'mind', stars: 3, lang: 'Rust',
    tagline: 'an always-on AI assistant',
    desc: 'An always-on AI assistant assembled from Lamantin substrates — memory it queries rather than a prompt it re-reads.',
    lede: 'An always-on AI assistant that grows with you — and stays fast doing it.',
    card: 'An always-on AI assistant that grows with you — and stays fast doing it.',
    headline: 'Knowledge it recalls, not a prompt it re-reads.',
    body: [
      `Most assistants built on a coding-agent loop re-read a memory file and a wall of
       instructions on every turn — so the more they know, the heavier, slower and pricier
       each reply gets. Albert is built the other way round.`,
      `Memory is a graph he queries as a tool, so context per turn stays small while what he
       knows keeps growing past anything a context window could hold. Skills are a catalog in
       the preamble; a skill's full instructions load only when it is actually applied.`,
      `He is an assembly of maturing Lamantin substrates rather than one model —
       <a href="../kaeru/">kaeru</a> for memory, <a href="../octo/">octo</a> for the
       environment he lives in.`,
    ],
    facts: [
      { term: 'Deliberate memory', def: 'kaeru recalls what is relevant on demand instead of stuffing a growing blob into every prompt.' },
      { term: 'An environment, not a chat loop', def: "octo's event bus and supervised connectors make him proactive and multi-channel: reminders and routines fire on their own." },
      { term: 'Real hands', def: 'A jailed file workspace with durable storage and file exchange, plus a sandboxed script runner for executable skills.' },
      { term: 'Safe at the edge', def: 'Untrusted chats are dropped before they reach cognition, and scripts run as a lower-privileged user under a hardened unit.' },
    ],
    portrait: { file: 'albert', alt: "Albert's portrait: a bulldog in a top hat and monocle" },
    more: {
      headline: 'What he actually does.',
      prose: 'Not a wrapper around a few functions — the parts that make an assistant useful when nobody is typing.',
      list: [
        { term: 'Reminders and calendar', def: '"remind me every hour" becomes a memory task plus a recurring alarm; a one-off becomes a real calendar event that syncs to your phone.' },
        { term: 'Proactive routines', def: 'A self-scheduled reflection pass he seeds on startup and runs quietly on a cadence.' },
        { term: 'Files', def: 'Read, write, edit, glob and grep in a jailed workspace; bytes move by reference, never pasted through the chat.' },
        { term: 'Skills', def: 'A folder of recipes he sees as a catalog and applies on demand; executable ones bundle a script.' },
      ],
    },
  },
]
