import { Router, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const aiRouter = Router();
const prisma = new PrismaClient();

const CS_SYSTEM_PROMPT = `You are CS Vault AI, an expert Company Secretary (CS) assistant specializing in:
- ICSI syllabus (Foundation, Executive, and Professional levels)
- Companies Act 2013 and amendments
- SEBI regulations and guidelines
- FEMA (Foreign Exchange Management Act)
- IBC (Insolvency and Bankruptcy Code)
- Corporate Governance and Secretarial Practices
- ROC filings, compliance calendars
- Drafting board resolutions, minutes, notices
- Secretarial audit reports
- Corporate restructuring (mergers, acquisitions)
- Securities laws and capital markets

Provide clear, accurate, and practical answers. When explaining legal provisions:
1. Give the plain English explanation first
2. Reference the exact section/rule number
3. Provide practical examples when helpful
4. Mention recent amendments if relevant
5. Keep responses concise but comprehensive

For drafting requests, provide professional templates.
Always remind students to verify with the latest ICSI/MCA notifications.`;

aiRouter.post('/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'AI service not configured',
        response: 'AI Assistant is not configured. Please set ANTHROPIC_API_KEY in server environment.',
      });
    }

    const client = new Anthropic({ apiKey });

    const messages = [
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: CS_SYSTEM_PROMPT,
      messages,
    });

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : '';

    // Save to chat history
    await prisma.chatMessage.createMany({
      data: [
        { userId: req.userId!, role: 'user', content: message },
        { userId: req.userId!, role: 'assistant', content: assistantMessage },
      ],
    });

    res.json({ response: assistantMessage });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
});

aiRouter.get('/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

aiRouter.delete('/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.chatMessage.deleteMany({ where: { userId: req.userId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

aiRouter.post('/explain-section', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { section, act } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'AI not configured' });

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: CS_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Explain ${section} of ${act || 'Companies Act 2013'} with practical examples and any recent amendments. Format with: 1) Plain English explanation 2) Key provisions 3) Practical example 4) Recent changes if any` }],
    });
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    res.json({ explanation: text });
  } catch {
    res.status(500).json({ error: 'AI service error' });
  }
});
