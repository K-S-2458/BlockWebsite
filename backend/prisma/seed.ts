import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding demo users...');
  const passwordHash = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.create({
    data: {
      username: 'elena_vance',
      email: 'elena@editorial.com',
      password_hash: passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'marcus_chen',
      email: 'marcus@editorial.com',
      password_hash: passwordHash,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'clara_ostberg',
      email: 'clara@editorial.com',
      password_hash: passwordHash,
    },
  });

  console.log('Seeding blog posts...');
  const post1 = await prisma.post.create({
    data: {
      user_id: user1.id,
      title: 'The Architecture of Silence: Designing for Cognitive Stillness',
      content: `In an era defined by relentless notifications and visual cacophony, intentional subtraction has become the ultimate luxury in interface design.

When we strip away unnecessary badges, aggressive contrasting shadows, and urgent micro-copy, something remarkable happens: the reader breathes. Digital environments should respect the human nervous system. We do not need louder software; we need tools that whisper.

### The Rhythm of Proportions
Consider the layout of a Swiss mid-century monograph. The generous margins are not empty space; they are structural pauses. They give weight to the typographic decisions. When a serif title sits against warm, unbleached paper or its digital counterpart (#FAF7F2), the eye settles naturally into a steady cadence.

> "Simplicity is not about having less. It is about making room for what matters."

By calibrating line-height to between 1.6 and 1.8 and limiting reading column widths to approximately 680 pixels, we honor the optical comfort of the human gaze. The result is not merely aesthetic elegance—it is an invitation to deep, sustained contemplation.`,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      user_id: user2.id,
      title: 'On Typefaces and Temperament: Choosing the Right Serif',
      content: `Typefaces possess distinct temperaments. Some command authority with razor-sharp geometric serifs; others welcome the reader with gentle optical nuances and calligraphic warmth.

### Fraunces and the Warmth of Old-Style Nuance
Variable font technology has revitalized vintage display faces. Fraunces, for instance, evokes the warm, ink-trapped charm of early 20th-century typefoundries while maintaining razor-sharp rendering on high-density Retina displays.

When paired with a neutral, rigorously engineered sans-serif like Inter for body copy and navigational chrome, the contrast establishes an effortless hierarchy:
- **Serif headings** signify editorial care, narrative voice, and thought leadership.
- **Sans-serif body copy** guarantees effortless legibility across diverse screen sizes and ambient lighting.

Crafting digital publications requires treating typography not as mere decoration, but as the primary voice of your thoughts.`,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      user_id: user3.id,
      title: 'Slow Software: A Manifesto for Durable Digital Craft',
      content: `The tech industry celebrates velocity above all else: ship fast, break things, iterate in public. Yet the artifacts we remember and cherish most are built with patience, precision, and longevity in mind.

### What is Slow Software?
Slow software is not sluggish code. It is software designed with intentionality:
1. **Decoupled clarity**: Clean REST APIs that outlive temporary frontend frameworks.
2. **Resilient data models**: Strict constraints, relational integrity, and explicit schemas.
3. **Tactile feedback**: Subtle micro-interactions that reassure rather than distract.

When we build systems grounded in proven fundamentals—PostgreSQL, rock-solid auth tokens, and semantic HTML—we create digital spaces that endure.`,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      user_id: user1.id,
      title: 'The Lost Art of Marginalia in Modern Web Reading',
      content: `Historical manuscripts are alive with marginal notes—sketches, rebuttals, glosses, and exclamation marks left by scholars across centuries. The printed book was never a static monologue; it was a conversation spanning generations.

In digital publishing, comments often devolve into noisy reaction feeds. But when designed with restrained typography, clear timestamps, and gentle visual hierarchy, discussion threads become thoughtful marginalia.

Let us reclaim the dignity of the comment section. Elevate genuine discourse over algorithmic outrage.`,
    },
  });

  console.log('Seeding comments...');
  await prisma.comment.createMany({
    data: [
      {
        post_id: post1.id,
        user_id: user2.id,
        content: 'The point about line-height and column width hits home. So many web apps stretch paragraphs across 1400px viewports without a second thought.',
      },
      {
        post_id: post1.id,
        user_id: user3.id,
        content: 'Warm paper tones (#FAF7F2) make an enormous difference during extended late-night reading sessions. Great essay!',
      },
      {
        post_id: post2.id,
        user_id: user1.id,
        content: 'Fraunces has quickly become my go-to for editorial work. The soft terminals give it so much soul.',
      },
      {
        post_id: post3.id,
        user_id: user2.id,
        content: 'Long live durable architectures! Postgres + Express + React continues to be one of the most productive and maintainable stacks in existence.',
      },
    ],
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
