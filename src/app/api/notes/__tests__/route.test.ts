/**
 * @jest-environment node
 */
import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/shared/lib/prisma';
import { encryptText, decryptText } from '@/shared/lib/crypto';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('@/shared/lib/prisma', () => ({
  note: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock('@/shared/lib/crypto');

const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedEncryptText = encryptText as jest.Mock;
const mockedDecryptText = decryptText as jest.Mock;

const MOCK_USER_ID = 'user-123';
const MOCK_TOKEN = 'mock-token';

describe('/api/notes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedJwt.verify.mockReturnValue({ id: MOCK_USER_ID });
    mockedDecryptText.mockImplementation(text => `decrypted_${text}`);
    mockedEncryptText.mockImplementation(text => `encrypted_${text}`);
  });

  describe('GET', () => {
    it('should return 401 if no token is provided', async () => {
      const req = new NextRequest('http://localhost/api/notes');
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('Unauthorized access');
    });

    it('should return a list of decrypted notes on success', async () => {
      const mockNotes = [
        { id: '1', title: 'title1', content: 'content1', userId: MOCK_USER_ID, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'title2', content: 'content2', userId: MOCK_USER_ID, createdAt: new Date(), updatedAt: new Date() },
      ];
      (mockedPrisma.note.findMany as jest.Mock).mockResolvedValue(mockNotes);

      const req = new NextRequest('http://localhost/api/notes', {
        headers: { Authorization: `Bearer ${MOCK_TOKEN}` },
      });
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockedPrisma.note.findMany).toHaveBeenCalledWith({
        where: { userId: MOCK_USER_ID },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
      });
      expect(mockedDecryptText).toHaveBeenCalledTimes(4); // title and content for each of two notes
      expect(body.notes[0].title).toBe('decrypted_title1');
    });
  });

  describe('POST', () => {
    it('should return 401 if no token is provided', async () => {
        const req = new NextRequest('http://localhost/api/notes', { method: 'POST' });
        const response = await POST(req);
        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body.error).toBe('Unauthorized access');
    });

    it('should return 400 for invalid input', async () => {
      const req = new NextRequest('http://localhost/api/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${MOCK_TOKEN}` },
        body: JSON.stringify({ title: '', content: '' }),
      });
      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it('should create and return a new note on success', async () => {
      const newNoteData = { title: 'New Title', content: 'New Content' };
      const createdNote = { id: '3', title: `encrypted_${newNoteData.title}`, content: `encrypted_${newNoteData.content}`, userId: MOCK_USER_ID, createdAt: new Date(), updatedAt: new Date() };
      (mockedPrisma.note.create as jest.Mock).mockResolvedValue(createdNote);

      const req = new NextRequest('http://localhost/api/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${MOCK_TOKEN}` },
        body: JSON.stringify(newNoteData),
      });
      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(mockedEncryptText).toHaveBeenCalledWith('New Title');
      expect(mockedEncryptText).toHaveBeenCalledWith('New Content');
      expect(mockedPrisma.note.create).toHaveBeenCalled();
      expect(body.note.title).toBe('decrypted_encrypted_New Title');
    });
  });
});
