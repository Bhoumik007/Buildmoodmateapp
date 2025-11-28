import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize default data
async function initializeData() {
  const quotesExist = await kv.get('quotes_initialized');
  if (!quotesExist) {
    const quotes = [
      "The only way out is through. – Robert Frost",
      "Feelings are just visitors. Let them come and go. – Mooji",
      "Your mental health is a priority, not a luxury.",
      "It's okay to not be okay. Healing is not linear.",
      "You are stronger than you think. You are braver than you believe.",
      "Small progress is still progress. Celebrate every step forward.",
      "The greatest glory in living lies not in never falling, but in rising every time we fall. – Nelson Mandela"
    ];
    await kv.set('quotes', JSON.stringify(quotes));
    await kv.set('quotes_initialized', 'true');
  }

  const tipsExist = await kv.get('tips_initialized');
  if (!tipsExist) {
    const tips = [
      { category: "Physical", content: "Take a 10-minute walk outside. Fresh air and movement can boost your mood instantly." },
      { category: "Mental", content: "Practice the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste." },
      { category: "Social", content: "Reach out to a friend or loved one. A simple conversation can brighten your day." },
      { category: "Creative", content: "Listen to your favorite uplifting music or create a mood-boosting playlist." },
      { category: "Mindfulness", content: "Try 5 minutes of deep breathing. Inhale for 4 counts, hold for 4, exhale for 6." },
      { category: "Self-Care", content: "Do something nice for yourself today, no matter how small. You deserve it." },
      { category: "Gratitude", content: "Write down 3 things you're grateful for right now. Gratitude shifts perspective." },
      { category: "Physical", content: "Drink a glass of water and have a healthy snack. Sometimes mood is affected by hydration and nutrition." }
    ];
    await kv.set('tips', JSON.stringify(tips));
    await kv.set('tips_initialized', 'true');
  }

  const factsExist = await kv.get('facts_initialized');
  if (!factsExist) {
    const facts = [
      "Smiling, even forced, can trigger the release of dopamine and serotonin, improving your mood.",
      "Spending just 20 minutes in nature can significantly reduce stress hormone levels.",
      "Writing about your feelings for 15 minutes a day can improve both mental and physical health.",
      "Exercise releases endorphins, often called 'feel-good' hormones, which naturally elevate mood.",
      "Laughter decreases stress hormones and increases immune cells and infection-fighting antibodies.",
      "Getting 7-9 hours of quality sleep is crucial for emotional regulation and mental health.",
      "Acts of kindness boost serotonin and oxytocin levels, making both giver and receiver feel good."
    ];
    await kv.set('facts', JSON.stringify(facts));
    await kv.set('facts_initialized', 'true');
  }
}

// Initialize data on startup
initializeData();

// ==================== AUTH ROUTES ====================

app.post('/make-server-54654d19/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || '' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user }, 201);
  } catch (error) {
    console.log('Signup exception:', error);
    return c.json({ error: 'Signup failed: ' + error.message }, 500);
  }
});

// ==================== MOOD ROUTES ====================

app.post('/make-server-54654d19/moods', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { emoji, reason, tag } = await c.req.json();

    if (!emoji || !reason) {
      return c.json({ error: 'Emoji and reason are required' }, 400);
    }

    const moodId = crypto.randomUUID();
    const mood = {
      id: moodId,
      user_id: user.id,
      emoji,
      reason,
      tag: tag || '',
      created_at: new Date().toISOString()
    };

    await kv.set(`mood:${user.id}:${moodId}`, JSON.stringify(mood));

    return c.json({ mood }, 201);
  } catch (error) {
    console.log('Error creating mood:', error);
    return c.json({ error: 'Failed to create mood: ' + error.message }, 500);
  }
});

app.get('/make-server-54654d19/moods', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const moodKeys = await kv.getByPrefix(`mood:${user.id}:`);
    const moods = moodKeys
      .map(item => JSON.parse(item))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return c.json({ moods });
  } catch (error) {
    console.log('Error fetching moods:', error);
    return c.json({ error: 'Failed to fetch moods: ' + error.message }, 500);
  }
});

app.put('/make-server-54654d19/moods/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const moodId = c.req.param('id');
    const { emoji, reason, tag } = await c.req.json();

    const existingMood = await kv.get(`mood:${user.id}:${moodId}`);
    if (!existingMood) {
      return c.json({ error: 'Mood not found' }, 404);
    }

    const mood = {
      ...JSON.parse(existingMood),
      emoji: emoji ?? JSON.parse(existingMood).emoji,
      reason: reason ?? JSON.parse(existingMood).reason,
      tag: tag ?? JSON.parse(existingMood).tag,
    };

    await kv.set(`mood:${user.id}:${moodId}`, JSON.stringify(mood));

    return c.json({ mood });
  } catch (error) {
    console.log('Error updating mood:', error);
    return c.json({ error: 'Failed to update mood: ' + error.message }, 500);
  }
});

app.delete('/make-server-54654d19/moods/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const moodId = c.req.param('id');
    const existingMood = await kv.get(`mood:${user.id}:${moodId}`);
    
    if (!existingMood) {
      return c.json({ error: 'Mood not found' }, 404);
    }

    await kv.del(`mood:${user.id}:${moodId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting mood:', error);
    return c.json({ error: 'Failed to delete mood: ' + error.message }, 500);
  }
});

// ==================== CONTENT ROUTES ====================

app.get('/make-server-54654d19/quote', async (c) => {
  try {
    const quotesData = await kv.get('quotes');
    const quotes = JSON.parse(quotesData || '[]');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return c.json({ quote: randomQuote });
  } catch (error) {
    console.log('Error fetching quote:', error);
    return c.json({ error: 'Failed to fetch quote' }, 500);
  }
});

app.get('/make-server-54654d19/tips', async (c) => {
  try {
    const tipsData = await kv.get('tips');
    const tips = JSON.parse(tipsData || '[]');
    return c.json({ tips });
  } catch (error) {
    console.log('Error fetching tips:', error);
    return c.json({ error: 'Failed to fetch tips' }, 500);
  }
});

app.get('/make-server-54654d19/fact', async (c) => {
  try {
    const factsData = await kv.get('facts');
    const facts = JSON.parse(factsData || '[]');
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    return c.json({ fact: randomFact });
  } catch (error) {
    console.log('Error fetching fact:', error);
    return c.json({ error: 'Failed to fetch fact' }, 500);
  }
});

Deno.serve(app.fetch);
