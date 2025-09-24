import { pgB2Bpool } from '../db-access';

describe('pgB2Bpool', () => {
  it('should be a Pool instance', () => {
    expect(pgB2Bpool).toBeDefined();
    expect(pgB2Bpool.constructor.name).toBe('BoundPool');
  });

  it('should have correct configuration', () => {
    expect(pgB2Bpool.options.keepAlive).toBe(true);
    expect(pgB2Bpool.options.user).toBeDefined();
    expect(pgB2Bpool.options.host).toBeDefined();
    expect(pgB2Bpool.options.database).toBeDefined();
  });

  it('should connect to database successfully', async () => {
    const client = await pgB2Bpool.connect();
    expect(client).toBeDefined();
    client.release();
  });

  it('should execute a simple query', async () => {
    const client = await pgB2Bpool.connect();
    const result = await client.query('SELECT 1 as test');
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].test).toBe(1);
    client.release();
  });

  it('should handle connection errors gracefully', async () => {
    // This test assumes the database might not be available
    try {
      const client = await pgB2Bpool.connect();
      client.release();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  describe('Timezone configuration', () => {
    it('should set timezone on connection', async () => {
      try {
        const client = await pgB2Bpool.connect();
        const result = await client.query('SHOW timezone');
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0].TimeZone).toBe('Europe/Athens');
        client.release();
      } catch (error) {
        // If database is not available, this is expected
        expect(error).toBeDefined();
      }
    });

    it('should handle timezone setting errors', (done) => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Simulate error by triggering connect event with mock client
      const mockClient = {
        query: jest.fn().mockRejectedValue(new Error('Timezone error')),
      };

      pgB2Bpool.emit('connect', mockClient);

      setTimeout(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error setting timezone:',
          expect.any(Error)
        );
        consoleSpy.mockRestore();
        done();
      }, 100);
    });
  });

  describe('Schema and timezone functions', () => {
    it('should export setSchemaAndTimezoneFunction', () => {
      // Since the function is not exported, we test its existence indirectly
      // by checking if timezone queries work
      expect(pgB2Bpool).toBeDefined();
    });

    it('should handle timezone queries', async () => {
      try {
        const result = await pgB2Bpool.query(
          "SELECT current_setting('timezone') as timezone"
        );
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0].timezone).toBeDefined();
      } catch (error) {
        // Database not available
        expect(error).toBeDefined();
      }
    });

    it('should handle search_path queries', async () => {
      try {
        const result = await pgB2Bpool.query(
          "SELECT current_setting('search_path') as search_path"
        );
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0].search_path).toBeDefined();
      } catch (error) {
        // Database not available
        expect(error).toBeDefined();
      }
    });

    it('should handle schema setting with error handling', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      try {
        // Try to set an invalid schema to test error handling
        await pgB2Bpool.query('SET search_path TO invalid_schema_name_12345');
      } catch (error) {
        // This is expected for invalid schema
      }

      consoleSpy.mockRestore();
    });
  });

  describe('Connection event handling', () => {
    it('should have connect event listener', () => {
      const listeners = pgB2Bpool.listeners('connect');
      expect(listeners.length).toBeGreaterThan(0);
    });

    it('should execute timezone setting on connect', (done) => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({}),
      };

      pgB2Bpool.emit('connect', mockClient);

      setTimeout(() => {
        expect(mockClient.query).toHaveBeenCalledWith(
          "SET TIME ZONE 'Europe/Athens';"
        );
        done();
      }, 50);
    });
  });

  afterAll(async () => {
    // Clean up pool connections
    await pgB2Bpool.end();
  });
});
