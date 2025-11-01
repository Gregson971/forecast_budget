import { importCSV } from '@/services/import';
import api from '@/lib/api';

jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('import service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('importCSV', () => {
    it('should upload CSV file and return import result', async () => {
      const mockFile = new File(['date,amount,category\n2025-01-01,100,FOOD'], 'test.csv', {
        type: 'text/csv',
      });

      const mockResult = {
        success: true,
        imported_count: 1,
        failed_count: 0,
        errors: [],
      };

      mockedApi.post.mockResolvedValue({ data: mockResult });

      const result = await importCSV(mockFile);

      expect(mockedApi.post).toHaveBeenCalledWith(
        '/imports/csv',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle import with errors', async () => {
      const mockFile = new File(['date,amount,category\ninvalid-date,100,FOOD'], 'test.csv', {
        type: 'text/csv',
      });

      const mockResult = {
        success: false,
        imported_count: 0,
        failed_count: 1,
        errors: ['Invalid date format on line 2'],
      };

      mockedApi.post.mockResolvedValue({ data: mockResult });

      const result = await importCSV(mockFile);

      expect(result.success).toBe(false);
      expect(result.failed_count).toBe(1);
      expect(result.errors).toHaveLength(1);
    });

    it('should handle partial import success', async () => {
      const mockFile = new File(
        ['date,amount,category\n2025-01-01,100,FOOD\ninvalid,200,TRANSPORT'],
        'test.csv',
        { type: 'text/csv' }
      );

      const mockResult = {
        success: true,
        imported_count: 1,
        failed_count: 1,
        errors: ['Invalid date format on line 3'],
      };

      mockedApi.post.mockResolvedValue({ data: mockResult });

      const result = await importCSV(mockFile);

      expect(result.imported_count).toBe(1);
      expect(result.failed_count).toBe(1);
      expect(result.errors).toHaveLength(1);
    });

    it('should handle large CSV files', async () => {
      const rows = ['date,amount,category'];
      for (let i = 0; i < 100; i++) {
        rows.push(`2025-01-${String(i + 1).padStart(2, '0')},${100 + i},FOOD`);
      }
      const mockFile = new File([rows.join('\n')], 'large.csv', {
        type: 'text/csv',
      });

      const mockResult = {
        success: true,
        imported_count: 100,
        failed_count: 0,
        errors: [],
      };

      mockedApi.post.mockResolvedValue({ data: mockResult });

      const result = await importCSV(mockFile);

      expect(result.imported_count).toBe(100);
      expect(result.failed_count).toBe(0);
    });

    it('should properly format FormData with file', async () => {
      const mockFile = new File(['test content'], 'test.csv', {
        type: 'text/csv',
      });

      const mockResult = {
        success: true,
        imported_count: 0,
        failed_count: 0,
        errors: [],
      };

      mockedApi.post.mockResolvedValue({ data: mockResult });

      await importCSV(mockFile);

      const callArgs = mockedApi.post.mock.calls[0];
      const formData = callArgs[1] as FormData;
      
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('file')).toBe(mockFile);
    });
  });
});

